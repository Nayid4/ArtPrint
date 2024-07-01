// src/domain/entities/ItemCarrito.ts

type ItemCarrito = {
    productoId: string,
    imagen: string,
    nombre: string,
    idPrenda: string,
    idMaterial: string;
    idColor: string;
    talla: string;
    genero: string,
    cantidad: number,
    precio: number,
};

export { ItemCarrito }