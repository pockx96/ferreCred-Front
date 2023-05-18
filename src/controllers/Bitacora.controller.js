import view from "../view/Bitacora.html";


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
  var url = "https://ferrecred.com/api/bitacora";
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);

      miTabla = $('#datatable_bitacora').DataTable({
        "data": data,
        "columns": [
          { "data": "Usuario" },
          { "data": "Proceso" },
          { "data": "Estatus" },
          { "data": "Fecha_Hora" }
        ],
        pageLength: 3,
        language: {
          lengthMenu: "Mostrar _MENU_ registros por página",
          zeroRecords: "Ningún usuario encontrado",
          info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
          infoEmpty: "Ningún usuario encontrado",
          infoFiltered: "(filtrados desde _MAX_ registros totales)",
          search: "Buscar:",
          loadingRecords: "Cargando...",
          paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior"
          }
        }
      });
    }
  }

};




export default () => {
  initDataTable();
  return divElement;

};
