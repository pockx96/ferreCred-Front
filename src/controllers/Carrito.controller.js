import Quagga from 'quagga';
import view from "../view/Carrito.html";
const divElement = document.createElement("div");
divElement.innerHTML = view;
const searchContainer = divElement.querySelector('.search-input-box');
const inputSearch = searchContainer.querySelector('input');
const boxSuggestions = divElement.querySelector('.container-suggestions');
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

const url = 'https://ferrecred.com/api/catalogo';

const getAll = async () => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        const catalogo = data.map(producto => {
            return {
                codigo: producto.codigo,
                descripcion: producto.descripcion
            };
        });
        return catalogo;
    } catch (error) {
        console.error(error);
    }
};

const getByCodigo = async (id) => {
    return fetch(`https://ferrecred.com/api/catalogo/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log("producto encontrado");
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}


getAll().then(nombres => {
    suggestions = nombres;
    console.log(suggestions);
});

const addRow = (producto) => {
    const importe = (producto.precio_venta*1.16);

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
        userValue = inputSearch.value;
        listData = `<li>${userValue}</li>`;
    } else {
        listData = list.join(' ');
    }
    boxSuggestions.innerHTML = listData;
};

function CantidadCaptura() {
    tabla.addEventListener('keydown', (event) => {
        const fila = event.target.parentNode;
        const celdaCantidad = fila.cells[2]; // índice de la celda cantidad

        if (event.keyCode === 13 && event.target === celdaCantidad) {
            const cantidad = celdaCantidad.innerText;
            alert(cantidad);
        }
    });


}



export default () => {
    Search();

    const btnClick = divElement.querySelector("#confirmar");
    btnClick.addEventListener("click", () => {
        initQuagga();
    });

    return divElement;
};
