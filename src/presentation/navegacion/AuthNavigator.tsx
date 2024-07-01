import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import InicioSesion from '../screens/Autenticacion/inicioSesion';
import Registro from '../screens/Autenticacion/Registro';
import Home from '../screens/Cliente/Home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import CarritoDeCompras from '../screens/Cliente/CarritoDeCompras';
import Perfil from '../screens/Cliente/Perfil';
import DetallesDeProducto from '../screens/Cliente/DetallesDeProducto';
import EditarPerfil from '../screens/Cliente/EditarPerfil';
import { RootStackParamList } from '../types/navigation';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();


const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={AuthNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="DetallesDeProducto" component={DetallesDeProducto} options={{ title: 'Detalles de Producto' }} />
    <Stack.Screen name="Perfil" component={Perfil} />
    <Stack.Screen name="CarritoDeCompras" component={CarritoDeCompras} />
    <Stack.Screen name="Login" component={InicioSesion} options={{ title: '' }} />
    <Stack.Screen name="Registro" component={Registro} options={{ title: '' }} />
  </Stack.Navigator>
);


  
  const AuthNavigator = () => (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#8B5FBF',
      }}
    >
      <Tab.Screen
        name="HomeCatalogo"
        component={Home}
        options={{
          tabBarIcon: ({ size, color }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="CarritoDeCompras"
        component={CarritoDeCompras}
        options={{
          tabBarIcon: ({ size, color }) => <AntDesign name="shoppingcart" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
          tabBarIcon: ({ size, color }) => <MaterialCommunityIcons name="account-circle-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );

export default AuthStack;
