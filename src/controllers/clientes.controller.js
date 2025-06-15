import view from "../view/usuarios.html";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ClientesGetAll,
  postClientes,
  ClientesGetByCorreo,
} from "../model/clientesController";
import FormManager from "../utils/FormManager.js";

const divElement = document.createElement("div");
divElement.innerHTML = view;
const table = divElement.querySelector("#tableBody");
let miTabla;

const initDataTable = async () => {
  if (miTabla) {
    miTabla.destroy();
    miTabla = null;
  }
  var xmlhttp = new XMLHttpRequest();
  var url = `${API_URL}clientes`;
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);

      miTabla = $("#datatable_usuario").DataTable({
        data: data,
        columns: [
          { data: "nombreCliente" },
          { data: "direccion" },
          { data: "telefono" },
          { data: "correoCliente" },
          { data: "limiteCredito" },
          { data: "saldoActual" },
        ],
        pageLength: 6,
        language: {
          lengthMenu: "",
          zeroRecords: "Ningún cliente encontrado",
          info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
          infoEmpty: "Ningún usuario encontrado",
          infoFiltered: "(filtrados desde _MAX_ registros totales)",
          search: "",
          searchPlaceholder: "¿Que Cliente Busca?",
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
};

async function PrintUsuarios() {
  const btnImprimir = divElement.querySelector("#user-print");
  const doc = new jsPDF();

  // Tu lista de objetos
  const clientes = await ClientesGetAll();

  const bodyData = [];
  clientes.forEach((cliente) => {
    bodyData.push([
      cliente.nombreCliente,
      cliente.direccion,
      cliente.telefono,
      cliente.limiteCredito,
      cliente.saldoActual,
      cliente.correoCliente,
    ]);
  });

  // Generar la tabla

  autoTable(doc, {
    head: [
      [
        "Nombre",
        "Dirección",
        "Telefono",
        "Limite de Credito",
        "Saldo Actual",
        "Correo",
      ],
    ],
    body: bodyData,
  });

  btnImprimir.addEventListener("click", () => {
    console.log("imprimiendo");
    alert("imprimiendo");
    doc.save("usuarios.pdf");
  });

  // Descargar PDF
}

// Crear Cliente
async function ValidateCreateClients() {
  let nombre = divElement.querySelector("#input-nombre").value;
  let direccion = divElement.querySelector("#input-direccion").value;
  let telefono = divElement.querySelector("#input-telefono").value;
  let correo = divElement.querySelector("#input-correo").value;
  let limite = divElement.querySelector("#input-limite").value;
  const clienteEncontrado = await ClientesGetByCorreo(correo);

  if (clienteEncontrado.length > 0) {
    const correoCliente = clienteEncontrado[0].correoCliente;

    if (correoCliente === correo) {
      console.log(`${correoCliente} == ${correo}`);
      alert("Ya existe un cliente con ese correo.");
      return false;
    }
  }

  // Realiza la validación de los campos
  if (
    nombre === "" ||
    direccion === "" ||
    limite === "" ||
    correo === "" ||
    telefono == ""
  ) {
    alert("Por favor, completa todos los campos.");
    return false; // Detiene la ejecución de la función si algún campo está vacío
  }
  var emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(correo)) {
    alert("El correo electrónico no tiene un formato válido.");
    return false; // Detiene la ejecución de la función si el formato del correo electrónico no es válido
  }
  var telefonoRegex = /^\d{10}$/;
  if (!telefonoRegex.test(telefono)) {
    alert(
      "El número de teléfono no tiene un formato válido. Debe contener 10 dígitos."
    );
    return false; // Detiene la ejecución de la función si el formato del número de teléfono no es válido
  }

  return true;
}

function handleCreateClient() {
  let nombre = divElement.querySelector("#input-nombre").value;
  let direccion = divElement.querySelector("#input-direccion").value;
  let telefono = divElement.querySelector("#input-telefono").value;
  let correo = divElement.querySelector("#input-correo").value;
  let limite = divElement.querySelector("#input-limite").value;

  const newCliente = {
    nombreCliente: nombre.toString(),
    direccion: direccion.toString(),
    correoCliente: correo.toString(),
    telefono: telefono.toString(),
    limiteCredito: limite.toString(),
    saldoActual: "0",
  };
  postClientes(newCliente);
  alert("Nuevo cliente agregado");
  initDataTable();
}
function createClientDialog() {
  FormManager.initForm({
    container: { divElement },
    triggerSelector: "#Lbl-crear-cliente",
    dialogSelector: "#new-cliente-dialog",
    closeSelector: "#close-cliente",
    submitSelector: "#btn-cliente",
    validateFn: ValidateCreateClients,
    submitFn: handleCreateClient,
  });
}

export default () => {
  initDataTable();
  PrintUsuarios();
  createClientDialog();
  return divElement;
};
