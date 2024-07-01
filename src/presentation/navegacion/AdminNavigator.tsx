import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import AdminHome from '../screens/Admin/AdminHome';
import GestionProducto from '../screens/Admin/gestion_productos/GestionProducto';
import ProductoForm from '../screens/Admin/gestion_productos/ProductoForm';
import GestionCategoria from '../screens/Admin/gestion_categorias/GestionCategoria';
import CategoriaForm from '../screens/Admin/gestion_categorias/CategoriaForm';
import GestionTalla from '../screens/Admin/gestion_tallas/GestionTalla';
import TallaForm from '../screens/Admin/gestion_tallas/TallaForm';
import GestionMaterial from '../screens/Admin/gestion_materiales/GestionMaterial';
import MaterialForm from '../screens/Admin/gestion_materiales/MaterialForm';
import GestionColor from '../screens/Admin/gestion_colores/GestionColor';
import ColorForm from '../screens/Admin/gestion_colores/ColorForm';
import GestionUsuario from '../screens/Admin/gestion_usuarios/GestionUsuario';
import UsuarioForm from '../screens/Admin/gestion_usuarios/UsuarioForm';
import GestionPrenda from '../screens/Admin/gestion_prendas/GestionPrenda';
import PrendaForm from '../screens/Admin/gestion_prendas/PrendaForm';
import GestionWhatsApp from '../screens/Admin/gestion_whatsapp/GetionWhatsapp';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AdminNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="AdminHome" component={AdminHome} options={{ headerShown: true, title: '' }} />
    <Stack.Screen name="GestionProducto" component={GestionProducto} options={{ title: 'Gestión de Productos' }} />
    <Stack.Screen name="ProductoForm" component={ProductoForm} options={{ title: 'Formulario de Producto' }} />
    <Stack.Screen name="GestionCategoria" component={GestionCategoria} options={{ title: 'Gestión de Categorías' }} />
    <Stack.Screen name="CategoriaForm" component={CategoriaForm} options={{ title: 'Formulario de Categoría' }} />
    <Stack.Screen name="GestionTalla" component={GestionTalla} options={{ title: 'Gestión de Tallas' }} />
    <Stack.Screen name="TallaForm" component={TallaForm} options={{ title: 'Formulario de Talla' }} />
    <Stack.Screen name="GestionMaterial" component={GestionMaterial} options={{ title: 'Gestión de Materiales' }} />
    <Stack.Screen name="MaterialForm" component={MaterialForm} options={{ title: 'Formulario de Material' }} />
    <Stack.Screen name="GestionColor" component={GestionColor} options={{ title: 'Gestión de Colores' }} />
    <Stack.Screen name="ColorForm" component={ColorForm} options={{ title: 'Formulario de Color' }} />
    <Stack.Screen name="GestionUsuario" component={GestionUsuario} options={{ title: 'Gestión de Usuarios' }} />
    <Stack.Screen name="UsuarioForm" component={UsuarioForm} options={{ title: 'Formulario de Usuario' }} />
    <Stack.Screen name="GestionPrenda" component={GestionPrenda} options={{ title: 'Gestión de Prendas' }} />
    <Stack.Screen name="PrendaForm" component={PrendaForm} options={{ title: 'Formulario de Prenda' }} />
    <Stack.Screen name="GestionWhatsApp" component={GestionWhatsApp} options={{ title: 'Gestión de WhatsApp' }} />
  </Stack.Navigator>
);


export default AdminNavigator;
