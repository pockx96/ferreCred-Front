const url = 'https://cristopherdev.com/backend/inventario';


export const getAll = async () => {
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return data;
        })
        .catch(error => console.error(error));
};
// GET por ID
export const InventarioGetByCodigo = async (id) => {
    return fetch(`${url}/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data =>{
            console.log(`${url}/${id}`);
            console.log("producto encontrado en inventario");
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}



export const SumaInventario = async (data) => {
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
                console.log('el inventario a sido sumado exitosamente');
            } else {
                console.log('Hubo un error al actualizar los datos.');
            }
        })
        .catch(error => console.error('Error:', error));
}

export const RestaInventario = async (data) => {
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
                console.log('se a restado del inventario exitosamente');
            } else {
                console.log('Hubo un error al actualizar los datos.');
            }
        })
        .catch(error => console.error('Error:', error));
}
