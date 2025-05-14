export function buildBitacoraEntry(producto, Operacion) {
  const bitacoraInput = {
    Usuario: USER_NAME,
    Codigo: producto.codigo,
    Producto: producto.descripcion,
    Cantidad: producto.cantidad,
    Operacion: Operacion,
    Inventario_Actual: producto.cantidad,
  };
  return bitacoraInput;
}
