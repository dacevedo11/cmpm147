"use strict";

// Project base code provided by {amsmith,ikarth}@ucsc.edu

/* global
  DOWN_ARROW
  LEFT_ARROW
  RIGHT_ARROW
  UP_ARROW
  background
  createCanvas
  createInput
  createP
  height
  keyIsDown
  mouseX
  mouseY
  p5
  translate
  width
*/

let tile_width_step_main; // A width step is half a tile's width
let tile_height_step_main; // A height step is half a tile's height

// Global variables. These will mostly be overwritten in setup().
let tile_rows, tile_columns;
let camera_offset;
let camera_velocity;

/////////////////////////////
// Transforms between coordinate systems
// These are actually slightly weirder than in full 3d...
/////////////////////////////
function worldToScreen([world_x, world_y], [camera_x, camera_y]) {
  let i = (world_x - world_y) * tile_width_step_main;
  let j = (world_x + world_y) * tile_height_step_main;
  return [i + camera_x, j + camera_y];
}

function worldToCamera([world_x, world_y], [camera_x, camera_y]) {
  let i = (world_x - world_y) * tile_width_step_main;
  let j = (world_x + world_y) * tile_height_step_main;
  return [i, j];
}

function tileRenderingOrder(offset) {
  return [offset[1] - offset[0], offset[0] + offset[1]];
}

function screenToWorld([screen_x, screen_y], [camera_x, camera_y]) {
  screen_x -= camera_x;
  screen_y -= camera_y;
  screen_x /= tile_width_step_main * 2;
  screen_y /= tile_height_step_main * 2;
  screen_y += 0.5;
  return [Math.floor(screen_y + screen_x), Math.floor(screen_y - screen_x)];
}

function cameraToWorldOffset([camera_x, camera_y]) {
  let world_x = camera_x / (tile_width_step_main * 2);
  let world_y = camera_y / (tile_height_step_main * 2);
  return { x: Math.round(world_x), y: Math.round(world_y) };
}

function worldOffsetToCamera([world_x, world_y]) {
  let camera_x = world_x * (tile_width_step_main * 2);
  let camera_y = world_y * (tile_height_step_main * 2);
  return new p5.Vector(camera_x, camera_y);
}

function preload() {
  if (window.p2_preload) {
    window.p2_preload();
  }
}

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent("c3");

  camera_offset = new p5.Vector(-width / 2, height / 2);
  camera_velocity = new p5.Vector(0, 0);

  if (window.p2_setup) {
    window.p2_setup();
  }

  let label = createP();
  label.html("World key: ");
  label.parent("c3");

  let input = createInput("lucky?");
  input.parent(label);
  input.input(() => {
    rebuildWorld(input.value());
  });
  
  rebuildWorld(input.value());
}

function rebuildWorld(key) {
  if (window.p2_worldKeyChanged) {
    window.p2_worldKeyChanged(key);
  }
  tile_width_step_main = window.p2_tileWidth ? window.p2_tileWidth() : 32;
  tile_height_step_main = window.p2_tileHeight ? window.p2_tileHeight() : 14.5;
  tile_columns = Math.ceil(width / (tile_width_step_main * 2));
  tile_rows = Math.ceil(height / (tile_height_step_main * 2));
}

function mouseClicked() {
  let world_pos = screenToWorld(
    [0 - mouseX, mouseY],
    [camera_offset.x, camera_offset.y]
  );

  if (window.p2_tileClicked) {
    window.p2_tileClicked(world_pos[0], world_pos[1]);
  }
}

function draw() {
  // Keyboard controls!
  if (keyIsDown(LEFT_ARROW)) {
    camera_velocity.x -= 1;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    camera_velocity.x += 1;
  }
  if (keyIsDown(DOWN_ARROW)) {
    camera_velocity.y -= 1;
  }
  if (keyIsDown(UP_ARROW)) {
    camera_velocity.y += 1;
  }

  let camera_delta = new p5.Vector(0, 0);
  camera_velocity.add(camera_delta);
  camera_offset.add(camera_velocity);
  camera_velocity.mult(0.95); // cheap easing
  if (camera_velocity.mag() < 0.01) {
    camera_velocity.setMag(0);
  }

  let world_pos = screenToWorld(
    [0 - mouseX, mouseY],
    [camera_offset.x, camera_offset.y]
  );
  let world_offset = cameraToWorldOffset([camera_offset.x, camera_offset.y]);

  background(100);

  if (window.p2_drawBefore) {
    window.p2_drawBefore();
  }

  let overdraw = 0.1;

  let y0 = Math.floor((0 - overdraw) * tile_rows);
  let y1 = Math.floor((1 + overdraw) * tile_rows);
  let x0 = Math.floor((0 - overdraw) * tile_columns);
  let x1 = Math.floor((1 + overdraw) * tile_columns);

  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      drawTile(tileRenderingOrder([x + world_offset.x, y - world_offset.y]), [
        camera_offset.x,
        camera_offset.y
      ]); // odd row
      drawTile(
        tileRenderingOrder([
          x + 0.5 + world_offset.x,
          y + 0.5 - world_offset.y
        ]),
        [camera_offset.x, camera_offset.y]
      ); // even rows are offset horizontally
    }
  }

  describeMouseTile(world_pos, [camera_offset.x, camera_offset.y]);

  if (window.p2_drawAfter) {
    window.p2_drawAfter();
  }
}

// Display a discription of the tile at world_x, world_y.
function describeMouseTile([world_x, world_y], [camera_x, camera_y]) {
  let [screen_x, screen_y] = worldToScreen(
    [world_x, world_y],
    [camera_x, camera_y]
  );
  drawTileDescription([world_x, world_y], [0 - screen_x, screen_y]);
}

function drawTileDescription([world_x, world_y], [screen_x, screen_y]) {
  translate(screen_x, screen_y);
  if (window.p2_drawSelectedTile) {
    window.p2_drawSelectedTile(world_x, world_y, screen_x, screen_y);
  }
  translate(0 - screen_x, -screen_y);
}

// Draw a tile, mostly by calling the user's drawing code.
function drawTile([world_x, world_y], [camera_x, camera_y]) {
  let [screen_x, screen_y] = worldToScreen(
    [world_x, world_y],
    [camera_x, camera_y]
  );
  translate(0 - screen_x, screen_y);
  if (window.p2_drawTile) {
    window.p2_drawTile(world_x, world_y,  - screen_x, screen_y);
  }
  translate(-(0 - screen_x), -screen_y);
}

"use strict";

/* global
  XXH
  applyMatrix
  background
  beginShape
  ellipse
  endShape
  fill
  height
  line
  millis
  noFill
  noStroke
  noiseSeed
  pop
  push
  randomSeed
  rect
  stroke
  strokeWeight
  text
  textSize
  translate
  vertex
  width
  CLOSE

  camera_offset
  camera_velocity
*/

let whitePawnImage;
let blackPawnImage;

function p2_preload() {
  whitePawnImage = loadImage('https://cdn.glitch.global/5cabbf55-f07b-407a-8d41-48189ca4f7b0/whitePawn.PNG?v=1714085320560');
  blackPawnImage = loadImage('https://cdn.glitch.global/5cabbf55-f07b-407a-8d41-48189ca4f7b0/blackPawn.PNG?v=1714085519671');
}

function p2_setup() {
  whitePawnImage.resize(tw, th);
  blackPawnImage.resize(tw, th);
}

let worldSeed;
let captureLocations;
let ego;

function p2_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  randomSeed(worldSeed);

  captureLocations = {};
  ego = { i: 0, j: 0, altitude: 0 };
  captureLocations[[ego.i, ego.j]] = true; // start location should be clear

  camera_offset.x = -width / 2 + 4 * tw;
  camera_offset.y = height / 2 - 2 * th;
}

function p2_tileWidth() {
  return 48;
}

function p2_tileHeight() {
  return 32;
}

function isOnBoard(i, j) {
  if (i == 0 && j == 0) {
    return true; // one tile is always visible
  }
  if (j >= 0 && j < 8 && i <= 0) {
    return 5 - i + j / 8 < millis() / 500; // tile appear over time with delay
  }
}

function isInPlay(i, j) {
  return true;
}

let [tw, th] = [p2_tileWidth(), p2_tileHeight()];

function isOccupiedByOpponent(i, j) {
  if (isInPlay(i, j) && XXH.h32("opponent at " + [i, j], worldSeed) % 3 == 0) {
    if (!captureLocations[[i, j]]) {
      return true;
    }
  } else {
    return false;
  }
}

function p2_tileClicked(i, j) {
  // Check if the clicked tile corresponds to a legal move for the selected pawn
  if (isLegalMove(i, j)) {
    // Apply the move
    applyMove(i, j);
  }
}

function p2_drawBefore() {
  background(240);

  push();
  translate(-camera_offset.x - tw, camera_offset.y + th * 1.5);
  textSize(36);
  noStroke();
  fill(0, 255 * (1 - 1000 / millis()));
  applyMatrix(1, th / tw, 0, 1, 0, 0);
  pop();
}

function p2_drawTile(i, j) {
  if (!isOnBoard(i, j)) {
    return;
  }

  if ((i + j) % 2 === 0) {
    fill(81, 103, 44);
  } else {
    fill(249, 249, 225);
  }

  noStroke();
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

   // Draw pawn images instead of generated pawns
  if (isOccupiedByOpponent(i, j)) {
    image(blackPawnImage, -tw / 2, -th / 2);
  }

  // Draw opponent's piece if present
  if (ego.i === i && ego.j === j) {
    image(whitePawnImage, -tw / 2, -th / 2);
  }
}

function isLegalMove(i, j) {
  // Check if the tile is on the board and part of the playable area
  if (!isOnBoard(i, j) || !isInPlay(i, j)) {
    return false;
  }

  // Determine the direction of movement based on the player's side
  let direction = 1; // Assuming pawns move upwards
  // Check if the target tile is one square forward
  if (ego.i + direction === i && ego.j === j) {
    return true;
  }
  
  // Check for diagonal capture
  if (ego.i + direction === i && Math.abs(ego.j - j) === 1) {
    if (isOccupiedByOpponent(i, j)) {
      return true; // Return true if the target tile contains an opponent's piece
    }
  }

  return false;
}

function applyMove(i, j) {
  // Check if the move is legal
  if (!isLegalMove(i, j)) {
    return; // If the move is not legal, do nothing
  }

  // Move the pawn to the new position
  ego.i = i;
  ego.j = j;
}

function p2_drawSelectedTile(i, j) {
  if (isLegalMove(i, j)) {
    ego.altitude = 10;
  } else {
    ego.altitude =0;
  }
}

function p2_drawAfter() {}
