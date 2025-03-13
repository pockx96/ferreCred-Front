const url = "https://www.cristopherdev.com/backend/bitacora";

export const BitacoraGetAll = async () => {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => console.error(error));
};
export const BitacoraPost = async (data) => {
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
        console.log("la bicora ah sido actualizada");
      } else {
        console.log("Hubo un error al actualizar los datos.");
      }
    })
    .catch((error) => console.error("Error:", error));
};
