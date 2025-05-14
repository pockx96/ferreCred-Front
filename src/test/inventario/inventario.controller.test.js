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

describe("getDialogElementsEdit", () => {
  it("should return dialog elements", () => {
    const result = getDialogElementsEdit();
    expect(result).toEqual({
      dialogEditar: expect.any(HTMLDialogElement),
      lblEditarCantidad: expect.any(HTMLLabelElement),
      inputCodigo: expect.any(HTMLInputElement),
      descripcionProducto: expect.any(HTMLInputElement),
      cantidadProducto: expect.any(HTMLInputElement),
      btnActualizar: expect.any(HTMLButtonElement),
      btnClose: expect.any(HTMLButtonElement),
    });
  });
});
