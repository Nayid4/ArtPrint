type Numero = {
    telefono: string;
  };
  
  // Función para crear una instancia de Numero
  const createNumero = (telefono: string): Numero => ({
    telefono,
  });
  
  // Función para editar el número de teléfono
  const editarNumero = (numero: Numero, nuevoTelefono: string): Numero => ({
    ...numero,
    telefono: nuevoTelefono,
  });
  
  // Función para eliminar el número de teléfono (dejándolo vacío)
  const eliminarNumero = (): Numero => ({
    telefono: '',
  });

  export {Numero,createNumero,editarNumero,eliminarNumero};