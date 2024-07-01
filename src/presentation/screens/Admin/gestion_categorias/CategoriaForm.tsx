import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import CategoriaController from '../../../../controllers/CategoriaController';
import { Categoria } from '../../../../domain/entities/Categoria';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type CategoriaFormProps = {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<any, any>;
};

const CategoriaForm: React.FC<CategoriaFormProps> = ({ route, navigation }) => {
    const { categoriaId } = route.params || {};
    const [nombre, setNombre] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const categoriaController = new CategoriaController();

    useEffect(() => {
        if (categoriaId) {
            const fetchCategoria = async () => {
                setLoading(true);
                try {
                    const categoria = await categoriaController.obtenerCategoriaPorId(categoriaId);
                    if (categoria) {
                        setNombre(categoria.nombre);
                    }
                } catch (error) {
                    console.error('Error fetching category:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchCategoria();
        }
    }, [categoriaId]);

    const handleSave = async () => {
        if (!nombre.trim()) {
            Alert.alert('Nombre Vacío', 'Por favor ingrese un nombre para la categoría.');
            return;
        }

        setLoading(true);
        try {
            const now = new Date();
            if (categoriaId) {
                await categoriaController.actualizarCategoria(categoriaId, { nombre, updatedAt: now });
            } else {
                const newCategoria: Categoria = { id: '', nombre, createdAt: now, updatedAt: now };
                await categoriaController.crearCategoria(newCategoria);
            }
            navigation.goBack();
        } catch (error) {
            console.error('Error saving category:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>{categoriaId ? 'Editar Categoría' : 'Añadir Categoría'}</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                <Text style={styles.saveButtonText}>{loading ? 'Guardando...' : 'Guardar'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: 16,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
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
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default CategoriaForm;
