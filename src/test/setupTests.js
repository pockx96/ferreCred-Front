import "@testing-library/jest-dom";

global.API_URL = "http://localhost:80/ferreCred-Backend/";
global.USER_NAME = "ana@example.com";

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  value: () => {
    // Retornamos un objeto vacío fingiendo que tenemos un contexto canvas
    return {
      fillRect: () => {},
      clearRect: () => {},
      getImageData: () => ({ data: [] }),
      putImageData: () => {},
      createImageData: () => [],
      setTransform: () => {},
      drawImage: () => {},
      save: () => {},
      fillText: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      stroke: () => {},
      translate: () => {},
      scale: () => {},
      rotate: () => {},
      arc: () => {},
      fill: () => {},
      measureText: () => ({ width: 0 }),
      transform: () => {},
      rect: () => {},
      clip: () => {},
    };
  },
});
