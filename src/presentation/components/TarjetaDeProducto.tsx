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
  onPress: () => void;
}

const TarjetaDeProducto: React.FC<Props> = ({ imagen, titulo, precio, onPress }) => {
  
  return (
    <TouchableOpacity onPress={onPress} style={styles.Contenedor}>
      <View style={styles.ContentedorImagen}>
        <Image style={styles.imagen} source={{ uri: imagen }} />
      </View>
      <View style={styles.Contenido}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.precio}>$ {precio}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  Contenedor: {
    width: 175,
    borderRadius: 10,
    margin: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1, // For Android shadow
  },
  ContentedorImagen: {
    alignItems: 'flex-start',
  },
  imagen: {
    width: 175,
    height: 220,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    objectFit: 'cover'
  },
  Contenido: {
    alignItems: 'flex-start',
    padding: 10,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#4A4A4A',
    textAlign: 'left',
  },
  precio: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8B5FBF',
    textAlign: 'center',
  },
});

export default React.memo(TarjetaDeProducto);
