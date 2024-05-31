let Background;
let Tower;
let lines = [];
let backgroundGraphics; // Used to store the background drawing
let maxLines = 1000;

let mouseXCoord = 0;
let mouseYCoord = 0;
const circleRadius = 100;

let showOriginal = false; // New state variable
let specialEffect = 0; // Used to switch between different effects

class Line {
  constructor(x1, y1, x2, y2, color, thickness, moveHorizontally, direction) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.color = color;
    this.thickness = thickness;
    this.moveHorizontally = moveHorizontally; // Whether to move horizontally
    this.direction = direction; // Moving direction
  }

  draw() {
    stroke(this.color);
    strokeWeight(this.thickness);
    line(this.x1, this.y1, this.x2, this.y2);
  }

  update() {
    // Check if the midpoint of the line is within the circle range
    let midX = (this.x1 + this.x2) / 2;
    let midY = (this.y1 + this.y2) / 2;
    let distanceToMouse = dist(midX, midY, mouseXCoord, mouseYCoord);

    if (distanceToMouse < circleRadius) {
      // Calculate the offset of the line midpoint relative to the center of the circle
      let offsetX1 = this.x1 - mouseXCoord;
      let offsetY1 = this.y1 - mouseYCoord;
      let offsetX2 = this.x2 - mouseXCoord;
      let offsetY2 = this.y2 - mouseYCoord;

      // Rotation angle
      let angle = radians(3); // Rotate 3 degrees per frame

      // Calculate new relative coordinates
      let newOffsetX1 = offsetX1 * cos(angle) - offsetY1 * sin(angle);
      let newOffsetY1 = offsetX1 * sin(angle) + offsetY1 * cos(angle);
      let newOffsetX2 = offsetX2 * cos(angle) - offsetY2 * sin(angle);
      let newOffsetY2 = offsetX2 * sin(angle) + offsetY2 * cos(angle);

      // Calculate new absolute coordinates
      this.x1 = newOffsetX1 + mouseXCoord;
      this.y1 = newOffsetY1 + mouseYCoord;
      this.x2 = newOffsetX2 + mouseXCoord;
      this.y2 = newOffsetY2 + mouseYCoord;

      this.thickness = 20; // Set the thickness of the line segment, you can adjust it as needed
    } else {
      // Update moving direction based on the angle of the line
      let angle = atan2(this.y2 - this.y1, this.x2 - this.x1);
      if (this.moveHorizontally) {
        this.x1 += this.direction * 1 * cos(angle); // Control movement speed
        this.x2 += this.direction * 1 * cos(angle); // Control movement speed
        this.y1 += this.direction * 1 * sin(angle); // Control movement speed
        this.y2 += this.direction * 1 * sin(angle); // Control movement speed
      }
    }

    // Change line color and thickness based on special effect
    if (specialEffect === 1) {
      this.color = color(random(255), random(255), random(255));
    } else if (specialEffect === 2) {
      // Change color and thickness based on line position
      let distanceToCenter = dist((this.x1 + this.x2) / 2, (this.y1 + this.y2) / 2, windowWidth / 2, windowHeight / 2);
      let colorBrightness = map(distanceToCenter, 0, sqrt(windowWidth * windowWidth + windowHeight * windowHeight) / 2, 255, 0);
      this.color = color(colorBrightness);
      this.thickness = map(distanceToCenter, 0, sqrt(windowWidth * windowWidth + windowHeight * windowHeight) / 2, 30, 85);
    }
  }
}

function preload() {
  Background = loadImage('asset/originalWork.jpg');
  Tower = loadImage('asset/tower.png');
}

function setup() {
  frameRate(60);
  createCanvas(windowWidth, windowHeight);

  // Generate background image
  backgroundGraphics = createGraphics(windowWidth, windowHeight);
  Tower.resize(windowWidth, windowHeight);

  generateBackground();
  redraw(); // Force redraw once to draw immediately after setup
}

function draw() {
  if (showOriginal) {
    // Show original work
    image(Background, 0, 0, windowWidth, windowHeight);
  } else {
    // Draw background
    image(backgroundGraphics, 0, 0, windowWidth, windowHeight);
    tint(255, 10);

    // Draw circle following mouse
    noStroke(); // Remove stroke
    fill(200, 200, 200, 2); // Set fill color to gray with 70% opacity
    circle(mouseXCoord, mouseYCoord, circleRadius * 2);

    // Draw pointillism background of Tower
    for (let i = 0; i < 25; i++) {
      addLine(Tower, false); // Lines of Tower do not move horizontally
      addLine(Background, true); // Lines of Background move horizontally
    }

    // Keep only the maximum number of lines
    while (lines.length > maxLines) {
      lines.shift();
    }

    // Update and draw lines
    for (let line of lines) {
      line.update(); // Update line position
      line.draw(); // Draw line
    }
  }
}

function generateBackground() {
  Background.resize(windowWidth, windowHeight);
  backgroundGraphics.resizeCanvas(windowWidth, windowHeight);

  backgroundGraphics.clear();

  for (let i = 0; i < 40000; i++) {
    const x1 = random(windowWidth);
    let y1 = random(windowHeight);
    let angle;
    if (y1 < windowHeight * 0.6) {
      angle = PI / 2 + random(-PI / 5, PI / 5);
    } else {
      angle = random(PI * 0.85, PI * 1.05); // Random angle between 85 and 105 degrees if y is greater than half the canvas height
    }
    const length = random(50); // Random length within 50
    const x2 = x1 + cos(angle) * length; // Calculate x coordinate of the end point based on angle and length
    const y2 = y1 + sin(angle) * length; // Calculate y coordinate of the end point based on angle and length
    const color = Background.get(x1, y1);
    const thickness = random(3, 10);
    backgroundGraphics.stroke(color);
    backgroundGraphics.strokeWeight(thickness);
    backgroundGraphics.line(x1, y1, x2, y2);
  }
}

function addLine(img, moveHorizontally) {
  const x1 = random(windowWidth);
  let y1 = random(windowHeight);
  let angle;
  let direction = 1;
  if (y1 > windowHeight * 0.3 && y1 < windowHeight * 0.6) {
    direction = -1;
  }
  if (y1 < windowHeight * 0.6) {
    angle = PI / 2 + random(-PI / 5, PI / 5);
  } else {
    angle = random(PI * 0.85, PI * 1.05); // Random angle between 85 and 105 degrees if y is greater than half the canvas height
  }
  const length = random(50); // Random length within 50
  const x2 = x1 + cos(angle) * length; // Calculate x coordinate of the end point based on angle and length
  const y2 = y1 + sin(angle) * length; // Calculate y coordinate of the end point based on angle and length
  const color = img.get(x1, y1);
  const thickness = random(3, 10);
  const line = new Line(x1, y1, x2, y2, color, thickness, moveHorizontally, direction);
  
  if (specialEffect === 2 && dist((x1 + x2) / 2, (y1 + y2) / 2, mouseXCoord, mouseYCoord) < circleRadius) {
    // Skip adding the line if it falls within the mouse circle radius
    return;
  }
  
  lines.push(line);
}
  
  function mouseMoved() {
    mouseXCoord = mouseX;
    mouseYCoord = mouseY;
  }
  
  function mouseDragged() {
    mouseXCoord = mouseX;
    mouseYCoord = mouseY;
  
    for (let line of lines) {
      line.thickness = random(10, 25); // Change thickness of all lines
    }
  }
  
  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    lines = []; 
    generateBackground(); 
    redraw(); 
  }
  
  function keyPressed() {
    if (key === ' ') { // Check if space bar is pressed
      showOriginal = !showOriginal; // Toggle state
    }
    if (key === '1') { // Press 1 to switch to effect 1
      specialEffect = 1;
    }
    if (key === '2') { // Press 2 to switch to effect 2
      specialEffect = 2;
    }
    if (key === '0') { // Press 0 to disable effect
      specialEffect = 0;
    }
  }
  