import Home from "./home.controller";
import Posts from "./posts.controller";
import NotFound from "./404.controller";
import Products from "./products.controller";
import Carrito from "./Carrito.controller";
import Usuarios from "./usuarios.controller";
import Bitacora from "./Bitacora.controller";
import Proveedor from "./provedores.controller";
import Inventario from "./inventario.controller";
import Abonos from "./abonos";

import ProductoTest from "./testing/productoTest";
import DeudaTest from "./testing/deudaTest";
import CompraTest from "./testing/compraTest";
import EntradaTest from "./testing/entradaTest";
import InventarioTest from "./testing/inventarioTest";
import ProveedorTest from "./testing/proveedorTest";
import ClientesTest from "./testing/clientesTest";
import CatalogoTest from "./testing/catalogoTest";
import UsuarioTest from "./testing/usuarioTest";
const pages = {
  home: Home,
  posts: Posts,
  notFound: NotFound,
  products:Products,
  carrito:Carrito,
  usuarios:Usuarios,
  bitacora:Bitacora,
  abonos:Abonos,
  productoTest:ProductoTest,//TESTING/
  deudaTest:DeudaTest,
  compraTest:CompraTest,
  entradaTest:EntradaTest,
  inventarioTest:InventarioTest,
  proveedorTest:ProveedorTest,
  clienteTest:ClientesTest,
  catalogoTest:CatalogoTest,
  usuarioTest:UsuarioTest,
  proveedor:Proveedor,
  inventario:Inventario

};

export { pages };
