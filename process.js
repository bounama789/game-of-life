const DEFAULT_COLS = 200
const DEFAULT_ROWS = 200
const process = async (Grid, potentialCells) => {

    const getNeighborsCount = ([x, y]) => {
        let count = 0
        count += y > 0 && x > 0 && Grid[y - 1][x - 1] == 1 ? 1 : 0
        count += y > 0 && Grid[y - 1][x] == 1 ? 1 : 0
        count += y > 0 && x < DEFAULT_COLS - 1 && Grid[y - 1][x + 1] == 1 ? 1 : 0
        count += x > 0 && Grid[y][x - 1] == 1 ? 1 : 0
        count += x < DEFAULT_COLS - 1 && Grid[y][x + 1] == 1 ? 1 : 0
        count += y < DEFAULT_ROWS - 1 && x > 0 && Grid[y + 1][x - 1] == 1 ? 1 : 0
        count += y < DEFAULT_ROWS - 1 && Grid[y + 1][x] == 1 ? 1 : 0
        count += x < DEFAULT_COLS - 1 && y < DEFAULT_ROWS - 1 && Grid[y + 1][x + 1] == 1 ? 1 : 0
        return count
    }

    let newGrid = Array.from({ length: DEFAULT_ROWS }, () => Array(DEFAULT_COLS).fill(-1));
    potentialCells.forEach(coord => {
        const [x, y] = coord
        const neighborsCount = getNeighborsCount([x, y])
        if (neighborsCount > 3 || neighborsCount < 2) {
            if (newGrid[y]) {
                newGrid[y][x] = -1
            }
        }
        else if (neighborsCount === 3) {
            if (newGrid[y]) {
                newGrid[y][x] = 1
            }
        } else newGrid[y][x] = Grid[y][x]
    })
    let batches = []
    const batchSize = 20
    for (let i = 0; i < potentialCells.length; i += batchSize) {
        const batch = potentialCells.slice(i, i + batchSize);
        batches.push(postMessage({ type: 'updateGrid', data: { grid: newGrid, potentialCells: batch } })
        )
    }
    await Promise.all(batches)
    // getcellNeighbors()
    postMessage({ type: 'getcellNeighbors' })

    requestAnimationFrame(() => postMessage({ type: 'process' }));
}


