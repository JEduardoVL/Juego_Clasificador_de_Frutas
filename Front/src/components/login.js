// Importaciones: React, Redirect de 'react-router-dom' para la redirección, swal para alertas y estilos CSS
import React from "react";
import { Redirect } from "react-router-dom";
import swal from 'sweetalert';
import '../styles/login.css';

// La clase Login extiende React.Component y gestiona el estado y la lógica del inicio de sesión
class Login extends React.Component {
  // El constructor inicializa el estado del componente
  constructor() {
    super();
    // condition se usa para determinar si se debe redirigir al usuario después de un inicio de sesión exitoso
    this.state = { condition: false };
  }

  // validar es un método que se invoca cuando el usuario intenta iniciar sesión
  validar = (usuario, password) => {
    // Realiza una solicitud GET al servidor con el usuario y la contraseña
    fetch('Login?User=' + usuario + '&password=' + password + '')
      .then(response => response.text())
      .then(data => {
        // Comprueba si la respuesta incluye la palabra "yes", lo que indica un inicio de sesión exitoso
        let ret = data.includes("yes");

        if (ret) {
          // Si el inicio de sesión es correcto, actualiza el estado y muestra una alerta de éxito
          this.setState({ condition: true });
          swal({
            title: "Correcto",
            text: "Usuario correcto",
            icon: "success",
            button: "Aceptar",
          });
        } else {
          // Si el inicio de sesión falla, mantiene el estado y muestra una alerta de error
          this.setState({ condition: false });
          swal({
            title: "Error",
            text: "Usuario y/o contraseña incorrectas",
            icon: "error",
            button: "Aceptar",
          }).then(value => {
            // Limpia los campos de usuario y contraseña tras cerrar la alerta
            document.getElementById("User").value = '';
            document.getElementById("password").value = '';
          });
        }
      });
  }

  // El método render devuelve JSX que representa el formulario de inicio de sesión
  render() {
    const { condition } = this.state;

    // Si el inicio de sesión fue exitoso, redirige al usuario a la página de inicio ('/Proyecto/home')
    if (condition) {
      return <Redirect to='/Proyecto/home' />;
    }

    // Renderiza el formulario de inicio de sesión con dos campos de entrada y un botón para enviar
    return (
      <div className="login-container">
        <div className="login-form">
          <h1>Login</h1>
          <div className="form-group">
            <input placeholder="Nombre usuario" type="text" id="User" className="form-control" />
          </div>
          <div className="form-group">
            <input placeholder="Contraseña" type="password" id="password" className="form-control" />
          </div>
          <button className="button" onClick={() => this.validar(document.getElementById("User").value, document.getElementById("password").value)}>
            Login
          </button>
        </div>
      </div>
    );
  }
}

// Exporta el componente Login para ser utilizado en otros lugares de la aplicación
export default Login;
