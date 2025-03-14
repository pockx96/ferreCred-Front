import view from "../view/inventario.html";
import { getAll } from "../controllersDb/inventarioController";
import { ProductoPost } from "../controllersDb/catalogoController";
import { ProveedorPost } from "../controllersDb/proveedorController";
import { showDialog } from "../controllers/Entradas.controller";

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
  var url = "https://www.cristopherdev.com/backend/inventario";
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
        pageLength: 6,
        language: {
          lengthMenu: "",
          zeroRecords: "Ningún usuario encontrado",
          info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
          infoEmpty: "Ningún usuario encontrado",
          infoFiltered: "(filtrados desde _MAX_ registros totales)",
          search: "",
          searchPlaceholder: "¿Que producto buscas?",
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
    var peso = divElement.querySelector("#input-peso").value;

    // Realiza la validación de los campos
    if (
      codigo === "" ||
      descripcion === "" ||
      precioCompra === "" ||
      precioVenta === "" ||
      peso === ""
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

    // Validación de tipo numérico para el peso
    if (isNaN(parseFloat(peso))) {
      alert("El peso debe ser un valor numérico.");
      return false; // Detiene la ejecución de la función si el peso no es numérico
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
      const inputPeso = divElement.querySelector("#input-peso");
      const newProducto = {
        codigo: inputCodigo.value,
        descripcion: inputDescripccion.value,
        precio_compra: inputCompra.value,
        precio_venta: inputVenta.value,
        peso: inputPeso.value,
      };
      ProductoPost(newProducto);
      alert("Nuevo producto agregado");
    }
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
    alert("Por favor, completa todos los campos.");
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
    initDataTableInventario();
  }
  CrearProducto();
  CrearProveedor();
  return divElement;
};
