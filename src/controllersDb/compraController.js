const url = "https://ferrecred.com/backend/compras";

export const ComprasGetAll = async () => {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => console.error(error));
};
// GET por ID
export const ComprasGetByFolio = async (id) => {
  return fetch(`${url}/${id}`, {
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
export const ComprasGetByCliente = async (id) => {
  return fetch(`${url}/cliente/${id}`, {
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
      console.log(`${id}`);
      console.error("Error:", error);
      throw error;
    });
};

export const ComprasGetDeuda = async (id) => {
  return fetch(`${url}/deuda/${id}`, {
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

export const ComprasPost = async (data) => {
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
        console.log("La compra a agregado exitosamente");
      } else {
        console.log("Hubo un error al actualizar los datos.");
      }
    })
    .catch((error) => console.error("Error:", error));
};
export const ComprasUpdateDeuda = async (data) => {
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
        console.log("La compra a agregado exitosamente");
      } else {
        console.log("Hubo un error al actualizar los datos.");
      }
    })
    .catch((error) => console.error("Error:", error));
};
