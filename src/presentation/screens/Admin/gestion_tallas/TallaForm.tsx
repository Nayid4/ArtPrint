import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import TallaController from '../../../../controllers/TallaController';
import { Talla } from '../../../../domain/entities/Talla';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type TallaFormProps = {
  navigation: StackNavigationProp<any, any>;
  route: RouteProp<any, any>;
};

const TallaForm: React.FC<TallaFormProps> = ({ route, navigation }) => {
  const { tallaId } = route.params || {};
  const [nombre, setNombre] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const tallaController = new TallaController();

  useEffect(() => {
    if (tallaId) {
      const fetchTalla = async () => {
        setLoading(true);
        try {
          const talla = await tallaController.obtenerTallaPorId(tallaId);
          if (talla) {
            setNombre(talla.nombre);
          }
        } catch (error) {
          console.error('Error fetching talla:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchTalla();
    }
  }, [tallaId]);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (!nombre.trim()) {
        Alert.alert('Campo Vacío', 'Por favor ingrese un nombre para la talla.');
        return;
      }

      const now = new Date();
      if (tallaId) {
        await tallaController.actualizarTalla(tallaId, { nombre, updatedAt: now });
      } else {
        const newTalla: Talla = { id: '', nombre, createdAt: now, updatedAt: now };
        await tallaController.crearTalla(newTalla);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving talla:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{tallaId ? 'Editar Talla' : 'Añadir Talla'}</Text>
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

export default TallaForm;
