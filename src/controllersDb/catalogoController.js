const url = "https://www.cristopherdev.com/backend/catalogo";

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
  console.log("Datos enviados:", data);
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
        console.log("El producto ha sido agregado correctamente");
      } else {
        console.log(`Hubo un error al actualizar los datos. ${response.json}`);
      }
    })
    .catch((error) => console.error("Error:", error));
};

export const EditCantidad = async (data) => {
  const opciones = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch(
    `https://www.cristopherdev.com/backend/catalogo/cantidad/${data.codigo}`,
    opciones
  )
    .then((response) => {
      if (response.ok) {
        console.log("el producto a sido actualizado exitosamente");
      } else {
        console.log("Hubo un error al actualizar los datos.");
      }
    })
    .catch((error) => console.error("Error:", error));
};

export const EditProducto = async (data) => {
  const opciones = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch(
    `https://www.cristopherdev.com/backend/catalogo/${data.codigo}`,
    opciones
  )
    .then((response) => {
      if (response.ok) {
        console.log("el producto a sido actualizado exitosamente");
      } else {
        console.log("Hubo un error al actualizar los datos.");
      }
    })
    .catch((error) => console.error("Error:", error));
};
