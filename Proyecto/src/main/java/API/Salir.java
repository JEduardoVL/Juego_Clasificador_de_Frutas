package API;


import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Salir extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // Invalidar la sesión si estás utilizando sesiones en el servidor.
        request.getSession().invalidate();
        
        // Configura la respuesta como tipo JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        // Envía una respuesta que indica que la sesión se ha cerrado.
        response.getWriter().write("{\"message\":\"Sesión cerrada correctamente.\"}");
    }
}