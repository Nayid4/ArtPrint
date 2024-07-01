import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  onAuthStateChanged,
  User,
  updateProfile
} from 'firebase/auth';
import { Usuario, RolUsuario } from '../domain/entities/Usuario';
import UsuarioController from './UsuarioController';

class AuthController {
  private auth = getAuth();
  private usuarioController = new UsuarioController();

  async register(
      email: string,
      password: string,
      cedula: string,
      nombre: string,
      telefono: string,
      direccion: string,
      rol: RolUsuario // Nuevo campo para el rol del usuario
  ): Promise<string | null> {
      try {
          const userCredential: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);

          const usuario: Usuario = {
              id: userCredential.user.uid,
              cedula,
              nombre,
              correo: email,
              rol,
              telefono,
              direccion,
              fotoPerfil: '', // Puedes dejar la foto de perfil en blanco por ahora
              createdAt: new Date(),
              updatedAt: new Date()
          };

          // Guardar los datos del usuario en la base de datos
          await this.usuarioController.crearUsuario(usuario);

          return userCredential.user.uid;
      } catch (error: any) {
          //console.error('Error al registrar usuario:', error);
          if (error.code === 'auth/email-already-in-use') {
              throw new Error('El correo electrónico ya está en uso.');
          }
          throw error; // Propaga cualquier otro error que no sea de correo electrónico en uso
      }
  }

  async login(email: string, password: string): Promise<string | null> {
      try {
          const userCredential: UserCredential = await signInWithEmailAndPassword(this.auth, email, password);
          return userCredential.user.uid;
      } catch (error: any) {
          //console.error('Error al iniciar sesión:', error);
          if (error.code === 'auth/email-already-in-use') {
            throw new Error('El correo electrónico ya está en uso.');
        }
        throw error;
      }
  }

  async logout(): Promise<void> {
      try {
          await signOut(this.auth);
      } catch (error) {
          console.error('Error al cerrar sesión:', error);
      }
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
      return onAuthStateChanged(this.auth, callback);
  }

}

export default AuthController;
