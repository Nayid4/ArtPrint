import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { Producto } from '../../../domain/entities/producto';
import ProductoController from '../../../controllers/ProductoController';
import TarjetaDeProducto from '../../components/TarjetaDeProducto';
import useAuthStore from '../../store/authStore';
import AuthController from '../../../controllers/AuthController';
import UsuarioController from '../../../controllers/UsuarioController';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const Home: React.FC<Props> = ({ navigation }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const productoController = new ProductoController();
  const { userInfo, setUserInfo } = useAuthStore();
  const authController = new AuthController();
  const usuarioController = new UsuarioController();

  useEffect(() => {
    const cargarDatos = async () => {
      await cargarProductos();
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

    cargarDatos();
  }, []);

  const cargarProductos = async () => {
    try {
      const productosObtenidos = await productoController.obtenerProductos();
      if (productosObtenidos && productosObtenidos.length > 0) {
        setProductos(productosObtenidos);
      } else {
        console.log('No se encontraron productos.');
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.Encabezado}>
        <View style={styles.BarraBusqueda}>
          <Fontisto name="zoom" size={24} style={styles.IconoBusqueda} />
          <TextInput
            style={styles.InputBusqueda}
            placeholder="Buscar productos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      {loading ? (
        <View style={styles.LoadingContainer}>
          <ActivityIndicator size="large" color="#8B5FBF" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.ScrollContent}>
          <View style={styles.ProductContainer}>
            {filteredProductos.map((producto, index) => (
              <TarjetaDeProducto 
                key={index}
                imagen={producto.imagenUrl}
                titulo={producto.nombre}
                precio={producto.precio.toString()}
                onPress={() => navigation.navigate('DetallesDeProducto', { producto })}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Fondo más claro
    paddingTop: 15
  },
  ScrollContent: {
    flexGrow: 1,
  },
  Encabezado: {
    marginTop: 20,
    padding: 10,
  },
  BarraBusqueda: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#8B5FBF',
    marginHorizontal: 10
  },
  IconoBusqueda: {
    marginRight: 10,
    color: '#8B5FBF'
  },
  InputBusqueda: {
    flex: 1,
    fontSize: 16,
    color: '#878787'
  },
  Filtros: {
    flexDirection: 'row',
    margin: 15
  },
  BotonFiltro: {
    backgroundColor: '#DFDCDC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 15
  },
  BotonFiltro1: {
    backgroundColor: '#8B5FBF',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginRight: 15
  },
  TextFiltro: {
    fontSize: 16,
    color: '#938F8F'
  },
  TextFiltro1: {
    fontSize: 16,
    color: '#FFFFFF'
  },
  ProductContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  LoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
