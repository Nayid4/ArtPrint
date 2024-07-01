import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Usuario } from '../../../../domain/entities/Usuario';
import UsuarioController from '../../../../controllers/UsuarioController';

type GestionUsuarioProps = {
  navigation: StackNavigationProp<any, any>;
  route: RouteProp<any, any>;
};

const GestionUsuario: React.FC<GestionUsuarioProps> = ({ navigation }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const usuarioController = new UsuarioController();

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const fetchedUsuarios = await usuarioController.obtenerUsuarios();
      if (fetchedUsuarios) {
        setUsuarios(fetchedUsuarios);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUsuarios();
    }, [])
  );

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: string) => {
    navigation.navigate('UsuarioForm', { usuarioId: id });
  };

  const handleDelete = async (id: string) => {
    try {
      await usuarioController.eliminarUsuario(id);
      setUsuarios(usuarios.filter(usuario => usuario.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#8B5FBF" />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.headerText}>Usuarios</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('UsuarioForm')}>
              <Text style={styles.addButtonText}>Registrar Usuario</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.searchBar}
            placeholder="Buscar por nombre"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Nombre</Text>
            <Text style={styles.tableHeaderText}>Rol</Text>
            <Text style={styles.tableHeaderText}>Acciones</Text>
          </View>
          <FlatList
            data={filteredUsuarios}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.nombre}</Text>
                <Text style={styles.tableCell}>{item.rol}</Text>
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
  loadingOverlay: {
    //...StyleSheet.absoluteFillObject,
    //backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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

export default GestionUsuario;
