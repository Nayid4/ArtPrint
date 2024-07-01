import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, FlatList, TouchableHighlight } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Usuario, RolUsuario } from '../../../../domain/entities/Usuario';
import AuthController from '../../../../controllers/AuthController';
import UsuarioController from '../../../../controllers/UsuarioController';

type UsuarioFormProps = {
  navigation: StackNavigationProp<any, any>;
  route: RouteProp<any, any>;
};

const UsuarioForm: React.FC<UsuarioFormProps> = ({ route, navigation }) => {
  const { usuarioId } = route.params || {};
  const [nombre, setNombre] = useState<string>('');
  const [cedula, setCedula] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [direccion, setDireccion] = useState<string>('');
  const [rol, setRol] = useState<RolUsuario>(RolUsuario.CLIENTE); // Cambia el valor inicial aquí
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const authController = new AuthController();
  const usuarioController = new UsuarioController();

  useEffect(() => {
    if (usuarioId) {
      const cargarDatosUsuario = async () => {
        try {
          setLoading(true);
          const usuario = await usuarioController.obtenerUsuarioPorId(usuarioId);
          if (usuario) {
            setNombre(usuario.nombre);
            setCedula(usuario.cedula);
            setCorreo(usuario.correo);
            setTelefono(usuario.telefono);
            setDireccion(usuario.direccion);
            setRol(usuario.rol);
          }
        } catch (error) {
          console.error('Error al cargar datos del usuario:', error);
        } finally {
          setLoading(false);
        }
      };
      cargarDatosUsuario();
    }
  }, [usuarioId]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!validateNombre(nombre)) {
      newErrors.nombre = 'Por favor ingrese un nombre válido.';
    }
    if (!validateCedula(cedula)) {
      newErrors.cedula = 'Por favor ingrese un N° de Indentifiacion válido de minimo 7 y maximo 10 dígitos.';
    }

    if (!validateTelefono(telefono)) {
      newErrors.telefono = 'Por favor ingrese un número de teléfono válido de minimo 9 o maximo 10 dígitos.';
    }
    if (!validateDireccion(direccion)) {
      newErrors.direccion = 'Por favor ingrese una dirección válida.';
    }
    if (!validateEmail(correo)) {
      newErrors.correo = 'Por favor ingrese un correo electrónico válido.';
    }
    if (!usuarioId && !validatePassword(password)) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (!rol) {
      newErrors.rol = 'Por favor seleccione un rol.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateNombre = (nombre: string) => {
    return nombre.trim().length > 0;
  };

  const validateCedula = (cedula: string) => {
    const cedulaRegex = /^\d{7,10}$/;
    return cedulaRegex.test(cedula);
}; 

  const validateTelefono = (telefono: string) => {
    const telefonoRegex = /^\d{9,10}$/;
    return telefonoRegex.test(telefono);
  };

  const validateDireccion = (direccion: string) => {
    return direccion.trim().length > 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const usuario: Usuario = {
        id: usuarioId || '',
        nombre,
        cedula,
        correo,
        telefono,
        direccion,
        rol,
        fotoPerfil: '', // Puedes manejar la carga de la foto de perfil aquí
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (usuarioId) {
        await usuarioController.actualizarUsuario(usuarioId, usuario);
        Alert.alert('Éxito', 'Usuario actualizado correctamente.');
      } else {
        await usuarioController.crearUsuarioYAutenticacion(usuario, password);
        Alert.alert('Éxito', 'Usuario registrado correctamente.');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      Alert.alert('Error', 'Hubo un problema al guardar el usuario. Por favor, inténtalo nuevamente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { label: 'Cliente', value: RolUsuario.CLIENTE },
    { label: 'Administrador', value: RolUsuario.ADMIN },
    // { label: 'Empleado', value: RolUsuario.EMPLEADO },
  ];

  const handleRolSelect = (value: RolUsuario) => {
    setRol(value);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{usuarioId ? 'Editar Usuario' : 'Añadir Usuario'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
      <TextInput
        style={styles.input}
        placeholder="N° de Indentifiacion"
        value={cedula}
        onChangeText={setCedula}
      />
      {errors.cedula && <Text style={styles.errorText}>{errors.cedula}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={correo}
        onChangeText={setCorreo}
      />
      {errors.correo && <Text style={styles.errorText}>{errors.correo}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
      />
      {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Dirección"
        value={direccion}
        onChangeText={setDireccion}
      />
      {errors.direccion && <Text style={styles.errorText}>{errors.direccion}</Text>}
      {!usuarioId && (
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      )}
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      <TouchableOpacity
        style={[styles.picker, errors.rol ? styles.inputError : null]} // Manejo condicional de estilos
        onPress={() => setModalVisible(true)}
      >
        <Text>{rol ? roles.find(r => r.value === rol)?.label : '-- Seleccione un rol --'}</Text>
      </TouchableOpacity>
      {errors.rol && <Text style={styles.errorText}>{errors.rol}</Text>}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveButtonText}>{loading ? 'Guardando...' : 'Guardar'}</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={roles}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableHighlight onPress={() => handleRolSelect(item.value)}>
                  <Text style={styles.modalItem}>{item.label}</Text>
                </TouchableHighlight>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  picker: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#8B5FBF',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  inputError: {
    borderColor: 'red',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#8B5FBF',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default UsuarioForm;
