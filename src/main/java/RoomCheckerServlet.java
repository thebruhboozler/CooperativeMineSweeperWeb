import gameCore.GameRoom;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


@WebServlet("/Check")
public class RoomCheckerServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response )
            throws ServletException, IOException
    {
        boolean has = false;

        String requestBody = request.getReader().lines().reduce("", (accumulator, actual) -> accumulator + actual);

        String s = requestBody.split(":")[1];
        Pattern pattern = Pattern.compile("\"([^\"]*)\"");
        Matcher matcher = pattern.matcher(s);
        matcher.find();
        String id = matcher.group(1);


        for(int i = 0 ; i < IdGenerator.ids.size() ; i++){
            System.out.println(IdGenerator.ids.get(i));
            if(id.equals( IdGenerator.ids.get(i)) ){
                has = true;
                break;
            }
        }

        String jsonResponse = "{\"exists\":";
        if(has) jsonResponse += "\"true\"}";
        else jsonResponse += "\"false\"}";

        logger.logger.info("User looked for Room " + id );
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(jsonResponse);
    }
}