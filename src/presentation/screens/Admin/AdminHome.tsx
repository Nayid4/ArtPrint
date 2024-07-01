// src/screens/AdminHome.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import useAuthStore from '../../store/authStore';
import AuthController from '../../../controllers/AuthController';

type AdminHomeProps = {
  navigation: StackNavigationProp<any, any>;
  route: RouteProp<any, any>;
};

const AdminHome: React.FC<AdminHomeProps> = ({ navigation }) => {
  const { userInfo, setUserInfo } = useAuthStore();
  const authController = new AuthController();

  const handleLogout = async () => {
    try {
      await authController.logout();
      setUserInfo(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const options = [
    { title: 'Gestionar Usuarios', route: 'GestionUsuario' },
    { title: 'Gestionar Productos', route: 'GestionProducto' },
    { title: 'Gestionar Categorías', route: 'GestionCategoria' },
    { title: 'Gestionar Tallas', route: 'GestionTalla' },
    { title: 'Gestionar Colores', route: 'GestionColor' },
    { title: 'Gestionar Materiales', route: 'GestionMaterial' },
    { title: 'Gestionar Prendas', route: 'GestionPrenda' },
    { title: 'Gestionar Whatsapp', route: 'GestionWhatsApp' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Home</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.gridContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => navigation.navigate(option.route)}
            >
              <Text style={styles.buttonText}>{option.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: 'bold'
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#8B5FBF',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    width: '40%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#8B5FBF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 20,
    alignSelf: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default AdminHome;
