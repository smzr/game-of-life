const canvas = document.getElementById('gameoflife');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const cellSize = 5; // size in px of each cell
const cols = Math.floor(width / cellSize);
const rows = Math.floor(height / cellSize);
const generation = document.getElementById('gen-counter');
const runEl = document.getElementById('run');
let run = false; // start with the game paused

function toggleGameOfLife() {
    run = !run
}

function new2DArr(cols, rows, value) {
    let arr = Array(cols);
    for (let x = 0; x < cols; x++) {
        arr[x] = Array(rows).fill(value);
    }
    return arr;
}

function init() {
    genCounter = 0; // reset counter for new grid
    generation.innerText = "Generation " + genCounter;
    ctx.fillStyle = 'rgb(33, 33, 33)';
    ctx.fillRect(0, 0, width, height); // fill the canvas background so it's not white
    for (let x = 1; x < cols - 1; x++) {
        for (let y = 1; y < rows - 1; y++) {
            grid[x][y] = (Math.random() > 0.5) + 0;
        }
    }
}

function draw() {
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            if (grid[x][y]) {
                ctx.fillStyle = 'rgb(238, 238, 238)'
            }
            else {
                ctx.fillStyle = 'rgb(33, 33, 33)'
            }
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

function update() {
    let nextGen = new2DArr(cols, rows, 0);
    for (let x = 1; x < cols - 1; x++) {
        for (let y = 1; y < rows - 1; y++) {
            let neighbours = neighbourhoodPopulation(x, y) - grid[x][y]; // to get the population of the surrounding cells, the value of the current cell must be removed
            if (grid[x][y] === 1 && neighbours < 2) {
                nextGen[x][y] = 0; // Death from underpopulation
            }
            else if (grid[x][y] === 1 && neighbours > 3) {
                nextGen[x][y] = 0; // Death from overpopulation
            }
            else if (grid[x][y] === 0 && neighbours === 3) {
                nextGen[x][y] = 1; // Birth
            }
            else {
                nextGen[x][y] = grid[x][y]; // Retains state
            }
        }
    }
    grid = nextGen; // update the grid
    genCounter++; // increase counter which represents current generation
    generation.innerText = "Generation "+genCounter;
}

function neighbourhoodPopulation(x, y) {
    let population = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            population += grid[x+i][y+j];
        }
    }
    return population;
}

function tick() {
    draw();
    if (run) {
        runEl.innerText = ("Pause");
        update();
    } else {
        runEl.innerText = ("Play")
    }
    requestAnimationFrame(tick);
}

function toggleCell(e) {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    let pos = convertClickPos(x, y);
    grid[pos.x][pos.y] = (!(grid[pos.x][pos.y])) + 0;
}

function convertClickPos(x, y) {
    let i = Math.floor((x/width)*cols);
    let j = Math.floor((y/height)*rows);
    return {x: i, y: j};
}

function genocide() {
    genCounter = 0; // reset counter for new grid
    generation.innerText = "Generation " + genCounter;
    grid = new2DArr(cols, rows, 0); // reset grid
}

let grid = new2DArr(cols, rows, 0);
let genCounter;
init();
tick();
