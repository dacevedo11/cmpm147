// my_design.js
// Author: Daniel Acevedo
// Date: May 05, 2024 

function getInspirations() {
    return [
        {
            name: "Albert Einstein",
            url: "https://cdn.glitch.global/212ba632-5883-4339-a059-a49b0c2c0c6b/einstein.jpg?v=1715140272091"
        },
        {
            name: "V-J Day in Times Square",
            url: "https://cdn.glitch.global/212ba632-5883-4339-a059-a49b0c2c0c6b/kiss.jpg?v=1715140275138",
        },
        {
            name: "Raising the Flag on Iwo Jima",
            url: "https://cdn.glitch.global/212ba632-5883-4339-a059-a49b0c2c0c6b/iwo-jima.jpg?v=1715140269314",
        }
    ];
}

function initDesign(inspiration) {
    // set the canvas size based on the aspect ratio of the image
    let canvasContainer = $('.image-container');
    let canvasWidth = canvasContainer.width();
    let aspectRatio = inspiration.image.height / inspiration.image.width;
    let canvasHeight = canvasWidth * aspectRatio;
    resizeCanvas(canvasWidth * 0.75, canvasHeight * 0.75);

    // add the original image to #original
    const imgHTML = `<img src="${inspiration.url}" style="width:${canvasWidth * 0.75}px;">`
    $('#original').empty();
    $('#original').append(imgHTML);

    let design = {
        bg: 128,
        fg: []
    }

    for (let i = 0; i < 500; i++) {
        design.fg.push({
            x: random(width),
            y: random(height),
            w: random(width / 3),
            h: random(height / 3),
            fill: random(255)
        });
    }
    return design;
}

function renderDesign(design, inspiration) {
    background(design.bg);
    noStroke();
    for (let box of design.fg) {
        fill(box.fill, 128);
        rect(box.x, box.y, box.w, box.h);
    }
}

function mutateDesign(design, inspiration, rate) {
    design.bg = mut(design.bg, 0, 255, rate);
    for (let box of design.fg) {
        box.fill = mut(box.fill, 0, 255, rate);
        box.x = mut(box.x, 0, width, rate);
        box.y = mut(box.y, 0, height, rate);
        box.w = mut(box.w, 0, width / 2, rate);
        box.h = mut(box.h, 0, height / 2, rate);
    }
}


function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}