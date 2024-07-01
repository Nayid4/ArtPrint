import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AuthController from '../../../controllers/AuthController'; // Importa el controlador de autenticación
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { Usuario } from '../../../domain/entities/Usuario'; // Importa la entidad Usuario

import UsuarioController from '../../../controllers/UsuarioController';
import useAuthStore from '../../store/authStore';

type EditScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditarPerfil'>;

type Props = {
  navigation: EditScreenNavigationProp;
};

const EditarPerfil: React.FC<Props> = ({ navigation }) => {
  const [nombre, setNombre] = useState<string>('');
  const [cedula, setCedula] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [direccion, setDireccion] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { userInfo, setUserInfo } = useAuthStore();
  const usuarioController = new UsuarioController();

  const authController = new AuthController(); // Instancia del controlador de autenticación

  useEffect(() => {
    // Fetch current user data and set it to state
    const fetchUserData = async () => {
      const unsubscribe = authController.onAuthStateChanged(async (userAuth) => {
        if (userAuth) {
          try {
            const user = await usuarioController.obtenerUsuarioPorId(userAuth.uid);
            if (user) {
              setUserInfo(user);
            }
          } catch (error) {
            console.error('Error al obtener la información del usuario:', error);
          }
        } else {
          setUserInfo(null);
        }
      });
  
      return () => unsubscribe();
      
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    try {
      console.log('Actualizando usuario...');

      await usuarioController.actualizarUsuario(userInfo!.id, userInfo!); // Llamar al método updateUser con los datos desglosados
      console.log('Usuario actualizado');

      // Redirigir a la pantalla de inicio
      navigation.navigate('Home');
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contenido}>
        <Text style={styles.nombre}>Art Print</Text>
        <Text style={styles.title}>Tus datos</Text>
        <Text style={styles.descripcion}>
          Modifica tus datos personales
        </Text>
        {/* {error ? <Text style={styles.error}>{error}</Text> : null} */}
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Cédula"
          value={cedula}
          onChangeText={setCedula}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Dirección"
          value={direccion}
          onChangeText={setDireccion}
        />
        <TouchableOpacity style={styles.registerButton} onPress={handleUpdate}>
          <Text style={styles.registerButtonText}>Guardar cambios</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  contenido: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  nombre: {
    color: '#4A4A4A',
    fontSize: 70,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#4A4A4A',
  },
  descripcion: {
    color: '#878787',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: '#fff',
    width: '100%',
    color: '#878787',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#8B5FBF',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
    width: '100%',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EditarPerfil;
