// src/domain/entities/Carrito.ts

import { ItemCarrito } from "./ItemCarrito";


type Carrito = {
    id: string;
    usuarioId: string;
    items: ItemCarrito[];
    createdAt: Date;
    updatedAt: Date;
};

const createCarrito = (
    id: string,
    usuarioId: string,
    items: ItemCarrito[],
    createdAt: Date,
    updatedAt: Date
): Carrito => ({
    id,
    usuarioId,
    items,
    createdAt,
    updatedAt,
});

export { Carrito, createCarrito };
