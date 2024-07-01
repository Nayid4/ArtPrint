import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface CustomCheckboxProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ label, selected, onSelect }) => {
  return (
    <TouchableOpacity style={[styles.checkbox, selected && styles.selectedCheckbox]} onPress={onSelect}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
  } as ViewStyle,
  selectedCheckbox: {
    borderColor: '#8B5FBF',
    backgroundColor: '#E9E4ED',
  } as ViewStyle,
  label: {
    color: '#000',
  } as TextStyle,
});

export default CustomCheckbox;
