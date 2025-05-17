describe("Formulario de nuevo producto", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/#/inventario");
    // Cambia a tu ruta real si es necesario
    cy.get("#Lbl-crear-producto").click(); // Abre el modal
  });

  it("Debe rechazar campos vacíos", () => {
    cy.get("#btn-edit").click();
    cy.on("window:alert", (str) => {
      expect(str).to.include("completa todos los campos");
    });
  });

  it("Debe rechazar texto en los campos de precio", () => {
    const randomCode = Math.floor(Math.random() * 100000);
    cy.intercept("GET", `**/catalogo/${randomCode}`, {
      statusCode: 404,
      body: {},
    }).as("getProducto");

    cy.get("#input-codigo").type(randomCode, toString());
    cy.get("#input-descripcion").type("Test");
    cy.get("#input-precio-compra").type("aaa");
    cy.get("#input-precio-venta").type("aaa");
    cy.get("#input-tipo").select("Pieza");
    cy.get("#input-cantidad").type("10");

    cy.get("#btn-edit").click();

    cy.wait("@getProducto");
    cy.on("window:alert", (str) => {
      expect(str).to.include("La cantidad debe ser numérica.");
    });
  });

  it("Debe rechazar texto en los campos de cantidad", () => {
    const randomCode = Math.floor(Math.random() * 100000);
    cy.intercept("GET", `**/catalogo/${randomCode}`, {
      statusCode: 404,
      body: {},
    }).as("getProducto");

    cy.get("#input-codigo").type(randomCode, toString());
    cy.get("#input-descripcion").type("Test");
    cy.get("#input-precio-compra").type("100");
    cy.get("#input-precio-venta").type("150");
    cy.get("#input-tipo").select("Pieza");
    cy.get("#input-cantidad").type("aaa");

    cy.get("#btn-edit").click();

    cy.wait("@getProducto");
    cy.on("window:alert", (str) => {
      expect(str).to.include("Los precios deben ser valores numéricos.");
    });
  });

  it("Debe rechazar texto en el campo de código", () => {
    cy.get("#input-codigo").type("aaa");
    cy.get("#input-descripcion").type("Test");
    cy.get("#input-precio-compra").type("100");
    cy.get("#input-precio-venta").type("150");
    cy.get("#input-tipo").select("Pieza");
    cy.get("#input-cantidad").type("10");

    cy.get("#btn-edit").click();

    cy.on("window:alert", (str) => {
      expect(str).to.include("El código debe contener solo valores numéricos.");
    });
  });

  it("Debe validar código duplicado", () => {
    cy.intercept("GET", "**/catalogo/111", {
      statusCode: 200,
      body: { codigo: 111 },
    }).as("getProducto");

    cy.get("#input-codigo").type("111");
    cy.get("#input-descripcion").type("Test");
    cy.get("#input-precio-compra").type("100");
    cy.get("#input-precio-venta").type("150");
    cy.get("#input-tipo").select("Pieza");
    cy.get("#input-cantidad").type("10");

    cy.get("#btn-edit").click();

    cy.wait("@getProducto");
    cy.on("window:alert", (str) => {
      expect(str).to.include("El código ya existe.");
    });
  });

  it("Debe aceptar datos válidos y enviarlos correctamente", () => {
    const randomCode = Math.floor(Math.random() * 100000); // Código único para evitar duplicados

    // Simulamos que NO existe el producto con ese código
    cy.intercept("GET", `**/catalogo/${randomCode}`, {
      statusCode: 404,
      body: {},
    }).as("getProducto");

    // Interceptamos el POST para validar que se está enviando el producto correctamente
    cy.intercept("POST", "**/catalogo", (req) => {
      expect(req.body).to.have.property("codigo", randomCode);
      expect(req.body).to.include.all.keys([
        "codigo",
        "descripcion",
        "precio_compra",
        "precio_venta",
        "tipo",
        "cantidad",
      ]);
    }).as("postProducto");

    // Llenado de formulario
    cy.get("#input-codigo").type(randomCode.toString());
    cy.get("#input-descripcion").type("Producto nuevo");
    cy.get("#input-precio-compra").type("50");
    cy.get("#input-precio-venta").type("75");
    cy.get("#input-tipo").select("Litro");
    cy.get("#input-cantidad").type("20");

    // Enviar formulario
    cy.get("#btn-edit").click();

    // Esperamos a que se valide primero
    cy.wait("@getProducto");

    // Luego esperamos que se envíe
    cy.wait("@postProducto");
  });
});
