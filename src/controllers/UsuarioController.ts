// src/controllers/UsuarioController.ts

import { getAuth, deleteUser, createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { getFirestore, collection, Firestore, DocumentData, doc, setDoc, updateDoc, deleteDoc, DocumentSnapshot, CollectionReference, query, orderBy, onSnapshot, QuerySnapshot, getDocs, getDoc } from 'firebase/firestore';
import { Usuario } from '../domain/entities/Usuario';
import { app, db, auth } from '../config/firebaseConfig';

class UsuarioController {
    private db: Firestore;
    private usuariosRef: CollectionReference<DocumentData>;
    //private carritoController: CarritoController; // Instancia del controlador de carrito
  
    constructor() {
      this.db = db;
      this.usuariosRef = collection(this.db, 'usuarios');
      //this.carritoController = new CarritoController(); // Inicializamos el controlador de carrito
    }

    async crearUsuario(usuario: Usuario): Promise<void> {
        try {
          // Crear el usuario
          //const userDocRef = await addDoc(this.usuariosRef, usuario);
          const docuRef = doc(db, `usuarios/${usuario.id}`)
          setDoc(docuRef, usuario)
          // Obtener el ID del nuevo usuario
          //const userId = userDocRef.id;
          // Crear un carrito para el nuevo usuario
          //await this.carritoController.crearCarrito(usuario.id);
        } catch (error) {
          console.error('Error al crear usuario:', error);
          throw error;
        }
      }
   
      async crearUsuarioYAutenticacion(usuario: Usuario, password: string): Promise<void> {
        let userCredential: UserCredential | null = null;
        try {
          // Paso 1: Crear usuario en la autenticación de Firebase
          const auth = getAuth();
          userCredential = await createUserWithEmailAndPassword(auth, usuario.correo, password);
    
          // Paso 2: Guardar información adicional en Firestore
          if (userCredential.user) {
            const { uid } = userCredential.user;
            const usuarioConId: Usuario = { ...usuario, id: uid };
            const docRef = doc(this.db, 'usuarios', uid);
            await setDoc(docRef, usuarioConId);
          }
        } catch (error) {
          // Si hay un error, eliminar el usuario recién creado en la autenticación si es necesario
          if (userCredential && userCredential.user) {
            await userCredential.user.delete();
          }
          console.error('Error al crear usuario y autenticación:', error);
          throw error;
        }
      }
  
  async obtenerUsuarioPorId(userId: string): Promise<Usuario | null> {
    try {
      const userDocRef = doc(this.db, 'usuarios', userId);
      const userDocSnap: DocumentSnapshot<DocumentData> = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        return userDocSnap.data() as Usuario;
      } else {
        console.error('No se encontró el usuario con el ID:', userId);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      throw error;
    }
  }

  async actualizarUsuario(userId: string, newData: Partial<Usuario>): Promise<void> {
    try {
      const userDocRef = doc(this.db, 'usuarios', userId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        await updateDoc(userDocRef, newData);
      } else {
        console.error('No se encontró el usuario con el ID:', userId);
        throw new Error('Usuario no encontrado');
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }
  

  async eliminarUsuario(userId: string): Promise<void> {
    try {
      // Eliminar en Firestore
      const userDoc = doc(this.db, 'usuarios', userId);
      await deleteDoc(userDoc);

      // Eliminar en Autenticación
      
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }

  async obtenerUsuarios(): Promise<Usuario[] | null> {
    try {
      const q = query(this.usuariosRef, orderBy('createdAt'));
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
      const usuarios: Usuario[] = querySnapshot.docs.map(doc => doc.data() as Usuario);
      return await usuarios;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return null;
    }
  }
  
  
  // Otros métodos de consulta y manipulación de usuarios pueden ser agregados según sea necesario
}

export default UsuarioController;
