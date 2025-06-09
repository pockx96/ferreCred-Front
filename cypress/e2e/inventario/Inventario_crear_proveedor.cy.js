describe("Formulario de nuevo proveedor", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/#/inventario");
    cy.viewport(1480, 720);
    cy.get("#Lbl-crear-proveedor").click(); // Abre el modal de nuevo proveedor
  });

  it("Debe rechazar campos vacíos", () => {
    cy.get("#btn-provedor").click();
    cy.on("window:alert", (str) => {
      expect(str).to.include("Por favor, completa todos los campos."); // Ajusta el mensaje si es diferente
    });
  });

  it("Debe validar formato de correo electrónico", () => {
    cy.get("#input-empresa").type("TechCorp");
    cy.get("#input-nombre").type("Laura López");
    cy.get("#input-correo").type("correo-no-valido");
    cy.get("#input-direccion").type("Calle Falsa 123");
    cy.get("#input-telefono").type("6641234567");
    cy.get("#input-rfc").type("XAXX010101000");

    cy.get("#btn-provedor").click();
    cy.on("window:alert", (str) => {
      expect(str).to.include(
        "El correo electrónico no tiene un formato válido."
      ); // Ajusta si tu función lanza algo distinto
    });
  });

  it("Debe rechazar letras en campo de teléfono", () => {
    cy.get("#input-empresa").type("TechCorp");
    cy.get("#input-nombre").type("Laura López");
    cy.get("#input-correo").type("laura@example.com");
    cy.get("#input-direccion").type("Calle Falsa 123");
    cy.get("#input-telefono").type("abc123xyz");
    cy.get("#input-rfc").type("XAXX010101000");

    cy.get("#btn-provedor").click();
    cy.on("window:alert", (str) => {
      expect(str).to.include(
        "El número de teléfono no tiene un formato válido. Debe contener 10 dígitos."
      ); // Ajusta según tus validaciones
    });
  });

  it("Debe aceptar datos válidos y mostrar confirmación", () => {
    cy.intercept("POST", "**/proveedores").as("postProveedor");

    cy.get("#input-empresa").type("TechCorp");
    cy.get("#input-nombre").type("Laura López");
    cy.get("#input-correo").type("laura@example.com");
    cy.get("#input-direccion").type("Calle Falsa 123");
    cy.get("#input-telefono").type("6641234567");
    cy.get("#input-rfc").type("XAXX010101000");

    cy.get("#btn-provedor").click();

    cy.on("window:alert", (str) => {
      expect(str).to.include("Nuevo proveedor agregado");
    });

    cy.wait("@postProveedor")
      .its("request.body")
      .should((body) => {
        expect(body).to.include({
          correo_electronico: "laura@example.com",
          nombre_empresa: "TechCorp",
          nombre_contacto: "Laura López",
          direccion: "Calle Falsa 123",
          telefono: "6641234567",
          RFC: "XAXX010101000",
        });
      });
  });
});
