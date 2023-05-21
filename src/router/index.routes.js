import { pages } from "../controllers/index";
import {showDialog} from "../controllers/Entradas.controller";

const router = async (route) => {
  let content = document.getElementById("root");
  content.innerHTML = "";

  console.log(route);

  switch (route) {
    case "#/": {
      return content.appendChild(pages.home());
    }
    case "#/creditos": {
      return content.appendChild(pages.carrito());
    }
    case "#/usuarios": {
      return content.appendChild(await pages.usuarios());
    }
    case "#/Entradas":{
      return content.appendChild(await pages.entradas());
    }
    case "#/inventario": {
      return content.appendChild(await pages.inventario());
    }
    case "#/proveedores":{
      return content.appendChild(await pages.proveedor());
    }
    case "#/bitacora":{
      return content.appendChild(await pages.bitacora());
    }
    case "#/abonos":{
      return content.appendChild(await pages.abonos());
    }
    case "#/productoTest":{
      return content.appendChild(await pages.productoTest());
    }
    case "#/deudaTest":{
      return content.appendChild(await pages.deudaTest());
    }
    case "#/compraTest":{
      return content.appendChild(await pages.compraTest());
    }
    case "#/entradaTest":{
      return content.appendChild(await pages.entradaTest());
    }
    case "#/inventarioTest":{
      return content.appendChild(await pages.inventarioTest());
    }
    case "#/proveedorTest":{
      return content.appendChild(await pages.proveedorTest());
    }
    case "#/clienteTest":{
      return content.appendChild(await pages.clienteTest());
    }
    case "#/catalogoTest":{
      return content.appendChild(await pages.catalogoTest());
    }
    case "#/usuarioTest":{
      return content.appendChild(await pages.usuarioTest());
    }
   
    default: {
      return content.appendChild(pages.notFound());
    }
  }
};



export { router };
