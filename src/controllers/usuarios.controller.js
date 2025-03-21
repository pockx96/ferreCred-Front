import view from "../view/usuarios.html";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getAllUsuarios } from "../controllersDb/usuariosController";

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
  var url = "https://www.cristopherdev.com/backend/usuarios";
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);

      miTabla = $("#datatable_usuario").DataTable({
        data: data,
        columns: [
          { data: "correoUsuario" },
          { data: "nombreUsuario" },
          { data: "contraseñaUsuario" },
        ],
        pageLength: 6,
        language: {
          lengthMenu: "",
          zeroRecords: "Ningún usuario encontrado",
          info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
          infoEmpty: "Ningún usuario encontrado",
          infoFiltered: "(filtrados desde _MAX_ registros totales)",
          search: "",
          searchPlaceholder: "¿Busca alguna usuario?",
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
  const usuarios = await getAllUsuarios();

  const bodyData = [];
  usuarios.forEach((usuario) => {
    bodyData.push([
      usuario.correoUsuario,
      usuario.nombreUsuario,
      usuario.contraseñaUsuario,
    ]);
  });

  console.log(usuarios);

  // Generar la tabla

  autoTable(doc, {
    head: [["Correo", "Nombre", "Contraseña"]],
    body: bodyData,
  });

  btnImprimir.addEventListener("click", () => {
    console.log("imprimiendo");
    alert("imprimiendo");
    doc.save("usuarios.pdf");
  });

  // Descargar PDF
}

export default () => {
  initDataTable();
  PrintUsuarios();
  return divElement;
};
