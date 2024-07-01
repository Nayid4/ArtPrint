import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import ProductoController from '../../../../controllers/ProductoController';
import { Producto } from '../../../../domain/entities/producto';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

type GestionProductoProps = {
  navigation: StackNavigationProp<any, any>;
  route: RouteProp<any, any>;
};

const GestionProducto: React.FC<GestionProductoProps> = ({ navigation }) => {
  const [products, setProducts] = useState<Producto[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const productoController = new ProductoController();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const fetchedProducts = await productoController.obtenerProductos();
      if (fetchedProducts) {
        setProducts(fetchedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  const filteredProducts = products.filter(product =>
    product.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: string) => {
    navigation.navigate('ProductoForm', { productId: id });
  };

  const handleDelete = async (id: string) => {
    try {
      await productoController.eliminarProducto(id);
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#8B5FBF" />
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.headerText}>Productos</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('ProductoForm')}>
              <Text style={styles.addButtonText}>Añadir Producto</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.searchBar}
            placeholder="Buscar"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Nombre</Text>
            <Text style={styles.tableHeaderText}>Precio</Text>
            <Text style={styles.tableHeaderText}>Acciones</Text>
          </View>
          <FlatList
            data={filteredProducts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.nombre}</Text>
                <Text style={styles.tableCell}>{item.precio}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item.id)}>
                    <Text style={styles.editButtonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#8B5FBF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    borderRadius: 4,
    marginBottom: 8,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#8B5FBF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  editButtonText: {
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  deleteButtonText: {
    color: '#fff',
  },
});

export default GestionProducto;