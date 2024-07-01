import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import AuthController from '../../../controllers/AuthController';
import UsuarioController from '../../../controllers/UsuarioController';
import useAuthStore from '../../store/authStore';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const InicioSesion: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const setUserInfo = useAuthStore(state => state.setUserInfo);
  const [loading, setLoading] = useState(false);

  const authController = new AuthController();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Por favor ingrese un correo electrónico válido.');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const uid = await authController.login(email, password);
      if (uid) {
        const usuarioController = new UsuarioController();
        const user = await usuarioController.obtenerUsuarioPorId(uid);
        if (user) {
          setUserInfo(user);
          //navigation.navigate('HomeCliente');
        } else {
          Alert.alert('Error', 'No se encontró el usuario.');
        }
      } else {
        Alert.alert('Error', 'Credenciales incorrectas.');
      }
    } catch (error) {
      console.error('Error de autenticación: ', error);
      Alert.alert('Error', 'Credenciales incorrectas. Por favor, verifica tus datos e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#8B5FBF" />
        </View>
      ) : (
        <>
          <View style={styles.Titulo}>
            <Text style={styles.Nombre}>Art Print</Text>
          </View>
          <View style={styles.Contenido}>
            <Text style={styles.title}>Inicio de Sesión</Text>
            <Text style={styles.Descripcion}>
              Inicia sesión con tu correo para realizar compras
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.LoginButton} onPress={handleLogin}>
              <Text style={styles.LoginButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
            
            <View style={styles.separatorContainer}>
              <View style={styles.separator} />
              <Text style={styles.separatorText}>o</Text>
              <View style={styles.separator} />
            </View>

            <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Registro')}>
              <Text style={styles.registerButtonText}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F5F5F5'
  },
  Titulo: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    padding: 15,
  },
  Contenido: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderColor: 'lightgray',
    borderWidth: 0.5,
    borderRadius: 10,
  },
  Nombre: {
    color: '#4A4A4A',
    fontSize: 70,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: '600',
    textAlign: 'center',
    color: '#4A4A4A'
  },
  Descripcion: {
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
    color: '#878787'
  },
  LoginButton: {
    backgroundColor: '#8B5FBF',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    width: '100%',
  },
  LoginButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#878787',
  },
  separatorText: {
    marginHorizontal: 8,
    color: '#878787',
  },
  registerButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    width: '100%',
  },
  registerButtonText: {
    color: '#4A4A4A',
    fontSize: 16,
  },
  loadingOverlay: {
    //...StyleSheet.absoluteFillObject,
    //backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InicioSesion;
