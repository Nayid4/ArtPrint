// src/controllers/CarritoController.ts

import { getFirestore, collection, addDoc, Firestore, DocumentData, doc, updateDoc, query, where, QuerySnapshot, getDocs, CollectionReference, getDoc } from 'firebase/firestore';
import { Carrito } from '../domain/entities/Carrito';
import { db } from '../config/firebaseConfig';
import { ItemCarrito } from '../domain/entities/ItemCarrito';
import { Linking } from 'react-native';
import PrendaController from './PrendaController';
import MaterialController from './MaterialController';
import ColorController from './ColorController';
import TallaController from './TallaController';
import UsuarioController from './UsuarioController';

class CarritoController {
  private db: Firestore;
  private carritosRef: CollectionReference<DocumentData>;
  private prendaController: PrendaController;
  private materialController: MaterialController;
  private colorController: ColorController;
  private tallaController: TallaController;
  private usuarioController: UsuarioController;

  constructor() {
    this.db = db;
    this.carritosRef = collection(this.db, 'carritos');
    this.prendaController = new PrendaController();
    this.materialController = new MaterialController();
    this.colorController = new ColorController();
    this.tallaController = new TallaController();
    this.usuarioController = new UsuarioController();
  }

  async crearCarrito(usuarioId: string): Promise<Carrito> {
    try {
      const createdAt = new Date();
      const newCarritoRef = await addDoc(this.carritosRef, {
        usuarioId,
        items: [],
        createdAt,
        updatedAt: createdAt,
      });
      const newCarritoSnapshot = await getDoc(newCarritoRef);
      return { id: newCarritoSnapshot.id, ...newCarritoSnapshot.data() } as Carrito;
    } catch (error) {
      console.error('Error al crear el carrito de compras:', error);
      throw error;
    }
  }

  async obtenerCarritoPorUsuarioId(usuarioId: string): Promise<Carrito | null> {
    try {
      const q = query(this.carritosRef, where('usuarioId', '==', usuarioId));
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
      if (querySnapshot.empty) {
        return null;
      }
      const carritoSnapshot = querySnapshot.docs[0];
      return { id: carritoSnapshot.id, ...carritoSnapshot.data() } as Carrito;
    } catch (error) {
      console.error('Error al obtener el carrito de compras:', error);
      throw error;
    }
  }

  async agregarProductoAlCarrito(carritoId: string, itemCarrito: ItemCarrito, usuarioId: string): Promise<void> {
    if (!usuarioId) {
      throw new Error('Usuario no autenticado');
    }
  
    try {
      const carritoDocRef = doc(this.db, 'carritos', carritoId);
      const carritoDocSnap = await getDoc(carritoDocRef);
  
      if (!carritoDocSnap.exists()) {
        throw new Error('Carrito no encontrado');
      }
  
      const carritoData = carritoDocSnap.data() as Carrito;
      let items = carritoData.items;
  
      items.push(itemCarrito);
  
      await updateDoc(carritoDocRef, {
        items: items,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      throw error;
    }
  }
  

  async eliminarProductoDelCarrito(carritoId: string, productoId: string): Promise<void> {
    try {
      const carritoDocRef = doc(this.db, 'carritos', carritoId);
      const carritoDocSnap = await getDoc(carritoDocRef);
      if (carritoDocSnap.exists()) {
        const carritoData = carritoDocSnap.data() as Carrito;
        const updatedItems = carritoData.items.filter(item => item.productoId !== productoId);
        await updateDoc(carritoDocRef, { items: updatedItems, updatedAt: new Date() });
      } else {
        console.error('No se encontró el carrito con el ID:', carritoId);
      }
    } catch (error) {
      console.error('Error al eliminar producto del carrito:', error);
      throw error;
    }
  }

  async actualizarCantidadProducto(carritoId: string, productoId: string, nuevaCantidad: number): Promise<void> {
    try {
      const carritoDocRef = doc(this.db, 'carritos', carritoId);
      const carritoDocSnap = await getDoc(carritoDocRef);
  
      if (!carritoDocSnap.exists()) {
        throw new Error('Carrito no encontrado');
      }
  
      const carritoData = carritoDocSnap.data() as Carrito;
      let items = carritoData.items;
  
      const existingItemIndex = items.findIndex(item => item.productoId === productoId);
  
      if (existingItemIndex !== -1) {
        items[existingItemIndex].cantidad = nuevaCantidad;
        await updateDoc(carritoDocRef, {
          items: items,
          updatedAt: new Date(),
        });
      } else {
        throw new Error('Producto no encontrado en el carrito');
      }
    } catch (error) {
      console.error('Error al actualizar cantidad del producto en el carrito:', error);
      throw error;
    }
  }

  async obtenerTotalCarrito(carritoId: string): Promise<number> {
    try {
      const carritoDocRef = doc(this.db, 'carritos', carritoId);
      const carritoDocSnap = await getDoc(carritoDocRef);
  
      if (!carritoDocSnap.exists()) {
        throw new Error('Carrito no encontrado');
      }
  
      const carritoData = carritoDocSnap.data() as Carrito;
      let total = 0;
      for (const item of carritoData.items) {
        total += item.cantidad * item.precio;
      }
      return total;
    } catch (error) {
      console.error('Error al obtener el total del carrito:', error);
      throw error;
    }
  }

  async vaciarCarrito(carritoId: string): Promise<void> {
    try {
      const carritoDocRef = doc(this.db, 'carritos', carritoId);
      await updateDoc(carritoDocRef, { items: [], updatedAt: new Date() });
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
      throw error;
    }
  }

  async comprarCarrito(carritoId: string, vendedorWhatsapp: string): Promise<void> {
    try {
      const carritoDocRef = doc(this.db, 'carritos', carritoId);
      const carritoDocSnap = await getDoc(carritoDocRef);
      if (!carritoDocSnap.exists()) {
        console.error('No se encontró el carrito con el ID:', carritoId);
        return;
      }
  
      const carritoData = carritoDocSnap.data() as Carrito;
      if (!carritoData) {
        console.error('Error al obtener los datos del carrito');
        return;
      }
  
      let mensaje = `Hola, quiero comprar los siguientes productos:\n`;
      let total = 0;

      mensaje += `\n------ Productos ------\n`;

      for (const item of carritoData.items) {
        const prenda = await this.prendaController.obtenerPrendaPorId(item.idPrenda);
        const material = await this.materialController.obtenerMaterialPorId(item.idMaterial);
        const color = await this.colorController.obtenerColorPorId(item.idColor);
        const talla = await this.tallaController.obtenerTallaPorId(item.talla);

        const prendaNombre = prenda ? prenda.nombre : 'Desconocido';
        const materialNombre = material ? material.nombre : 'Desconocido';
        const colorNombre = color ? color.nombre : 'Desconocido';
        const tallaNombre = talla ? talla.nombre : 'Desconocido';

        mensaje += `\n-- Producto --\n`;
        mensaje += `${item.nombre}: ${item.cantidad} x $${item.precio}\n`;
        mensaje += `Prenda: ${prendaNombre}, Material: ${materialNombre}, Color: ${colorNombre}, Talla: ${tallaNombre}, Género: ${item.genero}\n`;
        total += item.cantidad * item.precio;
      }

      const usuario = await this.usuarioController.obtenerUsuarioPorId(carritoData.usuarioId);

      mensaje += `\n\n------ Cliente ------`;
      mensaje += `\nCedula: ${usuario?.cedula}`;
      mensaje += `\nNombre: ${usuario?.nombre}`;
      mensaje += `\nTelefono: ${usuario?.telefono}`;
      mensaje += `\nCorreo: ${usuario?.correo}`;
      mensaje += `\nDireccion: ${usuario?.direccion}`;

      mensaje += `\n\n------ Total ------`;
      mensaje += `\nTotal: $${total}\nGracias!`;
  
      const whatsappLink = `https://wa.me/${vendedorWhatsapp}?text=${encodeURIComponent(mensaje)}`;
  
      Linking.openURL(whatsappLink)
      .then(() => console.log(`Se abrió WhatsApp con el número ${vendedorWhatsapp}`))
      .catch((error) => console.error('Error al abrir WhatsApp:', error));
  
      await this.vaciarCarrito(carritoId);
  
    } catch (error) {
      console.error('Error al comprar el carrito:', error);
      throw error;
    }
  }
}

export default CarritoController;
