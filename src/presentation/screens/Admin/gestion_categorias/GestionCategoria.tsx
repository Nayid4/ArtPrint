import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import CategoriaController from '../../../../controllers/CategoriaController';
import { Categoria } from '../../../../domain/entities/Categoria';
import { StackNavigationProp } from '@react-navigation/stack';

type GestionCategoriaProps = {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<any, any>;
};

const GestionCategoria: React.FC<GestionCategoriaProps> = ({ navigation }) => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const categoriaController = new CategoriaController();

    const fetchCategorias = async () => {
        try {
            setLoading(true);
            const fetchedCategorias = await categoriaController.obtenerTodasLasCategorias();
            setCategorias(fetchedCategorias);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchCategorias();
        }, [])
    );

    const filteredCategorias = categorias.filter(categoria =>
        categoria.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (id: string) => {
        navigation.navigate('CategoriaForm', { categoriaId: id });
    };

    const handleDelete = async (id: string) => {
        try {
            await categoriaController.eliminarCategoria(id);
            setCategorias(categorias.filter(categoria => categoria.id !== id));
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#8B5FBF" />
            ) : (
                <>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Categorías</Text>
                        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CategoriaForm')}>
                            <Text style={styles.addButtonText}>Añadir Categoría</Text>
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
                        <Text style={styles.tableHeaderText}>Acciones</Text>
                    </View>
                    <FlatList
                        data={filteredCategorias}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.tableRow}>
                                <Text style={styles.tableCell}>{item.nombre}</Text>
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

export default GestionCategoria;
