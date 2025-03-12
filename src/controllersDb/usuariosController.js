const url = "https://ferrecred.com/backend/usuarios";

// Función para obtener todos los usuarios
export const getAllUsuarios = async () => {
  return fetch(url) // Realiza una solicitud GET a la URL especificada
    .then((response) => response.json()) // Convierte la respuesta en formato JSON
    .then((data) => {
      return data; // Devuelve los datos obtenidos
    })
    .catch((error) => console.error(error)); // Maneja cualquier error que ocurra durante la solicitud
};

// Función para obtener un usuario por su ID
export const getByIDUsuario = async (id) => {
  return fetch(`https://cristopherdev.com/backend/usuarios/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json()) // Convierte la respuesta en formato JSON
    .then((data) => {
      console.log("Usuario encontrado");
      return data; // Devuelve los datos del usuario encontrado
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error; // Maneja cualquier error que ocurra durante la solicitud
    });
};

// Función para agregar un usuario
export const postUsuarios = async (data) => {
  const opciones = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // Convierte los datos del usuario en formato JSON
  };

  fetch(url, opciones)
    .then((response) => {
      if (response.ok) {
        console.log("El usuario ha sido agregado exitosamente");
      } else {
        console.log("Hubo un error al actualizar los datos.");
      }
    })
    .catch((error) => console.error("Error:", error)); // Maneja cualquier error que ocurra durante la solicitud
};

// Función para actualizar un usuario
export const putUsuarios = async (data) => {
  const opciones = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // Convierte los datos del usuario en formato JSON
  };

  fetch(url, opciones)
    .then((response) => {
      if (response.ok) {
        console.log("El usuario ha sido actualizado exitosamente");
      } else {
        console.log("Hubo un error al actualizar los datos.");
      }
    })
    .catch((error) => console.error("Error:", error)); // Maneja cualquier error que ocurra durante la solicitud
};

// Función para eliminar un usuario
export const deleteUsuario = async (data) => {
  return fetch(`https://cristopherdev.com/backend/usuarios`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // Convierte los datos del usuario en formato JSON
  })
    .then((response) => {
      if (response.ok) {
        console.log("El usuario ha sido eliminado exitosamente");
      } else {
        console.log("Hubo un error al actualizar los datos.");
      }
      return response.json(); // Devuelve los datos de respuesta en formato JSON
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error; // Maneja cualquier error que ocurra durante la solicitud
    });
};
