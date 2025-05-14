module.exports = {
  transform: {
    // Usar babel-jest para .js/.jsx (o .ts/.tsx si usas TS)
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  testEnvironment: "jsdom", // Entorno de navegador simulado (DOM)
  setupFilesAfterEnv: ["<rootDir>/src/test/setupTests.js"], // Carga jest-dom
  moduleFileExtensions: ["js", "jsx", "json", "node"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy", // para mocks de estilos
    "\\.html$": "<rootDir>/__mocks__/htmlMock.js", // para mocks de HTML
  },
  // Puedes agregar moduleNameMapper aquí si usas alias de Webpack o estilos CSS
};
