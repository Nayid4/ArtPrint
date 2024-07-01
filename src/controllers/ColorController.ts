// src/controllers/ColorController.ts

import { getFirestore, collection, addDoc, Firestore, DocumentData, doc, updateDoc, DocumentReference, query, where, QuerySnapshot, getDocs, CollectionReference, getDoc, deleteDoc } from 'firebase/firestore';
import { Color } from '../domain/entities/Color';
import { db } from '../config/firebaseConfig';

class ColorController {
  private db: Firestore;
  private coloresRef: CollectionReference<DocumentData>;

  constructor() {
    this.db = db;
    this.coloresRef = collection(this.db, 'colores');
  }

  async crearColor(color: Color): Promise<void> {
    try {
      const docRef = await addDoc(this.coloresRef, color);
      await updateDoc(docRef, { id: docRef.id });
    } catch (error) {
      console.error('Error al crear color:', error);
      throw error;
    }
  }

  async obtenerColorPorId(colorId: string): Promise<Color | null> {
    try {
      const colorDocRef = doc(this.db, 'colores', colorId);
      const colorDocSnap = await getDoc(colorDocRef);
      if (colorDocSnap.exists()) {
        return colorDocSnap.data() as Color;
      } else {
        console.error('No se encontró el color con el ID:', colorId);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener color por ID:', error);
      throw error;
    }
  }

  async actualizarColor(colorId: string, newData: Partial<Color>): Promise<void> {
    try {
      const colorDoc = doc(this.db, 'colores', colorId);
      await updateDoc(colorDoc, newData);
    } catch (error) {
      console.error('Error al actualizar color:', error);
      throw error;
    }
  }

  async eliminarColor(colorId: string): Promise<void> {
    try {
      const colorDoc = doc(this.db, 'colores', colorId);
      await deleteDoc(colorDoc);
    } catch (error) {
      console.error('Error al eliminar color:', error);
      throw error;
    }
  }

  async obtenerTodosLosColores(): Promise<Color[]> {
    try {
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(this.coloresRef);
      const colores: Color[] = [];
      querySnapshot.forEach((doc) => {
        colores.push(doc.data() as Color);
      });
      return colores;
    } catch (error) {
      console.error('Error al obtener todos los colores:', error);
      throw error;
    }
  }
}

export default ColorController;
