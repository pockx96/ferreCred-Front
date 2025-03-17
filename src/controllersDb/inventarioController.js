const url = "https://www.cristopherdev.com/backend/inventario";

export const getAll = async () => {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => console.error(error));
};
// GET por ID
export const InventarioGetByCodigo = async (id) => {
  return fetch(`${url}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(`${url}/${id}`);
      console.log("producto encontrado en inventario");
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
};

export const EditarInventario = async (data) => {
  const opciones = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  console.log(data);
  try {
    const response = await fetch(url, opciones);
    if (response.ok) {
      console.log("El inventario ha sido actualizado exitosamente.");
    } else {
      console.error("Hubo un error al actualizar los datos.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

