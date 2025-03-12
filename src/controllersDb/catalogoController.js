const url = "https://ferrecred.com/backend/catalogo";

export const getAll = async () => {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const catalogo = data.map((producto) => {
        return {
          codigo: producto.codigo,
          descripcion: producto.descripcion,
        };
      });
      return catalogo;
    })
    .catch((error) => console.error(error));
};
// GET por ID
export const getByCodigo = async (id) => {
  return fetch(`https://cristopherdev.com/backend/catalogo/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("producto encontrado");
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
};

export const ProductoPost = async (data) => {
  const opciones = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch(url, opciones)
    .then((response) => {
      if (response.ok) {
        console.log("el usuario ah sido agregado exitosamente");
      } else {
        console.log("Hubo un error al actualizar los datos.");
      }
    })
    .catch((error) => console.error("Error:", error));
};

export const put = async (data) => {
  const opciones = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch(url, opciones)
    .then((response) => {
      if (response.ok) {
        console.log("el usuario ah sido agregado exitosamente");
      } else {
        console.log("Hubo un error al actualizar los datos.");
      }
    })
    .catch((error) => console.error("Error:", error));
};
