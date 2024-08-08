import Users.ChatRoom;
import Users.Player;
import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

import java.io.IOException;

@ServerEndpoint("/Chat/{ChatRoomId}/{username}")
public class ChatWebSocket {


    ChatRoom localChatRoom;
    Player player;

    @OnOpen
    public void onOpen(Session session, @PathParam("ChatRoomId") String room , @PathParam("username") String username) {

        //System.out.println(room);
        localChatRoom = ChatRoom.getById(room);
        player = new Player(username, session);
        localChatRoom.AddPlayer(player);

    }

    @OnMessage
    public void onMessage(Session session, String msg) throws IOException {
        localChatRoom.broadCastMessage(msg,player.name);
    }

    @OnClose
    public void onClose(Session session, CloseReason closeReason) {
        System.out.println("Disconnected: "+ session.getId());
    }

}
