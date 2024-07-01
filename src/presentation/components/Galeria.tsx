// src/components/ImageGallery.tsx

import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface ImageGalleryProps {
  images: string[];
}

const Galeria: React.FC<ImageGalleryProps> = ({ images }) => {
  return (
    <View style={styles.container}>
      {images.map((imageUri, index) => (
        <Image key={index} source={{ uri: imageUri }} style={styles.image} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100, // adjust the width as necessary
    backgroundColor: '#E9E4ED',
    marginRight: 10, // adjust the margin as necessary
  },
  image: {
    width: '100%',
    height: 75, // adjust the height as necessary
    marginBottom: 10, // spacing between images
  },
});

export default Galeria;
