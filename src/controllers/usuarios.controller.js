import view from "../view/usuarios.html";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ClientesGetAll,
  postClientes,
} from "../controllersDb/clientesController";

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
  var url = "https://www.cristopherdev.com/backend/clientes";
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

function CrearCliente() {
  const inputNombre = divElement.querySelector("#input-nombre");
  const inputDireccion = divElement.querySelector("#input-direccion");
  const inputTelefono = divElement.querySelector("#input-telefono");
  const inputLimite = divElement.querySelector("#input-limite");
  const inputCorreo = divElement.querySelector("#input-correo");
  const lblNuevoCliente = divElement.querySelector("#Lbl-crear-cliente");
  const btnCliente = divElement.querySelector("#btn-cliente");

  const newClientDialog = divElement.querySelector("#new-cliente-dialog");

  lblNuevoCliente.addEventListener("click", () => {
    if (!newClientDialog.open) {
      newClientDialog.showModal();
      newClientDialog.style.visibility = "visible";
    }
  });
  divElement
    .querySelector("#close-cliente")
    .addEventListener("click", (event) => {
      newClientDialog.style.visibility = "hidden";
      newClientDialog.close();
    });

  function ValidateProductInputs() {
    var nombre = inputNombre.value;
    var direccion = inputDireccion;
    var correo = inputCorreo;
    var limite = divElement.querySelector("#input-limite");
    var telefono = inputTelefono;

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

    return true;
  }

  btnCliente.addEventListener("click", async (event) => {
    event.preventDefault();
    if (ValidateProductInputs()) {
      var nombre = inputNombre.value;
      var direccion = inputDireccion.value;
      var correo = inputCorreo.value;
      var limite = inputLimite.value;
      var telefono = inputTelefono.value;
      const newCliente = {
        nombreCliente: nombre.toString(),
        direccion: direccion.toString(),
        correoCliente: correo.toString(),
        telefono: telefono.toString(),
        limiteCredito: limite.toString(),
        saldoActual: "0",
      };
      console.log(`cliente posteado: ${newCliente}`);
      postClientes(newCliente);
      initDataTable();
    }
  });
}

export default () => {
  initDataTable();
  PrintUsuarios();
  CrearCliente();
  return divElement;
};
