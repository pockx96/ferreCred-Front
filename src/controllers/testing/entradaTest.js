import view from '../../view/testDB/entradaTest.html'
import {getAll,getByFolio,post } from '../../controllersDb/entradaController'

const divElement = document.createElement("div");
divElement.innerHTML = view;
const table = divElement.querySelector("#table");

const btnAgregar = divElement.querySelector("#Agregar");
const btnEditar = divElement.querySelector("#Editar");
const btnEliminar = divElement.querySelector("#Eliminar");
const btnBuscar = divElement.querySelector("#Buscar");

const codigo = divElement.querySelector("#codigo");
const folio = divElement.querySelector("#folio");
const unidad = divElement.querySelector("#unidad");
const cantidad = divElement.querySelector("#cantidad");
const importe = divElement.querySelector("#importe");




export default async () => {
    const divElement = document.createElement("div");
    divElement.innerHTML = view;
    return divElement;
};
