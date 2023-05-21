// import Quagga from 'quagga';
import view from "../view/Carrito.html";
import { getAll, getByCodigo } from '../controllersDb/catalogoController';
import { ProductoPost } from '../controllersDb/productoController';
import { ComprasPost } from '../controllersDb/compraController';
import { RestaInventario, InventarioGetByCodigo, SumaInventario } from '../controllersDb/inventarioController';
import { BitacoraPost } from '../controllersDb/bitacoraController';
import { DeudaUpdate } from '../controllersDb/deudaController';
import { initDataTable } from './inventario.controller';
import { ClientesGetAll } from '../controllersDb/clientesController';
import { ProveedoresGetAll } from '../controllersDb/proveedorController';


const divElement = document.createElement("div");
divElement.innerHTML = view;
const searchContainer = divElement.querySelector('.search-input-box');
const inputSearch = searchContainer.querySelector('input');
const boxSuggestions = divElement.querySelector('.container-suggestions');
const LblProducto = divElement.querySelector('#Lbl-Producto');
const inputCodigo = divElement.querySelector('#input-codigo');
let fila;
const tabla = divElement.querySelector('#table-body');
let suggestions = [];
let Cliente = "lord hikari";
let tipoNota = "credito";
var TotalCount;


// function initQuagga() {
//     Quagga.init({
//         inputStream: {
//             name: "Live",
//             type: "LiveStream",
//             target: document.querySelector('#interactive'),
//             constraints: {
//                 width: 184,
//                 height: 157,
//             }
//         },
//         decoder: {
//             readers: ["ean_reader"]
//         }
//     }, function (err) {
//         if (err) {
//             console.log(err);
//             return
//         }
//         console.log("Initialization finished. Ready to start");
//         Quagga.start();
//     }); Quagga.onDetected(function (result) {
//         var code = result.codeResult.code;
//         document.getElementById("result").innerHTML = code; Quagga.stop();

//     });


// }


function sumarImporte() {
    // Obtener todas las celdas de importe de la tabla
    const celdasImporte = document.querySelectorAll("#table-body td:nth-child(6)");

    // Iterar sobre cada celda y obtener el valor de su texto
    let total = 0;
    celdasImporte.forEach(celda => {
        const importe = parseFloat(celda.textContent);
        if (!isNaN(importe)) {
            total += importe;
        }
    });

    // Actualizar la etiqueta con el valor total
    const etiquetaTotal = document.getElementById("total-label");
    etiquetaTotal.textContent = total.toLocaleString('es-ES', { style: 'currency', currency: 'MXN' });
    TotalCount = total;
}


function loadCatalogo() {
    getAll().then(nombres => {
        suggestions = nombres;
    });
}

function empycellsTable(){
    var rowCount = tabla.getElementsByTagName('tr').length;
    var emptyRowsNeeded = 5 - rowCount;
    console.log(rowCount);
    console.log(emptyRowsNeeded);
    console.log('holaaaa');
    if (rowCount === 0) {
        for (var i = 0; i < emptyRowsNeeded; i++) {
            var row = document.createElement('tr');
            row.innerHTML = '<td>&nbsp;</td>'.repeat(7); // Agregar celdas vacías para cada columna
            tabla.appendChild(row);
        }
    }
}

const addRow = (producto) => {
    const importe = (producto.precio_venta * 1.16).toFixed(2);
    const totalRows = tabla.rows.length;

    const newRow = document.createElement('tr');
    const celdaCodigo = document.createElement('td');
    const celdaDescripcion = document.createElement('td');
    const celdaCantidad = document.createElement('td');
    const celdaPeso = document.createElement('td');
    const celdaPrecio = document.createElement('td');
    const celdaImporte = document.createElement('td');
    const celdaBoton = document.createElement('td');
    celdaBoton.style.textAlign = 'center';
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-danger');
    celdaCodigo.innerHTML = producto.codigo;
    celdaDescripcion.innerHTML = producto.descripcion;
    celdaCantidad.innerHTML = '1';
    celdaPeso.innerHTML = producto.peso;
    celdaPrecio.innerHTML = producto.precio_venta;
    celdaImporte.innerHTML = importe;
    button.innerHTML = 'Eliminar';

    button.onclick = function () {
        newRow.parentNode.removeChild(newRow);
        sumarImporte();
    };
    celdaBoton.appendChild(button);
    celdaCodigo.contentEditable = true;
    celdaCantidad.contentEditable = true;

    newRow.appendChild(celdaCodigo);
    newRow.appendChild(celdaDescripcion);
    newRow.appendChild(celdaCantidad);
    newRow.appendChild(celdaPeso);
    newRow.appendChild(celdaPrecio);
    newRow.appendChild(celdaImporte);
    newRow.appendChild(celdaBoton);

    const tableBody = document.getElementById('table-body');
    if (totalRows > 0) {
        tableBody.insertBefore(newRow, tableBody.childNodes[1]); // Insertar después de la segunda fila (después de las cabeceras)
    } else {
        tableBody.appendChild(newRow); // Si no hay filas, agregar como la primera fila
    }

    const emptyRowsNeeded = Math.max(0, 6 - totalRows - 1);
    for (let i = 0; i < emptyRowsNeeded; i++) {
        const emptyRow = document.createElement('tr');
        for (let j = 0; j < 6; j++) {
            const emptyCell = document.createElement('td');
            emptyCell.innerHTML = '&nbsp;';
            emptyRow.appendChild(emptyCell);
        }
        tableBody.appendChild(emptyRow);
    }

    newRow.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    celdaCantidad.focus();
};


const obtenerFilasTabla = () => {
    const filas = tabla.rows;
    const arrayFilas = [];

    for (let i = 0; i < filas.length; i++) {
        // Verificar si la fila no está vacía
        if (filas[i].innerText.trim() !== '') {
            arrayFilas.push(filas[i]);
        }
    }

    return arrayFilas;
};


const obtenerProductos = () => {
    const tablaArray = obtenerFilasTabla();
    const objetosFilas = tablaArray.map(fila => {
        const objetoFila = {};
        const columnas = fila.cells;
        objetoFila.codigo = parseInt(columnas[0].textContent);
        objetoFila.folio = "prueba";
        objetoFila.cantidad = parseInt(columnas[2].textContent);
        objetoFila.peso = parseFloat(columnas[3].textContent);
        objetoFila.importe = parseFloat(columnas[5].textContent);
        return objetoFila;
    });
    return objetosFilas;
}

function bicoraRecord() {
    let bitacora = {
        Usuario: "@example.com",
        Proceso: "pruebaCarrito3",
        Estatus: 1,
    }
    return bitacora;
}

const confirmarCompra = () => {
    const confirmarBtn = divElement.querySelector('#confirmar');
    confirmarBtn.addEventListener('click', () => {
        const confirmado = window.confirm('¿Está seguro de confirmar la compra?');
        if (confirmado) {
            const compra = {
                cliente: Cliente,
                tipo_nota: tipoNota,
                deuda: TotalCount,
                total: TotalCount
            };
            ComprasPost(compra);

            const productoList = obtenerProductos();
            console.log("lista de productos:");
            console.log(productoList);
            productoList.forEach(producto => {
                const produtoInventario = {
                    codigo: producto.codigo,
                    cantidad: producto.cantidad
                }
                SumaInventario(produtoInventario);
                ProductoPost(producto);
            });
            const bitacora = bicoraRecord();
            BitacoraPost(bitacora);
            initDataTable();
            ClearTable();
        }
    });
};


async function select(element) {
    const codigo = element.textContent.split("-")[0].trim()
    const producto = await getByCodigo(codigo);
    console.log(producto);
    console.log(typeof (producto));
    const cantidadActual = await InventarioGetByCodigo(codigo);
    if (cantidadActual.cantidad > 0) {
        LblProducto.innerText = `Codigo.${producto.codigo} - ${producto.descripcion}`;
        addRow(producto);
        sumarImporte();
    }
    else {
        alert("produco agotado");
    }

    searchContainer.classList.remove('active');
}

function Search() {
    window.select = select;
    inputSearch.onkeyup = e => {
        let userData = e.target.value;
        let emptyArray = [];

        if (userData) {
            emptyArray = suggestions.filter(producto => {
                const regex = new RegExp(userData, 'gi');
                return producto.descripcion.match(regex);
            });

            emptyArray = emptyArray.map(data => {
                return (data = `<li>${data.codigo} - ${data.descripcion}</li>`);
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

function CantidadCaptura() {
    tabla.addEventListener("keydown", async (event) => {
        const fila = event.target.parentNode;
        const celdaCantidad = fila.cells[2]; // índice de la celda cantidad
        const celdaCodigo = fila.cells[0];
        if (event.keyCode === 13 && event.target === celdaCantidad) {
            event.preventDefault(); // evitar que la celda salte a una nueva línea
            const codigo = celdaCodigo.innerText;
            console.log(codigo);
            const cantidad = parseInt(celdaCantidad.innerText);
            const cantidadActual = await InventarioGetByCodigo(codigo);
            if (cantidad <= cantidadActual.cantidad) {
                const precio = parseFloat(fila.cells[4].innerText);
                const importe = ((cantidad * precio) * 1.16).toFixed(2);
                fila.cells[5].innerText = importe;
                sumarImporte();
                fila.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
                inputCodigo.focus();
            }
            else {
                alert(`Cantidad insuficiente en inventario - cantidad disponible: ${cantidadActual.cantidad}`);
            }
        }
    });
}

function CodigoCapturaCelda() {
    tabla.addEventListener("keydown", async (event) => {
        const fila = event.target.parentNode;
        const celdaCodigo = fila.cells[0]; // índice de la celda cantidad

        if (event.keyCode === 13 && event.target === celdaCodigo) {
            event.preventDefault();
            const codigo = celdaCodigo.textContent;
            const producto = await getByCodigo(codigo);

            fila.cells[1].innerText = producto.descripcion;
            fila.cells[2].innerText = "1";
            fila.cells[3].innerText = producto.peso;
            fila.cells[4].innerText = producto.precio_venta;
            fila.cells[5].innerText = ((producto.precio_venta) * 1.16).toFixed(2);
            fila.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        }
    });
}
function CodigoCaptura() {

    inputCodigo.addEventListener("keydown", async (event) => {

        if (event.keyCode === 13 && event.target === inputCodigo) {
            event.preventDefault();
            const codigo = inputCodigo.value;
            const producto = await getByCodigo(codigo);
            LblProducto.innerText = `Codigo.${producto.codigo} - ${producto.descripcion}`;
            addRow(producto);
            sumarImporte();
            inputCodigo.value = "";

        }
    });
}

function ClearTable() {
    const btnEliminar = divElement.querySelector('#eliminar');
    btnEliminar.addEventListener('click', () => {
        while (tabla.firstChild) {
            tabla.removeChild(tabla.firstChild);
        }
    });
}

async function nuevoCliente() {
    const newProduct = divElement.querySelector('#LblCrear');
    const newProductDialog = divElement.querySelector('#select-client-dialog');
    newProduct.addEventListener('click', () => {
        if (!newProductDialog.open) { // Verificar si el cuadro de diálogo está cerrado
            newProductDialog.showModal();
            newProductDialog.style.visibility = 'visible';
        }
    });
    // Agregar evento de submit al formulario del cuadro de diálogo
    divElement.querySelector('#close').addEventListener('click', (event) => {
        newProductDialog.style.visibility = 'hidden';
        newProductDialog.close();
    });
    const comboBox = divElement.querySelector('#combo-box');
    const ListaClientes = await ClientesGetAll();
    console.log(ListaClientes);
    ListaClientes.forEach(Cliente => {
        const optionElement = document.createElement('option');
        optionElement.textContent = Cliente.nombreCliente;
        optionElement.value = Cliente.nombreCliente;
        comboBox.appendChild(optionElement);
    });

}

function SelectNuevoCliente() {
    const newProductDialog = divElement.querySelector('#select-client-dialog');
    const comboBox = divElement.querySelector('#combo-box');
    const btnCliete = divElement.querySelector('#btn-cliente');
    const lblCliente = divElement.querySelector('#Lbl-cliente');
    btnCliete.addEventListener('click', () => {
        const value = comboBox.value;
        Cliente = value;
        lblCliente.innerText = `Cli. ${value}`;
        newProductDialog.style.visibility = 'hidden';
        newProductDialog.close();
    });

}

function hiddenElements() {
    const labelContent = divElement.querySelector('.lbl-container');
    labelContent.style.display = "none";
}

export function showDialog() {
    // const newProductDialog = divElement.querySelector('#select-client-dialog');
    // if (!newProductDialog.open) { // Verificar si el cuadro de diálogo está cerrado
    //     newProductDialog.showModal();
    //     newProductDialog.style.visibility = 'visible';
    // }
    alert('working');
}
export async function Proveedores() {
    const newProductDialog = divElement.querySelector('#select-client-dialog');
    // Agregar evento de submit al formulario del cuadro de diálogo
    divElement.querySelector('#close').addEventListener('click', (event) => {
        newProductDialog.style.visibility = 'hidden';
        newProductDialog.close();
    });
    const comboBox = divElement.querySelector('#combo-box');
    const ListaProveedores = await ProveedoresGetAll();
    console.log(ListaProveedores);
    ListaProveedores.forEach(Cliente => {
        const optionElement = document.createElement('option');
        optionElement.textContent = Cliente.nombre_empresa;
        optionElement.value = Cliente.nombre_empresa;
        comboBox.appendChild(optionElement);
    });
}

export default () => {
    loadCatalogo();
    Search();
    ClearTable();
    CantidadCaptura();
    CodigoCapturaCelda();
    CodigoCaptura();
    confirmarCompra();
    SelectNuevoCliente();
    hiddenElements();
    Proveedores();
    empycellsTable();
    return divElement;
};
