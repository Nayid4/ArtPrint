// src/controllers/ColorController.ts

import { getFirestore, collection, addDoc, Firestore, DocumentData, doc, updateDoc, DocumentReference, query, where, QuerySnapshot, getDocs, CollectionReference, getDoc, deleteDoc } from 'firebase/firestore';
import { Material } from '../domain/entities/Material';
import { db } from '../config/firebaseConfig';

class MaterialController {
  private db: Firestore;
  private materialesRef: CollectionReference<DocumentData>;

  constructor() {
    this.db = db;
    this.materialesRef = collection(this.db, 'materiales');
  }

  async crearMaterial(material: Material): Promise<void> {
    try {
      const docRef = await addDoc(this.materialesRef, material);
      await updateDoc(docRef, { id: docRef.id });
    } catch (error) {
      console.error('Error al crear material:', error);
      throw error;
    }
  }

  async obtenerMaterialPorId(materialId: string): Promise<Material | null> {
    try {
      const materialDocRef = doc(this.db, 'materiales', materialId);
      const materialDocSnap = await getDoc(materialDocRef);
      if (materialDocSnap.exists()) {
        return materialDocSnap.data() as Material;
      } else {
        console.error('No se encontró el material con el ID:', materialId);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener material por ID:', error);
      throw error;
    }
  }

  async actualizarMaterial(materialId: string, newData: Partial<Material>): Promise<void> {
    try {
      const materialDoc = doc(this.db, 'materiales', materialId);
      await updateDoc(materialDoc, newData);
    } catch (error) {
      console.error('Error al actualizar material:', error);
      throw error;
    }
  }

  async eliminarMaterial(materialId: string): Promise<void> {
    try {
      const materialDoc = doc(this.db, 'materiales', materialId);
      await deleteDoc(materialDoc);
    } catch (error) {
      console.error('Error al eliminar material:', error);
      throw error;
    }
  }

  async obtenerTodosLosMateriales(): Promise<Material[]> {
    try {
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(this.materialesRef);
      const materiales: Material[] = [];
      querySnapshot.forEach((doc) => {
        materiales.push(doc.data() as Material);
      });
      return materiales;
    } catch (error) {
      console.error('Error al obtener todos los materiales:', error);
      throw error;
    }
  }
}

export default MaterialController;
