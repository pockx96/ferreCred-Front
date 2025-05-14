async function resetearCampos(elements) {
  elements.descripcionProducto.textContent = "Descripción: --";
  elements.cantidadProducto.value = "";
}

async function cargarDatosProducto(elements) {
  const codigo = elements.inputCodigo.value.trim();

  if (codigo) {
    try {
      const productoNombre = await getByCodigo(codigo);
      elements.descripcionProducto.textContent = productoNombre?.descripcion
        ? `Descripción: ${productoNombre.descripcion}`
        : "Descripción: Producto no encontrado";

      const productoCantidad = await InventarioGetByCodigo(codigo);
      elements.cantidadProducto.value = productoCantidad?.cantidad ?? "";
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      elements.descripcionProducto.textContent = "Descripción: Error al buscar";
      elements.cantidadProducto.value = "";
    }
  } else {
    elements.descripcionProducto.textContent = "Descripción: --";
    elements.cantidadProducto.value = "";
  }
}

function validarFormulario(elements) {
  const codigo = elements.inputCodigo.value.trim();
  const cantidad = elements.cantidadProducto.value.trim();

  if (!codigo || !cantidad) {
    alert("Por favor, completa todos los campos antes de actualizar.");
    return false;
  }
  return true;
}

async function enviarFormulario(elements) {
  const codigo = elements.inputCodigo.value.trim();
  const cantidad = elements.cantidadProducto.value.trim();
  const descripcion = elements.descripcionProducto.textContent.trim();

  const data = {
    codigo: parseInt(codigo, 10),
    cantidad: parseInt(cantidad, 10),
    descripcion: descripcion,
  };

  try {
    await EditCantidad(data);
    const bitacoraRecord = await buildBitacoraEntry(data, "Ajuste Manual");
    await BitacoraPost(bitacoraRecord);
    await initDataTableInventario();
  } catch (error) {
    console.error("Error al actualizar el inventario:", error);
    alert("Hubo un error al actualizar la cantidad");
  }
}
