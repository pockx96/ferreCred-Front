const url = 'http://localhost/EasyCredit-Backend/bitacora';


export const getAll = async () => {
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return data;
        })
        .catch(error => console.error(error) );
};