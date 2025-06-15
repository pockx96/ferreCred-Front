const url = `${Cypress.env("DEPLOY_URL")}/#/usuarios`;

describe("Formulario de nuevo cliente", () => {
  beforeEach(() => {
    cy.visit(url);
    cy.viewport(1480, 720);
    cy.get("#Lbl-crear-cliente").click(); // Abre el modal de nuevo proveedor
  });

  it("Debe rechazar campos vacíos", () => {
    cy.get("#btn-cliente").click();
    cy.on("window:alert", (str) => {
      expect(str).to.include("Por favor, completa todos los campos."); // Ajusta el mensaje si es diferente
    });
  });

  it("Debe validar formato de correo electrónico", () => {
    cy.get("#input-nombre").type("Laura López");
    cy.get("#input-correo").type("correo-no-valido");
    cy.get("#input-direccion").type("Calle Falsa 123");
    cy.get("#input-telefono").type("6641234567");
    cy.get("#input-limite").type("10000");

    cy.get("#btn-cliente").click();
    cy.on("window:alert", (str) => {
      expect(str).to.include(
        "El correo electrónico no tiene un formato válido."
      ); // Ajusta si tu función lanza algo distinto
    });
  });

  it("Debe rechazar letras en campo de teléfono", () => {
    cy.get("#input-nombre").type("Laura López");
    cy.get("#input-correo").type("laura@example.com");
    cy.get("#input-direccion").type("Calle Falsa 123");
    cy.get("#input-telefono").type("abc123xyz");
    cy.get("#input-limite").type("10000");

    cy.get("#btn-cliente").click();
    cy.on("window:alert", (str) => {
      expect(str).to.include(
        "El número de teléfono no tiene un formato válido. Debe contener 10 dígitos."
      ); // Ajusta según tus validaciones
    });
  });

  it("Debe rechazar el correo repetido", () => {
    cy.get("#input-nombre").type("Laura López");
    cy.get("#input-correo").type("laura@example.com");
    cy.get("#input-direccion").type("Calle Falsa 123");
    cy.get("#input-telefono").type("6641234567");
    cy.get("#input-limite").type("10000");

    cy.get("#btn-cliente").click();
    cy.on("window:alert", (str) => {
      expect(str).to.include("Ya existe un cliente con ese correo."); // Ajusta según tus validaciones
    });
  });

  it("Debe aceptar datos válidos y mostrar confirmación", () => {
    const timestamp = Date.now(); // O también podrías usar Math.floor(Math.random() * 1000000)
    const uniqueEmail = `laura${timestamp}@example.com`;

    cy.intercept("POST", "**/clientes").as("postClientes");

    cy.get("#input-nombre").type("Laura López");
    cy.get("#input-correo").type(uniqueEmail);
    cy.get("#input-direccion").type("Calle Falsa 123");
    cy.get("#input-telefono").type("6641234567");
    cy.get("#input-limite").type("10000");

    cy.get("#btn-cliente").click();

    cy.on("window:alert", (str) => {
      expect(str).to.include("Nuevo cliente agregado");
    });

    cy.wait("@postClientes")
      .its("request.body")
      .should((body) => {
        expect(body).to.include({
          nombreCliente: "Laura López",
          direccion: "Calle Falsa 123",
          correoCliente: uniqueEmail,
          telefono: "6641234567",
          limiteCredito: "10000",
          saldoActual: "0",
        });
      });
  });
});
