import { buildBitacoraEntry } from "../../utils/bitacoraUtils";
jest.mock("../../controllers/Entradas.controller", () => ({}));

const productoMock = {
  codigo: 101,
  descripcion: "Cafetera Vintage",
  precio_compra: 500,
  precio_venta: 850,
  tipo: "Electrodoméstico",
  cantidad: 10,
};

const operacionMock = "Agregar Inventario";

const expectedBitacoraOutput = {
  Usuario: "ana@example.com",
  Codigo: 101,
  Producto: "Cafetera Vintage",
  Cantidad: 10,
  Operacion: "Agregar Inventario",
  Inventario_Actual: 10,
};

describe("buildBitacoraEntry", () => {
  test("debería estructurar correctamente el objeto", () => {
    expect(buildBitacoraEntry(productoMock, operacionMock)).toStrictEqual(
      expectedBitacoraOutput
    );
  });

  test("debería manejar cantidad 0 correctamente", () => {
    const productoConCero = { ...productoMock, cantidad: 0 };
    const expected = {
      ...expectedBitacoraOutput,
      Cantidad: 0,
      Inventario_Actual: 0,
    };
    expect(buildBitacoraEntry(productoConCero, operacionMock)).toStrictEqual(
      expected
    );
  });

  test("debería manejar caracteres especiales en la descripción", () => {
    const productoConSimbolos = {
      ...productoMock,
      descripcion: "Café ☕✨ #1",
    };
    const expected = { ...expectedBitacoraOutput, Producto: "Café ☕✨ #1" };
    expect(
      buildBitacoraEntry(productoConSimbolos, operacionMock)
    ).toStrictEqual(expected);
  });

  test("debería manejar operación vacía", () => {
    const expected = { ...expectedBitacoraOutput, Operacion: "" };
    expect(buildBitacoraEntry(productoMock, "")).toStrictEqual(expected);
  });

  test("debería manejar producto sin descripción", () => {
    const productoSinDescripcion = { ...productoMock };
    delete productoSinDescripcion.descripcion;
    const expected = {
      ...expectedBitacoraOutput,
      Producto: undefined,
    };
    expect(
      buildBitacoraEntry(productoSinDescripcion, operacionMock)
    ).toStrictEqual(expected);
  });

  test("debería lanzar error si producto es null", () => {
    expect(() => buildBitacoraEntry(null, operacionMock)).toThrow();
  });

  test("debería estructurar aunque el código sea string", () => {
    const productoCodigoString = { ...productoMock, codigo: "101" };
    const expected = { ...expectedBitacoraOutput, Codigo: "101" };
    expect(
      buildBitacoraEntry(productoCodigoString, operacionMock)
    ).toStrictEqual(expected);
  });
});
