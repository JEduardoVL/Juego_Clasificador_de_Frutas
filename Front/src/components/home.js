/*
Importaciones necesarias: useState y useEffect son hooks de React,
Button y Table son componentes de react-bootstrap, y axios es un cliente HTTP.
*/
import React, { useState, useEffect } from "react";
import { Button, Container, Table, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Pregunta from "./pregunta";
import axios from "axios";
import swal from 'sweetalert';
import '../styles/home.css';

// El componente Home utiliza la sintaxis de función de flecha de ES6
const Home = () => {
    // useState hook se utiliza para manejar el estado local del componente
    const [data, setData] = useState([]); // Almacena la lista de preguntas
    const [showAlert, setShowAlert] = useState(false); // Controla la visibilidad de la alerta
    const [alertText, setAlertText] = useState(""); // Texto que se muestra en la alerta
    const history = useHistory(); // useHistory hook se utiliza para la navegación

    /*
    useEffect hook se utiliza para realizar efectos secundarios en componentes funcionales.
    En este caso, se utiliza para cargar la lista de preguntas desde la API cuando
    el componente se monta por primera vez.
    */
    useEffect(() => {
        axios.get("Preguntas").then(response => {
            setData(response.data);
        }).catch(error => {
            console.info(error);
            setShowAlert(true);
            setAlertText("ERROR EN LA OBTENCION DE DATOS");
        });
    }, []);

    /*
    handleDelete es una función que se llama cuando el usuario intenta eliminar una pregunta.
    Utiliza sweetalert para confirmar la acción y axios para enviar una solicitud de eliminación.
    */
    const handleDelete = (id) => {
        swal({
            title: "¿Estás seguro?",
            text: "Una vez eliminado, no podrás recuperar este juego.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                axios.delete(`EliminarJuego`, { params: { id: id } }) 
                    .then((response) => {
                        swal("¡El juego ha sido eliminado!", {
                            icon: "success",
                        });
                        setData(prevData => prevData.filter(item => item.id !== id));
                    })
                    .catch((error) => {
                        swal("¡Hubo un error al eliminar el juego!", {
                            icon: "error",
                        });
                        console.error("Error al eliminar el juego", error);
                    });
            }
        });
    };

    /*
    handleLogout es una función que se llama cuando el usuario hace clic en el botón de salir
    se encarga de enviar una solicitud para cerrar la sesión y redirige al usuario a la página principal
    */
    const handleLogout = () => {
        axios.get('/Proyecto/Salir')
            .then(response => {
                console.log(response.data.message); 
                history.push('/Proyecto');
            })
            .catch(error => {
                console.error('Error al cerrar la sesión', error);
            });
    };

    /*
    La función de renderizado del componente devuelve JSX que describe la interfaz de usuario
    Incluye una tabla de bienvenida, un contenedor para la lista de preguntas, y botones para acciones
    
    */
      return (
        // JSX para la estructura de la página de inicio
        <div className="home-container">
          <div className="background-image" />
  
          <Table className="welcome-table">
            <tbody>
              <tr>
                <td>
                  <h2 className="welcome-text">Bienvenido : Admin :D</h2>
                </td>
                <td>
                <Button className="logout-button" onClick={handleLogout}>
                SALIR
              </Button>
                </td>
              </tr>
            </tbody>
          </Table>
  
          <Container className="content-container">
            <h1 className="title">CREAR, ALTAS, BAJAS Y CAMBIOS</h1>
            <hr style={{ width: "80%" }} />
            {showAlert && <Alert variant="danger">{alertText}</Alert>}
            <Button variant="info" className="new-question-button">
              <Link to="/Proyecto/nuevaPre" className="CustomLink">
                NUEVA PREGUNTA
              </Link>
            </Button>

         
  
            <Table striped bordered className="question-table">
          <thead>
            <tr>
              <th>Pregunta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
                    {data.map((pregunta) => (
                        <Pregunta key={pregunta.id} {...pregunta} onDelete={handleDelete} />
                    ))}
                </tbody>
        </Table>
      </Container>
    </div>
  );
};
// Exportación del componente Home para su uso en otras partes de la aplicación
export default Home;


