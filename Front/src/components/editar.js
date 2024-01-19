// Importaciones de módulos y dependencias necesarias para el componente
import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import ml5 from 'ml5'; // Importar ml5
import '../styles/editar.css'; // estilos


// Componente 'editar' para la página de edición de un juego
const editar = () => {
    // Extracción del ID de juego de la URL y uso del hook useHistory para la navegación
    const { id } = useParams();
    const history = useHistory();

    // Estado del componente para manejar los datos del juego, la acción de guardar y verificar
    const [gameData, setGameData] = useState({
        id: '',
        pregunta: '',
        drags: []
    });
    const [isSaving, setIsSaving] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState(''); // Estado para nueva URL de imagen
    const [isVerifying, setIsVerifying] = useState(false); // Estado para verificar con ml5

    // Efecto para cargar los datos del juego cuando el componente se monta o el ID cambia
    useEffect(() => {
        const qId = new URLSearchParams(window.location.search).get("id");
        const cargarJuego = async () => {
            try {
                const response = await axios.get(`/Proyecto/Pregunta?id=${qId}`);
                if (response.data && response.data.length > 0) {
                    setGameData(response.data[0]);
                } else {
                    swal('Error', 'No se encontraron datos para el juego.', 'error');
                }
            } catch (error) {
                console.error('Error al cargar el juego:', error);
                swal('Error', 'No se pudo cargar la información del juego.', 'error');
            }
        };

        cargarJuego();
    }, [id]);

    /* Esta funció gestiona los cambios en las descripciones de las imágenes del juego.
     Cuando se edita el texto de una imagen, esta función actualiza el estado del juego
     con los nuevos valores para reflejar los cambios en la interfaz de usuario.*/
    const handleTextChange = (index, valor) => {
        const updatedDrags = gameData.drags.map((drag, i) =>
            i === index ? { ...drag, valor } : drag // Actualiza sólo la imagen modificada
        );
        setGameData({ ...gameData, drags: updatedDrags });
    };

    /* handleNameChange gestiona los cambios en el nombre del juego.
    Cada vez que se modifica el campo del nombre, esta función actualiza el estado
    para que el nuevo valor se muestre y esté listo para ser guardado. */
    const handleNameChange = (e) => {
        setGameData({ ...gameData, pregunta: e.target.value });
    };

    /*
    handleSave gestiona el evento de guardado cuando se presiona el botón 'Guardar Cambios'.
    Esta función envía los datos actualizados del juego al servidor y muestra una alerta
    indicando si el guardado fue exitoso o si hubo un error.
    */
    const handleSave = async () => {
        setIsSaving(true); // indica que el proceso de guardado ha comenzado
        try {
            const gameDataToSend = {
                id: gameData.id,
                pregunta: gameData.pregunta, 
                imagenes: gameData.drags.map(drag => ({
                    url: drag.imagen,
                    description: drag.valor
                }))
            };

            await axios.post('/Proyecto/ActualizarJuego', gameDataToSend);
            swal({
                title: "¡Guardado!",
                text: "El juego ha sido actualizado con éxito.",
                icon: "success",
                button: "Ok",
            }).then((willRedirect) => {
                if (willRedirect) {
                    history.push('/Proyecto/home');
                }
            });
        } catch (error) {
            console.error("Error al guardar el juego", error);
            swal("Error", "Hubo un error al guardar el juego.", "error");
        } finally {
            setIsSaving(false); // indica qu =e el proceso de guardado ha terminado
        }
    };

    /*
    removeImage gestiona la eliminación de una imagen específica del juego.
    Al hacer clic en el botón 'Quitar', esta función actualizará el estado para
    reflejar la eliminación de la imagen en la interfaz de usuario.
    */
    const removeImage = (index) => {
        const updatedDrags = gameData.drags.filter((_, i) => i !== index);
        setGameData({ ...gameData, drags: updatedDrags });
    };

    /*
    addNewImage se encarga de añadir una nueva imagen al juego.
    Al introducir una URL y hacer clic en 'Añadir Imagen', esta función
    actualizará el estado con la nueva imagen añadida.
    */
    const addNewImage = () => {
      if (newImageUrl) {
          const newDrag = {
              imagen: newImageUrl,
              valor: '' // iniciamos la descripción de la imagen nueva como vacía para despues actualizarla con la de la clasificación
          };
          setGameData({ ...gameData, drags: [...gameData.drags, newDrag] });
          setNewImageUrl(''); // Limpia el campo de entrada después de añadir la imagen
      }
  };

  /*
    verifyImages utiliza la biblioteca ml5 para clasificar las imágenes del juego.
    Al hacer clic en 'Verificar Imágenes', esta función actualizará el estado de cada imagen con
    'Actualizando...' y luego con el resultado de la clasificación obtenido de ml5.
  */
  const verifyImages = async () => {
    setIsVerifying(true); // Indica que la verificación ha comenzado

    // Establece el estado inicial de las descripciones de las imágenes a 'Actualizando...'
    setGameData(currentGameData => ({
        ...currentGameData,
        drags: currentGameData.drags.map(drag => ({ ...drag, valor: "Actualizando..." }))
    }));

    const classifier = await ml5.imageClassifier('MobileNet');

    // Procesamos cada imagen y actualizamos el estado después de cada clasificación
    for (let drag of gameData.drags) {
        try {
            const imageElement = new Image();
            imageElement.crossOrigin = "anonymous"; // Intenta evitar el error de CORS
            imageElement.src = drag.imagen;
            
            // Esperamos a que la imagen se cargue antes de clasificar
            await new Promise((resolve, reject) => {
                imageElement.onload = resolve;
                imageElement.onerror = reject;
            });

            const results = await classifier.classify(imageElement);
            // Actualizamos el estado con el resultado de la clasificación
            setGameData(currentGameData => ({
                ...currentGameData,
                drags: currentGameData.drags.map(d => 
                    d.imagen === drag.imagen ? { ...d, valor: results[0].label } : d
                )
            }));
        } catch (error) {
            console.error('Error al clasificar la imagen:', error);
        }
    }

    setIsVerifying(false); // Indica que la verificación ha terminado
};
    /*
    El componente devuelve la estructura de la página de edición del juego, incluyendo
    campos de entrada para editar el nombre y las descripciones de las imágenes, así como
    botones para añadir nuevas imágenes, verificarlas y guardar los cambios realizados.
    */

    return (
      <div className="background-style">
          <Container className="content-style">
              <Row className="justify-content-center my-4">
                  <Col xs={12} md={8} lg={6}>
                      <h2 className="text-center">Editar información del juego.</h2>
                      <h3>Cambiar nombre del juego</h3>
                      <input
                          type="text"
                          className="name-edit-style"
                          value={gameData.pregunta}
                          onChange={handleNameChange}
                          placeholder="Nombre del juego"
                          style={{ width: '100%' }}
                      />
                  </Col>
              </Row>
              <Row>
                {gameData.drags.map((drag, index) => (
                    <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-3">
                        <div className="image-container">
                            <img
                                id={`img-${index}`}
                                src={drag.imagen}
                                alt={`Drag ${index}`}
                                style={{ width: "150px", height: "150px" }} // Adjust the size as needed
                            />
                            <input
                                type="text"
                                placeholder="Esperando verificación."
                                value={drag.valor}
                                onChange={(e) => handleTextChange(index, e.target.value)}
                                //readOnly={!drag.isEditable} // Adjust based on your verification logic
                            />
                            <Button variant="danger" onClick={() => removeImage(index)}>
                                Quitar
                            </Button>
                        </div>
                    </Col>
                ))}
              </Row>
              <Row className="justify-content-center my-4">
                <Col xs={12} sm={6} md={4} lg={3}>
                    <input
                        type="text"
                        className="image-url-input"
                        placeholder="URL de la nueva imagen"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                    />
                    <Button variant="warning" onClick={addNewImage}>
                        Añadir Imagen
                    </Button>
                </Col>
            </Row>
              <Row className="justify-content-center my-4">
                  <Col xs={12} sm={6} md={4}>
                      <Button variant="primary" onClick={verifyImages} disabled={isVerifying}>
                          {isVerifying ? 'Verificando...' : 'Verificar Imágenes'}
                      </Button>
                  </Col>
              </Row>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link to={`/Proyecto/home`} className="btn btn-danger">Cancelar</Link>
              <Button variant="primary" className="M-6" onClick={handleSave} disabled={isSaving}>
                          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                      </Button>
              </div>
          </Container>
      </div>
  );
};
export default editar;





