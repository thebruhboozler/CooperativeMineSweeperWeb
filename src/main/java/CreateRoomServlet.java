import Users.ChatRoom;
import gameCore.GameBoard;
import gameCore.GameRoom;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet(name = "RoomCreateServlet", urlPatterns = {"/Create"})
public class CreateRoomServlet extends HttpServlet {



    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException
    {
        String uniqueId = IdGenerator.uniqueRandomId();
        var gameRoom = new GameRoom(uniqueId);
        GameRoom.gameRooms.add(gameRoom);

        var chatRoom = new ChatRoom(uniqueId);
        ChatRoom.chatRooms.add(chatRoom);


        String jsonResponse = "{\"Id\":" + "\""+ gameRoom.Id+ " \"}";
        // Set response content type
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        // Send the response
        response.getWriter().write(jsonResponse);
    }
}