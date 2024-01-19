

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@WebServlet(urlPatterns = {"/editar"})
public class editarserv extends HttpServlet {

     @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out = response.getWriter();
        
      
        response.setContentType("application/json");
        response.addHeader("Access-Control-Allow-Origin", "*");
        StringBuilder json = new StringBuilder();
        json.append("[");
        
        try {
            Actualizar  actualizador = new Actualizar();
           
            String nuevoJSON = "{ \"nuevo\": \"valor\" }";
            
            boolean actualizado = actualizador.actualizarTodosLosDatosJSON(nuevoJSON);
            
            if (actualizado) {
                json.append("{\"status\": \"success\"}");
            } else {
                json.append("{\"status\": \"error\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            json.append("{\"status\": \"error\"}");
        }

        json.append("]");
        out.write(json.toString());
    }

    private static class Actualizar {

        public Actualizar() {
        }
        public boolean actualizarTodosLosDatosJSON(String nuevoValor) {
        boolean actualizado = false;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection db = DriverManager.getConnection("jdbc:mysql://localhost/crudjson", "admin", "1234");
            
            String consulta = "UPDATE tablajson SET columnajson = ? WHERE IDEJERCICIO = ?";
            PreparedStatement ps = db.prepareStatement(consulta);
            ps.setString(1, nuevoValor);
            

            int filasActualizadas = ps.executeUpdate();
            if (filasActualizadas > 0) {
                actualizado = true;
            }

            ps.close();
            db.close();
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }
        return actualizado;
    }
    }

}




