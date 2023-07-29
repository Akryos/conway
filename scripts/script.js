var inputElements = [];
inputElements['amountOfRows'] = 0;
inputElements['amountOfColumns'] = 0;
inputElements['cellSize'] = 0;
inputElements['cycleSpeed'] = 0;

var gameboard;

document.getElementById('buttonPrepareField').addEventListener('click', function(e) {
    getInputElementValues();
    gameboard = document.getElementById('gameboard');
    gameboard.width  = inputElements['amountOfColumns'] * inputElements['cellSize'];
    gameboard.height = inputElements['amountOfRows'] * inputElements['cellSize'];

    const ctx = gameboard.getContext("2d");

    //create cells left to right, then top to bottom
    for(var x = 0; x < inputElements['amountOfRows']; x++) {
        for(var y = 0; y < inputElements['amountOfColumns']; y++) {
            ctx.fillStyle = '#' + Math.floor(Math.random()*16777215).toString(16);

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
});

function getInputElementValues() {
      for (const key in inputElements) {
        inputElements[key] = document.getElementById(key).value || 0;
      }
}