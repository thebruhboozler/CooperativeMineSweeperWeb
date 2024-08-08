import gameCore.GameBoard;
import gameCore.GameRoom;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;


import java.io.*;
import java.util.Properties;
import java.util.ResourceBundle;
import java.util.logging.LogManager;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;



@WebListener
public class Initialiser implements ServletContextListener {

    @Override
    public void contextDestroyed(ServletContextEvent arg0) {

    }

    @Override
    public void contextInitialized(ServletContextEvent arg0) {

        try(InputStream rn = this.getClass().getClassLoader().getResourceAsStream("GameBoard.properties"))
        {
            Properties properties = new Properties();
            properties.load(rn);

            String size = properties.getProperty("size");
            String numOfMines = properties.getProperty("numOfMines");

            GameBoard.size = Integer.parseInt(size);
            GameBoard.numOfMines = Integer.parseInt(numOfMines);

        }catch (Exception e){

        };
        try {
            LogManager.getLogManager().readConfiguration(
                    logger.class.getResourceAsStream("/logging.properties"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        logger.logger.info("Application has started");



        // Initialize MySQL connection
        String url = "jdbc:mysql://localhost:3306/games";
        String user = "root";
        String password = "root";

        // Load MySQL JDBC driver
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.out.println("MySQL JDBC driver not found.");
            e.printStackTrace();
            return;
        }

        // JDBC variables for opening and managing connection
        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            System.out.println("Connected to the MySQL server successfully.");

            // You can perform additional database operations here if needed

        } catch (SQLException e) {
            System.out.println("Connection failed. Check output console.");
            e.printStackTrace();
        }
    }


}