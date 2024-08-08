import Users.Player;
import gameCore.GameRoom;
import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

import java.io.IOException;

@ServerEndpoint("/Game/{room}/{username}")
public class GameWebSocket {

    GameRoom localGameRoom;
    Player player;

    @OnOpen
    public void onOpen(Session session, @PathParam("room") String room , @PathParam("username") String username) {
        logger.logger.info("User:" + username + " has joined room " + room );
        localGameRoom = GameRoom.getGameById(room);
        player = new Player(username,session);
        localGameRoom.AddPlayer(player);
    }

    @OnMessage
    public void onMessage(Session session, String msg) throws IOException {
        localGameRoom.processInput(msg);
        localGameRoom.BroadCastGrid();
    }

    @OnClose
    public void onClose(Session session, CloseReason closeReason) {
        System.out.println("Disconnected: "+ session.getId());
    }

}
