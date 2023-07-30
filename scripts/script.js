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
}

function draw() {
    const ctx = gameboard.getContext("2d");
    ctx.font = "10px serif";

    setTimeout(function() {

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


        requestAnimationFrame(draw);
    }, inputElements['cycleSpeed']);
}