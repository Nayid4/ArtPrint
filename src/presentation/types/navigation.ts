import { Producto } from '../../domain/entities/producto';

export type RootStackParamList = {
  DetallesDeProducto: { producto: Producto };
  Login: undefined;
  EditarPerfil: undefined;
  Home: undefined;
  Registro: undefined;
  Perfil: undefined;
  CarritoDeCompras: undefined;
  GestionProducto: undefined;
  HomeAdmin: undefined;
  HomeCliente: undefined;
  HomeGeneral: undefined;
  MyAdminStack: undefined;
  MyClientStack: undefined;
  ProductoForm: undefined;
  GestionCategoria: undefined;
  CategoriaForm: undefined;
  GestionTalla: undefined;
  TallaForm: undefined;
  GestionMaterial: undefined;
  MaterialForm: undefined;
  GestionColor: undefined;
  ColorForm: undefined;
  GestionUsuario: undefined;
  UsuarioForm: undefined;
  GestionPrenda: undefined;
  PrendaForm: undefined;
  GestionWhatsApp: undefined;
};
