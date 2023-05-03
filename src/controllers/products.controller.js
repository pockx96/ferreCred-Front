import view from "../view/products.html";

export default () => {
  const divElement = document.createElement("div");
  divElement.innerHTML = view;
  return divElement;
};
