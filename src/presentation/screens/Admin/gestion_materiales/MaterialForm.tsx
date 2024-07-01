import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import MaterialController from '../../../../controllers/MaterialController';
import { Material } from '../../../../domain/entities/Material';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type MaterialFormProps = {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<any, any>;
};

const MaterialForm: React.FC<MaterialFormProps> = ({ route, navigation }) => {
    const { materialId } = route.params || {};
    const [nombre, setNombre] = useState<string>('');
    const [precioExtra, setPrecioExtra] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const materialController = new MaterialController();

    useEffect(() => {
        if (materialId) {
            const fetchMaterial = async () => {
                setLoading(true);
                try {
                    const material = await materialController.obtenerMaterialPorId(materialId);
                    if (material) {
                        setNombre(material.nombre);
                        setPrecioExtra(material.precioExtra.toString());
                    }
                } catch (error) {
                    console.error('Error fetching material:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchMaterial();
        }
    }, [materialId]);

    const handleSave = async () => {
        if (!nombre.trim() || !precioExtra.trim()) {
            Alert.alert('Campos Vacíos', 'Por favor complete todos los campos.');
            return;
        }

        setLoading(true);
        try {
            const now = new Date();
            const parsedPrecioExtra = parseFloat(precioExtra);
            if (!isNaN(parsedPrecioExtra)) {
                if (materialId) {
                    await materialController.actualizarMaterial(materialId, { nombre, precioExtra: parsedPrecioExtra, updatedAt: now });
                } else {
                    const newMaterial: Material = { id: '', nombre, precioExtra: parsedPrecioExtra, createdAt: now, updatedAt: now };
                    await materialController.crearMaterial(newMaterial);
                }
                navigation.goBack();
            } else {
                console.error('Precio extra inválido.');
            }
        } catch (error) {
            console.error('Error saving material:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>{materialId ? 'Editar Material' : 'Añadir Material'}</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
            />
            <TextInput
                style={styles.input}
                placeholder="Precio Extra"
                keyboardType="numeric"
                value={precioExtra}
                onChangeText={setPrecioExtra}
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

export default MaterialForm;
