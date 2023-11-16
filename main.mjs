const DEFAULT_COLS = 200
const DEFAULT_ROWS = 200
let Grid = []
export const getGrid=()=>Grid
var potentialCells = [];
export const getPotentialCells = () => potentialCells;
const GridElement = document.getElementById('grid');
let simulationLoop
export const initGrid = () => {
    for (let i = 0; i < DEFAULT_ROWS; i++) {
        Grid.push(Array(DEFAULT_COLS).fill(-1));
    }
    renderGrid(Grid)

    GridElement.querySelectorAll('td').forEach(td => {
        td.addEventListener('click', () => {
            td.classList.toggle('alive')
        })
    })
}

export const updateGrid = (grid, potentialCells) => {
    // const { minX, maxX, minY, maxY } = boundary
    potentialCells.forEach(coord => {
        const [x, y] = coord
        const cellElement = document.querySelector(`[data-coord="${[x, y]}"`);
        // cellElement.dataset.coord = [x, y]
        if (grid[y][x] === 1) {
            cellElement.classList.add('alive');
        }
        if (grid[y][x] === -1) {
            cellElement.classList.contains('alive') && cellElement.classList.remove('alive')
        }
    })

    Grid = grid
}

const renderGrid = (grid) => {
    for (let y = 0; y <= DEFAULT_COLS; y++) {
        const rowElement = document.createElement('tr');

        for (let x = 0; x <= DEFAULT_ROWS; x++) {
            const cellElement = document.createElement('td');
            // cellElement.innerText = `${[x,y]}`
            cellElement.dataset.coord = [x, y]

            rowElement.appendChild(cellElement);
        }

        GridElement.appendChild(rowElement);
    }
    Grid = grid
}

const setStartData = () => {
    const activeCells = GridElement.querySelectorAll('.alive')
    activeCells.forEach((cell) => {
        const [x, y] = cell.dataset.coord.split(',').map(e => parseInt(e))
        // setBoundaries([x, y])
        Grid[y][x] = 1
    })
    getcellNeighbors()
    console.log();
}

export const startSimulation = () => {
    setStartData()
    // postMessage({ type: 'process', data: Grid })
}

export const stopSimulation = () => {
    clearInterval(simulationLoop)
}

export const getcellNeighbors = () => {
    potentialCells = []
    const cells = document.querySelectorAll('.alive')
    cells.forEach(c => {
        const [x, y] = c.dataset.coord.split(',').map(e => parseInt(e))

        const tmp = [[x, y],
        [y - 1, x - 1],
        [y - 1, x],
        [y - 1, x + 1],
        [y, x - 1],
        [y, x + 1],
        [y + 1, x - 1],
        [y + 1, x],
        [y + 1, x + 1]]

        tmp.forEach(c => {
            c.reverse()
            if (c[0] < DEFAULT_COLS && c[1] < DEFAULT_ROWS && !potentialCells.some(v => v[0] === c[0] && v[1] === c[1])) {
                potentialCells.push(c)
            }
        })
    })
}

export const reset = () => {
    stopSimulation()
    Grid.forEach((row) => row.fill(-1))
    potentialCells = []

    GridElement.querySelectorAll('.alive').forEach(elem => elem.classList.remove('alive'))

}

