package Users;

import jakarta.websocket.Session;

public class Player {

    public String name;
    public Session session;

    public Player(String name, Session session) {
        this.name = name;
        this.session = session;
    }
}