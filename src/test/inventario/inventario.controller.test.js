import { getDialogElementsEdit } from "../../controllers/inventario.controller.js";

jest.mock("../../controllers/inventario.controller", () => ({
  getDialogElementsEdit: jest.fn(() => ({
    dialogEditar: document.createElement("dialog"),
    lblEditarCantidad: document.createElement("label"),
    inputCodigo: document.createElement("input"),
    descripcionProducto: document.createElement("input"),
    cantidadProducto: document.createElement("input"),
    btnActualizar: document.createElement("button"),
    btnClose: document.createElement("button"),
  })),
}));





