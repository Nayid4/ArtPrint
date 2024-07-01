// src/domain/entities/Talla.ts

type Talla = {
    id: string;
    nombre: string;
    createdAt: Date;
    updatedAt: Date;
  };
  
  const createTalla = (
    id: string,
    nombre: string,
    createdAt: Date,
    updatedAt: Date
  ): Talla => ({
    id,
    nombre,
    createdAt,
    updatedAt
  });
  
  export { Talla, createTalla };