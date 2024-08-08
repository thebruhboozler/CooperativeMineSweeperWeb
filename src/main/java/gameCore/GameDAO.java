package gameCore;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class GameDAO {
    // Database connection parameters
    private final String url = "jdbc:mysql://localhost:3306/games";  // Replace 'games' with your database name
    private final String username = "root";
    private final String password = "root";

    // Method to add (insert) a new game into the database
    public void addGame(String charCode, String movesHistory) {
        String sql = "INSERT INTO games (charCode, movesHistory) VALUES (?, ?)";

        try (Connection conn = DriverManager.getConnection(url, username, password);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, charCode);
            pstmt.setString(2, movesHistory);

            int rowsInserted = pstmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Method to retrieve a game by charCode from the database
    public String getGameByCharCode(String charCode) {
        String sql = "SELECT id, charCode, movesHistory FROM games WHERE charCode = ?";
        String res = "";
        try (Connection conn = DriverManager.getConnection(url, username, password);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, charCode);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    int id = rs.getInt("id");
                    String retrievedCharCode = rs.getString("charCode");
                    String movesHistory = rs.getString("movesHistory");


                     res = movesHistory;
                } else {
                    System.out.println("No game found with CharCode: " + charCode);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return res;
    }
}
