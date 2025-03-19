import { router } from "./router/index.routes";
import "datatables.net-dt/css/jquery.dataTables.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./css/main.css";
import "bootstrap/dist/css/bootstrap.min.css";

const init = () => {
  router(window.location.hash);

  window.addEventListener("hashchange", () => {
    router(window.location.hash);
  });
};

const updateNav = () => {
  // Obtener la ruta actual
  const route = window.location.hash;

  // Obtener todos los elementos de la barra de navegación
  const navItems = document.querySelectorAll("nav ul li");

  // Iterar sobre los elementos de la barra de navegación y
  // agregar la clase 'active' al elemento correspondiente a la ruta actual
  for (let i = 0; i < navItems.length; i++) {
    const item = navItems[i];
    const link = item.querySelector("a");

    if (link.getAttribute("href") === route) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  }
};

window.addEventListener("load", init);
window.addEventListener("load", updateNav);
window.addEventListener("hashchange", updateNav);
