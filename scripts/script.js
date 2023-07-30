var inputElements = [];
inputElements['amountOfRows'] = 0;
inputElements['amountOfColumns'] = 0;
inputElements['cellSize'] = 0;
inputElements['cycleSpeed'] = 0;

var gameboard;
var gameboardBounds;
var gameboardMemory = [];

const deadCellColor = '#c7bea5';
const liveCellColor = '#fcba03';

var then = Date.now();
var now = then;

document.getElementById('buttonPrepareField').addEventListener('click', function(e) {
    getInputElementValues();
    gameboard = document.getElementById('gameboard');
    gameboard.width  = inputElements['amountOfColumns'] * inputElements['cellSize'];
    gameboard.height = inputElements['amountOfRows'] * inputElements['cellSize'];
    gameboardBounds = gameboard.getBoundingClientRect();

    const ctx = gameboard.getContext("2d");

    //create cells left to right, then top to bottom
    for(var x = 0; x < inputElements['amountOfRows']; x++) {
        gameboardMemory[x] = [];

        for(var y = 0; y < inputElements['amountOfColumns']; y++) {
            gameboardMemory[x][y] = 0;

            //ctx.fillStyle = '#' + Math.floor(Math.random()*16777215).toString(16);
            ctx.fillStyle = deadCellColor;

            ctx.strokeRect(
                y * inputElements['cellSize'],
                x * inputElements['cellSize'],
                inputElements['cellSize'],
                inputElements['cellSize']
            );

            ctx.fillRect(
                y * inputElements['cellSize'],
                x * inputElements['cellSize'],
                inputElements['cellSize'],
                inputElements['cellSize']
            );
        }
    }

    gameboard.addEventListener('click', function(e) {toggleCell(e);});
    draw();
});

document.getElementById('buttonStartGame').addEventListener('click', function(e) {
    draw();
});

function calculateNextTurn() {
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
            neighborCount = 0 + getCellValue(x-1, y-1) + getCellValue(x-1, y+1) + getCellValue(x+1, y-1) + getCellValue(x+1, y+1);

            switch(neighborCount) {
                case 0:
                case 1:
                case 4:
                    //new value will be 0
                    shadowMemory[x][y] = 0;
                    break;
                case 2:
                    //new value will be old value
                    //no operation needed
                    break;
                case 3:
                    //new value will be 1
                    shadowMemory[x][y] = 1;
                    break;
            }
        }
    }

    gameboardMemory = shadowMemory;
};

function getCellValue(x, y) {
    if(
        !(gameboardMemory[x] == undefined) && 
        !(gameboardMemory[x][y] == undefined) &&
        gameboardMemory[x][y] == 1    
    ) {
        return 1;
    }

    return 0;
}

function getInputElementValues() {
      for (const key in inputElements) {
        inputElements[key] = document.getElementById(key).value || 0;
      }
}

function toggleCell(e) {
    let posX = e.clientX - gameboardBounds.left;
    let posY = e.clientY - gameboardBounds.top;

    let x = Math.floor(posY / inputElements['cellSize']);
    let y = Math.floor(posX / inputElements['cellSize']);
    
    gameboardMemory[x][y] = 1 - gameboardMemory[x][y];
    //draw();
}

function draw() {
    requestAnimationFrame(draw);
    now = Date.now();

    if((now - then) > inputElements['cycleSpeed']) {
        then = now;

        const ctx = gameboard.getContext("2d");
        ctx.font = "10px serif";

        for(var x = 0; x < inputElements['amountOfRows']; x++) {
            for(var y = 0; y < inputElements['amountOfColumns']; y++) {
                ctx.fillStyle = gameboardMemory[x][y] ? liveCellColor : deadCellColor;

                ctx.strokeRect(
                    y * inputElements['cellSize'],
                    x * inputElements['cellSize'],
                    inputElements['cellSize'],
                    inputElements['cellSize']
                );
    
                ctx.fillRect(
                    y * inputElements['cellSize'],
                    x * inputElements['cellSize'],
                    inputElements['cellSize'],
                    inputElements['cellSize']
                );

                // ctx.fillStyle = 'black';
                // ctx.fillText(`${x}/${y}`, y * inputElements['cellSize'], (x+1) * inputElements['cellSize']);
            }
        }

        calculateNextTurn();
    }
}