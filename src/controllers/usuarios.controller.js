import view from "../view/usuarios.html";


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
  var url = "https://ferrecred.com/api/usuarios";
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);

      miTabla = $('#datatable_usuario').DataTable({
        "data": data,
        "columns": [
          { "data": "correoUsuario" },
          { "data": "nombreUsuario" },
          { "data": "contraseñaUsuario" }
        ],
        pageLength: 6,
        language: {
          lengthMenu: "",
          zeroRecords: "Ningún usuario encontrado",
          info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
          infoEmpty: "Ningún usuario encontrado",
          infoFiltered: "(filtrados desde _MAX_ registros totales)",
          search: "",
          searchPlaceholder: '¿Busca alguna usuario?',
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
