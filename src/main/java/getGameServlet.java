import gameCore.GameRoom;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@WebServlet("/getGame")
public class getGameServlet extends HttpServlet {

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


        logger.logger.info("User looked for Room " + id );
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String jsonResponse = "{\"data\":" + "\""+ GameRoom.gameDAO.getGameByCharCode(id)+ " \"}";
        response.getWriter().write(jsonResponse);
    }
}
