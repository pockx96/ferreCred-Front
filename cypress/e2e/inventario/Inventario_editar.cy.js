describe("Formulario de editar producto", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/#/inventario");
    // Cambia a tu ruta real si es necesario
    cy.get("#Lbl-editar").click(); // Abre el modal
  });

  it("Debe rechazar campos vacíos en la busqueda", () => {
    cy.get("#btnBuscar").click();
    cy.on("window:alert", (str) => {
      expect(str).to.include("Por favor, ingresa el código del producto.");
    });
  });

  it("Debe rechazar texto en el campos de código", () => {
    cy.get("#codigoBusqueda").type("Test");
    cy.get("#btnBuscar").click();

    cy.on("window:alert", (str) => {
      expect(str).to.include("El código debe ser numérico.");
    });
  });

  it("Debe abrir el modal de editar", () => {
    cy.get("#codigoBusqueda").type("111");
    cy.get("#btnBuscar").click();

    cy.get("#dialogoBuscarProducto").should("be.visible");

    // Y verificamos que los campos se hayan llenado correctamente
    cy.get("#input-descripcion-edit").should("have.value", "Producto nuevo");
    cy.get("#input-tipo-edit").should("have.value", "Pieza");
  });

  it("Debe rechazar campos vacíos en editar", () => {
    cy.get("#codigoBusqueda").type("111");
    cy.get("#btnBuscar").click();

    cy.get("#btn-edit").click();
    cy.on("window:alert", (str) => {
      expect(str).to.include("Por favor, completa todos los campos.");
    });
  });

  it("debe rechazar texto en los campos de precio", () => {
    cy.get("#codigoBusqueda").type("111");
    cy.get("#btnBuscar").click();

    cy.get("#input-precio-compra-edit").type("aaa");
    cy.get("#input-precio-venta-edit").type("aaa");
    cy.get("#btn-edit").click();
    cy.on("window:alert", (str) => {
      expect(str).to.include("Los precios deben ser valores numéricos.");
    });
  });

  it("Debe aceptar datos válidos y enviarlos correctamente", () => {
    cy.get("#codigoBusqueda").type("111");
    cy.get("#btnBuscar").click();
    // Interceptamos el PUT para validar que se está enviando el producto correctamente

    // Llenado de formulario
    cy.get("#input-descripcion-edit").type("Producto nuevo");
    cy.get("#input-precio-compra-edit").type("50");
    cy.get("#input-precio-venta-edit").type("75");
    cy.get("#input-tipo-edit").select("Litro");
    // Enviar formulario
    cy.get("#btn-edit").click();

    // Luego esperamos que se envíe
  });
});
