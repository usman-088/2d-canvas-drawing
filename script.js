const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Clear button
const clearButton = document.getElementById("clear");
const slider = document.getElementById("myRange");

const undoButton = document.getElementById("undo");
const redoButton = document.getElementById("redo");
// Set initial canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);
function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

// Variables to track drawing state
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let penColor = "white";
let drawingPath = [];
let lineWidth = 5;
let bgCanvas = "black";
let redoDrawingPath = [];
// Resize canvas while keeping the drawing
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.fillStyle = bgCanvas;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawEverything();
}

// Handle drawing
function startDrawing(e) {
  // e.preventDefault();
  isDrawing = true;
  lastX = e.clientX;
  lastY = e.clientY;
}

function stopDrawing() {
  // e.preventDefault();
  isDrawing = false;
}

function draw(e) {
  // e.preventDefault();
  if (!isDrawing) return;
  const pos = getMousePos(e);
  ctx.strokeStyle = penColor;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  drawingPath.push([lastX, lastY, pos.x, pos.y, penColor, lineWidth]);

  lastX = pos.x;
  lastY = pos.y;
  // console.log(drawingPath);
}

function drawEverything() {
  for (let i = 0; i < drawingPath.length; i++) {
    for (let j = 0; j < drawingPath[i].length; j += 6) {
      ctx.beginPath();
      ctx.strokeStyle = drawingPath[i][j + 4];
      ctx.lineWidth = drawingPath[i][j + 5];
      ctx.moveTo(drawingPath[i][j], drawingPath[i][j + 1]);
      ctx.lineTo(drawingPath[i][j + 2], drawingPath[i][j + 3]);
      ctx.stroke();
      ctx.closePath();
    }
  }
}

function undo() {
  if (drawingPath.length !== 0) {
    // console.log("orignal", drawingPath.length);
    ctx.fillStyle = bgCanvas;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    redoDrawingPath.push(drawingPath[drawingPath.length - 1]);
    drawingPath.pop();
    drawEverything();
  } else if (drawingPath.length === 2) {
    drawingPath = [];
  }
}

function redo() {
  if (redoDrawingPath.length === 0) return;
  ctx.fillStyle = bgCanvas;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawingPath.push(redoDrawingPath[redoDrawingPath.length - 1]);
  redoDrawingPath.pop();
  drawEverything();
}

clearButton.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawingPath = [];
  lineWidth = 5;
  slider.value = 5;
});

slider.addEventListener("input", () => {
  lineWidth = slider.value;
});

// Event listeners
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("touchstart", startDrawing, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });
canvas.addEventListener("touchend", stopDrawing, { passive: false });

undoButton.addEventListener("click", undo);
redoButton.addEventListener("click", redo);

window.addEventListener("resize", resizeCanvas);

// Color buttons
const bgcolors = ["green", "black", "white", "yellow", "blue", "red"];
const colorButton = document.querySelector(".colorButton");
bgcolors.forEach((color, i) => {
  const button = document.createElement("button");
  button.style.backgroundColor = color;
  button.style.width = "50px";
  button.style.height = "50px";
  button.style.position = "absolute";
  button.style.left = i * 50 + "px";
  button.style.bottom = "0px";
  button.style.margin = "10px";
  button.addEventListener("click", () => {
    ctx.fillStyle = color;
    bgCanvas = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawEverything();
  });
  colorButton.appendChild(button);
});
const penButton = document.querySelector(".penButton");
penButton.style.display = "flex";
penButton.style.flexDirection = "column";
penButton.style.position = "absolute";
penButton.style.right = "10px";
penButton.style.top = "100px";
bgcolors.forEach((color, i) => {
  const button = document.createElement("button");
  button.style.backgroundColor = color;
  button.style.width = "20px";
  button.style.height = "20px";

  button.addEventListener("click", () => {
    penColor = color;
    // drawEverything();
  });
  penButton.appendChild(button);
});
