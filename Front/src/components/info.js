// Importaciones necesarias de React, Bootstrap para los componentes de la UI, axios para las peticiones HTTP y estilos CSS.
import React from "react";
import { Button, Container } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import '../styles/info.css'; // Importa los estilos CSS

class Info extends React.Component {
// El estado inicial del componente contiene propiedades para id, pregunta, respuesta, drags y targets
    state = {
        id: "",
        pregunta: "",
        respuesta: "",
        drags: [],
        targets: []
    }

  // componentDidMount se invoca inmediatamente después de que el componente se monta 
  componentDidMount() {
    // Extrae el ID de la pregunta de la URL usando URLSearchParams
    const qId = new URLSearchParams(window.location.search).get("id");
    if (qId) {
        // Realiza una petición GET para obtener los detalles de la pregunta usando axios
        axios.get("/Proyecto/Pregunta?id=" + qId) 
            .then(response => {
                // En caso de éxito, establece la respuesta en el estado del componente
                const question = response.data[0];
                this.setState({ ...question });
            })
            .catch(error => {
                // En caso de error, muestra un mensaje en la consola y una alerta al usuario
                console.error("Error al cargar la pregunta:", error);
                alert("Ha ocurrido un error al cargar la pregunta.");
            });
    }
}

// Método render que devuelve el JSX para la página de información del ejercicio
render() {
    // Extrae drags y targets del estado para usarlos en la UI
    const { drags, targets } = this.state;

    // JSX que describe la estructura de la página de información
    return (
      <>
        <div className="background-style" />
        <Container className="MarginContainer content-style">
          <h3 style={{ textAlign: 'center' }}>Información del ejercicio</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Mapea sobre los arrays drags y targets para mostrar cada opción como una tarjeta con imagen y texto */}
            {drags.concat(targets).map((option, index) => (
              <div key={index} className="card-style">
                <img src={option.imagen} alt={`Opción ${index}`} className="image-style" />
                <p className="text-style">{option.valor}</p>
              </div>
            ))}
          </div>
          {/* Botón que lleva al usuario de vuelta a la página principal de CRUD */}
          <Button variant="success" className="M-6" style={{ display: 'block', margin: '20px auto' }}>
            <Link to={`/Proyecto/home`} className="CustomLink">CRUD</Link>
          </Button>
        </Container>
      </>
    );
}
}

// Exporta el componente Info para su uso en otras partes de la aplicación.
export default Info;
