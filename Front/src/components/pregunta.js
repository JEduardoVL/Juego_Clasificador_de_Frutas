import React from "react";
import { Button } from "react-bootstrap"; // Importa el componente Button de react-bootstrap
import { Link } from "react-router-dom"; // Importa el componente Link de react-router-dom

// Componente funcional Pregunta que recibe props: id, pregunta y onDelete
const Pregunta = ({ id, pregunta, onDelete }) => {
  // Devuelve una fila de tabla con el contenido de la pregunta y botones de acción
  return (
    <tr>
      {/* Muestra el texto de la pregunta en una celda de tabla */}
      <td>{pregunta}</td>
      {/* Celda de tabla con los botones de acción */}
      <td className="AlignCenter">
        {/* Botón para ver detalles del juego. Link envuelve al botón para redirigir a la ruta /info con el id del juego */}
        <Button variant="success" className="M-6">
          <Link to={`/Proyecto/info?id=${id}`} className="CustomLink">
            Ver juego
          </Link>
        </Button>
        {/* Botón para editar el juego. Navega a la ruta /editar con el id del juego */}
        <Button variant="warning" className="M-6">
          <Link to={`/Proyecto/editar?id=${id}`} className="CustomLink">
            Editar juego
          </Link>
        </Button>
        {/* Botón para eliminar el juego. Ejecuta la función onDelete pasada como prop cuando se hace clic */}
        <Button
          variant="danger"
          className="M-6"
          onClick={() => onDelete(id)}
        >
          Eliminar juego
        </Button>
        {/* Botón para probar el juego. Navega a la ruta /probar con el id del juego */}
        <Button variant="primary" className="M-6">
          <Link to={`/Proyecto/probar?id=${id}`} className="CustomLink">
            Probar juego
          </Link>
        </Button>
      </td>
    </tr>
  );
};

// Exporta el componente para que pueda ser utilizado en otros archivos
export default Pregunta;
