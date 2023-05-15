import view from "../view/abonos.html";
import {ClientesGetAll,ClientesGetByCorreo} from '../controllersDb/clientesController';
const divElement = document.createElement("div");
divElement.innerHTML = view;
const searchContainer = divElement.querySelector('.search-input-box');
const inputSearch = searchContainer.querySelector('input');
const boxSuggestions = divElement.querySelector('.container-suggestions');
let suggestions = [];
let cliente = '';
const table = divElement.querySelector("#tableBody");
let miTabla;





function loadCatalogo() {
  ClientesGetAll().then(nombres => {
    suggestions = nombres;
  });
}

function Search() {
  window.select = select;
  inputSearch.onkeyup = e => {
      let userData = e.target.value;
      let emptyArray = [];

      if (userData) {
          emptyArray = suggestions.filter(clientes => {
              const regex = new RegExp(userData, 'gi');
              return clientes.nombreCliente.match(regex);
          });

          emptyArray = emptyArray.map(data => {
              return (data = `<li>${data.nombreCliente} - ${data.correoCliente}</li>`);
          });
          searchContainer.classList.add('active');
          showSuggestions(emptyArray);

          let allList = boxSuggestions.querySelectorAll('li');

          allList.forEach(li => {
              li.setAttribute('onclick', 'select(this)');
          });
      } else {
          searchContainer.classList.remove('active');
      }
  };


}

const showSuggestions = list => {
  let listData;

  if (!list.length) {
    const userValue = inputSearch.value;
    listData = `<li>${userValue}</li>`;
  } else {
    listData = list.join(' ');
  }
  boxSuggestions.innerHTML = listData;
};

async function select(element) {
  cliente = element.textContent.split("-")[0].trim().replace(/\s+/g, '%20');
  console.log(cliente);
  searchContainer.classList.remove('active');
  await initDataTable();
}




const initDataTable = async () => {
  if (miTabla) {
    miTabla.destroy();
    miTabla = null;
  }
  
  var xmlhttp = new XMLHttpRequest();
  var url = `https://ferrecred.com/api/deuda/cliente/${cliente}`;
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);

      miTabla = $('#datatable_clientes').DataTable({
        "data": data,
        "columns": [
          { "data": "cliente" },
          { "data": "total" },
          { "data": "adeudo" },
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
  loadCatalogo();
  Search();
  return divElement;

};
