import $ from 'jquery';
import 'datatables.net';
import '../../../node_modules/datatables/media/css/jquery.dataTables.min.css';
import view from '../../view/testDB/inventarioTest.html'
import {getAll,getByFolio,post } from '../../controllersDb/inventarioController'

const divElement = document.createElement("div");
divElement.innerHTML = view;
const table = divElement.querySelector("#table");

const btnAgregar = divElement.querySelector("#Agregar");
const btnEditar = divElement.querySelector("#Editar");
const btnEliminar = divElement.querySelector("#Eliminar");
const btnBuscar = divElement.querySelector("#Buscar");

const codigo = divElement.querySelector("#codigo");


let dataTable;
let dataTableIsInitialized = false;

const initDataTable = async () => {
    if (dataTableIsInitialized) {
        dataTable.destroy();
    };

    await listProductos();

    dataTable = $(divElement).find("#datatable_producto").dataTable({});


    dataTableIsInitialized = true;
};


const listProductos= async()=> {

    getAll().then((producto) => {
        producto.forEach((producto) => {
            table.innerHTML += `
          <tr>
          <td>${producto.codigo}</td>
          <td>${producto.descripcion}</td>
          <td>${producto.precio_compra}</td>
          <td>${producto.precio_venta}</td>
      </tr>
          `;

        });
    });

};


export default async () => {
    await initDataTable();
    return divElement;
};
