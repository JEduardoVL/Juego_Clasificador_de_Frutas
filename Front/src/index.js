import React from "react";
import {
    Switch,
    Route,
} from "react-router-dom"; // Importa Switch y Route de react-router-dom para el enrutamiento

// Importa los componentes individuales utilizados en las rutas
import Home from "./components/home";
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos de Bootstrap
import "./styles/styles.css" // Importa estilos CSS adicionales
import Login from "./components/login"
import Info from "./components/info"
import Editar from "./components/editar"
import Probar from "./components/probar"
import NuevaP from "./components/nuevaPre"

// Componente funcional App
const App = () => {
    return (
        <div>
            {/* Switch envuelve las rutas y permite que solo se muestre una ruta a la vez */}
            <Switch>
                {/* Define las rutas y los componentes que se deben renderizar */}
                <Route exact path="/Proyecto">
                    <Login /> // Ruta para la página de inicio de sesión
                </Route>
                <Route exact path="/Proyecto/home">
                    <Home /> // Ruta para la página de inicio
                </Route>
                <Route exact path="/Proyecto/info">
                    <Info /> // Ruta para la página de información del juego
                </Route>
                <Route exact path="/Proyecto/editar">
                    <Editar /> // Ruta para la página de edición del juego
                </Route>
                <Route exact path="/Proyecto/probar">
                    <Probar /> // Ruta para la página de prueba del juego
                </Route>    
                <Route exact path="/Proyecto/nuevaPre">
                    <NuevaP /> // Ruta para la página de creación de un nuevo juego
                </Route>       
                {/* Ruta para manejar cualquier dirección URL que no coincida con las anteriores */}
                <Route path="*" render={() => <h1>RECURSO NO ENCONTRADO</h1>} />
            </Switch>
        </div>
    );
}
export default App;
