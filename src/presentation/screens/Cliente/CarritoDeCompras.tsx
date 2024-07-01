import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import TarjetaDeProductoEnCarrito from '../../components/TajerdaDeProductoEnCarrito';
import CarritoController from '../../../controllers/CarritoController';
import useAuthStore from '../../store/authStore';
import { ItemCarrito } from '../../../domain/entities/ItemCarrito';
import handleWhatsAppPress from '../../../utils/whatsapp';
import { useFocusEffect } from '@react-navigation/native';
import WhatsAppController from '../../../controllers/WhatsAppController';

const CarritoDeCompras: React.FC = () => {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Aquí especificamos que error puede ser string o null
  const { userInfo } = useAuthStore();
  const [vendedorWhatsApp, setVendedorWhatsApp] = useState<string>('');

  useEffect(() => {
    const fetchWhatsAppData = async () => {
      try {
        const whatsappController = new WhatsAppController();
        const vendedorData = await whatsappController.obtenerNumeroWhatsAppPorIdDefault();
        if (vendedorData) {
          setVendedorWhatsApp(vendedorData.countryCode+""+vendedorData.phoneNumber);
        }
      } catch (error) {
        console.error('Error fetching WhatsApp data:', error);
      }
    };
    fetchWhatsAppData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarCarrito();
    }, [userInfo])
  );

  const cargarCarrito = async () => {
    setLoading(true);
    setError(null);

    try {
      if(userInfo == null){
        return;
      }

      const carritoController = new CarritoController();
      const usuarioId = userInfo?.id;
      if (!usuarioId) {
        throw new Error('No se encontró el ID del usuario');
      }
      const carritoUsuario = await carritoController.obtenerCarritoPorUsuarioId(usuarioId);
      if (carritoUsuario) {
        setCarrito(carritoUsuario.items || []);
      }
    } catch (error: any) { // Aquí usamos 'any' para manejar cualquier tipo de error, o puedes usar un tipo específico si lo conoces
      setError('Error al cargar el carrito: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const actualizarCantidad = async (productoId: string, nuevaCantidad: number) => {
    if (nuevaCantidad < 1) return; // No permitir cantidades menores a 1
    try {
      const carritoController = new CarritoController();
      const usuarioId = userInfo?.id;
      if (!usuarioId) {
        throw new Error('No se encontró el ID del usuario');
      }
      const carritoUsuario = await carritoController.obtenerCarritoPorUsuarioId(usuarioId);
      if (carritoUsuario) {
        await carritoController.actualizarCantidadProducto(carritoUsuario.id, productoId, nuevaCantidad);
        cargarCarrito();
      }
    } catch (error) {
      console.error('Error al actualizar la cantidad del producto:', error);
    }
  };

  const eliminarProducto = async (productoId: string) => {
    try {
      const carritoController = new CarritoController();
      const usuarioId = userInfo?.id;
      if (!usuarioId) {
        throw new Error('No se encontró el ID del usuario');
      }
      const carritoUsuario = await carritoController.obtenerCarritoPorUsuarioId(usuarioId);
      if (carritoUsuario) {
        await carritoController.eliminarProductoDelCarrito(carritoUsuario.id, productoId);
        cargarCarrito();
      }
    } catch (error) {
      console.error('Error al eliminar el producto del carrito:', error);
    }
  };

  const totalCarrito = carrito.reduce((total, compra) => total + parseFloat(compra.precio.toString()) * compra.cantidad, 0).toFixed(2);

  const comprarCarrito = async () => {
    if (userInfo == null || carrito.length === 0) {
      return;
    }

    try {
      const carritoController = new CarritoController();
      const usuarioId = userInfo?.id;
      if (!usuarioId) {
        throw new Error('No se encontró el ID del usuario');
      }

      // Obtener el ID del último carrito del usuario (asumiendo que es el último agregado)
      const carritoUsuario = await carritoController.obtenerCarritoPorUsuarioId(usuarioId);
      if (!carritoUsuario) {
        throw new Error('No se encontró ningún carrito para este usuario');
      }

      const vendedorWhatsapp = vendedorWhatsApp; // Número de WhatsApp del vendedor en formato internacional

      Alert.alert(
        'Compra realizada',
        'Tu compra ha sido realizada exitosamente. Se abrirá WhatsApp para que puedas contactar al vendedor.',
        [
          { text: 'Cancelar', },
          { text: 'OK', onPress: async () => {
            await carritoController.comprarCarrito(carritoUsuario.id, vendedorWhatsapp)
            setCarrito([]);
          }},
        ],
        { cancelable: false }
      );

    } catch (error) {
      console.error('Error al comprar el carrito:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5FBF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.Encabezado}>
        <View style={styles.EncabezadoPrincipal}>
          <Text style={styles.TituloEncabezado}>Carrito</Text>
        </View>
      </View>
      <View style={styles.containerCarrito}>
        <ScrollView contentContainerStyle={styles.ScrollContent}>
          <View style={styles.ProductContainer}>
            {carrito.map((compra, index) => (
              <TarjetaDeProductoEnCarrito
                key={index}
                imagen={compra.imagen}
                titulo={compra.nombre}
                precio={compra.precio.toString()}
                cantidad={compra.cantidad}
                onEliminar={() => eliminarProducto(compra.productoId)}
                onIncrementar={() => actualizarCantidad(compra.productoId, compra.cantidad + 1)}
                onDecrementar={() => actualizarCantidad(compra.productoId, compra.cantidad - 1)}
              />
            ))}
          </View>
        </ScrollView>
        <View style={styles.totalContainer}>
          <Text style={styles.totalTexto}>Total: ${totalCarrito}</Text>
          <TouchableOpacity style={styles.botonComprar} onPress={comprarCarrito}>
            <Text style={styles.textoBoton}>Comprar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 15
  },
  containerCarrito: {
    flex: 1,
  },
  ScrollContent: {
    backgroundColor: '#fff',
  },
  Encabezado: {
    padding: 10,
    backgroundColor: '#F5F5F5',
  },
  EncabezadoPrincipal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 15,
  },
  TituloEncabezado: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  ProductContainer: {
    width: '100%',
    padding: 10,
    backgroundColor: '#F5F5F5',
  },
  totalContainer: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  totalTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  botonComprar: {
    backgroundColor: '#8B5FBF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  textoBoton: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default CarritoDeCompras;
