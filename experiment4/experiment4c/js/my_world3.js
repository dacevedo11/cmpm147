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
  captureLocations[[ego.i, ego.j]] = true;

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
    return true;
  }
  if (j >= 0 && j < 8 && i <= 0) {
    return 5 - i + j / 8 < millis() / 500;
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
  if (isLegalMove(i, j)) {
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

  if (isOccupiedByOpponent(i, j)) {
    image(blackPawnImage, -tw / 2, -th / 2);
  }

  if (ego.i === i && ego.j === j) {
    image(whitePawnImage, -tw / 2, -th / 2);
  }
}

function isLegalMove(i, j) {
  if (!isOnBoard(i, j) || !isInPlay(i, j)) {
    return false;
  }

  let direction = 1;
  if (ego.i + direction === i && ego.j === j) {
    return true;
  }
  
  if (ego.i + direction === i && Math.abs(ego.j - j) === 1) {
    if (isOccupiedByOpponent(i, j)) {
      return true;
    }
  }

  return false;
}

function applyMove(i, j) {
  if (!isLegalMove(i, j)) {
    return;
  }

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
