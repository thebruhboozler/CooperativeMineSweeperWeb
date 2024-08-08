package gameCore;

import Users.Player;

import java.util.Random;

public class GameBoard {

    public static int size;
    public static int numOfMines;
    public int[][] board;

    //0 is empty
    //1 is covered
    //2 is alarm
    //3 is unknown

    public int[][] mask;


    public GameBoard(){

        board = new int[size][size];
        mask = new int[size][size];

        Random random = new Random();

        for(int i = 0 ; i < numOfMines ; i++){
            int mineY = random.nextInt(0,size - 1);
            int mineX = random.nextInt(0,size - 1);
            board[mineX][mineY] = 9;
        }

        for(int i = 0 ; i < size;i++){
            for(int j = 0 ; j< size ;j++){
                if(board[i][j] == 9) continue;
                int numOfNeighboursingMines = 0;
                if(i> 0 && j > 0&&board[i-1][j-1] == 9) numOfNeighboursingMines++;
                if( i > 0       &&board[i-1][j] == 9) numOfNeighboursingMines++;
                if( i> 0        && j< size-1 &&board[i-1][j+1] == 9) numOfNeighboursingMines++;

                if( j > 0       &&board[i][j-1] == 9) numOfNeighboursingMines++;
                if( j < size -1 &&board[i][j+1] == 9) numOfNeighboursingMines++;

                if(i < size-1   && j > 0 &&board[i+1][j-1] == 9) numOfNeighboursingMines++;
                if(i < size-1   && board[i+1][j] == 9) numOfNeighboursingMines++;
                if(i < size-1   &&  j < size -1 &&board[i+1][j+1] == 9) numOfNeighboursingMines++;
                board[i][j] = numOfNeighboursingMines;
            }
        }

        for(int i = 0 ; i < size; i++){
            for(int j = 0 ; j < size; j++){
                mask[i][j] = 1;
            }
        }
    }


    public void reveal(int i , int j){
        mask[i][j] = 0;
    }

    public void setAlarm(int i , int j){
        mask[i][j] = 2;
    }

    public void setQuestion(int i , int j){
        mask[i][j] = 3;
    }


    public String stringRepresentation(){
        StringBuilder stringBuilder = new StringBuilder();

        for(int i = 0 ; i < size ; i++){
            for(int j = 0 ; j < size ; j++){
                if(mask[i][j] == 0) stringBuilder.append(board[i][j]);
                if(mask[i][j] == 1) stringBuilder.append("c");
                if(mask[i][j] == 2) stringBuilder.append("a");
                if(mask[i][j] == 3) stringBuilder.append("u");
            }
        }

        return  stringBuilder.toString();
    }
}
