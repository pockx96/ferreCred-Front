const url = 'https://ferrecred.com/api/productos';


export const ProductogetAll = async () => {
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => console.error(error));
};
// GET por ID
export const ProductogetByFolio = async (id) => {
    return fetch(`${url}/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data =>{
            console.log(id);
            data = Array.from(data);
            console.log(typeof(data));
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}





export const ProductoPost = async (data) => {
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
                console.log('el producto ah sido agregado exitosamente');
            } else {
                console.log('Hubo un error al actualizar los datos.');
            }
        })
        .catch(error => console.error('Error:', error));
}


