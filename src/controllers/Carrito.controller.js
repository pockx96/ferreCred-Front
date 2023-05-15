// import Quagga from 'quagga';
import view from "../view/Carrito.html";
import { getAll, getByCodigo } from '../controllersDb/catalogoController';
import { ProductoPost } from '../controllersDb/productoController';
import {ComprasPost} from '../controllersDb/compraController';
import {RestaInventario,InventarioGetByCodigo} from '../controllersDb/inventarioController';
import{BitacoraPost} from '../controllersDb/bitacoraController';
import {DeudaUpdate} from '../controllersDb/deudaController';



const divElement = document.createElement("div");
divElement.innerHTML = view;
const searchContainer = divElement.querySelector('.search-input-box');
const inputSearch = searchContainer.querySelector('input');
const boxSuggestions = divElement.querySelector('.container-suggestions');
const inputCodigo = divElement.querySelector('input-codigo');
let fila;
const tabla = divElement.querySelector('#table-body');
let suggestions = [];
let Cliente = "lord hikari";
let tipoNota= "credito";
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
    etiquetaTotal.textContent = total.toFixed(2);
    TotalCount = total;
}


function loadCatalogo() {
    getAll().then(nombres => {
        suggestions = nombres;
        console.log(suggestions);
    });
}


const addRow = (producto) => {
    const importe = (producto.precio_venta * 1.16).toFixed(2);
    const fila = tabla.insertRow(tabla.rows.length);
    const celdaCodigo = fila.insertCell(0);
    const celdaDescripcion = fila.insertCell(1);
    const celdaCantidad = fila.insertCell(2);
    const celdaPeso = fila.insertCell(3);
    const celdaPrecio = fila.insertCell(4);
    const celdaImporte = fila.insertCell(5);
    const celdaBoton = fila.insertCell(6);
    const button = document.createElement('button');
    celdaCodigo.innerHTML = producto.codigo;
    celdaDescripcion.innerHTML = producto.descripcion;
    celdaCantidad.innerHTML = "1";
    celdaPeso.innerHTML = producto.peso;
    celdaPrecio.innerHTML = producto.precio_venta;
    celdaImporte.innerHTML = importe;
    button.innerHTML = 'Eliminar';

    button.onclick = function () {
        fila.parentNode.removeChild(fila);
        sumarImporte();
    };
    celdaBoton.appendChild(button);
    celdaCodigo.contentEditable = true;
    celdaCantidad.contentEditable = true;
    fila.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
};

const obtenerFilasTabla = () => {
    const filas = tabla.rows;
    const arrayFilas = [];

    for (let i = 0; i < filas.length; i++) {
        arrayFilas.push(filas[i]);
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

function bicoraRecord (){
    let bitacora ={ 
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
            const compra ={
                cliente:Cliente,
                tipo_nota:tipoNota,
                total:TotalCount 
            };
            ComprasPost(compra);

            const productoList = obtenerProductos();
            productoList.forEach(producto => {
                const produtoInventario={
                    codigo:producto.codigo,
                    cantidad:producto.cantidad
                }
                RestaInventario(produtoInventario);
                ProductoPost(producto);
            });
            const bitacora = bicoraRecord();
            const deuda ={    
                "cliente": "Juan Perez",
                "adeudo": TotalCount
            }
            DeudaUpdate(deuda);
            BitacoraPost(bitacora);
        }
    });
};


async function select(element) {
    const codigo = element.textContent.split("-")[0].trim()
    const producto = await getByCodigo(codigo);
    console.log(producto);
    console.log(typeof (producto));
    const cantidadActual = await InventarioGetByCodigo(codigo);
    if(cantidadActual.cantidad>0){
        addRow(producto);
        sumarImporte();
    }
    else{
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
            if(cantidad <= cantidadActual.cantidad){
                const precio = parseFloat(fila.cells[4].innerText);
                const importe = ((cantidad * precio) * 1.16).toFixed(2);
                fila.cells[5].innerText = importe;
                sumarImporte();
                fila.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
            }
            else{
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
    const inputCodigo = divElement.querySelector('#input-codigo');
    inputCodigo.addEventListener("keydown", async (event) => {

        if (event.keyCode === 13 && event.target === inputCodigo) {
            event.preventDefault();
            const codigo = inputCodigo.value;
            const producto = await getByCodigo(codigo);

            addRow(producto);
            sumarImporte();
            inputCodigo.value="";

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



export default () => {
    loadCatalogo();
    Search();
    ClearTable();
    CantidadCaptura();
    CodigoCapturaCelda();
    CodigoCaptura();
    confirmarCompra();


    return divElement;
};
