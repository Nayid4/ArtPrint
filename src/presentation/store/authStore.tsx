// Estado global de Zustand
import { create } from 'zustand';
import { Usuario } from '../../domain/entities/Usuario'; // Importamos la entidad Usuario

type AuthStore = {
  userInfo: Usuario | null; // Cambiamos el tipo UserInfo por Usuario
  setUserInfo: (userInfo: Usuario | null) => void;
};

const useAuthStore = create<AuthStore>((set) => ({
  userInfo: null,
  setUserInfo: (userInfo) => set({ userInfo }),
}));

export default useAuthStore;
