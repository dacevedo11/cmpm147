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
let timeScale = 0.005;



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
  let randomNoiseScale = map(XXH.h32("tile:" + [i, j], worldSeed), 0, 4294967295, 0.5, 2.0);

  stroke(255, 0, 0);
  strokeWeight(2);

  let distanceFromCenter = dist(i, j, width / 2, height / 2);

  let xOffsetRange = map(distanceFromCenter, 0, dist(0, 0, width / 2, height / 2), -20, 20); // Adjust the range (5, 20) as needed
  let yOffsetRange = map(distanceFromCenter, 0, dist(0, 0, width / 2, height / 2), -20, 20); // Adjust the range (5, 20) as needed
  
  let noiseValueX = noise(i * randomNoiseScale, j * randomNoiseScale, frameCount * timeScale);
  let noiseValueY = noise(j * randomNoiseScale, i * randomNoiseScale, frameCount * timeScale);

  let xOffset = map(noiseValueX, 0, 1, -xOffsetRange, xOffsetRange);
  let yOffset = map(noiseValueY, 0, 1, -yOffsetRange, yOffsetRange);
  
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
      fill(255, 215, 0);
      ellipse(0, 0, 20, 20);
      fill(255, 255, 0);
      ellipse(0, 0, 14, 14);
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
