import view from '../view/proveedores.html'
const divElement = document.createElement("div");
divElement.innerHTML = view;


export default async () => {

    return divElement;
};
