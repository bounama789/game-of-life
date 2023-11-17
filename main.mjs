const GridElement = document.getElementById('grid');
const cellSize = 5
const DEFAULT_COLS = 350
const DEFAULT_ROWS = 350
let Grid = []
let cycle = 0
let population = 0
const Cells = new Map()
var PotentialCells = [];
let simulationLoop

const cycleElement = document.querySelector('#cycle')
const popElement = document.querySelector('#pop')

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

export const updateGrid = (grid) => {
    PotentialCells.forEach(coord => {
        const [y, x] = coord
        const cellElement = Cells.get(`${[x, y]}`)
        if (cellElement != undefined) {
            if (grid[y][x] === 1) {
                cellElement.classList.add('alive');
            }
            if (grid[y][x] === -1) {
                cellElement.classList.contains('alive') && cellElement.classList.remove('alive')
            }
        }
    })
    Grid = grid
}

const renderGrid = (grid) => {
    for (let y = 0; y <= DEFAULT_COLS; y++) {
        const rowElement = document.createElement('tr');
        for (let x = 0; x <= DEFAULT_ROWS; x++) {
            const cellElement = document.createElement('td');
            cellElement.dataset.coord = [x, y]
            Cells.set(`${[x, y]}`, cellElement)
            cellElement.style.minWidth = cellSize + 'px'
            cellElement.style.height = cellSize + 'px'
            rowElement.appendChild(cellElement);
        }
        GridElement.appendChild(rowElement);
    }
    Grid = grid
}

const setStartData = () => {
    getActiveCells()
    getcellNeighbors()
}

export const startSimulation = () => {
    setStartData()
    // process()
    simulationLoop = setInterval(process,1)
}

export const stopSimulation = () => {
    clearInterval(simulationLoop)
}

export const getcellNeighbors = () => {
    PotentialCells = []
    const cells = Array.from(Cells.values()).filter((td) => td.classList.contains('alive'))
    cells.forEach(c => {
        const [x, y] = c.dataset.coord.split(',').map(e => parseInt(e))

        const tmp = [[y, x],
        [y - 1, x - 1],
        [y - 1, x],
        [y - 1, x + 1],
        [y, x - 1],
        [y, x + 1],
        [y + 1, x - 1],
        [y + 1, x],
        [y + 1, x + 1]]

        tmp.forEach(c => {
            if (c[0] < DEFAULT_COLS && c[1] < DEFAULT_ROWS && !PotentialCells.some(a => a[0] === c[0] && a[1] === c[1])) {
                PotentialCells.push(c)
            }
        })
    })
}

export const reset = () => {
    stopSimulation()
    Grid.forEach((row) => row.fill(-1))
    PotentialCells = []

    getActiveCells().forEach(elem => elem.classList.remove('alive'))

}

const process = () => {
    let newGrid = Array.from({ length: DEFAULT_ROWS }, () => Array(DEFAULT_COLS).fill(-1));
    PotentialCells.forEach(coord => {
        const [y, x] = coord
        const neighborsCount = getNeighborsCount([x, y])
        if (newGrid[y] != undefined && newGrid[y][x] != undefined) {
            if (neighborsCount > 3 || neighborsCount < 2) {
                newGrid[y][x] = -1
            }
            else if (neighborsCount === 3) {
                newGrid[y][x] = 1
            } else newGrid[y][x] = Grid[y][x]
        }
    })
    updateGrid(newGrid)
    population = getActiveCells().length
    getcellNeighbors()
    cycle++
    cycleElement.innerText = cycle
    popElement.innerText = population
    // requestAnimationFrame(process)
}


const getNeighborsCount = ([x, y]) => {
    let count = 0
    count += y > 0 && x > 0 && Grid[y - 1][x - 1] == 1 ? 1 : 0
    count += y > 0 && Grid[y][x] != undefined && Grid[y - 1][x] == 1 ? 1 : 0
    count += y > 0 && x < DEFAULT_COLS - 1 && Grid[y - 1][x + 1] == 1 ? 1 : 0
    count += x > 0 && Grid[y] != undefined && Grid[y][x - 1] == 1 ? 1 : 0
    count += x < DEFAULT_COLS - 1 && Grid[y] != undefined && Grid[y][x + 1] == 1 ? 1 : 0
    count += y < DEFAULT_ROWS - 1 && x > 0 && Grid[y + 1][x - 1] == 1 ? 1 : 0
    count += y < DEFAULT_ROWS - 1 && Grid[y + 1][x] == 1 ? 1 : 0
    count += x < DEFAULT_COLS - 1 && y < DEFAULT_ROWS - 1 && Grid[y + 1][x + 1] == 1 ? 1 : 0
    return count
}

const getActiveCells = () => {
    const cells = Array.from(Cells.entries())
        .filter(([, value]) => value.classList.contains('alive'))

    const activeCells = []
    cells.forEach(c => {
        const [x, y] = c[0].split(',').map(n => parseInt(n))
        Grid[y][x] = 1
        activeCells.push(c[1])
    })
    return activeCells
}