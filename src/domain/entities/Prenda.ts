// src/domain/entities/Prenda.ts

type Prenda = {
    id: string;
    nombre: string;
    idCategoria: string;
    precio: number;
    createdAt: Date;
    updatedAt: Date;
  };
  
  const createPrenda = (
    id: string,
    nombre: string,
    idCategoria: string,
    precio: number,
    createdAt: Date,
    updatedAt: Date
  ): Prenda => ({
    id,
    nombre,
    idCategoria,
    precio,
    createdAt,
    updatedAt
  });
  
  export { Prenda, createPrenda };