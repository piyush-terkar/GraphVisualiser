const grid = document.getElementById('grid');
const startSelector = document.getElementById('start-selector');
const endSelector = document.getElementById('end-selector');
const resetButton = document.getElementById('reset');
const DFSButton = document.getElementById("DFS");
const BFSButton = document.getElementById("BFS");
const errorToast = document.getElementById('liveToast');
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(errorToast)
const messageHolder = document.getElementById("message");

function showToast(message) {
    console.log(message);
    messageHolder.innerText = message;
    toastBootstrap.show();
}

BFSButton.addEventListener("click", async (e) => {
    if (!IS_START_SELECTED || !IS_END_SELECTED) { showToast("Select a Start Node and Target Node to proceed"); return; }
    showToast("BFS is an unweighted Algorithm that guarantees shortest Path!")
    await visualiseAlgo("BFS", START, END);
})
DFSButton.addEventListener("click", async (e) => {
    if (!IS_START_SELECTED || !IS_END_SELECTED) { showToast("Select a Start Node and Target Node to proceed"); return; }
    showToast("DFS is an unweighted Algorithm that does NOT guarantees shortest Path!")
    await visualiseAlgo("DFS", START, END);
})

const NODE_SIZE = 25;
let TOTAL_NODES;
let IS_START_SELECTED = false, IS_END_SELECTED = false, CURRENT_SELECTOR = "";
let INPUT_GRAPH = [];
let START, END;

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
            node["data-aos"] = "flip-left";
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

    if (CURRENT_SELECTOR === 'start' && !IS_START_SELECTED) {
        IS_START_SELECTED = true;
        setnodeState(e.target, CURRENT_SELECTOR);
        START = e.target.dataset.node;
        e.target.dataset.state = CURRENT_SELECTOR;
    } else if (CURRENT_SELECTOR === 'end' && !IS_END_SELECTED) {
        IS_END_SELECTED = true;
        setnodeState(e.target, CURRENT_SELECTOR);
        END = e.target.dataset.node;
        e.target.dataset.state = CURRENT_SELECTOR;
    } else {
        setnodeState(e.target, 'wall');
    }
}


function startOrEndSelector(e, selector) {
    if (IS_END_SELECTED) return;
    showToast(`Click anywhere on the screen to place the ${selector} node`)
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
    const nodeState = getNodeById(id).dataset.state;
    return nodeState === 'visited' || nodeState === 'start' || nodeState === 'wall';
}

function visitnode(id) {
    const node = getNodeById(id);
    if (node.dataset.state !== 'start' || node.dataset.state !== 'end') {
        setnodeState(node, "visited");
    }
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
    return adjList;
}

const highlightPath = async (path) => {
    for (let i = 0; i < path.length; i++) {
        let node = getNodeById(path[i])
        if (node.dataset.state !== "start" || node.dataset.state !== 'end') {
            setnodeState(node, "path");
        }
        await new Promise(resolve => setTimeout(() => { resolve() }, 2));
    }
}
const visualiseAlgo = async (algorithmName, start, end) => {
    let adjList = createAjacencyList(INPUT_GRAPH);
    let shortestPath = [];
    switch (algorithmName) {
        case "DFS":
            if (!await DFS(adjList, start, end, shortestPath)) {
                showToast("No Path Found!!, is node surrounded by walls?");
                break;
            };
            await highlightPath(shortestPath);
            break;
        case "BFS":
            console.log("IN BFS");
            if (!await BFS(adjList, start, end, shortestPath)) {
                showToast("No Path Found!!, is node surrounded by walls?");
                break;
            }
            await highlightPath(shortestPath);
            break; 
        default:
            break;
    }
}

const DFS = async (adjList, start, end, path) => {
    if (start == end) return true;
    visitnode(start);
    path.push(start);
    await new Promise(resolve => setTimeout(() => { resolve() }, 5));

    for (let i = 0; i < adjList[start].length; i++) {
        if (!isVisited(adjList[start][i])) {
            if (await DFS(adjList, adjList[start][i], end, path)) return true;
        }
    }

    return false;
}

const BFS = async (adjList, start, end, path) => {

    visitnode(start);
    const queue = [start];
    const parent = {};
    parent[start] = null;

    while (queue.length > 0) {

        let node = queue.pop();
        if (node == end) {
            let current = end;
            while (current != null) {
                path.unshift(current);
                current = parent[current];
            }
            return true;
        }

        for (let i = 0; i < adjList[node].length; i++) {
            let neighbour = adjList[node][i];
            if (!isVisited(neighbour)) {
                visitnode(neighbour);
                parent[neighbour] = node;
                await new Promise(resolve => setTimeout(() => { resolve() }, 5));
                queue.unshift(neighbour);
            }
        }
    }
    return false;
}