import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import uuid from 'react-native-uuid';
import { storage } from '../config/firebaseConfig';  // Asegúrate de importar la configuración de storage

class ImageUploadController {
  async pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) {
      return null;
    }

    return result.assets[0].uri;
  }

  async uploadImage(uri: string): Promise<string> {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `images/${uuid.v4()}`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }
}

export default new ImageUploadController();
