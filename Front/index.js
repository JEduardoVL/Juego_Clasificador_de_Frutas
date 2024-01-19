import React from "react"; // Importa la biblioteca React
import ReactDOM from "react-dom"; // Importa ReactDOM para interactuar con el DOM
import { BrowserRouter } from "react-router-dom"; // Importa BrowserRouter de react-router-dom
import App from "./src"; // Importa el componente App desde el directorio src

// Renderiza la aplicación en el DOM
ReactDOM.render(
    /*
    Utiliza BrowserRouter para envolver el componente App
    BrowserRouter es un enrutador de nivel superior que utiliza la API de historial del HTML5 
    para mantener sincronizada la UI con la URL
    */
    <BrowserRouter>
        <App /> // Renderiza el componente App
    </BrowserRouter>,
    document.getElementById("app") // Indica el elemento del DOM donde se montará la aplicación
);
