import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import Dialog from 'react-native-dialog';
import useAuthStore from '../../store/authStore';
import AuthController from '../../../controllers/AuthController';
import UsuarioController from '../../../controllers/UsuarioController';
import TarjetaDePerfil from '../../components/TarjetaDePerfil';
import { Usuario, RolUsuario } from '../../../domain/entities/Usuario';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Perfil'>;

const ProfilePage: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { userInfo, setUserInfo } = useAuthStore();
  const authController = new AuthController();
  const usuarioController = new UsuarioController();
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogLabel, setDialogLabel] = useState('');
  const [dialogValue, setDialogValue] = useState('');
  const [currentField, setCurrentField] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false); // Estado para controlar la pantalla de carga

  useEffect(() => {
    const unsubscribe = authController.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        try {
          const user = await usuarioController.obtenerUsuarioPorId(userAuth.uid);
          if (user) {
            setUserInfo(user);
          }
        } catch (error) {
          console.error('Error al obtener la información del usuario:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setUserInfo(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await authController.logout();
      setUserInfo(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleEditProfile = (etiqueta: string, valor: string) => {
    setDialogLabel(etiqueta);
    setDialogValue(valor);
    setCurrentField(getFieldNameFromLabel(etiqueta));
    setDialogVisible(true);
  };

  const handleSave = async () => {
    setDialogVisible(false);
    setUpdatingProfile(true); // Activar pantalla de carga al guardar

    try {
      if (userInfo) {
        const updatedUserInfo: Partial<Usuario> = { ...userInfo, [currentField]: dialogValue };

        // Validar y actualizar solo el campo correspondiente
        let isValid = true;
        let errorMessage = '';

        switch (currentField) {
          case 'nombre':
            if (!validateNombre(dialogValue)) {
              isValid = false;
              errorMessage = 'Por favor ingrese un nombre válido.';
            }
            break;
          case 'correo':
            if (!validateEmail(dialogValue)) {
              isValid = false;
              errorMessage = 'Por favor ingrese un correo electrónico válido.';
            }
            break;
          case 'telefono':
            if (!validateTelefono(dialogValue)) {
              isValid = false;
              errorMessage = 'Por favor ingrese un número de teléfono válido de minimo 9 o maximo 10 dígitos.';
            }
            break;
          case 'direccion':
            if (!validateDireccion(dialogValue)) {
              isValid = false;
              errorMessage = 'Por favor ingrese una dirección válida.';
            }
            break;
          case 'cedula':
            if (!validateCedula(dialogValue)) {
              isValid = false;
              errorMessage = 'Por favor ingrese un N° de Identificación válido de mínimo 7 y máximo 10 dígitos.';
            }
            break;
          default:
            break;
        }

        if (!isValid) {
          Alert.alert('Error', errorMessage);
          setUpdatingProfile(false); // Desactivar pantalla de carga
          return;
        }

        await usuarioController.actualizarUsuario(userInfo.id, updatedUserInfo as Usuario);
        setUserInfo(updatedUserInfo as Usuario);
      }
    } catch (error) {
      console.error('Error al actualizar la información del usuario:', error);
    } finally {
      setUpdatingProfile(false); // Desactivar pantalla de carga al finalizar
    }
  };

  const userInfoItems = userInfo ? [
    { etiqueta: "Nombre", valor: userInfo.nombre },
    { etiqueta: "Correo", valor: userInfo.correo },
    { etiqueta: "Teléfono", valor: userInfo.telefono },
    { etiqueta: "Dirección", valor: userInfo.direccion },
    { etiqueta: "Número de identificación", valor: userInfo.cedula }
  ] : [];

  // Funciones de validación
  const validateNombre = (nombre: string) => {
    return nombre.trim().length > 0;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateTelefono = (telefono: string) => {
    const telefonoRegex = /^\d{9,10}$/;
    return telefonoRegex.test(telefono);
  };

  const validateDireccion = (direccion: string) => {
    return direccion.trim().length > 0;
  };

  const validateCedula = (cedula: string) => {
    const cedulaRegex = /^\d{7,10}$/;
    return cedulaRegex.test(cedula);
  };

  // Función para obtener el nombre del campo de usuario a partir de la etiqueta
  const getFieldNameFromLabel = (label: string): keyof Usuario => {
    switch (label) {
      case 'Nombre':
        return 'nombre';
      case 'Correo':
        return 'correo';
      case 'Teléfono':
        return 'telefono';
      case 'Dirección':
        return 'direccion';
      case 'Número de identificación':
        return 'cedula';
      default:
        throw new Error(`Campo no reconocido: ${label}`);
    }
  };

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.cabecera}>
        {/*<TouchableOpacity onPress={() => navigation.goBack()} style={estilos.iconoVolver}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>*/}
      </View>
      <View style={estilos.contenido}>
        {loading ? (
          <View style={[estilos.loadingContainer, { flex: 1, justifyContent: 'center' }]}>
            <ActivityIndicator size="large" color="#8B5FBF" />
          </View>
        ) : userInfo ? (
          <>
            <Text style={estilos.titulo}>Perfil</Text>
            {userInfo.fotoPerfil ? (
              <Image source={{ uri: userInfo.fotoPerfil }} style={estilos.imagenPerfil} />
            ) : (
              <MaterialCommunityIcons name="account-circle" size={100} color="#8B5FBF" style={estilos.imagenPerfilIcono} />
            )}
            <View style={estilos.contenedorDatosUsuario}>
              {userInfoItems.map((item, index) => (
                <View key={index}>
                  <TarjetaDePerfil etiqueta={item.etiqueta} valor={item.valor} onPress={() => handleEditProfile(item.etiqueta, item.valor)} />
                </View>
              ))}
            </View>
            <View style={estilos.contenedorBotonesDeCliente}>
              {/*<TouchableOpacity style={estilos.botonEditarPerfil} onPress={() => navigation.navigate('EditarPerfil')}>
                <Text style={estilos.textoBotonCerrarSesion}>Editar</Text>
              </TouchableOpacity>*/}
              <TouchableOpacity style={estilos.botonCerrarSesion} onPress={handleLogout}>
                <Text style={estilos.textoBotonCerrarSesion}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={[estilos.contenedorBotones, { flex: 1, justifyContent: 'center' }]}>
            <TouchableOpacity style={estilos.boton} onPress={() => navigation.navigate('Login')}>
              <Text style={estilos.textoBoton}>Iniciar Sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity style={estilos.boton} onPress={() => navigation.navigate('Registro')}>
              <Text style={estilos.textoBoton}>Registrarse</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>Editar {dialogLabel}</Dialog.Title>
        <Dialog.Input value={dialogValue} onChangeText={setDialogValue} />
        <Dialog.Button label="Cancelar" onPress={() => setDialogVisible(false)} />
        <Dialog.Button label="Guardar" onPress={handleSave} />
      </Dialog.Container>

      {/* Pantalla de carga */}
      {updatingProfile && (
        <View style={estilos.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    position: 'relative',
  },
  iconoVolver: {
    position: 'absolute',
    left: 0,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A4A4A',
    textAlign: 'center',
  },
  contenido: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Centra los elementos verticalmente
    flex: 1,
  },
  imagenPerfil: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 20,
  },
  imagenPerfilIcono: {
    marginVertical: 20,
  },
  contenedorDatosUsuario: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
  },
  contenedorBotonesDeCliente: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 20,
  },
  botonCerrarSesion: {
    backgroundColor: '#8B5FBF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  botonEditarPerfil: {
    backgroundColor: '#8B5FBF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginRight: 10,
  },
  textoBotonCerrarSesion: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  contenedorBotones: {
    width: '100%',
    marginTop: 20,
  },
  boton: {
    backgroundColor: '#8B5FBF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginVertical: 10,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfilePage;
