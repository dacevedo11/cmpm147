// Experiment 02 - Living Impressions
// Author: Daniel Acevedo
// Date:  4/15/2024

/* exported setup, draw */
let seed = 0;
let clouds = [];
let numClouds;

const minCloudSpeed = 0.1;
const maxCloudSpeed = 0.5;
const cloudColors = ["#BCAFDB", "#979DCC", "#A75B89", "#B9A8D2", "#F0C2E7", "#F1B5D9"];
const skyColor = "#3852A0";

function setup() {
  let canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");

  $(window).resize(function () {
    resizeScreen();
  });
  resizeScreen();

  $("#reimagine").on("click", () => {
    seed++;
    resetClouds();
  });
  
  resetClouds();
}

function resizeScreen() {
  let canvasContainer = $("#canvas-container");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  resetClouds();
}

function resetClouds() {
  clouds = [];
  numClouds = int(random(5, 50)); // Randomize the number of clouds
  for (let i = 0; i < numClouds; i++) {
    let cloud = {
      x: random(0, width),
      y: random(50, height),
      speed: random(minCloudSpeed, maxCloudSpeed),
      size: random(50, 120),
      color: random(cloudColors)
    };
    clouds.push(cloud);
  }
}

function draw() {
  randomSeed(seed);
  background(skyColor);

  // Update and display clouds
  for (let i = 0; i < numClouds; i++) {
    clouds[i].x += clouds[i].speed; // Update cloud position using variable speed
    if (clouds[i].x > width + 100) { // Adjust the condition for cloud wrap-around
      clouds[i].x = -100;
      clouds[i].y = random(50, height / 2);
    }
    let c = clouds[i];
    makeCloud(c.x, c.y, c.size, c.color, i);
  }
}

function makeCloud(x, y, size, color, index) {
  fill(color);
  noStroke();
  ellipse(x, y, size, size * 0.7);
  ellipse(x + size * 0.2, y + size * 0.2, size, size * 0.7);
  ellipse(x - size * 0.4, y + size * 0.2, size, size * 0.7);
  
  // Check if the mouse is over the cloud
  if (mouseIsPressed && dist(mouseX, mouseY, x, y) < size * 0.5) {
    clouds[index].color = random(cloudColors); // Change cloud color
  }
}
