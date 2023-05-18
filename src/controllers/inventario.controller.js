import view from '../view/inventario.html';
import { getAll } from '../controllersDb/inventarioController';
import {ProductoPost} from '../controllersDb/catalogoController';
import {ProveedorPost} from '../controllersDb/proveedorController';

const divElement = document.createElement("div");
divElement.innerHTML = view;
let miTabla;
export const initDataTable = async () => {
  if (miTabla) {
    miTabla.destroy();
    miTabla = null;
  }
  var xmlhttp = new XMLHttpRequest();
  var url = "https://ferrecred.com/api/inventario";
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);

      miTabla = $('#datatable_inventario').DataTable({
        "data": data,
        "columns": [
          { "data": "codigo" },
          { "data": "descripcion" },
          { "data": "precio_compra" },
          { "data": "precio_venta" },
          { "data": "cantidad" }
        ],
        pageLength: 6,
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
        }
      });
    }
  }

};


function CrearProducto() {
  const lblProducto = divElement.querySelector('#Lbl-crear-producto');
  const newClientDialog = divElement.querySelector('#new-product-dialog');
  lblProducto.addEventListener('click', () => {
    newClientDialog.showModal();
    newClientDialog.style.visibility = 'visible';
    newClientDialog.style.justifyContent = 'center';
    newClientDialog.style.alignItems = 'center';
    console.log('p')
  });
  divElement.querySelector('#close').addEventListener('click', (event) => {
    console.log("prueba");
    newClientDialog.style.visibility = 'hidden';
    newClientDialog.close();
  });

  const btnProducto = divElement.querySelector('#btn-producto');
  btnProducto.addEventListener('click', async () => {
    const inputCodigo = divElement.querySelector('#input-codigo');
    const inputDescripccion = divElement.querySelector('#input-descripcion');
    const inputCompra = divElement.querySelector('#input-precio-compra');
    const inputVenta = divElement.querySelector('#input-precio-venta');
    const inputPeso = divElement.querySelector('#input-peso');
    const newProducto = {
      codigo: inputCodigo.value,
      descripcion: inputDescripccion.value,
      precio_compra: inputCompra.value,
      precio_venta: inputVenta.value,
      peso: inputPeso.value
    }
    ProductoPost(newProducto);
    alert('Nuevo producto agregado');
  });


}


function CrearProveedor() {
  const lblProvedor = divElement.querySelector('#Lbl-crear-proveedor');
  const newClientDialog = divElement.querySelector('#new-proveedor-dialog');
  lblProvedor.addEventListener('click', () => {
    newClientDialog.showModal();
    newClientDialog.style.visibility = 'visible';
    newClientDialog.style.justifyContent = 'center';
    newClientDialog.style.alignItems = 'center';
  });
  divElement.querySelector('#close-proveedor').addEventListener('click', (event) => {
    console.log("prueba");
    newClientDialog.style.visibility = 'hidden';
    newClientDialog.close();
  });

  const btnProvedor = divElement.querySelector('#btn-provedor');
  btnProvedor.addEventListener('click', async () => {
    const inputEmpresa = divElement.querySelector('#input-empresa');
    const inputNombre = divElement.querySelector('#input-nombre');
    const inputCorreo = divElement.querySelector('#input-correo');
    const inputDireccion = divElement.querySelector('#input-direccion');
    const inputTelefono = divElement.querySelector('#input-telefono');
    const inputRFC = divElement.querySelector('#input-rfc');
    const newProveedor = {
      correo_electronico: inputCorreo.value,
      nombre_empresa: inputEmpresa.value,
      nombre_contacto: inputNombre.value,
      direccion: inputDireccion.value,
      telefono: inputTelefono.value,
      RFC:inputRFC.value
    }
    ProveedorPost(newProveedor);

    alert('Nuevo proveedor agregado');
  });


}
export default async () => {
  initDataTable();
  CrearProducto();
  CrearProveedor();
  return divElement;
};
