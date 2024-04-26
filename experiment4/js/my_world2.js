"use strict";

// live site: https://cmpm147experiment3-2.glitch.me

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

function p3_preload() {}

function p3_setup() {}

let worldSeed

let noiseScale;
let timeScale = 0.005; // Adjust this value to control the speed of time-based changes



function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}

function p3_drawBefore() {
  background("#87CEEB");
}

function p3_drawTile(i, j) {
  let randomNoiseScale = map(XXH.h32("tile:" + [i, j], worldSeed), 0, 4294967295, 0.5, 2.0); // Map the hash value to a range of noiseScale

  // Set stroke color to red
  stroke(255, 0, 0);
  
  // Set stroke weight (thickness) to 2 pixels
  strokeWeight(2);

  // Calculate distance from the center of the grid
  let distanceFromCenter = dist(i, j, width / 2, height / 2);

  // Map distance to a range for the horizontal and vertical offsets
  let xOffsetRange = map(distanceFromCenter, 0, dist(0, 0, width / 2, height / 2), -20, 20); // Adjust the range (5, 20) as needed
  let yOffsetRange = map(distanceFromCenter, 0, dist(0, 0, width / 2, height / 2), -20, 20); // Adjust the range (5, 20) as needed
  
  // Calculate noise values based on tile position and time
  let noiseValueX = noise(i * randomNoiseScale, j * randomNoiseScale, frameCount * timeScale);
  let noiseValueY = noise(j * randomNoiseScale, i * randomNoiseScale, frameCount * timeScale);

  // Map noise values to horizontal and vertical offsets within their respective ranges
  let xOffset = map(noiseValueX, 0, 1, -xOffsetRange, xOffsetRange);
  let yOffset = map(noiseValueY, 0, 1, -yOffsetRange, yOffsetRange);
  
  // Apply horizontal and vertical offsets to tile position
  translate(xOffset, yOffset);

  if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
    fill("#0504aa");

    push();

    beginShape();
    vertex(-tw, 0);
    vertex(0, th);
    vertex(tw, 0);
    vertex(0, -th);
    endShape(CLOSE);

    let n = clicks[[i, j]] | 0;
    if (n % 2 == 1) {
      fill(255, 215, 0); // Set fill color to yellow gold
      ellipse(0, 0, 20, 20); // Draw a circle for the coin
      fill(255, 255, 0); // Set fill color to bright yellow
      ellipse(0, 0, 14, 14); // Draw a smaller circle inside for shine effect
    }

    pop();
  }
}


function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {}
