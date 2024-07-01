// src/domain/entities/Usuario.ts

enum RolUsuario {
    ADMIN = 'ADMIN',
    CLIENTE = 'CLIENTE',
}

type Usuario = {
    id: string;
    cedula: string;
    nombre: string;
    correo: string;
    rol: RolUsuario;
    telefono: string;
    direccion: string;
    fotoPerfil: string;
    createdAt: Date;
    updatedAt: Date;
};

const createUsuario = (
    id: string,
    cedula: string,
    nombre: string,
    correo: string,
    rol: RolUsuario,
    telefono: string,
    direccion: string,
    fotoPerfil: string,
    createdAt: Date,
    updatedAt: Date
): Usuario => ({
    id,
    cedula,
    nombre,
    correo,
    rol,
    telefono,
    direccion,
    fotoPerfil,
    createdAt,
    updatedAt
});

export { Usuario, RolUsuario, createUsuario };
