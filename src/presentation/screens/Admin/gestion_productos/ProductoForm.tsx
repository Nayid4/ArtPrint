import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import ProductoController from '../../../../controllers/ProductoController';
import { Producto } from '../../../../domain/entities/producto';
import ImageUploadController from '../../../../controllers/ImageUploadController';

type ProductoFormProps = {
  navigation: StackNavigationProp<any, any>;
  route: RouteProp<any, any>;
};

const ProductoForm: React.FC<ProductoFormProps> = ({ navigation, route }) => {
  const { productId } = route.params || {};
  const [producto, setProducto] = useState<Partial<Producto>>({
    nombre: '',
    descripcion: '',
    precio: 0,
    imagenUrl: ''
  });
  const [uploading, setUploading] = useState(false);
  const productoController = new ProductoController();

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        const fetchedProduct = await productoController.obtenerProductoPorId(productId);
        if (fetchedProduct) {
          setProducto(fetchedProduct);
        }
      };
      fetchProduct();
    }
  }, [productId]);

  const handleSave = async () => {
    try {
      if (!producto.nombre!.trim() || !producto.descripcion!.trim() || !producto.precio || !producto.imagenUrl!.trim()) {
        Alert.alert('Campos Vacíos', 'Por favor complete todos los campos.');
        return;
      }

      if (productId) {
        await productoController.actualizarProducto(productId, producto);
      } else {
        await productoController.crearProducto({ ...producto, id: '', createdAt: new Date(), updatedAt: new Date() } as Producto);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handlePickImage = async () => {
    try {
      setUploading(true);
      const uri = await ImageUploadController.pickImage();
      if (uri) {
        const imageUrl = await ImageUploadController.uploadImage(uri);
        setProducto({ ...producto, imagenUrl: imageUrl });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{productId ? 'Editar Producto' : 'Agregar Producto'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={producto.nombre}
        onChangeText={text => setProducto({ ...producto, nombre: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={producto.descripcion}
        onChangeText={text => setProducto({ ...producto, descripcion: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        keyboardType="numeric"
        value={producto.precio?.toString()}
        onChangeText={text => setProducto({ ...producto, precio: parseFloat(text) })}
      />
      <Button
        title={uploading ? "Subiendo imagen..." : "Seleccionar Imagen"}
        onPress={handlePickImage}
        disabled={uploading}
      />
      <TextInput
        style={styles.input}
        placeholder="URL de la Imagen"
        value={producto.imagenUrl}
        editable={false}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#8B5FBF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProductoForm;
