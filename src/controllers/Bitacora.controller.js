import view from "../view/Bitacora.html";

const divElement = document.createElement("div");
divElement.innerHTML = view;
const table = divElement.querySelector("#tableBody");
let miTabla;

export const initDataTableBitacora = async () => {
  if (miTabla) {
    miTabla.destroy();
    miTabla = null;
  }
  var xmlhttp = new XMLHttpRequest();
  var url = "https://www.cristopherdev.com/backend/bitacora";
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      console.log(data);

      miTabla = $("#datatable_bitacora").DataTable({
        data: data,
        columns: [
          { data: "Usuario" },
          { data: "Proceso" },
          { data: "Estatus" },
          { data: "Fecha_Hora" },
        ],
        pageLength: 6,
        language: {
          lengthMenu: "",
          zeroRecords: "Ningún usuario encontrado",
          info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
          infoEmpty: "Ningún usuario encontrado",
          infoFiltered: "(filtrados desde _MAX_ registros totales)",
          search: "",
          searchPlaceholder: "¿Busca alguna operacion?",
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

export default () => {
  initDataTableBitacora();
  return divElement;
};
