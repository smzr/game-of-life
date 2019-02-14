const canvas = document.getElementById('gameoflife');
const ctx = canvas.getContext('2d');
const gridSize = 30;
let gridState = new Array(gridSize);
for (let i = 0; i < gridSize; i++) {
    gridState[i] = new Array(gridSize);
}
let canvasSize = 800;
let cellSize = canvasSize / gridSize;
const STATE = {RUN: 0, PAUSE: 1};
let currentState = STATE.PAUSE;

init = function() {
    canvas.onclick = populate;
    for (let x = 0 ; x < gridSize; x++) {
        for (let y = 0 ; y < gridSize; y++) {
            gridState[x][y] = 0;
        }
    }
    for (let x = 1; x < gridSize -1; x++) {
        for (let y = 1; y < gridSize -1; y++) {
            gridState[x][y] = (Math.random() > 0.5) + 0;
        }
    }
    console.log(gridState)
};

setState = function(state) {
    currentState = state;
};

updateGrid = function() {
    let gridCopy = new Array(gridSize);
    for (let i = 0; i < gridSize; i++) {
        gridCopy[i] = new Array(gridSize);
    }
    console.log(gridCopy);
    for (let x = 0 ; x < gridSize; x++) {
        for (let y = 0 ; y < gridSize; y++) {
            gridCopy[x][y] = 0;
        }
    }
    for (let x = 1 ; x < gridSize - 1; x++) {
        for (let y = 1 ; y < gridSize - 1; y++) {
            let neighbours = 0;

            // TOP-LEFT
            neighbours += gridState[x-1][y-1];
            // TOP
            neighbours += gridState[x][y-1];
            // TOP-RIGHT
            neighbours += gridState[x+1][y-1];
            // RIGHT
            neighbours += gridState[x+1][y];
            // BOTTOM-RIGHT
            neighbours += gridState[x+1][y+1];
            // BOTTOM
            neighbours += gridState[x][y+1];
            // BOTTOM-LEFT
            neighbours += gridState[x-1][y+1];
            // LEFT
            neighbours += gridState[x-1][y];

            if (gridState[x][y] && neighbours < 2) {
                gridCopy[x][y] = 0;
            } else if (gridState[x][y] && neighbours > 3) {
                gridCopy[x][y] = 0;
            } else if (!(gridState[x][y]) && neighbours === 3) {
                gridCopy[x][y] = 1;
            } else {
                gridCopy[x][y] = gridState[x][y];
            }
        }
    }
    gridState = gridCopy;
};

populate = function(e) {
    let rect = canvas.getBoundingClientRect();
    let x =e.clientX - rect.left;
    let y = e.clientY - rect.top;
    let pos = convertClickPos(x, y);
    gridState[pos.x][pos.y] = (!(gridState[pos.x][pos.y])) + 0;
};

convertClickPos = function(x, y) {
    let newx = Math.floor((x/canvasSize)*gridSize);
    let newy = Math.floor((y/canvasSize)*gridSize);
    return {x: newx, y: newy};
};

tick = function() {
    switch (currentState) {
        case STATE.RUN:
            updateGrid();
            drawGrid();
            break;
        case STATE.PAUSE:
            drawGrid();
            break;
    }
    requestAnimationFrame(tick);
};

drawGrid = function() {
    for (let x = 0 ; x < gridSize; x++) {
        for (let y = 0 ; y < gridSize; y++) {
            let state = gridState[x][y];
            if (state) {
                ctx.fillStyle = 'rgb(238, 238, 238)'
            } else {
                ctx.fillStyle = 'rgb(33, 33, 33)'
            }
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
};

init();
tick();