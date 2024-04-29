// Experiment 04 - Infinite Worlds
// Author: Daniel Acevedo
// Date:  4/29/2024

// ========================
// Sketch 1
// ========================

var s1 = function (p) {
    "use strict";

    /* global p5, XXH */
    /* exported preload, setup, draw, mouseClicked */

    // Project base code provided by {amsmith,ikarth}@ucsc.edu

    let tile_width_step_main; // A width step is half a tile's width
    let tile_height_step_main; // A height step is half a tile's height

    // Global variables. These will mostly be overwritten in setup().
    let tile_rows, tile_columns;
    let camera_offset;
    let camera_velocity;
    let worldSeed;
    let noiseScale = 1; // Adjust this value to control the frequency of the noise
    let timeScale = 0.005; // Adjust this value to control the speed of time-based changes
    let clicks = {};

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

    p.preload = function () {
        if (window.p3_preload) {
            window.p3_preload();
        }
    }

    p.setup = function () {
        let canvas = p.createCanvas(400, 300);
        canvas.parent("c1");

        camera_offset = new p5.Vector(-p.width / 2, p.height / 2);
        camera_velocity = new p5.Vector(0, 0);

        if (window.p3_setup) {
            window.p3_setup();
        }

        let label = p.createP();
        label.html("World key: ");
        label.parent("c1");

        let input = p.createInput("xyzzy");
        input.parent(label);
        input.input(() => {
            rebuildWorld(input.value());
        });

        p.createP("Arrow keys scroll. Clicking changes tiles.").parent("c1");

        rebuildWorld(input.value());
    }

    p.rebuildWorld = function (key) {
        if (window.p3_worldKeyChanged) {
            window.p3_worldKeyChanged(key);
        }
        tile_width_step_main = window.p3_tileWidth ? window.p3_tileWidth() : 32;
        tile_height_step_main = window.p3_tileHeight ? window.p3_tileHeight() : 14.5;
        tile_columns = Math.ceil(p.width / (tile_width_step_main * 2)); // Updated width reference
        tile_rows = Math.ceil(p.height / (tile_height_step_main * 2)); // Updated height reference
    }

    p.mouseClicked = function () {
        let world_pos = screenToWorld(
            [0 - mouseX, mouseY],
            [camera_offset.x, camera_offset.y]
        );

        if (window.p3_tileClicked) {
            window.p3_tileClicked(world_pos[0], world_pos[1]);
        }
        return false;
    }

    p.draw = function() {
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

        if (window.p3_drawBefore) {
            window.p3_drawBefore();
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
            }
            for (let x = x0; x < x1; x++) {
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

        if (window.p3_drawAfter) {
            window.p3_drawAfter();
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
        push();
        translate(screen_x, screen_y);
        if (window.p3_drawSelectedTile) {
            window.p3_drawSelectedTile(world_x, world_y, screen_x, screen_y);
        }
        pop();
    }

    // Draw a tile, mostly by calling the user's drawing code.
    function drawTile([world_x, world_y], [camera_x, camera_y]) {
        let [screen_x, screen_y] = worldToScreen(
            [world_x, world_y],
            [camera_x, camera_y]
        );
        push();
        translate(0 - screen_x, screen_y);
        if (window.p3_drawTile) {
            window.p3_drawTile(world_x, world_y, -screen_x, screen_y);
        }
        pop();
    }

    function p3_preload() { }

    function p3_setup() { }

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

    function p3_tileClicked(i, j) {
        let key = [i, j];
        clicks[key] = 1 + (clicks[key] | 0);
    }

    function p3_drawBefore() { }

    function p3_drawTile(i, j) {
        noStroke();

        // Calculate distance from the center of the grid
        let distanceFromCenter = dist(i, j, width / 2, height / 2);

        // Map distance to a range for the vertical offset
        let yOffsetRange = map(distanceFromCenter, 0, dist(0, 0, width / 2, height / 2), 5, 20); // Adjust the range (5, 20) as needed

        // Calculate noise value based on tile position and time
        let noiseValue = noise(i * noiseScale, j * noiseScale, frameCount * timeScale);

        // Map noise value to vertical offset within the range
        let yOffset = map(noiseValue, 0, 1, -yOffsetRange, yOffsetRange);

        // Apply vertical offset to tile position
        translate(0, yOffset);

        if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
            fill(81, 103, 44);
        } else {
            fill(249, 249, 225);
        }

        push();

        beginShape();
        vertex(-tw, 0);
        vertex(0, th);
        vertex(tw, 0);
        vertex(0, -th);
        endShape(CLOSE);

        let n = clicks[[i, j]] | 0;
        if (n % 2 == 1) {
            fill(0, 0, 0, 32);
            ellipse(0, 0, 10, 5);
            translate(0, -10);
            fill(255, 255, 100, 128);
            ellipse(0, 0, 10, 10);
        }

        pop();
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

    function p3_drawAfter() { }


}

var myp5 = new p5(s1, 'c1');

