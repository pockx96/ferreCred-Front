const url = 'https://ferrecred.com/api/clientes';


export const ClientesGetAll = async () => {
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => console.error(error));
};
// GET por ID
export const ClientesGetByCorreo = async (id) => {
    return fetch(`${url}/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data =>{
            console.log("clientes encontrado");
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}



export const postClientes = async (data) => {
    const opciones = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch(url, opciones)
        .then(response => {
            if (response.ok) {
                console.log('el client ah sido agregado exitosamente');
            } else {
                console.log('Hubo un error al actualizar los datos.');
            }
        })
        .catch(error => console.error('Error:', error));
}

export const putUsuarios = async (data) => {
    const opciones = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch(url, opciones)
        .then(response => {
            if (response.ok) {
                console.log('el usuario ah sido actualizado exitosamente');
            } else {
                console.log('Hubo un error al actualizar los datos.');
            }
        })
        .catch(error => console.error('Error:', error));
}


// DELETE
export const deleteUsuario = async (data) => {
    return fetch(`https://cristopherdev.com/backend/usuarios`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                console.log('el usuario ah sido eliminado exitosamente');
            } else {
                console.log('Hubo un error al actualizar los datos.');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}
