import view from "../view/inventario.html";
import {
  ProductoPost,
  EditCantidad,
  EditProducto,
  getAll,
} from "../controllersDb/catalogoController";
import { ProveedorPost } from "../controllersDb/proveedorController";
import { InventarioGetByCodigo } from "../controllersDb/inventarioController";
import { BitacoraPost } from "../controllersDb/bitacoraController";

import { showDialog } from "../controllers/Entradas.controller";
import { getByCodigo } from "../controllersDb/catalogoController";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import _ from "lodash";
import { buildBitacoraEntry } from "../utils/bitacoraUtils";
import FormManager from "../utils/FormManager.js";

const divElement = document.createElement("div");
divElement.innerHTML = view;
let miTabla;

const lblProvedor = divElement.querySelector("#Lbl-crear-proveedor");
let appInitialized = false;

export const initDataTableInventario = async () => {
  if (miTabla) {
    miTabla.destroy();
    miTabla = null;
  }
  var xmlhttp = new XMLHttpRequest();
  var url = `${API_URL}catalogo`;
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);

      miTabla = $("#datatable_inventario").DataTable({
        data: data,
        columns: [
          { data: "codigo" },
          { data: "descripcion" },
          { data: "precio_compra" },
          { data: "precio_venta" },
          { data: "cantidad" },
        ],
        pageLength: 10,
        language: {
          lengthMenu: "",
          zeroRecords: "Ningún producto encontrado",
          info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
          infoEmpty: "Ningún producto encontrado",
          infoFiltered: "(filtrados desde _MAX_ registros totales)",
          search: "",
          searchPlaceholder: "¿Que Producto busca?",
          loadingRecords: "Cargando...",
          paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior",
          },
        },
      });
    }
  };
  appInitialized = true;
};

/// Crear Producto

async function ValidateCreateInputs() {
  const codigo = document.querySelector("#input-codigo").value.trim();
  const descripcion = document.querySelector("#input-descripcion").value.trim();
  const precioCompra = document
    .querySelector("#input-precio-compra")
    .value.trim();
  const precioVenta = document
    .querySelector("#input-precio-venta")
    .value.trim();
  const tipo = document.querySelector("#input-tipo").value.trim();
  const cantidad = document.querySelector("#input-cantidad").value.trim();
  const producto = await getByCodigo(codigo);

  if (producto.codigo == codigo) {
    alert("El código ya existe.");
    return false;
  }
  // Validar campos vacíos
  if (
    !codigo ||
    !descripcion ||
    !precioCompra ||
    !precioVenta ||
    !tipo ||
    !cantidad
  ) {
    alert("Por favor, completa todos los campos.");
    return false;
  }

  // Validaciones numéricas
  if (isNaN(codigo)) {
    alert("El código debe contener solo valores numéricos.");
    return false;
  }

  if (isNaN(precioCompra) || isNaN(precioVenta)) {
    alert("Los precios deben ser valores numéricos.");
    return false;
  }

  if (isNaN(cantidad)) {
    alert("La cantidad debe ser numérica.");
    return false;
  }

  return true;
}

async function handleCreateProduct() {
  const inputCodigo = divElement.querySelector("#input-codigo");
  const inputDescripccion = divElement.querySelector("#input-descripcion");
  const inputCompra = divElement.querySelector("#input-precio-compra");
  const inputVenta = divElement.querySelector("#input-precio-venta");
  const inputTipo = divElement.querySelector("#input-tipo");
  const inputCantidad = divElement.querySelector("#input-cantidad");

  const newProducto = {
    codigo: parseInt(inputCodigo.value, 10),
    descripcion: inputDescripccion.value.toString(),
    precio_compra: parseFloat(inputCompra.value),
    precio_venta: parseFloat(inputVenta.value),
    tipo: inputTipo.value.toString(),
    cantidad: parseFloat(inputCantidad.value),
  };

  await ProductoPost(newProducto);
  const bitacoRecord = await buildBitacoraEntry(
    newProducto,
    "Alta de Producto"
  );
  await BitacoraPost(bitacoRecord);
  await initDataTableInventario();
}

function createProductDialog() {
  FormManager.initForm({
    container: { divElement },
    triggerSelector: "#Lbl-crear-producto",
    dialogSelector: "#new-product-dialog",
    closeSelector: "#close",
    submitSelector: "#btn-producto",
    validateFn: ValidateCreateInputs,
    submitFn: handleCreateProduct,
  });
}

/// Editar Producto

async function ValidateProductEdit() {
  const descripccionEdit = document
    .querySelector("#input-descripcion-edit")
    .value.trim();
  const compraEdit = document
    .querySelector("#input-precio-compra-edit")
    .value.trim();
  const ventaEdit = document
    .querySelector("#input-precio-venta-edit")
    .value.trim();
  const tipoEdit = document.querySelector("#input-tipo-edit").value.trim();

  if (
    descripccionEdit === "" ||
    compraEdit === "" ||
    ventaEdit === "" ||
    tipoEdit === ""
  ) {
    alert("Por favor, completa todos los campos.");
    return false;
  }
  // Validación de tipo numérico para los precios de compra y venta
  if (isNaN(parseFloat(compraEdit)) || isNaN(parseFloat(ventaEdit))) {
    alert("Los precios deben ser valores numéricos.");
    return false; // Detiene la ejecución de la función si los precios no son numéricos
  }

  return true;
}

async function handleEditProduct() {
  const inputCodigoEdit = divElement.querySelector("#input-codigo-edit");
  const inputDescripccionEdit = divElement.querySelector(
    "#input-descripcion-edit"
  );
  const inputCompraEdit = divElement.querySelector("#input-precio-compra-edit");
  const inputVentaEdit = divElement.querySelector("#input-precio-venta-edit");
  const inputTipoEdit = divElement.querySelector("#input-tipo-edit");
  const newProducto = {
    codigo: parseInt(inputCodigoEdit.value, 10),
    descripcion: inputDescripccionEdit.value.toString(),
    precio_compra: parseFloat(inputCompraEdit.value),
    precio_venta: parseFloat(inputVentaEdit.value),
    tipo: inputTipoEdit.value.toString(),
  };
  await EditProducto(newProducto);
  const bitacoRecord = await buildBitacoraEntry(
    newProducto,
    "Edición de Producto"
  );
  await BitacoraPost(bitacoRecord);
  await initDataTableInventario();
}

function editProductDialog() {
  FormManager.initForm({
    container: { divElement },
    triggerSelector: "#btnBuscar",
    dialogSelector: "#edit-product-dialog",
    closeSelector: "#close-edit",
    submitSelector: "#btn-edit",
    validateFn: ValidateProductEdit,
    submitFn: handleEditProduct,
  });
}

// Buscar Producto a Editar

async function ValidateSearchProduct() {
  const inputCodigoSearch = document.querySelector("#codigoBusqueda").value.trim();

  if (inputCodigoSearch === "") {
    alert("Por favor, ingresa el código del producto.");
    console.log(inputCodigoSearch);
    return false;
  }

  if (isNaN(inputCodigoSearch)) {
    alert("El código debe ser numérico.");
    console.log(inputCodigoSearch);
    return false;
  }

  return true;
}

async function handleSeachEdit() {
  const inputCodigoSearch = divElement.querySelector("#codigoBusqueda");
  const producto = await getByCodigo(inputCodigoSearch.value.trim());
  const inputCodigo = divElement.querySelector("#input-codigo-edit");
  const inputDescripccion = divElement.querySelector("#input-descripcion-edit");
  const inputCompra = divElement.querySelector("#input-precio-compra-edit");
  const inputVenta = divElement.querySelector("#input-precio-venta-edit");
  const inputTipo = divElement.querySelector("#input-tipo-edit");

  inputCodigo.value = producto.codigo;
  inputDescripccion.value = producto.descripcion;
  inputTipo.value = producto.tipo;
  inputCompra.value = "";
  inputVenta.value = "";
  inputCodigo.readOnly = true;
}

function searchEditDialog() {
  FormManager.initForm({
    container: { divElement },
    triggerSelector: "#Lbl-editar",
    dialogSelector: "#dialogoBuscarProducto",
    closeSelector: "#close-editar",
    submitSelector: "#btnBuscar",
    validateFn: ValidateSearchProduct,
    submitFn: handleSeachEdit,
  });
}

////

function EditarCantidad() {
  const dialogEditarCantidad = divElement.querySelector(
    "#dialogoEditarCantidad"
  );
  const lblEditarCantidad = divElement.querySelector("#Lbl-editar-cantidad");
  const inputCodigo = divElement.querySelector("#codigoProducto");
  const descripcionProducto = divElement.querySelector("#descripcionProducto");
  const cantidadProducto = divElement.querySelector("#cantidadProducto");
  const btnActualizar = divElement.querySelector("#actualizarCantidad");
  const btnCloseCantidad = divElement.querySelector("#close-editar-cantidad");

  lblEditarCantidad.addEventListener("click", () => {
    if (!dialogEditarCantidad.open) {
      dialogEditarCantidad.showModal();
      dialogEditarCantidad.style.visibility = "visible";
      descripcionProducto.textContent = "Descripción: --"; // Reinicia los valores al abrir
      cantidadProducto.value = ""; // Limpia el valor de la cantidad
    }
  });

  divElement
    .querySelector("#close-editar-cantidad")
    .addEventListener("click", () => {
      dialogEditarCantidad.style.visibility = "hidden";
      dialogEditarCantidad.close();
    });

  inputCodigo.addEventListener("input", async () => {
    const codigo = inputCodigo.value.trim();

    if (codigo) {
      try {
        const productoNombre = await getByCodigo(codigo);
        if (productoNombre && productoNombre.descripcion) {
          descripcionProducto.textContent = `Descripción: ${productoNombre.descripcion}`;
        } else {
          descripcionProducto.textContent =
            "Descripción: Producto no encontrado";
        }
        const productoCantidad = await InventarioGetByCodigo(codigo);
        if (productoCantidad && productoCantidad.cantidad !== undefined) {
          cantidadProducto.value = productoCantidad.cantidad;
        } else {
          cantidadProducto.value = "";
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
        descripcionProducto.textContent = "Descripción: Error al buscar";
        cantidadProducto.value = "";
      }
    } else {
      descripcionProducto.textContent = "Descripción: --";
      cantidadProducto.value = "";
    }
  });

  btnActualizar.addEventListener("click", async () => {
    const codigo = inputCodigo.value.trim();
    const cantidad = cantidadProducto.value.trim();
    const descripcion = descripcionProducto.value.trim();

    if (codigo && cantidad) {
      const data = {
        codigo: parseInt(codigo, 10),
        cantidad: parseInt(cantidad, 10),
        descripcion: descripcion,
      };

      try {
        await EditCantidad(data); // Llama a tu método para actualizar el inventario
        const bitacoraRecord = await buildBitacoraEntry(data, "Ajuste Manual");
        await BitacoraPost(bitacoraRecord);
        dialogEditarCantidad.style.visibility = "hidden";
        dialogEditarCantidad.close();
      } catch (error) {
        console.error("Error al actualizar el inventario:", error);
        alert("Hubo un error al actualizar la cantidad");
      }
    } else {
      alert("Por favor, completa todos los campos antes de actualizar.");
    }
    initDataTableInventario();
  });
}

function ValidateProviderInputs() {
  var empresa = divElement.querySelector("#input-empresa").value;
  var nombreProveedor = divElement.querySelector("#input-nombre").value;
  var correo = divElement.querySelector("#input-correo").value;
  var direccion = divElement.querySelector("#input-direccion").value;
  var telefono = divElement.querySelector("#input-telefono").value;
  var rfc = divElement.querySelector("#input-rfc").value;

  // Realiza la validación de los campos
  if (
    empresa === "" ||
    nombreProveedor === "" ||
    correo === "" ||
    direccion === "" ||
    telefono === "" ||
    rfc === ""
  ) {
    alert("Por favor, completa todos los campos. 3");
    return false; // Detiene la ejecución de la función si algún campo está vacío
  }

  // Validación de formato de correo electrónico utilizando una expresión regular
  var emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(correo)) {
    alert("El correo electrónico no tiene un formato válido.");
    return false; // Detiene la ejecución de la función si el formato del correo electrónico no es válido
  }

  // Validación de formato de número de teléfono utilizando una expresión regular
  var telefonoRegex = /^\d{10}$/;
  if (!telefonoRegex.test(telefono)) {
    alert(
      "El número de teléfono no tiene un formato válido. Debe contener 10 dígitos."
    );
    return false; // Detiene la ejecución de la función si el formato del número de teléfono no es válido
  }

  return true;
}

function CrearProveedor() {
  const newProveedorDialog = divElement.querySelector("#new-proveedor-dialog");
  lblProvedor.addEventListener("click", () => {
    if (!newProveedorDialog.open) {
      newProveedorDialog.showModal();
      newProveedorDialog.style.visibility = "visible";
    }
  });
  divElement
    .querySelector("#close-proveedor")
    .addEventListener("click", (event) => {
      newProveedorDialog.style.visibility = "hidden";
      newProveedorDialog.close();
    });

  const btnProvedor = divElement.querySelector("#btn-provedor");
  btnProvedor.addEventListener("click", async (event) => {
    event.preventDefault();
    if (ValidateProviderInputs()) {
      const inputEmpresa = divElement.querySelector("#input-empresa");
      const inputNombre = divElement.querySelector("#input-nombre");
      const inputCorreo = divElement.querySelector("#input-correo");
      const inputDireccion = divElement.querySelector("#input-direccion");
      const inputTelefono = divElement.querySelector("#input-telefono");
      const inputRFC = divElement.querySelector("#input-rfc");
      const newProveedor = {
        correo_electronico: inputCorreo.value,
        nombre_empresa: inputEmpresa.value,
        nombre_contacto: inputNombre.value,
        direccion: inputDireccion.value,
        telefono: inputTelefono.value,
        RFC: inputRFC.value,
      };
      ProveedorPost(newProveedor);
      alert("Nuevo proveedor agregado");
    }
  });
}

async function PrintProductos() {
  const btnImprimir = divElement.querySelector("#btn-product-print");
  const doc = new jsPDF();

  // Tu lista de objetos
  const productos = await getAll();

  const bodyData = [];
  productos.forEach((producto) => {
    bodyData.push([
      producto.codigo,
      producto.descripcion,
      producto.precio_compra,
      producto.precio_venta,
      producto.tipo,
      producto.cantidad,
    ]);
  });

  // Generar la tabla

  autoTable(doc, {
    head: [
      [
        "Código",
        "Descripción",
        "Precio de Compra",
        "Precio de Venta",
        "Unidad",
        "Cantidad",
        "Cantidad Actual",
      ],
    ],
    body: bodyData,
  });

  btnImprimir.addEventListener("click", () => {
    console.log(productos);
    doc.save("productos.pdf");
  });

  // Descargar PDF
}

export default async () => {
  if (!appInitialized) {
    initDataTableInventario();
  }
  PrintProductos();
  CrearProveedor();
  EditarCantidad();
  createProductDialog();
  searchEditDialog();
  editProductDialog();
  return divElement;
};
