// src/controllers/TallaController.ts

import { getFirestore, collection, addDoc, Firestore, DocumentData, doc, updateDoc, DocumentReference, query, where, QuerySnapshot, getDocs, CollectionReference, getDoc, deleteDoc } from 'firebase/firestore';
import { Talla } from '../domain/entities/Talla';
import { db } from '../config/firebaseConfig';

class TallaController {
  private db: Firestore;
  private tallasRef: CollectionReference<DocumentData>;

  constructor() {
    this.db = db;
    this.tallasRef = collection(this.db, 'tallas');
  }

  async crearTalla(talla: Talla): Promise<void> {
    try {
      const docRef = await addDoc(this.tallasRef, talla);
      await updateDoc(docRef, { id: docRef.id });
    } catch (error) {
      console.error('Error al crear talla:', error);
      throw error;
    }
  }

  async obtenerTallaPorId(tallaId: string): Promise<Talla | null> {
    try {
      const tallaDocRef = doc(this.db, 'tallas', tallaId);
      const tallaDocSnap = await getDoc(tallaDocRef);
      if (tallaDocSnap.exists()) {
        return tallaDocSnap.data() as Talla;
      } else {
        console.error('No se encontró la talla con el ID:', tallaId);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener talla por ID:', error);
      throw error;
    }
  }

  async actualizarTalla(tallaId: string, newData: Partial<Talla>): Promise<void> {
    try {
      const tallaDoc = doc(this.db, 'tallas', tallaId);
      await updateDoc(tallaDoc, newData);
    } catch (error) {
      console.error('Error al actualizar talla:', error);
      throw error;
    }
  }

  async eliminarTalla(tallaId: string): Promise<void> {
    try {
      const tallaDoc = doc(this.db, 'tallas', tallaId);
      await deleteDoc(tallaDoc);
    } catch (error) {
      console.error('Error al eliminar talla:', error);
      throw error;
    }
  }

  async obtenerTodasLasTallas(): Promise<Talla[]> {
    try {
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(this.tallasRef);
      const tallas: Talla[] = [];
      querySnapshot.forEach((doc) => {
        tallas.push(doc.data() as Talla);
      });
      return tallas;
    } catch (error) {
      console.error('Error al obtener todas las tallas:', error);
      throw error;
    }
  }
}

export default TallaController;
