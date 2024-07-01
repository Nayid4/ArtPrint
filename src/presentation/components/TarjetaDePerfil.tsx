import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

type PropiedadesTarjetaDePerfil = {
  etiqueta: string;
  valor: string;
  onPress: () => void;
};

const TarjetaDePerfil: React.FC<PropiedadesTarjetaDePerfil> = ({ etiqueta, valor, onPress }) => (
  <TouchableOpacity style={estilos.tarjetaDePerfil} onPress={onPress}>
    <View>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <Text style={estilos.valor}>{valor}</Text>
    </View>
    <AntDesign name="right" size={20} color="#4A4A4A" />
  </TouchableOpacity>
);

const estilos = StyleSheet.create({
  tarjetaDePerfil: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  etiqueta: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  valor: {
    fontSize: 16,
    color: '#878787',
    marginTop: 5,
  },
});

export default TarjetaDePerfil;
