import { router } from "./router/index.routes";

import "./css/main.css";
import "bootstrap/dist/css/bootstrap.min.css";

const init = () => {
    router(window.location.hash);
  
    window.addEventListener("hashchange", () => {
      router(window.location.hash);
    });
  };
  
  window.addEventListener("load", init);