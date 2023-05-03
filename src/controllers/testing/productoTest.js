import $ from 'jquery';
import 'datatables.net';
import '../../../node_modules/datatables/media/css/jquery.dataTables.min.css';
import view from '../../view/testDB/productoTest.html'
import { getAll, getByFolio, post } from '../../controllersDb/productoController'


const divElement = document.createElement("div");
divElement.innerHTML = view;
const table = divElement.querySelector("#tableBody");

const btnAgregar = divElement.querySelector("#Agregar");
const btnEditar = divElement.querySelector("#Editar");
const btnEliminar = divElement.querySelector("#Eliminar");
const btnBuscar = divElement.querySelector("#Buscar");

const codigo = divElement.querySelector("#codigo");
const folio = divElement.querySelector("#folio");
const unidad = divElement.querySelector("#unidad");
const cantidad = divElement.querySelector("#cantidad");
const importe = divElement.querySelector("#importe");

let dataTable;
let dataTableIsInitialized = false;

const dataTableOptions = {
    pageLength: 3,
    destroy: true,
    searching: false,
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
    },
    columns: [
        { data: 'codigo', searchable: false },
        { data: 'folio', searchable: true },
        { data: 'unidad', searchable: false },
        { data: 'cantidad', searchable: false },
        { data: 'importe', searchable: false }
    ]

};


const initDataTable = async () => {
    if (dataTableIsInitialized) {
        dataTable.destroy();
    };

    await listProductos();

    dataTable = $(divElement).find("#datatable_producto").dataTable();


    dataTableIsInitialized = true;
};


const listProductos= async()=> {

    getAll().then((producto) => {
        producto.forEach((producto) => {
            table.innerHTML += `
          <tr>
          <td>${producto.codigo}</td>
          <td>${producto.folio}</td>
          <td>${producto.unidad}</td>
          <td>${producto.cantidad}</td>
          <td>${producto.importe}</td>
      </tr>
          `;

        });
    });

};


function searchproducto() {
    btnBuscar.addEventListener("click", () => {
        var folioString = folio.value;
        getByFolio(folioString).then((productos) => {
            productos.forEach((producto) => {
                console.log(typeof (producto));
            });
        });
    });

};

function addProducto() {
    btnAgregar.addEventListener("click", () => {
        var producto = {
            codigo: codigo.value,
            folio: folio.value,
            unidad: unidad.value,
            cantidad: cantidad.value,
            importe: importe.value
        };

        post(producto);
        loadTable();
    });

};

function jquery() {
    const btn = $(divElement).find("#prueba");
    btn.click(function () {
        alert("¡Haz hecho clic en el botón de prueba!");
    });
}




export default async () => {
    dataTable = $(divElement).find("#datatable_producto").dataTable();
    searchproducto();
    addProducto();
    jquery();
    return divElement;
};
