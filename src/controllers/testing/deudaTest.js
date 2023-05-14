import view from '../../view/testDB/deudaTest.html'
import {getAll,getByFolio,post,DeudaUpdate,getByCliente } from '../../controllersDb/deudaController'

const divElement = document.createElement("div");
divElement.innerHTML = view;
const table = divElement.querySelector("#table");

const btnAgregar = divElement.querySelector("#Agregar");
const btnEditar = divElement.querySelector("#Editar");
const btnEliminar = divElement.querySelector("#Eliminar");
const btnBuscar = divElement.querySelector("#Buscar");

const folio = divElement.querySelector("#folio");
const fecha = divElement.querySelector("#fecha");
const cliente = divElement.querySelector("#cliente");
const total = divElement.querySelector("#total");
const adeudo = divElement.querySelector("#adeudo");

function loadTable() {
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    getAll().then((deuda) => {
        deuda.forEach((deuda) => {
            table.innerHTML += `
          <tr>
          <td>${deuda.folio}</td>
          <td>${deuda.fecha}</td>
          <td>${deuda.cliente}</td>
          <td>${deuda.total}</td>
          <td>${deuda.adeudo}</td>
      </tr>
          `;

        });
    });
};

function searchDeudaByFolio() {
    btnBuscar.addEventListener("click", () => {
        var folioString = folio.value;
        getByFolio(folioString).then((deudas) =>{
            console.log(deudas);
            alert(deudas.cliente);
        });
    });

};
function searchDeudaByCliente() {
    btnBuscar.addEventListener("click", () => {
        var ClienteString = cliente.value;
        console.log(ClienteString);
        getByCliente(ClienteString).then((deudas) =>{
            console.log(deudas);
            alert(deudas.folio);
        });
    });

};

function addDeuda() {
    btnAgregar.addEventListener("click", () => {
        var deuda = {
            folio:folio.value,
            fecha:fecha.value,
            cliente:cliente.value,
            total:total.value,
            adeudo:adeudo.value
        };
        console.log(deuda);

        post(deuda);
        loadTable();
    });
};
function updateDeuda() {
    btnEditar.addEventListener("click", () => {
        var deuda = {
            adeudo:adeudo.value
        };
        console.log(deuda);
        const folioString = folio.value;
        console.log(folioString);
        DeudaUpdate(folioString,deuda);
        loadTable();
    });
};


export default async () => {
    loadTable();
    searchDeudaByFolio();
    searchDeudaByCliente();
    updateDeuda();
    addDeuda();
    return divElement;
};
