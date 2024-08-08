package gameCore;

import Users.Player;
import jakarta.websocket.Session;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class GameRoom {


    public static GameDAO gameDAO;
    StringBuilder movesHistory;
    public GameBoard gameBoard;
    ArrayList<Player> players;
    boolean lost;

    public String Id;

    public static ArrayList<GameRoom> gameRooms = new ArrayList<>();


    public GameRoom(String Id){
        //create an unique id
        this.Id= Id;
        players = new ArrayList<>();
        gameBoard = new GameBoard();
        lost = false;
        movesHistory = new StringBuilder();
    }

    public void AddPlayer(Player player){
        players.add(player);
    }


    public void BroadCastGrid(){
        players.forEach(player -> {
            try {
                player.session.getBasicRemote().sendText(gameBoard.stringRepresentation());
                player.session.getBasicRemote().flushBatch();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
    }


    //c for clicked
    //a for alarm placed
    //u for question mark placed
    public void processInput(String input){
        String[] params = input.split(" ");
        int x = Integer.parseInt(params[1]);
        int y = Integer.parseInt(params[2]);
        if(params[0].equals("c")){
            gameBoard.reveal(x,y);
        }else if(params[0].equals("a")){
            gameBoard.setAlarm(x,y);
        }else {
            gameBoard.setQuestion(x,y);
        }
        if(gameBoard.board[x][y] ==9) lost = true;
        movesHistory.append(input + "\n");
    }

    public static GameRoom getGameById(String id){
        for(int i = 0 ; i < gameRooms.size();i++){
            if(gameRooms.get(i).Id.equals(id)) return gameRooms.get(i);
        }
        return null;
    }

}