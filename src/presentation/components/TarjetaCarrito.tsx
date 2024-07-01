import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  Image
} from 'react-native';

interface Props {
  imagen: string,
  titulo: string,
  precio: string
}

const TarjetaCarrito: React.FC<Props> = ({ imagen, titulo, precio }) => {
    return (
        <View style={styles.Contenedor}>
          <View style={styles.ContenedorImagen}>
            <Image style={styles.imagen} source={{ uri: imagen }} />
          </View>
          <View style={styles.Contenido}>
            <Text>{titulo}</Text>
            <Text>{precio}</Text>
          </View>
        </View>
    );
};

const styles = StyleSheet.create({

    Contenedor: {

    },
    ContenedorImagen: {

    },
    imagen: {

    },
    Contenido: {
        
    },
    precio:{
        color: '#8B5FBF'
    }
})