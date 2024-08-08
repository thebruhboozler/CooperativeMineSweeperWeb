import java.util.ArrayList;
import java.util.Random;

public class IdGenerator {
    static ArrayList<String> ids = new ArrayList<>();


    static String uniqueRandomId(){
        boolean isUnique = false;
        String id = "";

        while (!isUnique) {
            String alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            Random random = new Random();

            for (int i = 0; i < 10; i++) {
                id += alphabet.charAt(random.nextInt(0, alphabet.length() - 1));
            }
            //check uniqueness
            isUnique = true;
            for(int i = 0 ; i < ids.size();i++){
                if(ids.get(i).equals(id)) isUnique = false;
            }
        }
        ids.add(id);
        return id;
    }
}
