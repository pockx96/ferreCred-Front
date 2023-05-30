import view from "../view/abonos.html";
import { ClientesGetAll, ClientesGetByCorreo } from '../controllersDb/clientesController';
import { ComprasGetByCliente, ComprasGetDeuda, ComprasUpdateDeuda } from '../controllersDb/compraController';
import { postClientes } from '../controllersDb/clientesController';
import { BitacoraPost } from '../controllersDb/bitacoraController';
import {initDataTableBitacora}  from './Bitacora.controller';

const divElement = document.createElement("div");
divElement.innerHTML = view;
const searchContainer = divElement.querySelector('.search-input-box');
const inputSearch = searchContainer.querySelector('input');
const boxSuggestions = divElement.querySelector('.container-suggestions');
let suggestions = [];
let cliente = 'anlopez@gmail.com';
const table = divElement.querySelector("#tableBody");
let miTabla;



function bicoraRecord() {
  let bitacora = {
      Usuario: "@example.com",
      Proceso: "abono a adeudos",
      Estatus: 1,
  }
  return bitacora;
}

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
  searchContainer.classList.remove('active');
  await initDataTable();
  const deuda = await ComprasGetDeuda(cliente);
  const LblDeuda = divElement.querySelector('#Lbl-deudaCount');
  const LblCliente = divElement.querySelector('#lbl-cliente');
  LblDeuda.textContent = deuda.suma_deuda;
  LblCliente.textContent = cliente;
}

const initDataTable = async () => {
  if (miTabla) {
    miTabla.destroy();
    miTabla = null;
  }
  
  var xmlhttp = new XMLHttpRequest();
  var url = `https://ferrecred.com/api/compras/cliente/${cliente}`;
  console.log(`https://ferrecred.com/api/compras/cliente/${cliente}`);
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);

      miTabla = $('#datatable_clientes').DataTable({
        "data": data,
        "columns": [
          { "data": "folio" },
          { "data": "fecha" },
          {
            "data": "deuda",
            "render": function (data, type, row) {
              return data.toString(); // Convierte el valor decimal a cadena
            }
          },
          {
            "data": "total",
            "render": function (data, type, row) {
              return data.toString(); // Convierte el valor decimal a cadena
            }
          }
        ],
        pageLength: 5,
        searching: false,
        language: {
          lengthMenu: "",
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
async function Abonar() {
  const btnAbonar = divElement.querySelector('#btn-abonar');
  btnAbonar.addEventListener('click', async () => {
    const abonoinput = divElement.querySelector('#input-deuda');
    const listaDeuda = await ComprasGetByCliente(cliente);
    let AbonoCount = parseFloat(abonoinput.value);
    console.log(AbonoCount);
    listaDeuda.map((Deuda) => {
      const deudaActual = Deuda.deuda;
      if (deudaActual < AbonoCount) {
        AbonoCount - deudaActual;
        Deuda.deuda = 0;
      }
      else {
        Deuda.deuda -= AbonoCount;
        AbonoCount = 0;
      }
    });
    listaDeuda.forEach(async (Deuda) => {
      ComprasUpdateDeuda(Deuda);
    });
    const bitacora = bicoraRecord();
    BitacoraPost(bitacora);
    initDataTableBitacora();
    initDataTable();
  });

}
function ValidateInputs(){
  var nombreCliente = divElement.querySelector("#input-nombre-cliente").value;
  var direccion = divElement.querySelector("#input-direccion").value;
  var telefono = divElement.querySelector("#input-telefono").value;
  var correo = divElement.querySelector("#input-correo").value;
  var limiteCredito = divElement.querySelector("#input-limite").value;

  // Realiza la validación de los campos
  if (nombreCliente === "" || direccion === "" || telefono === "" || correo === "" || limiteCredito === "") {
    alert("Por favor, completa todos los campos.");
    return false; // Detiene la ejecución de la función si algún campo está vacío
  }

  // Validación de formato de correo electrónico utilizando una expresión regular
  var emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(correo)) {
    alert("El correo electrónico no tiene un formato válido.");
    return false; // Detiene la ejecución de la función si el formato del correo electrónico no es válido
  }

  // Validación de tipo de teléfono utilizando una expresión regular
  var telefonoRegex = /^[0-9]{10}$/;
  if (!telefonoRegex.test(telefono)) {
    alert("El teléfono no tiene un formato válido. Debe ser un número de 10 dígitos.");
    return false; // Detiene la ejecución de la función si el tipo de teléfono no es válido
  }
  if (isNaN(parseFloat(limiteCredito))) {
    alert("El límite de crédito debe ser un valor numérico.");
    return false; // Detiene la ejecución de la función si el límite de crédito no es numérico
  }
  return true;

}

function CrearCliente() {
  const lblCliente = divElement.querySelector('#Lbl-crear-cliente');
  const newClientDialog = divElement.querySelector('#new-product-dialog');
  lblCliente.addEventListener('click', () => {
    if (!newClientDialog.open) { // Verificar si el cuadro de diálogo está cerrado
      newClientDialog.showModal();
      newClientDialog.style.visibility = 'visible';
    }
  });
  divElement.querySelector('#close').addEventListener('click', (event) => {
    console.log("prueba");
    newClientDialog.style.visibility = 'hidden';
    newClientDialog.close();
  });

  const btnCliente = divElement.querySelector('#btn-cliente');
  btnCliente.addEventListener('click', async (event) => {
   event.preventDefault();
   if(ValidateInputs()){
    const inputNombre = divElement.querySelector('#input-nombre-cliente');
    const inputDireccion = divElement.querySelector('#input-direccion');
    const inputTelefono = divElement.querySelector('#input-telefono');
    const inputLimite = divElement.querySelector('#input-limite');
    const inputCorreo = divElement.querySelector('#input-correo');
    const newCliete = {
      nombreCliente: inputNombre.value,
      direccion: inputDireccion.value,
      telefono: inputTelefono.value,
      limiteCredito: inputLimite.value,
      saldoActual: "0",
      correoCliente: inputCorreo.value
    }
    postClientes(newCliete);
    newClientDialog.style.visibility = 'hidden';
    newClientDialog.close();
    ClientesGetAll().then(nombres => {
      suggestions = nombres;
    });
    console.log(suggestions);
    alert("cliente agregado con exito!");

   }
  });


}

export default () => {
  initDataTable();
  loadCatalogo();
  Search();
  Abonar();
  CrearCliente();
  return divElement;
};
