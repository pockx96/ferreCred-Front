import $ from 'jquery';
import 'datatables.net';
import '../../../node_modules/datatables/media/css/jquery.dataTables.min.css';
import view from '../../view/testDB/catalogoTest.html'
import {getAll,getByFolio,ProductoPost } from '../../controllersDb/catalogoController'

const divElement = document.createElement("div");
divElement.innerHTML = view;
const table = divElement.querySelector("#table");

const btnAgregar = divElement.querySelector("#Agregar");
const btnEditar = divElement.querySelector("#Editar");
const btnEliminar = divElement.querySelector("#Eliminar");
const btnBuscar = divElement.querySelector("#Buscar");

const codigo = divElement.querySelector("#codigo");
const descripcion = divElement.querySelector("#descripcion");
const precio_compra = divElement.querySelector("#precio_compra");
const precio_venta = divElement.querySelector("#precio_venta");
const tipo = divElement.querySelector("#tipo");

let dataTable;
let dataTableIsInitialized = false;

const initDataTable = async () => {
    if (dataTableIsInitialized) {
        dataTable.fnDestroy();
    };

    await listProductos();

    dataTable = $(divElement).find("#datatable_producto").dataTable({searching:true,destroy: true});


    dataTableIsInitialized = true;
};


const listProductos= async()=> {

    getAll().then((producto) => {
        dataTable.fnClearTable();
        producto.forEach((producto) => {
            table.innerHTML += `
          <tr>
          <td>${producto.codigo}</td>
          <td>${producto.descripcion}</td>
          <td>${producto.precio_compra}</td>
          <td>${producto.precio_venta}</td>
          <td>${producto.tipo}</td>
      </tr>
          `;

        });
    });

};

function addProducto() {
    btnAgregar.addEventListener("click", () => {
        var producto = {
            codigo: codigo.value,
            descripcion: descripcion.value,
            precio_compra: precio_compra.value,
            precio_venta: precio_venta.value,
            tipo: tipo.value
        };

        ProductoPost(producto);
    });

};



export default async () => {

    await initDataTable();
    addProducto();
    return divElement;
};
