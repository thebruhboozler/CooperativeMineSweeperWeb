//setting up the socket


let socket = new WebSocket("ws:localhost:8080/CooperativeMinesweeperWeb/Game/" + getCookie("roomId") + "/"+ getCookie("username"));
socket.binaryType = "string"

socket.onopen = function (event) {
    console.log("Connected to WebSocket server.");
};

socket.onmessage = function (event) {
    console.log("message got");
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            updateGrid(i, j, event.data[i * size + j])
        }
    }
};

socket.onclose = function (event) {
    console.log("Disconnected from WebSocket server.");
};


//size of the grid
const canvas = document.getElementById("Canvas");
canvas.setAttribute("width", window.innerWidth * 0.8 * window.devicePixelRatio);
canvas.setAttribute("height", window.innerHeight * window.devicePixelRatio);
let context = canvas.getContext("2d");


let squareSize = 50
const size = 100
let cameraX = 1000
let cameraY = 1000

context.imageSmoothingEnabled = false;
context.mozImageSmoothingEnabled = false;

window.addEventListener("resize", () => {
    canvas.setAttribute("width", window.innerWidth * 0.8 * window.devicePixelRatio);
    canvas.setAttribute("height", window.innerHeight * window.devicePixelRatio);
    context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;

})



//the grid will consist of an array strings describing its state per line
//u-unknown
//a-alarm
//c-covered
//0..9 number of bombs around it where 9 is it being TNT 

function loadImage(imageLocation) {
    let res = new Image()
    res.src = imageLocation
    res.width = squareSize
    res.height = squareSize
    return res
}

//loading the non-number Tiles 
const tnt = loadImage("assets/TNT.bmp")
const empty = loadImage("assets/Empty.bmp")
const covered = loadImage("assets/Tile.bmp")
const unknown = loadImage("assets/Unknown.bmp")
const alarm = loadImage("assets/Alarm.bmp")
const notImplemented = loadImage("assets/NotImplemented.bmp")
const clicked = loadImage("assets/Clicked.bmp")

//loading the Tiles
const _1 = loadImage("assets/Tile1.bmp")
const _2 = loadImage("assets/Tile2.bmp")
const _3 = loadImage("assets/Tile3.bmp")
const _4 = loadImage("assets/Tile4.bmp")
const _5 = loadImage("assets/Tile5.bmp")
const _6 = loadImage("assets/Tile6.bmp")
const _7 = loadImage("assets/Tile7.bmp")
const _8 = loadImage("assets/Tile8.bmp")



//initializing the grid
const grid = []
for (let i = 0; i < size; i++) {
    grid.push("");
    for (let j = 0; j < size; j++) {
        grid[i] += 'c';
    }
}

function updateGrid(x, y, char) {
    if (x < 0 || x >= size || y < 0 || y >= size) {
        console.error("Coordinates out of bounds")
        return
    }
    let rowArray = grid[x].split('')
    rowArray[y] = char
    grid[x] = rowArray.join('')
}

//helper function
function roundUp(value, unit) {
    return Math.ceil(value / unit) * unit;
}

function updateCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#c0c0c0';
    context.fillRect(0, 0, canvas.width, canvas.height);
    function charToImage(char) {
        switch (char) {
            case 'c':
                return covered
            case 'C':
                return clicked;
            case 'a':
                return alarm
            case 'u':
                return unknown
            case '0':
                return empty
            case "1":
                return _1
            case "2":
                return _2
            case "3":
                return _3
            case "4":
                return _4
            case "5":
                return _5
            case "6":
                return _6
            case "7":
                return _7
            case "8":
                return _8
            case '9':
                return tnt
            default:
                return notImplemented
        }
    }

    function getVisibleTilesRange() {

        let currentTileX = roundUp(cameraX, squareSize) / squareSize
        let currentTileY = roundUp(cameraY, squareSize) / squareSize - 1
        let deltaX = roundUp(Math.floor(canvas.width / 2), squareSize) / squareSize
        let deltaY = roundUp(Math.floor(canvas.height / 2), squareSize) / squareSize + 1
        let left = currentTileX - deltaX
        let right = currentTileX + deltaX
        let top = currentTileY + deltaY
        let bottom = currentTileY - deltaY
        let shiftX = cameraX - (currentTileX * squareSize - squareSize)
        let shiftY = cameraY - (currentTileY * squareSize - squareSize)
        return [left, top, right, bottom, shiftX, shiftY]
    }

    let [left, top, right, bottom, shiftX, shiftY] = getVisibleTilesRange();
    for (let i = left; i < right; i++) {
        for (let j = top; j > bottom; j--) {
            if (j < 0 || i < 0 || i > size || j + 1 > size) continue;
            let image = charToImage(grid[i][j]);
            context.drawImage(image, ((i - left) * squareSize - shiftX), ((j - bottom) * squareSize - shiftY), squareSize, squareSize)

        }
    }
}

updateCanvas();
setInterval(
    updateCanvas
    ,
    16
)

let pressSound = new Audio("assets/sounds/press.wav")
pressSound.volume = 0.3
let releaseSound = new Audio("assets/sounds/release.wav")
releaseSound.volume = 0.3
let cancelClick = new Audio("assets/sounds/cancelClick.mp3")
cancelClick.volume = 0.3
let alarmPlaced = new Audio("assets/sounds/alarm.mp3")
alarmPlaced.volume = 0.3
let questionPlaced = new Audio("assets/sounds/questionMark.mp3")
questionPlaced.volume = 0.6;
let explosionSound = new Audio("assets/sounds/explosion.wav")
let clickedX;
let clickedY;


let rightClicked = false;

canvas.addEventListener("contextmenu", function (event) {
    event.preventDefault();
    if(rightClicked || emptyPressed ) return;
    rightClicked = true;
    var ctxMenu = document.getElementById("ctxMenu");
    ctxMenu.style.display = "block";
    ctxMenu.style.left = (event.pageX - 10) + "px";
    ctxMenu.style.top = (event.pageY - 10) + "px";
}, false);


document.getElementById("Alarm").addEventListener("click", () => {
    if(emptyPressed) return;
    socket.send(`a ${clickedX} ${clickedY}`)
    let ctxMenu = document.getElementById("ctxMenu");
    ctxMenu.style.display = "";
    ctxMenu.style.left = "";
    ctxMenu.style.top = "";
    alarmPlaced.play();
    rightClicked = false;
})

document.getElementById("Unknown").addEventListener("click", () => {
    if(emptyPressed ) return;
    socket.send(`u ${clickedX} ${clickedY}`)
    let ctxMenu = document.getElementById("ctxMenu");
    ctxMenu.style.display = "";
    ctxMenu.style.left = "";
    ctxMenu.style.top = "";
    questionPlaced.play()
    rightClicked = false;
})

document.getElementById("Clear").addEventListener("click", () => {
    if(emptyPressed) return;
    updateGrid(clickedX, clickedY, 'c')
    let ctxMenu = document.getElementById("ctxMenu");
    ctxMenu.style.display = "";
    ctxMenu.style.left = "";
    ctxMenu.style.top = "";
    cancelClick.play();
    rightClicked = false;
})



canvas.addEventListener("click", function (event) {
    var ctxMenu = document.getElementById("ctxMenu");
    ctxMenu.style.display = "";
    ctxMenu.style.left = "";
    ctxMenu.style.top = "";
}, false);


function determineTile(x, y) {

    let clickX = x - Math.floor(canvas.width / 2)
    let clickY = y - Math.floor(canvas.height / 2)
    let globalX = cameraX + clickX + Math.floor(squareSize / 5);
    let globalY = cameraY + clickY - Math.floor(squareSize / 5);
    return [(roundUp(globalX, squareSize) / squareSize - 1), roundUp(globalY, squareSize) / squareSize - 1]
}

let xOffset = () => canvas.getBoundingClientRect().x

let middlePressed = false;

let emptyPressed = false;

canvas.addEventListener("mousedown", (event) => {
    if (event.button == 1) {
        middlePressed = true;
        event.preventDefault()
        return
    }
    if(rightClicked)return;

    emptyPressed = false;
    [clickedX, clickedY] = determineTile(event.x - xOffset(), event.y)
    if(grid[clickedX][clickedY] != "c" && grid[clickedX][clickedY] != "u" && grid[clickedX][clickedY] != "a" ) {
        emptyPressed = true;   
        return;
    }
    if (clickedX > size || clickedY > size) {
        clickedX = null
        clickedY = null
        return;
    }
    pressSound.play();
    updateGrid(clickedX, clickedY, 'C')

})


canvas.addEventListener("mouseup", (event) => {
    if (event.button == 1) {
        middlePressed = false;
        return;
    }
    if (event.button == 2) return;
    let [x, y] = determineTile(event.x - xOffset(), event.y)
    if(emptyPressed) return;
   
    if (x == clickedX && y == clickedY) {
        setTimeout(() => {
            socket.send(`c ${clickedX} ${clickedY}`)
            releaseSound.play();
        }, 120);
    }
    else {
        updateGrid(clickedX, clickedY, 'c')
        cancelClick.play();
    }
})



const maxSquareSize = 250;
const minSquareSize = 20;
canvas.addEventListener('wheel', function (event) {
    event.preventDefault();
    if (event.deltaY > 0 && squareSize - 1 >= minSquareSize) squareSize--;
    if (event.deltaY < 0 && squareSize + 1 <= maxSquareSize) squareSize++;

    if (squareSize - 1 >= minSquareSize || squareSize + 1 <= maxSquareSize) return;

    function lerp(start, end, t) {
        return start + t * (end - start);
    }

    let targetX = cameraX + event.pageX - canvas.getBoundingClientRect().x - Math.floor(canvas.width / 2);
    let targetY = cameraY + event.pageY - Math.floor(canvas.height / 2);

    cameraY = Math.floor(lerp(cameraY, targetY, 0.6));
    cameraX = Math.floor(lerp(cameraX, targetX, 0.6));
    console.log(cameraX, cameraY)
}, false);




let lastX = null
let lastY = null


canvas.addEventListener('mouseleave', () => {
    middlePressed = false;
})


let minCameraX = () => -10 * squareSize;
let minCameraY = () => -10 * squareSize;
let maxCameraX = () => 100 * squareSize;
let maxCameraY = () => 100 * squareSize;


canvas.addEventListener('mousemove', (event) => {
    if (!middlePressed) return;
    if (lastX == null && lastY == null) {
        lastX = event.x
        lastY = event.y
    }

    let deltaX = lastX - event.x < 0 ? Math.max(-50, lastX - event.x) : Math.min(50, lastX - event.x)
    let deltaY = lastY - event.y < 0 ? Math.max(-50, lastY - event.y) : Math.min(50, lastY - event.y)
    if ((cameraX + deltaX < maxCameraX() && cameraX + deltaX > minCameraX())) cameraX += deltaX
    if ((cameraY + deltaY < maxCameraY() && cameraY + deltaY > minCameraY())) cameraY += deltaY
    lastX = event.x
    lastY = event.y

})
