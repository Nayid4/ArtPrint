// src/controllers/PrendaController.ts

import { getFirestore, collection, addDoc, Firestore, DocumentData, doc, setDoc, updateDoc, deleteDoc, DocumentSnapshot, CollectionReference, query, orderBy, onSnapshot, QuerySnapshot, getDocs, getDoc, where } from 'firebase/firestore';
import { Prenda } from '../domain/entities/Prenda';
import { db } from '../config/firebaseConfig';

class PrendaController {
  private db: Firestore;
  private prendasRef: CollectionReference<DocumentData>;

  constructor() {
    this.db = db;
    this.prendasRef = collection(this.db, 'prendas');
  }

  async crearPrenda(prenda: Prenda): Promise<void> {
    try {
      const docRef = await addDoc(this.prendasRef, prenda);
      await updateDoc(docRef, { id: docRef.id });
    } catch (error) {
      console.error('Error al crear prenda:', error);
      throw error;
    }
  }

  async obtenerPrendaPorId(prendaId: string): Promise<Prenda | null> {
    try {
      const prendaDocRef = doc(this.db, 'prendas', prendaId);
      const prendaDocSnap: DocumentSnapshot<DocumentData> = await getDoc(prendaDocRef);
      if (prendaDocSnap.exists()) {
        return prendaDocSnap.data() as Prenda;
      } else {
        console.error('No se encontró la prenda con el ID:', prendaId);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener prenda por ID:', error);
      throw error;
    }
  }

  async actualizarPrenda(prendaId: string, newData: Partial<Prenda>): Promise<void> {
    try {
      const prendaDoc = doc(this.db, 'prendas', prendaId);
      await updateDoc(prendaDoc, newData);
    } catch (error) {
      console.error('Error al actualizar prenda:', error);
      throw error;
    }
  }

  async eliminarPrenda(prendaId: string): Promise<void> {
    try {
      const prendaDoc = doc(this.db, 'prendas', prendaId);
      await deleteDoc(prendaDoc);
    } catch (error) {
      console.error('Error al eliminar prenda:', error);
      throw error;
    }
  }

  async obtenerPrendas(): Promise<Prenda[] | null> {
    try {
      const q = query(this.prendasRef, orderBy('createdAt'));
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
      const prendas: Prenda[] = querySnapshot.docs.map(doc => doc.data() as Prenda);
      return prendas;
    } catch (error) {
      console.error('Error al obtener prendas:', error);
      return null;
    }
  }

  async obtenerPrendasPorCategoria(categoriaId: string): Promise<Prenda[]> {
    try {
      const q = query(this.prendasRef, where('idCategoria', '==', categoriaId));
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
      const prendas: Prenda[] = querySnapshot.docs.map(doc => doc.data() as Prenda);
      return prendas;
    } catch (error) {
      console.error('Error al obtener prendas por categoría:', error);
      throw error;
    }
  }
}

export default PrendaController;
