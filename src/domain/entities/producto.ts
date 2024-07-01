

type Producto = {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    imagenUrl: string;
    createdAt: Date;
    updatedAt: Date;
};

const createProducto = (
    id: string,
    nombre: string,
    descripcion: string,
    precio: number,
    imagenUrl: string,
    createdAt: Date,
    updatedAt: Date
): Producto => ({
    id,
    nombre,
    descripcion,
    precio,
    imagenUrl,
    createdAt,
    updatedAt
});

export { Producto, createProducto };
