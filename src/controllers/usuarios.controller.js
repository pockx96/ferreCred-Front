import view from '../view/usuarios.html'
import { getAllUsuarios, postUsuarios, putUsuarios, deleteUsuario, getByIDUsuario } from '../controllersDb/usuariosController'

const divElement = document.createElement("div");
divElement.innerHTML = view;
const table = divElement.querySelector("#table");

const btnAgregar = divElement.querySelector("#Agregar");
const btnEditar = divElement.querySelector("#Editar");
const btnEliminar = divElement.querySelector("#Eliminar");
const btnBuscar = divElement.querySelector("#Buscar");

const nombre = divElement.querySelector("#nombre");
const correo = divElement.querySelector("#correo");
const contrasena = divElement.querySelector("#contrasena");



function loadTable() {
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    getAllUsuarios().then((usuarios) => {
        usuarios.forEach((usuario) => {
            table.innerHTML += `
          <tr>
          <td>${usuario.nombreUsuario}</td>
          <td>${usuario.contraseñaUsuario}</td>
          <td>${usuario.correoUsuario}</td>
      </tr>
          `;

        });
    });
};


function searchUsuario() {
    btnBuscar.addEventListener("click", () => {
        var correotext = correo.value;
        getByIDUsuario(correotext).then((usuarios) =>{
            console.log(typeof(usuarios));
            usuarios.forEach((usuario)=>{
                alert(`holaaa ${usuario.nombreUsuario}`);
            });
        });
    });

};

function addUsuario() {
    btnAgregar.addEventListener("click", () => {
        var usuario = {
            nombreUsuario: nombre.value,
            contraseñaUsuario: contrasena.value,
            correoUsuario: correo.value
        };

        postUsuarios(usuario);
        loadTable();
    });
    nombre.value = '';
    correo.value = '',
    contrasena.value = '';
};

function editUsuario() {
    btnEditar.addEventListener("click", () => {
        var usuario = {
            nombreUsuario: nombre.value,
            contraseñaUsuario: contrasena.value,
            correoUsuario: correo.value
        };

        putUsuarios(usuario);
        loadTable();
    });
    nombre.value = '';
    correo.value = '',
    contrasena.value = '';
};

function removeUsuario() {
    btnEliminar.addEventListener("click", () => {
        var usuario = {
            nombreUsuario: nombre.value
        }
        deleteUsuario(usuario);
        loadTable();
    });
    nombre.value = '';
};



export default async () => {

    loadTable();
    addUsuario();
    editUsuario();
    removeUsuario();
    searchUsuario();
    return divElement;
};
