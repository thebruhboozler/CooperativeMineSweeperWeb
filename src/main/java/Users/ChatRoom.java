package Users;

import java.io.IOException;
import java.util.ArrayList;

public class ChatRoom {

    public ArrayList<Player> players;

    public static  ArrayList<ChatRoom> chatRooms = new ArrayList<>();

    String Id;
    

    public ChatRoom(String Id){
        this.Id = Id;
        players = new ArrayList<>();
    }


    public void broadCastMessage(String message , String username) {
        players.forEach(player -> {
            try {
                player.session.getBasicRemote().sendText(username +':' + message);
                player.session.getBasicRemote().flushBatch();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
    }

    public void AddPlayer(Player player){
        this.players.add(player);
    }

    public static ChatRoom getById(String Id){
        for(int i = 0 ; i < chatRooms.size();i++){
            if(Id.equals(chatRooms.get(i).Id)) return chatRooms.get(i);
        }
        return null;
    }

}
