// src/domain/entities/Categoria.ts

type Categoria = {
    id: string;
    nombre: string;
    createdAt: Date;
    updatedAt: Date;
  };
  
  const createCategoria = (
    id: string,
    nombre: string,
    createdAt: Date,
    updatedAt: Date
  ): Categoria => ({
    id,
    nombre,
    createdAt,
    updatedAt
  });
  
  export { Categoria, createCategoria };