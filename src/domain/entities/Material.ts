// src/domain/entities/Material.ts

type Material = {
    id: string;
    nombre: string;
    precioExtra: number;
    createdAt: Date;
    updatedAt: Date;
  };
  
  const createMaterial = (
    id: string,
    nombre: string,
    precioExtra: number,
    createdAt: Date,
    updatedAt: Date
  ): Material => ({
    id,
    nombre,
    precioExtra,
    createdAt,
    updatedAt
  });
  
  export { Material, createMaterial };