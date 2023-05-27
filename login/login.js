const getByCorreo = async (correoUsuario) => {
    return fetch(`https://ferrecred.com/api/usuarios/${correoUsuario}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log("usuario encontrado");
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}

async function Login(email, password) {
    try {
        const userData = await getByCorreo(email);
        console.log(userData);
        if (userData && userData.contraseñaUsuario === password) {
            console.log(`${userData.correoUsuario}==${email}`)
            console.log(`${userData.contraseñaUsuario}==${password}`)
            console.log("Inicio de sesión exitoso");
            window.location.assign('https://www.ferrecred.com/app/#/creditos');
        } 
        else {
            alert("Credenciales inválidas");
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Asignar el evento al botón de inicio de sesión
var loginButton = document.getElementById("botonIrAMain");
loginButton.addEventListener("click", ()=> {
    const emailInput = document.getElementById("correo");
    const passwordInput = document.getElementById("pass");
    Login(emailInput.value, passwordInput.value);
});