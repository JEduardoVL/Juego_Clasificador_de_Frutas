import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import '../styles/probar.css';

// Componente funcional Probar
const Probar = () => {
    // Estados para almacenar la información del juego, la entrada del usuario, el tiempo y el estado del temporizador
    const [data, setData] = useState({
        id: "",
        pregunta: "",
        respuesta: "",
        drags: [],
        targets: []
    });
    const [userInput, setUserInput] = useState('');
    const [time, setTime] = useState(0);
    const [timerOn, setTimerOn] = useState(false);

    // useEffect para cargar los datos del juego desde la API
    useEffect(() => {
        const qId = new URLSearchParams(window.location.search).get("id");
        if (qId) {
            axios.get(`/Proyecto/Pregunta?id=${qId}`)
                .then(response => {
                    const question = response.data[0];
                    setData({...question});
                    // Mostrar la alerta antes de iniciar el cronómetro
                    Swal.fire({
                        title: '¿Cómo jugar?',
                        text: 'Primero deberás de escribir el nombre de la fruta que ves en la imagen en el cuadro de texto superior, cuando termines de escribir todos los nombres de las frutas habrás completado el juego',
                        icon: 'info',
                        confirmButtonText: 'Empezar'
                    }).then(() => {
                        setTimerOn(true); // Inicia el temporizador después de cerrar la alerta
                    });
                })
                .catch(error => {
                    console.error("Error al cargar el juego:", error);
                    Swal.fire({
                        title: 'Error',
                        text: 'Ha ocurrido un error al cargar el juego.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                });
        }
    }, []);

    // useEffect para manejar el temporizador
    useEffect(() => {
        let interval = null;
        if (timerOn) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 1); // Aumenta el tiempo cada segundo
            }, 1000);
        } else if (!timerOn) {
            clearInterval(interval); // Detiene el temporizador
        }
        return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
    }, [timerOn]);

    // useEffect para verificar la entrada del usuario
    useEffect(() => {
        if (!userInput) return;

        const normalizedInput = userInput.trim().toLowerCase();
        const foundMatch = data.drags.some(drag => drag.valor.toLowerCase() === normalizedInput);

        if (foundMatch) {
            // Actualiza los elementos visibles y verifica si el juego está completo
            const updatedDrags = data.drags.map(drag => ({
                ...drag,
                visible: drag.visible || drag.valor.toLowerCase() === normalizedInput,
            }));
            setData({...data, drags: updatedDrags});
            setUserInput(''); 
            const allVisible = updatedDrags.every(drag => drag.visible);
            if (allVisible) {
                setTimerOn(false); // Detiene el temporizador cuando se completa el juego
                Swal.fire({
                    title: '¡Juego completado!',
                    text: `Juego completado en un tiempo de: ${Math.floor(time / 60)}:${("0" + (time % 60)).slice(-2)}`,
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
            }
        }
    }, [userInput, data.drags]);

    // Función para reiniciar el juego
    const restartGame = () => {
        const resetDrags = data.drags.map(drag => ({
            ...drag,
            visible: false
        }));
        setData({...data, drags: resetDrags});
        setTime(0);
        setTimerOn(true);
    };

    // Renderiza el juego
    return (
        <>
            <div className="background-style" />
            <Container className="MarginContainer content-style">
                <h3 style={{ textAlign: 'center' }}>¡A jugar!</h3>
                <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                    Tiempo: {Math.floor(time / 60)}:{("0" + (time % 60)).slice(-2)}
                </div>
                <Form.Group controlId="userTextInput">
                    <Form.Control
                        type="text"
                        placeholder="Escribe aquí tu respuesta"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                    />
                </Form.Group>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {data.drags.map((option, index) => (
                        <Card key={index} className="card-style">
                            <Card.Img variant="top" src={option.imagen} alt={`Opción ${index}`} className="image-style" />
                            {option.visible && <Card.Title className="text-style">{option.valor}</Card.Title>}
                        </Card>
                    ))}
                </div>
                <div className="action-buttons">
                    <Link to={`/Proyecto/home`} className="btn btn-success M-6">CRUD</Link>
                    <Button variant="info" onClick={restartGame} className="M-6">Volver a jugar</Button>
                </div>
            </Container>
        </>
    );
};

export default Probar;

