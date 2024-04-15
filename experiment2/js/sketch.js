// Experiment 02 - Living Impressions
// Author: Daniel Acevedo
// Date:  4/15/2024

// Kept resizeScreen() function from template
function resizeScreen() {
  centerHorz = canvasContainer.width() / 2;
  centerVert = canvasContainer.height() / 2;
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
}

// Listener for reimagine button. Borrowed from Wes. 
$("#reimagine").click(function () {
  seed++;
});

// ====================================================
// Imported from Glitch.com

let seed = 0;
let cloudx = [];
let cloudy = [];
let numClouds = 50;

const cloudSpeed = 0.25;
const cloudColors = ["#BCAFDB", "#979DCC", "#A75B89", "#B9A8D2", "#F0C2E7", "#F1B5D9"];
const skyColor = "#3852A0";

function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  $(window).resize(function () {
    resizeScreen();
  });
  resizeScreen();
}

function draw() {
  randomSeed(seed);
  background(skyColor);

  for (let i = 0; i < numClouds; i++) {
      cloudx.push(random(0, width));
      cloudy.push(random(50, height));
    }

  // Update and display clouds
  for (let i = 0; i < numClouds; i++) {
    cloudx[i] += cloudSpeed; // Update cloud position using constant speed
    if (cloudx[i] > width + 100) { // Adjust the condition for cloud wrap-around
      cloudx[i] = -100;
      cloudy[i] = random(50, height / 2);
    }
    makeCloud(cloudx[i], cloudy[i]);
  }
}

function makeCloud(x, y) {
  let cloudColor = random(cloudColors);
  fill(cloudColor);
  noStroke();
  ellipse(x, y, 70, 50);
  ellipse(x + 10, y + 10, 70, 50);
  ellipse(x - 20, y + 10, 70, 50);
}
