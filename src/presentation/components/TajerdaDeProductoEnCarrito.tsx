import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native';

interface Props {
  imagen: string,
  titulo: string,
  precio: string,
  cantidad: number,
  onEliminar: () => void;
  onIncrementar: () => void;
  onDecrementar: () => void;
}

const TarjetaDeProductoEnCarrito: React.FC<Props> = ({ imagen, titulo, precio, cantidad, onEliminar, onIncrementar, onDecrementar }) => {
    return (
      <View style={styles.contenedor}>
          <View style={styles.contenidoImagen}>
            <Image style={styles.imagen} source={{ uri: imagen }} />
          </View>
          <View style={styles.contenido}>
            <Text style={styles.titulo}>{titulo}</Text>
            <Text style={styles.precio}>$ {precio}</Text>
            <View style={styles.cantidadContainer}>
              <TouchableOpacity onPress={onDecrementar} style={styles.botonCantidad}>
                <Text style={styles.textoBotonCantidad}>-</Text>
              </TouchableOpacity>
              <Text style={styles.cantidad}>{cantidad}</Text>
              <TouchableOpacity onPress={onIncrementar} style={styles.botonCantidad}>
                <Text style={styles.textoBotonCantidad}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={onEliminar} style={[styles.boton, { backgroundColor: '#8B5FBF' }]}>
              <Text style={styles.textoBoton}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
    );
};

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
    elevation: 2,
  },
  contenidoImagen: {
    marginRight: 10,
  },
  imagen: {
    width: 80,
    height: 100,
    borderRadius: 10,
  },
  contenido: {
    flex: 1,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#4A4A4A',
  },
  precio: {
    fontSize: 14,
    marginBottom: 5,
    color: '#4A4A4A',
  },
  cantidadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  cantidad: {
    fontSize: 14,
    marginHorizontal: 10,
    color: '#4A4A4A',
  },
  botonCantidad: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#8B5FBF',
  },
  textoBotonCantidad: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  boton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#8B5FBF',
    alignItems: 'center',
    marginTop: 5,
  },
  textoBoton: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default TarjetaDeProductoEnCarrito;
