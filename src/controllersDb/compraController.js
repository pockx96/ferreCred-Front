const url = 'http://localhost/EasyCredit-Backend/productos';


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
    return fetch(`http://localhost/EasyCredit-Backend/productos/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data =>{
            console.log("producto encontrado");
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
                console.log('el usuario ah sido agregado exitosamente');
            } else {
                console.log('Hubo un error al actualizar los datos.');
            }
        })
        .catch(error => console.error('Error:', error));
}


