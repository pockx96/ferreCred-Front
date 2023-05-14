import view from "../view/abonos.html";
const divElement = document.createElement("div");
divElement.innerHTML = view;
const searchContainer = divElement.querySelector('.search-input-box');
const inputSearch = searchContainer.querySelector('input');
const boxSuggestions = divElement.querySelector('.container-suggestions');
let suggestions = [];


const url = 'https://ferrecred.com/api/clientes';

const getAll = async () => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        const nombres = data.map(cliente => cliente.nombreCliente);
        return nombres;
    } catch (error) {
        console.error(error);
    }
};

function search() {

    getAll().then(nombres => {
        suggestions = nombres;
        console.log(suggestions);
        // Resto del código aquí...
    });

    inputSearch.onkeyup = e => {
        let userData = e.target.value;
        let emptyArray = [];

        if (userData) {
            emptyArray = suggestions.filter(data => {
                return data
                    .toLocaleLowerCase()
                    .startsWith(userData.toLocaleLowerCase());
            });

            emptyArray = emptyArray.map(data => {
                return (data = `<li>${data}</li>`);
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
        userValue = inputSearch.value;
        listData = `<li>${userValue}</li>`;
    } else {
        listData = list.join(' ');
    }
    boxSuggestions.innerHTML = listData;
};
function select(element) {
    alert(`${element.textContent}`)
    searchContainer.classList.remove('active');
}



const table = divElement.querySelector("#tableBody");
let miTabla;


const initDataTable = async () => {
  var xmlhttp = new XMLHttpRequest();
  var url = "https://ferrecred.com/api/deuda";
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);

      miTabla = $('#datatable_bitacora').DataTable({
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
  initDataTable();
  search();
  return divElement;

};
