import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ColorController from '../../../../controllers/ColorController';
import { Color } from '../../../../domain/entities/Color';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type ColorFormProps = {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<any, any>;
};

const ColorForm: React.FC<ColorFormProps> = ({ route, navigation }) => {
    const { colorId } = route.params || {};
    const [nombre, setNombre] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const colorController = new ColorController();

    useEffect(() => {
        if (colorId) {
            const fetchColor = async () => {
                setLoading(true);
                try {
                    const color = await colorController.obtenerColorPorId(colorId);
                    if (color) {
                        setNombre(color.nombre);
                    }
                } catch (error) {
                    console.error('Error fetching color:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchColor();
        }
    }, [colorId]);

    const handleSave = async () => {
        if (!nombre.trim()) {
            Alert.alert('Nombre Vacío', 'Por favor ingrese un nombre para el color.');
            return;
        }

        setLoading(true);
        try {
            const now = new Date();
            if (colorId) {
                await colorController.actualizarColor(colorId, { nombre, updatedAt: now });
            } else {
                const newColor: Color = { id: '', nombre, createdAt: now, updatedAt: now };
                await colorController.crearColor(newColor);
            }
            navigation.goBack();
        } catch (error) {
            console.error('Error saving color:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>{colorId ? 'Editar Color' : 'Añadir Color'}</Text>
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

export default ColorForm;
