import view from '../view/inventario.html'
import { getAll} from '../controllersDb/inventarioController'

const divElement = document.createElement("div");
divElement.innerHTML = view;
let miTabla;
const initDataTable = async () => {
    var xmlhttp = new XMLHttpRequest();
    var url = "https://ferrecred.com/api/inventario";
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.responseText);
  
        miTabla = $('#datatable_inventario').DataTable({
          "data": data,
          "columns": [
            { "data": "codigo" },
            { "data": "descripcion" },
            { "data": "precio_compra" },
            { "data": "precio_venta" },
            { "data": "cantidad" }
          ],
          pageLength: 6,
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
export default async () => {
    initDataTable();
    return divElement;
};
