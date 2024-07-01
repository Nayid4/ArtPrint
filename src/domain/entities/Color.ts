// src/domain/entities/Color.ts

type Color = {
    id: string;
    nombre: string;
    codigo?: string;
    createdAt: Date;
    updatedAt: Date;
  };
  
  const createColor = (
    id: string,
    nombre: string,
    codigo: string | undefined,
    createdAt: Date,
    updatedAt: Date
  ): Color => ({
    id,
    nombre,
    codigo,
    createdAt,
    updatedAt
  });
  
  export { Color, createColor };
  