import view from "../view/inventario.html";
import {
  ProductoPost,
  EditCantidad,
  EditProducto,
} from "../controllersDb/catalogoController";
import { ProveedorPost } from "../controllersDb/proveedorController";
import {
  InventarioGetByCodigo,
  EditarInventario,
} from "../controllersDb/inventarioController";
import { showDialog } from "../controllers/Entradas.controller";
import { getByCodigo } from "../controllersDb/catalogoController";

const divElement = document.createElement("div");
divElement.innerHTML = view;
let miTabla;

const lblProducto = divElement.querySelector("#Lbl-crear-producto");
const lblProvedor = divElement.querySelector("#Lbl-crear-proveedor");
let appInitialized = false;

export const initDataTableInventario = async () => {
  if (miTabla) {
    miTabla.destroy();
    miTabla = null;
  }
  var xmlhttp = new XMLHttpRequest();
  var url = "https://www.cristopherdev.com/backend/catalogo";
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
        pageLength: 7,
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

function CrearProducto() {
  const newClientDialog = divElement.querySelector("#new-product-dialog");
  lblProducto.addEventListener("click", () => {
    if (!newClientDialog.open) {
      newClientDialog.showModal();
      newClientDialog.style.visibility = "visible";
    }
  });
  divElement.querySelector("#close").addEventListener("click", (event) => {
    newClientDialog.style.visibility = "hidden";
    newClientDialog.close();
  });

  function ValidateProductInputs() {
    var codigo = divElement.querySelector("#input-codigo").value;
    var descripcion = divElement.querySelector("#input-descripcion").value;
    var precioCompra = divElement.querySelector("#input-precio-compra").value;
    var precioVenta = divElement.querySelector("#input-precio-venta").value;
    var tipo = divElement.querySelector("#input-tipo").value;
    var cantidad = divElement.querySelector("#input-cantidad").value;

    // Realiza la validación de los campos
    if (
      codigo === "" ||
      descripcion === "" ||
      precioCompra === "" ||
      precioVenta === "" ||
      tipo === "" ||
      cantidad == ""
    ) {
      alert("Por favor, completa todos los campos.");
      return false; // Detiene la ejecución de la función si algún campo está vacío
    }

    // Validación de tipo numérico para los precios de compra y venta
    if (isNaN(parseFloat(codigo))) {
      alert("El codigo debe contener solo valores numéricos.");
      return false; // Detiene la ejecución de la función si los precios no son numéricos
    }

    // Validación de tipo numérico para los precios de compra y venta
    if (isNaN(parseFloat(precioCompra)) || isNaN(parseFloat(precioVenta))) {
      alert("Los precios deben ser valores numéricos.");
      return false; // Detiene la ejecución de la función si los precios no son numéricos
    }

    // Validación de tipo numérico para la cantidad de producto
    if (isNaN(parseFloat(cantidad))) {
      alert("La cantidad debe de ser Numerica");
      return false; // Detiene la ejecución de la función si los precios no son numéricos
    }

    return true;
  }

  const btnProducto = divElement.querySelector("#btn-producto");
  btnProducto.addEventListener("click", async (event) => {
    event.preventDefault();
    if (ValidateProductInputs()) {
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
      console.log(`producto posteado: ${newProducto}`);
      ProductoPost(newProducto);
      initDataTableInventario();
    }
  });
}

function BuscarProducto() {
  const lblEditar = divElement.querySelector("#Lbl-editar");
  const dialogBuscar = divElement.querySelector("#dialogoBuscarProducto");
  const btnCerrar = divElement.querySelector("#close-editar");
  const inputBusqueda = divElement.querySelector("#codigoBusqueda");
  const btnBuscar = divElement.querySelector("#btnBuscar");
  const dialogEditar = divElement.querySelector("#edit-product-dialog");

  lblEditar.addEventListener("click", () => {
    if (!dialogBuscar.open) {
      dialogBuscar.showModal();
      dialogBuscar.style.visibility = "visible";
    }
  });

  btnCerrar.addEventListener("click", () => {
    dialogBuscar.style.visibility = "hidden";
    dialogBuscar.close();
  });

  btnBuscar.addEventListener("click", async () => {
    if (!dialogEditar.open) {
      const busqueda = inputBusqueda.value.toString();
      inputBusqueda.value = "";
      dialogBuscar.style.visibility = "hidden";
      dialogBuscar.close();
      actualizarEditDialog(busqueda);
      dialogEditar.showModal();
      dialogEditar.style.visibility = "visible";
      const producto = await getByCodigo(busqueda);
      actualizarEditDialog(producto);
    }
  });
}

function actualizarEditDialog(idProduct) {
  const inputCodigo = divElement.querySelector("#input-codigo-edit");
  const inputDescripccion = divElement.querySelector("#input-descripcion-edit");
  const inputCompra = divElement.querySelector("#input-precio-compra-edit");
  const inputVenta = divElement.querySelector("#input-precio-venta-edit");
  const inputTipo = divElement.querySelector("#input-tipo-edit");
  const btnCerrar = divElement.querySelector("#close-edit");

  inputCodigo.value = idProduct.codigo;
  inputDescripccion.value = idProduct.descripcion;
  inputTipo.value = idProduct.tipo;
  inputCompra.value = "";
  inputVenta.value = "";
  inputCodigo.readOnly = true;
}

function EditarProducto() {
  const dialogEditar = divElement.querySelector("#edit-product-dialog");
  const inputCodigoEdit = divElement.querySelector("#input-codigo-edit");
  const inputDescripccionEdit = divElement.querySelector(
    "#input-descripcion-edit"
  );
  const inputCompraEdit = divElement.querySelector("#input-precio-compra-edit");
  const inputVentaEdit = divElement.querySelector("#input-precio-venta-edit");
  const inputTipoEdit = divElement.querySelector("#input-tipo-edit");
  const btnCerrarEdit = divElement.querySelector("#close-edit");
  const btnEditar = divElement.querySelector("#btn-edit");

  btnCerrarEdit.addEventListener("click", () => {
    dialogEditar.style.visibility = "hidden";
    dialogEditar.close();
  });

  function ValidateProductEdit() {
    const descripcion = inputDescripccionEdit.value;
    const precioCompra = inputCompraEdit.value;
    const precioVenta = inputVentaEdit.value;
    const tipo = inputTipoEdit.value;

    if (
      descripcion === "" ||
      precioCompra === "" ||
      precioVenta === "" ||
      tipo === ""
    ) {
      alert("Por favor, completa todos los campos.");
      return false;
    }

    // Validación de tipo numérico para los precios de compra y venta
    if (isNaN(parseFloat(precioCompra)) || isNaN(parseFloat(precioVenta))) {
      alert("Los precios deben ser valores numéricos.");
      return false; // Detiene la ejecución de la función si los precios no son numéricos
    }

    return true;
  }

  btnEditar.addEventListener("click", async (event) => {
    event.preventDefault();
    if (ValidateProductEdit()) {
      const newProducto = {
        codigo: parseInt(inputCodigoEdit.value, 10),
        descripcion: inputDescripccionEdit.value.toString(),
        precio_compra: parseFloat(inputCompraEdit.value),
        precio_venta: parseFloat(inputVentaEdit.value),
        tipo: inputTipoEdit.value.toString(),
      };
      console.log(`producto posteado: ${newProducto}`);
      EditProducto(newProducto);
      dialogEditar.style.visibility = "hidden";
      dialogEditar.close();
      initDataTableInventario();
    }
  });
}

function EditarCantidad() {
  const dialogEditarCantidad = divElement.querySelector(
    "#dialogoEditarCantidad"
  );
  const lblEditarCantidad = divElement.querySelector("#Lbl-editar-cantidad");
  const inputCodigo = divElement.querySelector("#codigoProducto");
  const descripcionProducto = divElement.querySelector("#descripcionProducto");
  const cantidadProducto = divElement.querySelector("#cantidadProducto");
  const btnActualizar = divElement.querySelector("#actualizarCantidad");

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

    if (codigo && cantidad) {
      const data = {
        codigo: parseInt(codigo, 10),
        cantidad: parseInt(cantidad, 10),
      };

      try {
        await EditCantidad(data); // Llama a tu método para actualizar el inventario
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

export default async () => {
  if (!appInitialized) {
  }
  initDataTableInventario();
  EditarProducto();
  BuscarProducto();
  CrearProducto();
  CrearProveedor();
  EditarCantidad();
  return divElement;
};
