// src/controllers/ProductoController.ts

import { getFirestore, collection, addDoc, Firestore, DocumentData, doc, setDoc, updateDoc, deleteDoc, DocumentSnapshot, CollectionReference, query, orderBy, onSnapshot, QuerySnapshot, getDocs, getDoc } from 'firebase/firestore';
import { Producto } from '../domain/entities/producto';
import { db } from '../config/firebaseConfig'; // Solo necesitamos la instancia de Firestore

class ProductoController {
  private db: Firestore;
  private productosRef: CollectionReference<DocumentData>;

  constructor() {
    this.db = db;
    this.productosRef = collection(this.db, 'productos');
  }

  async crearProducto(producto: Producto): Promise<void> {
    try {
      const docRef = await addDoc(this.productosRef, producto);
      await updateDoc(docRef, { id: docRef.id });  // Actualiza el producto con el ID generado por Firebase
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  }

  async obtenerProductoPorId(productId: string): Promise<Producto | null> {
    try {
      const productoDocRef = doc(this.db, 'productos', productId);
      const productoDocSnap: DocumentSnapshot<DocumentData> = await getDoc(productoDocRef);
      if (productoDocSnap.exists()) {
        return productoDocSnap.data() as Producto;
      } else {
        console.error('No se encontró el producto con el ID:', productId);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener producto por ID:', error);
      throw error;
    }
  }

  async actualizarProducto(productId: string, newData: Partial<Producto>): Promise<void> {
    try {
      const productoDoc = doc(this.db, 'productos', productId);
      await updateDoc(productoDoc, newData);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  }

  async eliminarProducto(productId: string): Promise<void> {
    try {
      const productoDoc = doc(this.db, 'productos', productId);
      await deleteDoc(productoDoc);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  }

  async obtenerProductos(): Promise<Producto[] | null> {
    try {
      const q = query(this.productosRef, orderBy('precio'));
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
      const productos: Producto[] = querySnapshot.docs.map(doc => doc.data() as Producto);
      return productos;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return null;
    }
  }
}

export default ProductoController;
