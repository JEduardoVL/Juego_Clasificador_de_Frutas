// Importaciones: Utiliza React y varios hooks, componentes de Bootstrap para la UI, el hook useHistory para la navegación, y swal para alertas
import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useHistory } from 'react-router-dom';
import { Link } from "react-router-dom";
import swal from 'sweetalert';
import axios from "axios";
import '../styles/nuevaP.css';
import ml5 from "ml5";


const NuevaP = () => {
  // Hooks de estado para la lógica y UI del componente.
  const history = useHistory();
  const [selectedImages, setSelectedImages] = useState([]); // Almacena las imágenes seleccionadas
  const [imageUrl, setImageUrl] = useState(''); // Guarda la URL actual del input
  const [isVerifying, setIsVerifying] = useState(false); // Indica si la verificación está en progreso
  const [gameName, setGameName] = useState(''); // Almacena el nombre del juego
  
  // useEffect: Muestra una alerta con instrucciones cuando el componente se monta por primera vez
  useEffect(() => {
    // Mostrar la alerta al cargar la página
    swal({
      title: "Para crear un nuevo juego debes hacer lo siguiente:",
      text: "1. Primero debes de pegar una URL de internet la cual pertenezca a una imagen de alguna fruta y presionar el boton 'Añadir imagen', puedes ingresar las URLs que desees al igual que puedes eliminarlas.\n\n" +
            "2. Cuando termines de ingresar las URLs presiona el botón de 'Verificar ejercicio'.\n\n" +
            "3. Verifica que el nombre de la fruta sea igual al de la imagen y presiona el botón de 'Guardar', si hay algún error puedes modificar el cuadro de texto de la imagen que no corresponda.",
      icon: "info",
      button: "Entendido",
    });
  }, []);


  // addImageFromUrl: Añade una nueva imagen al estado cuando se proporciona una URL
  const addImageFromUrl = () => {
    if (imageUrl) { // Verifica si imageUrl no está vacío
      const newImage = { // Crea un nuevo objeto de imagen
        url: imageUrl,
        id: Date.now(), // Utiliza la hora actual como identificador único
        description: "", // Inicializa la descripción vacía
        isEditable: true // Permite la edición de la descripción
      };
      setSelectedImages(prevImages => [...prevImages, newImage]); // Añade la nueva imagen al estado
      setImageUrl(''); // Limpia el input de URL
    }
  };

  // removeImage: Elimina una imagen del estado basado en su id
  const removeImage = (id) => {
    setSelectedImages(prevImages => prevImages.filter(image => image.id !== id));
  };

  // verifyAllImages: Inicia la verificación de las imágenes utilizando ml5
  const verifyAllImages = async () => {
    setIsVerifying(true); // Indica que la verificación ha comenzado
    // Actualiza todas las descripciones a "Actualizando..." durante la verificación
    setSelectedImages(prevImages => prevImages.map(image => ({ ...image, description: "Actualizando...", isEditable: false })));

    // Crea una instancia del clasificador de MobileNet
    const classifier = await ml5.imageClassifier('MobileNet');
    // Mapa de promesas para clasificar cada imagen
    const promises = selectedImages.map(async (image, index) => {
      // Realiza la clasificación y actualiza la descripción con el resultado
      const results = await classifier.classify(document.getElementById('img-' + index));
      return { ...image, description: results[0].label, isEditable: true };
    });

    // Una vez que todas las promesas se resuelven, actualiza el estado con las nuevas imágenes
    Promise.all(promises).then(newImages => {
      setSelectedImages(newImages);
      setIsVerifying(false); // Indica que la verificación ha finalizado
    });
  };
  
  // Guardar en la base de datos
const handleSave = async () => {
  try {
    // Preparar datos para enviar a la API: nombre del juego y array de imágenes con sus URLs y descripciones
    const gameData = {
      nombre: gameName,
      imagenes: selectedImages.map(img => ({
        url: img.url,
        description: img.description
      }))
    };

    // Realizar una solicitud POST a la API 'GuardarJuego' con los datos del juego
    const response = await axios.post('GuardarJuego', gameData);

    // Si el guardado es exitoso, mostrar una alerta de éxito y redirigir al usuario
    swal({
      title: "¡Guardado!",
      text: "El juego ha sido guardado con éxito.",
      icon: "success",
      button: "Ok",
    }).then((willRedirect) => {
      if (willRedirect) {
        history.push('/Proyecto/home'); // Redirección al 'home' de la aplicación
      }
    });
  } catch (error) {
    // En caso de error en la solicitud, loguear el error y mostrar una alerta al usuario
    console.error("Error al guardar el juego", error);
    swal("Error", "Hubo un error al guardar el juego.", "error");
  }
};
  
  return (
    // Este es el contenedor principal que utiliza una clase CSS para aplicar estilos de fondo
<div className="background-style">
  {/* Container es un componente de Bootstrap React que centra y contiene el contenido */}
  <Container className="content-style">
    {/* Título central del formulario */}
    <h2 className="text-center">Crear nuevo juego.</h2>
    {/* Input para el nombre del juego con un estilo que ocupa el ancho completo */}
    <div className="full-width-input">
      <h3>Ponle un nombre al juego:</h3>
      <input
        type="text"
        placeholder="Escribe aquí el nombre . . ."
        value={gameName} // El valor del input está ligado al estado gameName
        onChange={(e) => setGameName(e.target.value)} // Actualiza el estado con cada cambio
        style={{ width: '100%' }}
      />
    </div>
    {/* Muestra una lista de imágenes seleccionadas para el juego */}
    <Row>
      {selectedImages.map((image, index) => (
        // Para cada imagen seleccionada, se muestra en una columna con su descripción y un botón para quitarla.
        <Col key={image.id} xs={6} md={4} lg={3} className="mb-3">
          <div className="image-container">
            <img
              crossOrigin="anonymous" // Se usa para prevenir problemas CORS cuando se cargan imágenes de otras origenes
              id={'img-' + index} // ID único para cada imagen, usado para la verificación
              src={image.url} // La URL de la imagen
              alt={`Imagen ${index}`}
              style={{ width: "150px", height: "150px" }} // Estilos para mantener las imágenes uniformes
            />
            <input
              type="text"
              placeholder="Esperando verificación."
              value={image.description} // Ligado a la descripción de la imagen en el estado
              onChange={(event) => {
                // Permite editar la descripción de la imagen y actualizar el estado
                const newDescription = event.target.value;
                setSelectedImages(prevImages =>
                  prevImages.map(img =>
                    img.id === image.id ? { ...img, description: newDescription } : img
                  )
                );
              }}
              readOnly={!image.isEditable} // Solo se puede editar si isEditable es true
            />
            <Button variant="danger" onClick={() => removeImage(image.id)}>
              Quitar
            </Button>
          </div>
        </Col>
      ))}
      {/* Input y botón para añadir una nueva imagen a la lista */}
      <Col xs={6} md={4} lg={3} className="mb-3">
        <input
          type="text"
          placeholder="Pegar URL de la imagen"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)} // Actualiza el estado con la nueva URL
          className="mb-2"
        />
        <Button variant="warning" onClick={addImageFromUrl}>
          Añadir imagen
        </Button>
      </Col>
    </Row>
    {/* Botones para verificar las imágenes y guardar el juego */}
    <div className="action-buttons">
      <Button variant="primary" onClick={verifyAllImages} disabled={isVerifying}>
        {isVerifying ? "Verificando..." : "Verificar ejercicio"}
      </Button>
    </div>
    <div className="action-buttons">
      <Button variant="success" onClick={handleSave}>Guardar</Button>
      <Link to={`/Proyecto/home`} className="btn btn-danger">Cancelar</Link>
    </div>
  </Container>
</div>
  )
};

// Exporta el componente NuevaP para ser utilizado en otros lugares de la aplicación
export default NuevaP;
