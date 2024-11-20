const grid = document.getElementById('grid');
const cellSize = 25;

let IS_START_SELECTED = false, IS_END_SELECTED = false, CURRENT_SELECTOR = "";

const startSelector = document.getElementById('start-selector');
const endSelector = document.getElementById('end-selector');
const resetButton = document.getElementById('reset');
resetButton.addEventListener('click', createGrid);

startSelector.addEventListener("click", (e) => {
    if (IS_START_SELECTED) return;
    e.target.classList.add("card");
    CURRENT_SELECTOR = 'start';
})

endSelector.addEventListener("click", (e) => {
    if (IS_END_SELECTED) return;
    e.target.classList.add("card");
    CURRENT_SELECTOR = 'end';
})

function createGrid() {
    IS_START_SELECTED = false, IS_END_SELECTED = false, CURRENT_SELECTOR = "";
    grid.innerHTML = '';

    const cols = Math.floor(window.innerWidth * 0.9 / cellSize);
    const rows = Math.floor((window.innerHeight * 0.5) / cellSize);

    grid.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
    grid.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.dataset.state = 'empty';
            cell.addEventListener('click', (e) => {
                if (IS_START_SELECTED && IS_END_SELECTED) return;
                if (CURRENT_SELECTOR === 'start' && !IS_START_SELECTED) {
                    IS_START_SELECTED = true;
                    setCellState(e.target, CURRENT_SELECTOR);
                    startSelector.classList.remove('card');
                } else if (!IS_END_SELECTED) {
                    IS_END_SELECTED = true;
                    setCellState(e.target, CURRENT_SELECTOR);
                    endSelector.classList.remove('card');
                };
            })
            grid.appendChild(cell);
        }
    }
}
function getCellByRowCol(row, col) {
    return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

function setCellState(cell, state) {
    cell.classList.remove(cell.dataset.state);

    cell.dataset.state = state;

    cell.classList.add(cell.dataset.state);
}

function isVisited(row, col) {
    return getCellByRowCol(row, col).dataset.state === 'visited';
}

function visitCell(row, col) {
    setCellState(getCellByRowCol(row, col), "visited");
}

function isEnd(row, col) {
    return getCellByRowCol(row, col).dataset.state === 'end';
}

createGrid();

window.addEventListener('resize', createGrid);
