package API;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;

public class ActualizarJuego extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.addHeader("Access-Control-Allow-Origin", "*");
        String requestData = request.getReader().lines().collect(java.util.stream.Collectors.joining());
        JSONObject jsonObject = new JSONObject(requestData);

        long idEjercicio = jsonObject.getLong("id");
        String nombreJuego = jsonObject.getString("pregunta"); // Corrección aquí
        JSONArray imagesArray = jsonObject.getJSONArray("imagenes");

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection db = DriverManager.getConnection("jdbc:mysql://localhost/crudjson", "root", "1234")) {
                // Verificar si el idEjercicio existe
                String checkQuery = "SELECT COUNT(*) FROM tablajson WHERE idEjercicio = ?";
                PreparedStatement checkStatement = db.prepareStatement(checkQuery);
                checkStatement.setLong(1, idEjercicio);
                ResultSet rs = checkStatement.executeQuery();
                if (rs.next() && rs.getInt(1) == 0) {
                    response.getWriter().write("{\"message\":\"No se encontró el juego para actualizar.\"}");
                    return;
                }

                JSONObject juego = new JSONObject();
                juego.put("id", idEjercicio);
                juego.put("pregunta", nombreJuego);

                JSONArray drags = new JSONArray();
                for (int i = 0; i < imagesArray.length(); i++) {
                    JSONObject image = imagesArray.getJSONObject(i);
                    JSONObject drag = new JSONObject();
                    drag.put("imagen", image.getString("url"));
                    drag.put("valor", image.getString("description"));
                    drags.put(drag);
                }
                juego.put("drags", drags);

                String updateQuery = "UPDATE tablajson SET columnajson = ? WHERE idEjercicio = ?";
                PreparedStatement updateStatement = db.prepareStatement(updateQuery);
                updateStatement.setString(1, juego.toString());
                updateStatement.setLong(2, idEjercicio);
                int rowsUpdated = updateStatement.executeUpdate();

                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                if (rowsUpdated > 0) {
                    response.getWriter().write("{\"message\":\"Juego actualizado correctamente.\"}");
                } else {
                    response.getWriter().write("{\"message\":\"No se encontró el juego para actualizar.\"}");
                }

            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error al actualizar el juego: " + e.getMessage());
        }
    }
}

