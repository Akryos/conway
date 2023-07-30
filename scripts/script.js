var inputElements = [];
inputElements['amountOfRows'] = 0;
inputElements['amountOfColumns'] = 0;
inputElements['cellSize'] = 0;
inputElements['cycleSpeed'] = 0;
inputElements['amountOfTurnsTaken'] = 0;

const gameboard = document.getElementById('gameboard');
const ctx = gameboard.getContext("2d");
ctx.font = "10px serif";
var gameboardBounds;
var gameboardMemory = [];


const deadCellColor = '#c7bea5';
const liveCellColor = '#fcba03';

var then = Date.now();
var now = then;
var animationRequestID = undefined;

gameboard.addEventListener('click', function(e) {
    toggleCell(e);
    drawNewCanvas();
});

document.getElementById('buttonPrepareField').addEventListener('click', function(){
    createGameboard();
    calculateNextRound();
    drawNewCanvas();
});

document.getElementById('buttonStartGame').addEventListener('click', function(){
    loopGame();
});

document.getElementById('buttonStopGame').addEventListener('click', function(){
    stopGame();
});

function createGameboard() {
    getUserInputElementValues();
    
    gameboard.width  = inputElements['amountOfColumns'] * inputElements['cellSize'];
    gameboard.height = inputElements['amountOfRows'] * inputElements['cellSize'];
    gameboardBounds = gameboard.getBoundingClientRect();

     //create cells left to right, then top to bottom
     for(var x = 0; x < inputElements['amountOfRows']; x++) {
        gameboardMemory[x] = [];

        for(var y = 0; y < inputElements['amountOfColumns']; y++) {
            gameboardMemory[x][y] = 0;
        }
    }
}

function getUserInputElementValues() {
      for (const key in inputElements) {
        inputElements[key] = document.getElementById(key).value || 0;
      }
}

function incrementTurnValue() {
    document.getElementById('amountOfTurnsTaken').value = ++inputElements['amountOfTurnsTaken'];
}

function toggleCell(e) {
    let posX = e.clientX - gameboardBounds.left;
    let posY = e.clientY - gameboardBounds.top;

    let x = Math.floor(posY / inputElements['cellSize']);
    let y = Math.floor(posX / inputElements['cellSize']);
    
    gameboardMemory[x][y] = 1 - gameboardMemory[x][y];
}

function calculateNextRound() {
/*
    Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    Any live cell with two or three live neighbours lives on to the next generation.
    Any live cell with more than three live neighbours dies, as if by overpopulation.
    Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
*/

    let shadowMemory = gameboardMemory;
    let neighborCount = 0;

    for(var x = 0; x < inputElements['amountOfRows']; x++) {
        for(var y = 0; y < inputElements['amountOfColumns']; y++) {
            switch(getNeighborCount(x, y)) {
                case 0:
                case 1:
                    shadowMemory[x][y] = 0;
                    break;
                case 2:
                    //no operation needed
                    break;
                case 3:
                    shadowMemory[x][y] = 1;
                    break;
                default: //more than 3
                    shadowMemory[x][y] = 0;
                    break;
            }
        }
    }
    
    gameboardMemory = shadowMemory;
}

function getNeighborCount(x, y) {
    let neighborCount = 0;

    for(let a = (x-1); a <= (x+1); a++) {
        for(let b = (y-1); b <= (y+1); b++) {
            if(
                !(gameboardMemory[a] == undefined) && 
                !(gameboardMemory[a][b] == undefined) &&
                gameboardMemory[a][b] == 1    
            ) {
                neighborCount++;
            }
        }
    }

    return neighborCount;
}

function drawNewCanvas() {
    for(var x = 0; x < inputElements['amountOfRows']; x++) {
        for(var y = 0; y < inputElements['amountOfColumns']; y++) {
            ctx.fillStyle = gameboardMemory[x][y] ? liveCellColor : deadCellColor;
            let rectValues = [y * inputElements['cellSize'], x * inputElements['cellSize'], inputElements['cellSize'], inputElements['cellSize']];

            ctx.strokeRect(...rectValues);
            ctx.fillRect(...rectValues);
        }
    }
}

function loopGame() {
    now = Date.now();

    if((now - then) > inputElements['cycleSpeed']) {
        then = now;
        incrementTurnValue();
        calculateNextRound();
        drawNewCanvas();
    }

    animationRequestID = requestAnimationFrame(loopGame);
}

function stopGame() {
    if(animationRequestID) {
        window.cancelAnimationFrame(animationRequestID);
        animationRequestID = undefined;
     }
}