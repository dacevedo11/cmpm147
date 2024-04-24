/* Focus Edits Here */

const lookup = [
  [1,1],
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null
];



function generateGrid(numCols, numRows) {
  let grid = [];

  // background code
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }

  // randomly determine size of room
  let roomWidth = floor(random(1, numCols));
  let roomHeight = floor(random(1, numRows));

  // randomly selecting the coordinates of the room
  let startX = floor(random(grid[0].length - roomWidth));
  let startY = floor(random(grid.length - roomHeight));

  // fill smaller room with secondary code
  for (let i = startY; i < startY + roomHeight && i < grid.length; i++) {
    for (let j = startX; j < startX + roomWidth && j < grid[i].length; j++) {
      grid[i][j] = ".";
    }
  }

  return grid;
}


function drawGrid(grid) {
  background(128);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (gridCheck(grid, i, j, ".")) {
        placeTile(i, j, floor(random(4)), 0);
      } else {
        drawContext(grid, i, j, ".", 4, 0);
      }

    }
  }
}




function gridCheck(grid, i, j, target) {
  if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length) {
    return grid[i][j] === target;
  } else {
    return false;
  }
}


function gridCode(grid, i, j, target) {
  // Define variables to store the codes for neighbors
  let northBit = gridCheck(grid, i - 1, j, target) ? 1 : 0;
  let southBit = gridCheck(grid, i + 1, j, target) ? 1 : 0;
  let eastBit = gridCheck(grid, i, j + 1, target) ? 1 : 0;
  let westBit = gridCheck(grid, i, j - 1, target) ? 1 : 0;

  // Form the 4-bit code using left shifts
  let code = (northBit << 0) + (southBit << 1) + (eastBit << 2) + (westBit << 3);

  return code;
}


function drawContext(grid, i, j, target, dti, dtj) {
  // Get the 4-bit code for this location and target
  let code = gridCode(grid, i, j, target);

  // Use the code as an index to get the tile offset pair from the lookup array
  let tileOffsetPair = lookup[code];

  // If tileOffsetPair is not null, draw the corresponding tile
  if (tileOffsetPair !== null) {
    let offsetX = tileOffsetPair[0];
    let offsetY = tileOffsetPair[1];
    placeTile(i + offsetX, j + offsetY, dti, dtj);
  }
}