import Quagga from 'quagga'; 
import view from "../view/Carrito.html";

function initQuagga() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#interactive'),
            constraints: {
                width: 184,
                height: 157,
            }
        },
        decoder: {
            readers: ["ean_reader"]
        }
    }, function (err) {
        if (err) {
            console.log(err);
            return
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
    }); Quagga.onDetected(function (result) {
        var code = result.codeResult.code;
        document.getElementById("result").innerHTML = code; Quagga.stop();
        
    }); 


}


export default()=>{
    const divElement = document.createElement("div");
    divElement.innerHTML = view;

    const btnClick = divElement.querySelector("#confirmar");
    btnClick.addEventListener("click", () => {
        initQuagga();
    });

    return divElement;
};
