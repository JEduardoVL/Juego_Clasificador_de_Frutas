package API;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

public class EliminarJuego extends HttpServlet {
        @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "DELETE");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Permitir que cualquier dominio acceda a este recurso
        response.addHeader("Access-Control-Allow-Methods", "DELETE");

        PrintWriter out = response.getWriter();
        String id = request.getParameter("id");
        if (id == null || id.trim().isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "ID de juego no proporcionado.");
            return;
        }

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection db = DriverManager.getConnection("jdbc:mysql://localhost/crudjson", "root", "1234")) {
                String deleteQuery = "DELETE FROM tablajson WHERE IDEJERCICIO = ?";
                try (PreparedStatement preparedStatement = db.prepareStatement(deleteQuery)) {
                    preparedStatement.setInt(1, Integer.parseInt(id));

                    int rowCount = preparedStatement.executeUpdate();
                    if (rowCount > 0) {
                        out.println("Juego eliminado correctamente.");
                    } else {
                        response.sendError(HttpServletResponse.SC_NOT_FOUND, "No se encontró un juego con el ID proporcionado.");
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error al eliminar el juego: " + e.getMessage());
        }
    }
}