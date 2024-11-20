const grid = document.getElementById('grid');
const startSelector = document.getElementById('start-selector');
const endSelector = document.getElementById('end-selector');
const resetButton = document.getElementById('reset');

const NODE_SIZE = 25;
let TOTAL_NODES;
let IS_START_SELECTED = false, IS_END_SELECTED = false, CURRENT_SELECTOR = "";
let INPUT_GRAPH = [];

resetButton.addEventListener('click', createGrid);
startSelector.addEventListener("click", (e) => startOrEndSelector(e, "start"))
endSelector.addEventListener("click", (e) => startOrEndSelector(e, "end"))

function createGrid() {
    IS_START_SELECTED = false, IS_END_SELECTED = false, CURRENT_SELECTOR = "";
    grid.innerHTML = '';

    const cols = Math.floor(window.innerWidth * 0.9 / NODE_SIZE);
    const rows = Math.floor((window.innerHeight * 0.7) / NODE_SIZE);

    console.log(rows, cols);
    TOTAL_NODES = rows * cols;
    grid.style.gridTemplateColumns = `repeat(${cols}, ${NODE_SIZE}px)`;
    grid.style.gridTemplateRows = `repeat(${rows}, ${NODE_SIZE}px)`;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const node = document.createElement('div');
            node.className = 'node';
            node.dataset.row = row;
            node.dataset.col = col;
            let currNode = row * cols + col;
            node.dataset.node = currNode;
            node.dataset.state = 'empty';
            node.addEventListener('click', (e) => {
                nodeSelector(e);
            });
            grid.appendChild(node);
            if (col < cols - 1) INPUT_GRAPH.push([currNode, currNode + 1]) //RIGHT
            if (row < rows - 1) INPUT_GRAPH.push([currNode, currNode + cols]) //DOWN 
        }
    }
}


function nodeSelector(e) {

    if ((IS_START_SELECTED && IS_END_SELECTED) || CURRENT_SELECTOR === "") return;
    if (CURRENT_SELECTOR === 'start' && !IS_START_SELECTED) {
        IS_START_SELECTED = true;
        setnodeState(e.target, CURRENT_SELECTOR);
        startSelector.classList.remove('card');
    } else if (!IS_END_SELECTED) {
        IS_END_SELECTED = true;
        setnodeState(e.target, CURRENT_SELECTOR);
        endSelector.classList.remove('card');
    };
}


function startOrEndSelector(e, selector) {
    if (IS_END_SELECTED) return;
    e.target.classList.add("card");
    CURRENT_SELECTOR = selector;
}

function getNodeByRowCol(row, col) {
    return document.querySelector(`.node[data-row="${row}"][data-col="${col}"]`);
}

function getNodeById(id) {
    return document.querySelector(`.node[data-node="${id}"]`);
}

function setnodeState(node, state = "empty") {
    node.classList.remove(node.dataset.state);

    node.dataset.state = state;

    node.classList.add(node.dataset.state);
}

function isVisited(id) {
    return getNodeById(id).dataset.state === 'visited';
}

function visitnode(id) {
    setnodeState(getNodeById(id), "visited");
}

function isEnd(id) {
    return getNodeById(id).dataset.state === 'end';
}

createGrid();

window.addEventListener('resize', createGrid);

const createAjacencyList = (input) => {
    let adjList = [];
    for (let i = 0; i < TOTAL_NODES; i++) adjList[i] = [];

    for (let i = 0; i < input.length; i++) {
        let u = input[i][0], v = input[i][1];
        adjList[u].push(v);
        adjList[v].push(u);
    }
    console.log(adjList);
}

createAjacencyList(INPUT_GRAPH);