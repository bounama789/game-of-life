importScripts('process.js')
// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  // The event data should contain the current state of the grid
  const [grid,potentialCells] = event.data.data;

  // Call the process function
  process(grid,potentialCells);
});
