import view from "../view/Carrito.html";
import {
  getAll,
  getByCodigo,
  EditCantidad,
} from "../controllersDb/catalogoController";
import { ProductoPost } from "../controllersDb/productoController";
import { ComprasPost } from "../controllersDb/compraController";
import { BitacoraPost } from "../controllersDb/bitacoraController";
import { ClientesGetAll } from "../controllersDb/clientesController";
import _ from "lodash";

const divElement = document.createElement("div");
divElement.innerHTML = view;
const searchContainer = divElement.querySelector(".search-input-box");
const inputSearch = searchContainer.querySelector("input");
const boxSuggestions = divElement.querySelector(".container-suggestions");
const LblProducto = divElement.querySelector("#Lbl-Producto");
const inputCodigo = divElement.querySelector("#input-codigo");
let fila;
const tabla = divElement.querySelector("#table-body");
let suggestions = [];
let Cliente = "venta de contado";
let metodoDePago = "";
var TotalCount;
const etiquetaTotal = divElement.querySelector("#total-label");

function sumarImporte() {
  const celdasImporte = document.querySelectorAll(
    "#table-body td:nth-child(6)"
  );
  // Iterar sobre cada celda y obtener el valor de su texto
  let total = 0;
  celdasImporte.forEach((celda) => {
    const importe = parseFloat(celda.textContent);
    if (!isNaN(importe)) {
      total += importe;
    }
  });

  // Actualizar la etiqueta con el valor total
  etiquetaTotal.textContent = total.toLocaleString("es-ES", {
    style: "currency",
    currency: "MXN",
  });
  TotalCount = total;
}

function loadCatalogo() {
  getAll().then((nombres) => {
    suggestions = nombres;
  });
}
function empycellsTable() {
  var rowCount = tabla.getElementsByTagName("tr").length;
  var emptyRowsNeeded = 5 - rowCount;
  if (rowCount === 0) {
    for (var i = 0; i < emptyRowsNeeded; i++) {
      var row = document.createElement("tr");
      row.innerHTML = "<td>&nbsp;</td>".repeat(7); // Agregar celdas vacías para cada columna
      tabla.appendChild(row);
    }
  }
}

const addRow = (producto) => {
  const importe = (producto.precio_venta * 1.16).toFixed(2);
  const totalRows = tabla.rows.length;

  const newRow = document.createElement("tr");
  const celdaCodigo = document.createElement("td");
  const celdaDescripcion = document.createElement("td");
  const celdaCantidad = document.createElement("td");
  const celdaTipo = document.createElement("td");
  const celdaPrecio = document.createElement("td");
  const celdaImporte = document.createElement("td");
  const celdaBoton = document.createElement("td");
  celdaBoton.style.textAlign = "center";
  const button = document.createElement("button");
  button.classList.add("btn", "btn-danger");
  celdaCodigo.innerHTML = producto.codigo;
  celdaDescripcion.innerHTML = producto.descripcion;
  celdaCantidad.innerHTML = "1";
  celdaTipo.innerHTML = producto.tipo;
  celdaPrecio.innerHTML = producto.precio_venta;
  celdaImporte.innerHTML = importe;
  button.innerHTML = "Eliminar";

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
  newRow.appendChild(celdaTipo);
  newRow.appendChild(celdaPrecio);
  newRow.appendChild(celdaImporte);
  newRow.appendChild(celdaBoton);

  const tableBody = document.getElementById("table-body");
  if (totalRows > 0) {
    tableBody.insertBefore(newRow, tableBody.childNodes[0]);
  } else {
    tableBody.appendChild(newRow);
  }

  const emptyRowsNeeded = Math.max(0, 6 - totalRows - 1);
  for (let i = 0; i < emptyRowsNeeded; i++) {
    const emptyRow = document.createElement("tr");
    for (let j = 0; j < 6; j++) {
      const emptyCell = document.createElement("td");
      emptyCell.innerHTML = "&nbsp;";
      emptyRow.appendChild(emptyCell);
    }
    tableBody.appendChild(emptyRow);
  }

  newRow.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest",
  });
  celdaCantidad.focus();
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
  const objetosFilas = tablaArray.map((fila) => {
    const objetoFila = {};
    const columnas = fila.cells;
    objetoFila.codigo = parseInt(columnas[0].textContent.trim());
    objetoFila.descripcion = columnas[1].textContent.trim();
    objetoFila.cantidad = parseInt(columnas[2].textContent.trim());
    objetoFila.tipo = columnas[3].textContent.trim();
    objetoFila.importe = parseFloat(columnas[5].textContent.trim());
    if (
      !isNaN(objetoFila.codigo) &&
      !isNaN(objetoFila.cantidad) &&
      !isNaN(objetoFila.importe) &&
      objetoFila.tipo !== ""
    ) {
      return objetoFila;
    } else {
      return null;
    }
  });

  // Filtrar valores nulos para obtener solo las filas válidas
  //console.log(objetosFilas.filter((fila) => fila !== null));
  return objetosFilas.filter((fila) => fila !== null);
};

async function BitacoraAdd() {
  const listaProducto = obtenerProductos();
  const catalogo = await getAll();
  const catalogoIndexado = _.keyBy(catalogo, "codigo");
  const bitacoraList = _.map(listaProducto, (item) => {
    const inventarioReal = catalogoIndexado[item.codigo];
    return {
      Usuario: "ana@example.com",
      Operacion: "Venta",
      Producto: item.descripcion,
      Codigo: item.codigo,
      Cantidad: item.cantidad,
      Inventario_Actual: inventarioReal
        ? inventarioReal.cantidad - item.cantidad
        : 0,
    };
  });

  bitacoraList.forEach((item) => {
    BitacoraPost(item);
  });
}

const confirmarCompra = async () => {
  const lblCliente = divElement.querySelector("#Lbl-cliente");
  const confirmado = window.confirm("¿Está seguro de confirmar la compra?");
  if (confirmado) {
    const compra = {
      cliente: Cliente,
      tipo_nota: metodoDePago,
      deuda: TotalCount,
      total: TotalCount,
    };
    await ComprasPost(compra); // también deberías esperar aquí

    try {
      const productosCatalogo = await getAll();
      const productoList = obtenerProductos();

      for (const producto of productoList) {
        const productoFind = productosCatalogo.find(
          (item) => item.codigo === producto.codigo
        );

        if (productoFind) {
          const cantidadActual = productoFind.cantidad;
          const produtoInventario = {
            codigo: producto.codigo,
            cantidad: cantidadActual - producto.cantidad,
          };

          console.log("Código del producto:", produtoInventario.codigo);
          console.log("Cantidad ajustada:", produtoInventario.cantidad);

          await EditCantidad(produtoInventario);
          await ProductoPost(produtoInventario);

          Cliente = "venta de contado";
          lblCliente.textContent = "";
        } else {
          console.warn(
            `Producto con código ${producto.codigo} no encontrado en el catálogo`
          );
        }
      }

      await BitacoraAdd();
    } catch (error) {
      console.error("Error al procesar los productos:", error);
    }

    ClearTable();
  }
};

async function select(element) {
  const codigo = element.textContent.split("-")[0].trim();
  const producto = await getByCodigo(codigo);
  const btnConfirmar = divElement.querySelector("#confirmar");
  if (producto.cantidad > 0) {
    LblProducto.innerText = `Codigo.${producto.codigo} - ${producto.descripcion}`;
    addRow(producto);
    sumarImporte();
    inputSearch.value = "";
    btnConfirmar.disabled = false;
    btnConfirmar.classList.remove("!bg-slate-500");
  } else {
    alert("produco agotado");
  }
  searchContainer.classList.remove("active");
}

function Search() {
  window.select = select;
  inputSearch.onkeyup = (e) => {
    let userData = e.target.value;
    let emptyArray = [];

    if (userData) {
      emptyArray = suggestions.filter((producto) => {
        const regex = new RegExp(userData, "gi");
        return producto.descripcion.match(regex);
      });

      emptyArray = emptyArray.map((data) => {
        return (data = `<li>${data.codigo} - ${data.descripcion}</li>`);
      });
      searchContainer.classList.add("active");
      showSuggestions(emptyArray);

      let allList = boxSuggestions.querySelectorAll("li");

      allList.forEach((li) => {
        li.setAttribute("onclick", "select(this)");
      });
    } else {
      searchContainer.classList.remove("active");
    }
  };
}

const showSuggestions = (list) => {
  let listData;

  if (!list.length) {
    const userValue = inputSearch.value;
    listData = `<li>${userValue}</li>`;
  } else {
    listData = list.join(" ");
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
      const cantidadActual = await getByCodigo(codigo);
      if (cantidad <= cantidadActual.cantidad) {
        const precio = parseFloat(fila.cells[4].innerText);
        const importe = (cantidad * precio * 1.16).toFixed(2);
        fila.cells[5].innerText = importe;
        sumarImporte();
        fila.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
        inputCodigo.focus();
      } else {
        alert(
          `Cantidad insuficiente en inventario - cantidad disponible: ${cantidadActual.cantidad}`
        );
        celdaCantidad.innerText = "";
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
      fila.cells[3].innerText = producto.tipo;
      fila.cells[4].innerText = producto.precio_venta;
      fila.cells[5].innerText = (producto.precio_venta * 1.16).toFixed(2);
      fila.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  });
}
function CodigoCaptura() {
  const btnConfirmar = divElement.querySelector("#confirmar");
  inputCodigo.addEventListener("keydown", async (event) => {
    if (event.keyCode === 13 && event.target === inputCodigo) {
      event.preventDefault();
      const codigo = inputCodigo.value;
      const producto = await getByCodigo(codigo);
      addRow(producto);
      sumarImporte();
      inputCodigo.value = "";
      btnConfirmar.classList.remove("!bg-slate-500");
      btnConfirmar.disabled = false;
    }
  });
}

function ClearTable() {
  const tableBody = divElement.querySelector("#table-body");
  tableBody.innerHTML = ``;
  for (let i = 0; i < 7; i++) {
    const emptyRow = document.createElement("tr");
    for (let j = 0; j < 6; j++) {
      const emptyCell = document.createElement("td");
      emptyCell.innerHTML = "&nbsp;";
      emptyRow.appendChild(emptyCell);
    }
    tableBody.appendChild(emptyRow);
  }
  etiquetaTotal.textContent = "";
  LblProducto.textContent = "";
}

async function nuevoCliente() {
  const newProduct = divElement.querySelector("#LblCrear");
  const newProductDialog = divElement.querySelector("#select-client-dialog");
  newProduct.addEventListener("click", () => {
    if (!newProductDialog.open) {
      // Verificar si el cuadro de diálogo está cerrado
      newProductDialog.showModal();
      newProductDialog.style.visibility = "visible";
    }
  });
  // Agregar evento de submit al formulario del cuadro de diálogo
  divElement.querySelector("#close").addEventListener("click", (event) => {
    newProductDialog.style.visibility = "hidden";
    newProductDialog.close();
  });
  const comboBox = divElement.querySelector("#combo-box");
  const ListaClientes = await ClientesGetAll();
  console.log(ListaClientes);
  ListaClientes.forEach((Cliente) => {
    const optionElement = document.createElement("option");
    optionElement.textContent = Cliente.nombreCliente;
    optionElement.value = Cliente.nombreCliente;
    comboBox.appendChild(optionElement);
  });
}

function SelectNuevoCliente() {
  const newProductDialog = divElement.querySelector("#select-client-dialog");
  const comboBox = divElement.querySelector("#combo-box");
  const btnCliete = divElement.querySelector("#btn-cliente");
  const lblCliente = divElement.querySelector("#Lbl-cliente");
  btnCliete.addEventListener("click", () => {
    const value = comboBox.value;
    Cliente = value;
    lblCliente.innerText = `Cli. ${value}`;
    newProductDialog.style.visibility = "hidden";
    newProductDialog.close();
  });
}

function btnEliminar() {
  const btnEliminar = divElement.querySelector("#eliminar");
  btnEliminar.addEventListener("click", () => {
    const confirmado = window.confirm(
      "¿Está seguro de eliminar todos los productos?"
    );
    if (confirmado) {
      ClearTable();
    }
  });
}

function metodoPago() {
  const btnConfirmar = divElement.querySelector("#confirmar");
  const btnPagar = divElement.querySelector("#btnPay");
  const dialogMetodPay = divElement.querySelector("#select-pay-dialog");
  const btnClose = divElement.querySelector("#close-pay");
  const btnEfectivo = divElement.querySelector("#btnEfectivo");
  const btnDebito = divElement.querySelector("#BtnDebito");
  const btnCredito = divElement.querySelector("#BtnCredito");
  const btnDolares = divElement.querySelector("#BtnDolares");
  const btnAddPay = divElement.querySelector("#btnAddPay");
  const lblSubtotal = divElement.querySelector("#lblSubtotal");
  const lblPago = divElement.querySelector("#lblPago");
  const lblTotal = divElement.querySelector("#lblTotal");
  const lblTitleTotal = divElement.querySelector("#lblTitleTotal");
  var inputPago = divElement.querySelector("#inputPay");
  let pago = 0;
  let isMethodPay = false;

  lblTotal.toLocaleString("es-ES", {
    style: "currency",
    currency: "MXN",
  });

  btnPagar.disabled = true;
  btnPagar.classList.add("!bg-slate-500");

  function clearDialog() {
    inputPago.textContent = "";
    btnEfectivo.classList.remove("bg-orange-800");
    btnDolares.classList.remove("bg-orange-800");
    btnCredito.classList.remove("bg-orange-800");
    btnDebito.classList.remove("bg-orange-800");
  }

  dialogMetodPay.showModal();
  dialogMetodPay.style.visibility = "visible";
  lblSubtotal.textContent = TotalCount.toLocaleString("es-ES", {
    style: "currency",
    currency: "MXN",
  });
  lblTotal.textContent = TotalCount.toLocaleString("es-ES", {
    style: "currency",
    currency: "MXN",
  });

  btnClose.addEventListener("click", () => {
    dialogMetodPay.style.visibility = "hidden";
    dialogMetodPay.close();
  });

  btnEfectivo.addEventListener("click", () => {
    metodoDePago += " | Efectivo";
    btnEfectivo.classList.add("bg-orange-800");
    btnDebito.classList.remove("bg-orange-800");
    btnDolares.classList.remove("bg-orange-800");
    btnCredito.classList.remove("bg-orange-800");
    isMethodPay = true;
  });

  btnDebito.addEventListener("click", () => {
    metodoDePago += " | Débito";
    btnDebito.classList.add("bg-orange-800");
    btnCredito.classList.remove("bg-orange-800");
    btnEfectivo.classList.remove("bg-orange-800");
    btnDolares.classList.remove("bg-orange-800");
    isMethodPay = true;
  });

  btnCredito.addEventListener("click", () => {
    metodoDePago += " | Crédito";
    btnCredito.classList.add("bg-orange-800");
    btnEfectivo.classList.remove("bg-orange-800");
    btnDebito.classList.remove("bg-orange-800");
    btnDolares.classList.remove("bg-orange-800");
    isMethodPay = true;
  });

  btnDolares.addEventListener("click", () => {
    metodoDePago += " | Dólares";
    btnDolares.classList.add("bg-orange-800");
    btnEfectivo.classList.remove("bg-orange-800");
    btnDebito.classList.remove("bg-orange-800");
    btnCredito.classList.remove("bg-orange-800");
    isMethodPay = true;
  });

  btnAddPay.addEventListener("click", () => {
    const cantidad = inputPago.value;
    if (cantidad === "") {
      alert("Por favor, completa todos los campos.");
      return false;
    }
    if (isNaN(parseFloat(cantidad))) {
      alert("Los precios deben ser valores numéricos.");
      return false;
    }
    if (!isMethodPay) {
      alert("seleccione al menos un metodo de pago");
      return false;
    } else {
      btnAddPay.disabled = false;
      lblSubtotal.textContent = TotalCount.toLocaleString("es-ES", {
        style: "currency",
        currency: "MXN",
      });

      lblPago.textContent = cantidad.toLocaleString("es-ES", {
        style: "currency",
        currency: "MXN",
      });
      if (cantidad >= TotalCount) {
        btnPagar.classList.remove("!bg-slate-500");
        btnPagar.disabled = false;
        const cambio = Math.abs(TotalCount - cantidad);
        lblTotal.textContent = cambio.toLocaleString("es-ES", {
          style: "currency",
          currency: "MXN",
        });
        lblTitleTotal.textContent = "Cambio";
      } else {
        lblTotal.textContent = (TotalCount - cantidad).toLocaleString("es-ES", {
          style: "currency",
          currency: "MXN",
        });
      }
    }
  });

  btnPagar.addEventListener("click", () => {
    confirmarCompra();
    dialogMetodPay.visibility = "hidden";
    dialogMetodPay.close();
    btnConfirmar.disabled = true;
    btnConfirmar.classList.add("!bg-slate-500");
  });
}

function contadoCreditoValidation() {
  const btnConfirmar = divElement.querySelector("#confirmar");
  btnConfirmar.disabled = true;
  btnConfirmar.classList.add("!bg-slate-500");

  btnConfirmar.addEventListener("click", () => {
    if (Cliente != "venta de contado") {
      confirmarCompra();
      btnConfirmar.disabled = true;
      btnConfirmar.classList.add("!bg-slate-500");
    } else {
      metodoPago();
    }
  });
}

export default () => {
  loadCatalogo();
  Search();
  CantidadCaptura();
  CodigoCapturaCelda();
  CodigoCaptura();
  nuevoCliente();
  SelectNuevoCliente();
  empycellsTable();
  btnEliminar();
  contadoCreditoValidation();

  return divElement;
};
