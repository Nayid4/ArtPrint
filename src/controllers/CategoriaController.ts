// src/controllers/ColorController.ts

import { getFirestore, collection, addDoc, Firestore, DocumentData, doc, updateDoc, DocumentReference, query, where, QuerySnapshot, getDocs, CollectionReference, getDoc, deleteDoc } from 'firebase/firestore';
import { Categoria } from '../domain/entities/Categoria';
import { db } from '../config/firebaseConfig';

class CategoriaController {
  private db: Firestore;
  private categoriasRef: CollectionReference<DocumentData>;

  constructor() {
    this.db = db;
    this.categoriasRef = collection(this.db, 'categorias');
  }

  async crearCategoria(categoria: Categoria): Promise<void> {
    try {
      const docRef = await addDoc(this.categoriasRef, categoria);
      await updateDoc(docRef, { id: docRef.id });
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw error;
    }
  }

  async obtenerCategoriaPorId(categoriaId: string): Promise<Categoria | null> {
    try {
      const categoriaDocRef = doc(this.db, 'categorias', categoriaId);
      const categoriaDocSnap = await getDoc(categoriaDocRef);
      if (categoriaDocSnap.exists()) {
        return categoriaDocSnap.data() as Categoria;
      } else {
        console.error('No se encontró la categoría con el ID:', categoriaId);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener categoría por ID:', error);
      throw error;
    }
  }

  async actualizarCategoria(categoriaId: string, newData: Partial<Categoria>): Promise<void> {
    try {
      const categoriaDoc = doc(this.db, 'categorias', categoriaId);
      await updateDoc(categoriaDoc, newData);
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      throw error;
    }
  }

  async eliminarCategoria(categoriaId: string): Promise<void> {
    try {
      const categoriaDoc = doc(this.db, 'categorias', categoriaId);
      await deleteDoc(categoriaDoc);
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      throw error;
    }
  }

  async obtenerTodasLasCategorias(): Promise<Categoria[]> {
    try {
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(this.categoriasRef);
      const categorias: Categoria[] = [];
      querySnapshot.forEach((doc) => {
        categorias.push(doc.data() as Categoria);
      });
      return categorias;
    } catch (error) {
      console.error('Error al obtener todas las categorías:', error);
      throw error;
    }
  }
}

export default CategoriaController;
