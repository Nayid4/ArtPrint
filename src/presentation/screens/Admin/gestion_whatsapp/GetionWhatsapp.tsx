import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Modal, FlatList, TouchableHighlight } from 'react-native';
import WhatsAppController from '../../../../controllers/WhatsAppController';
import { WhatsApp } from '../../../../domain/entities/WhatsApp';

const GestionWhatsApp = () => {
  const [numeroWhatsApp, setNumeroWhatsApp] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [whatsappData, setWhatsAppData] = useState<WhatsApp | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const whatsappController = new WhatsAppController();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const data = await whatsappController.obtenerNumeroWhatsApp();

        if (data) {
          setWhatsAppData(data);
          setNumeroWhatsApp(data.phoneNumber);
          setCountryCode(data.countryCode);
        } else {
          Alert.alert(
            'Agregar Número de WhatsApp',
            'No se encontró ningún número de WhatsApp. ¿Deseas agregar uno nuevo?',
            [
              {
                text: 'Cancelar',
                style: 'cancel',
              },
              {
                text: 'Agregar',
                onPress: () => setNumeroWhatsApp(''),
              },
            ]
          );
        }
      } catch (error) {
        console.error('Error fetching WhatsApp data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGuardarNumero = async () => {
    try {
      setLoading(true);

      if (whatsappData) {
        await whatsappController.actualizarNumeroWhatsApp(numeroWhatsApp, countryCode);
        setWhatsAppData({ ...whatsappData, phoneNumber: numeroWhatsApp, countryCode });
        showAlert('Número de WhatsApp actualizado correctamente.');
      } else {
        await whatsappController.guardarNumeroWhatsApp(numeroWhatsApp, countryCode);
        const newWhatsAppData = await whatsappController.obtenerNumeroWhatsApp();
        
        if (newWhatsAppData) {
          setWhatsAppData(newWhatsAppData);
          setNumeroWhatsApp(newWhatsAppData.phoneNumber);
          setCountryCode(newWhatsAppData.countryCode);
          showAlert('Número de WhatsApp agregado correctamente.');
        }
      }
    } catch (error) {
      console.error('Error al actualizar/guardar número de WhatsApp:', error);
      showAlert('Error al guardar/actualizar número de WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message: string) => {
    Alert.alert('Aviso', message);
  };

  const countries = [
    { label: 'Colombia (+57)', value: '57' },
    { label: 'Estados Unidos (+1)', value: '1' },
    { label: 'Perú (+51)', value: '51' },
    { label: 'Ecuador (+593)', value: '593' },
  ];

  const handleCountrySelect = (value: string) => {
    setCountryCode(value);
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#8B5FBF" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Número de WhatsApp:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese el número de WhatsApp"
        value={numeroWhatsApp}
        onChangeText={setNumeroWhatsApp}
      />
      <Text style={styles.label}>Código de País:</Text>
      <TouchableOpacity
        style={[styles.picker, !countryCode && styles.inputError]} // Manejo condicional de estilos
        onPress={() => setModalVisible(true)}
      >
        <Text>{countryCode ? countries.find(c => c.value === countryCode)?.label : 'Seleccionar país'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleGuardarNumero}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={countries}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableHighlight onPress={() => handleCountrySelect(item.value)}>
                  <Text style={styles.modalItem}>{item.label}</Text>
                </TouchableHighlight>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  picker: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8B5FBF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputError: {
    borderColor: 'red',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#8B5FBF',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default GestionWhatsApp;
