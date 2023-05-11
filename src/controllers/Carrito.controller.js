import Quagga from 'quagga';
import view from "../view/Carrito.html";
import { getAll, getByCodigo } from '../controllersDb/catalogoController';

const divElement = document.createElement("div");
divElement.innerHTML = view;
const searchContainer = divElement.querySelector('.search-input-box');
const inputSearch = searchContainer.querySelector('input');
const boxSuggestions = divElement.querySelector('.container-suggestions');
const inputCodigo = divElement.querySelector('input-codigo');
let fila;
const tabla = divElement.querySelector('#table-body');
let suggestions = [];

function initQuagga() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#interactive'),
            constraints: {
                width: 184,
                height: 157,
            }
        },
        decoder: {
            readers: ["ean_reader"]
        }
    }, function (err) {
        if (err) {
            console.log(err);
            return
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
    }); Quagga.onDetected(function (result) {
        var code = result.codeResult.code;
        document.getElementById("result").innerHTML = code; Quagga.stop();

    });


}

function loadCatalogo() {
    getAll().then(nombres => {
        suggestions = nombres;
        console.log(suggestions);
    });
}

const addRow = (producto) => {
    const importe = (producto.precio_venta * 1.16).toFixed(2);

    fila = tabla.insertRow(tabla.rows.length);
    const celdaCodigo = fila.insertCell(0);
    const celdaDescripcion = fila.insertCell(1);
    const celdaCantidad = fila.insertCell(2);
    const celdaPeso = fila.insertCell(3);
    const celdaPrecio = fila.insertCell(4);
    const celdaImporte = fila.insertCell(5);

    celdaCodigo.innerHTML = producto.codigo;
    celdaDescripcion.innerHTML = producto.descripcion;
    celdaCantidad.innerHTML = "1";
    celdaPeso.innerHTML = producto.peso;
    celdaPrecio.innerHTML = producto.precio_venta;
    celdaImporte.innerHTML = importe;

    celdaCodigo.contentEditable = true;
    celdaCantidad.contentEditable = true;
};

async function select(element) {
    const codigo = element.textContent.split("-")[0].trim()
    const producto = await getByCodigo(codigo);
    console.log(producto);
    console.log(typeof (producto));

    addRow(producto);


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
    tabla.addEventListener("keydown", (event) => {
        const fila = event.target.parentNode;
        const celdaCantidad = fila.cells[2]; // índice de la celda cantidad

        if (event.keyCode === 13 && event.target === celdaCantidad) {
            event.preventDefault(); // evitar que la celda salte a una nueva línea
            const cantidad = parseInt(celdaCantidad.innerText);
            const precio = parseFloat(fila.cells[4].innerText);
            const importe = ((cantidad * precio) * 1.16).toFixed(2);
            fila.cells[5].innerText = importe;

        }
    });
}

function CodigoCaptura() {
    tabla.addEventListener("keydown", async (event) => {
        const fila = event.target.parentNode;
        const celdaCodigo = fila.cells[0]; // índice de la celda cantidad
        
        if (event.keyCode === 13 && event.target === celdaCodigo) {
            event.preventDefault();
            const codigo = celdaCodigo.textContent;
            const producto = await getByCodigo(codigo);
    
            fila.cells[1].innerText = producto.descripcion;
            fila.cells[2].innerText  = "1";
            fila.cells[3].innerText  = producto.peso;
            fila.cells[4].innerText  = producto.precio_venta;
            fila.cells[5].innerText  = ((producto.precio_venta)*1.16).toFixed(2); 

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
    CodigoCaptura();

    return divElement;
};
