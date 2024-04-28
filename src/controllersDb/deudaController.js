const url = 'https://cristopherdev.com/backend/deuda';


export const getAll = async () => {
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => console.error(error));
};
// GET por ID
export const getByFolio = async (id) => {
    return fetch(`${url}/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data =>{
            console.log("deuda encontrado");
            console.log(data);
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}

export const getByCliente = async (id) => {
    return fetch(`${url}/${id}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data =>{
            console.log(urlc);
            console.log("deuda encontrado");
            console.log(typeof(data));
            console.log(data);
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}



export const post = async (data) => {
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
                console.log('la deuda ah sido agregado exitosamente');
            } else {
                console.log('Hubo un error al actualizar los datos.');
            }
        })
        .catch(error => console.error('Error:', error));
}

export const DeudaUpdate = async (data) => {
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
                console.log('la deuda ah sido actualizada exitosamente');
            } else {
                console.log('Hubo un error al actualizar los datos.');
            }
        })
        .catch(error => console.error('Error:', error));
}


