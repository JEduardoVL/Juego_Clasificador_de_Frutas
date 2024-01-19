package API;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.stream.Collectors;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;

public class GuardarJuego extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.addHeader("Access-Control-Allow-Origin", "*");

        String requestData = request.getReader().lines().collect(Collectors.joining());
        JSONObject jsonObject = new JSONObject(requestData);
        String nombreJuego = jsonObject.getString("nombre");
        JSONArray imagesArray = jsonObject.getJSONArray("imagenes");

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection db = DriverManager.getConnection("jdbc:mysql://localhost/crudjson", "root", "1234")) {
                JSONObject juego = new JSONObject();
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

                // Insertar sin el campo 'id'
                String insertQuery = "INSERT INTO tablajson (columnajson) VALUES (?)";
                PreparedStatement preparedStatement = db.prepareStatement(insertQuery, Statement.RETURN_GENERATED_KEYS);
                preparedStatement.setString(1, juego.toString());
                preparedStatement.executeUpdate();

                // Recuperar el idEjercicio generado
                ResultSet generatedKeys = preparedStatement.getGeneratedKeys();
                if (generatedKeys.next()) {
                    long idEjercicio = generatedKeys.getLong(1);

                    // Actualizar el registro con el idEjercicio
                    juego.put("id", idEjercicio);
                    String updateQuery = "UPDATE tablajson SET columnajson = ? WHERE idEjercicio = ?";
                    PreparedStatement updateStatement = db.prepareStatement(updateQuery);
                    updateStatement.setString(1, juego.toString());
                    updateStatement.setLong(2, idEjercicio);
                    updateStatement.executeUpdate();
                }

                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                response.getWriter().write("{\"message\":\"Juego guardado correctamente.\"}");

            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error al guardar el juego: " + e.getMessage());
        }
    }
}
