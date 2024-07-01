import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, FlatList, TouchableHighlight, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import PrendaController from '../../../../controllers/PrendaController';
import CategoriaController from '../../../../controllers/CategoriaController';
import { Prenda, createPrenda } from '../../../../domain/entities/Prenda';
import { Categoria } from '../../../../domain/entities/Categoria';

type PrendaFormProps = {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<any, any>;
};

const PrendaForm: React.FC<PrendaFormProps> = ({ navigation, route }) => {
    const { prendaId } = route.params || {};
    const [nombre, setNombre] = useState<string>('');
    const [idCategoria, setIdCategoria] = useState<string>('');
    const [precio, setPrecio] = useState<string>('');
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ nombre: boolean, idCategoria: boolean, precio: boolean }>({
        nombre: false,
        idCategoria: false,
        precio: false
    });

    const prendaController = new PrendaController();
    const categoriaController = new CategoriaController();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const fetchedCategorias = await categoriaController.obtenerTodasLasCategorias();
                setCategorias(fetchedCategorias);

                if (prendaId) {
                    const prenda = await prendaController.obtenerPrendaPorId(prendaId);
                    if (prenda) {
                        setNombre(prenda.nombre);
                        setIdCategoria(prenda.idCategoria);
                        setPrecio(prenda.precio.toString());
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [prendaId]);

    const validateFields = () => {
        const newErrors = {
            nombre: nombre.trim() === '',
            idCategoria: idCategoria === '',
            precio: precio.trim() === '' || isNaN(Number(precio))
        };
        setErrors(newErrors);
        return !Object.values(newErrors).includes(true);
    };

    const handleSave = async () => {
        if (!validateFields()) {
            return;
        }

        try {
            const prendaData: Prenda = createPrenda(
                prendaId || '',
                nombre,
                idCategoria,
                parseFloat(precio),
                new Date(),
                new Date()
            );

            if (prendaId) {
                await prendaController.actualizarPrenda(prendaId, prendaData);
            } else {
                await prendaController.crearPrenda(prendaData);
            }

            navigation.goBack();
        } catch (error) {
            console.error('Error saving prenda:', error);
        }
    };

    const handleCategoriaSelect = (id: string) => {
        setIdCategoria(id);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#8B5FBF" />
            ) : (
                <>
                    <Text style={styles.headerText}>{prendaId ? 'Editar Prenda' : 'Añadir Prenda'}</Text>
                    <TextInput
                        style={[styles.input, errors.nombre && styles.inputError]}
                        placeholder="Nombre"
                        value={nombre}
                        onChangeText={setNombre}
                    />
                    {errors.nombre && <Text style={styles.errorText}>Nombre es requerido</Text>}
                    <TouchableOpacity style={[styles.picker, errors.idCategoria && styles.inputError]} onPress={() => setModalVisible(true)}>
                        <Text>{idCategoria ? categorias.find(c => c.id === idCategoria)?.nombre : '-- Seleccione una categoría --'}</Text>
                    </TouchableOpacity>
                    {errors.idCategoria && <Text style={styles.errorText}>Categoría es requerida</Text>}
                    <TextInput
                        style={[styles.input, errors.precio && styles.inputError]}
                        placeholder="Precio"
                        value={precio}
                        onChangeText={setPrecio}
                        keyboardType="numeric"
                    />
                    {errors.precio && <Text style={styles.errorText}>Precio es requerido y debe ser un número</Text>}
                    <TouchableOpacity style={styles.button} onPress={handleSave}>
                        <Text style={styles.buttonText}>{prendaId ? 'Actualizar' : 'Guardar'} Prenda</Text>
                    </TouchableOpacity>
                    <Modal visible={modalVisible} transparent={true} animationType="slide">
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <FlatList
                                    data={categorias}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item }) => (
                                        <TouchableHighlight onPress={() => handleCategoriaSelect(item.id)}>
                                            <Text style={styles.modalItem}>{item.nombre}</Text>
                                        </TouchableHighlight>
                                    )}
                                />
                                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.closeButtonText}>Cerrar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
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
        marginBottom: 8,
    },
    inputError: {
        borderColor: 'red',
    },
    picker: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        justifyContent: 'center',
        marginBottom: 8,
    },
    button: {
        backgroundColor: '#8B5FBF',
        paddingVertical: 12,
        borderRadius: 4,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        marginBottom: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 8,
        padding: 16,
        maxHeight: '80%',
        width: '80%',
    },
    modalItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    closeButton: {
        backgroundColor: '#8B5FBF',
        paddingVertical: 12,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 16,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default PrendaForm;
