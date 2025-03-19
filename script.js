const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Clear button
const clearButton = document.getElementById("clear");

// Set initial canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Variables to track drawing state
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let penColor = "white";
let drawingPath = [];

// Resize canvas while keeping the drawing
function resizeCanvas() {
  // Create a temporary image
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");

  // Set temp canvas size to current canvas size
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  // Copy current drawing to temp canvas
  tempCtx.drawImage(canvas, 0, 0);

  // Resize the main canvas
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Redraw the stored image (scaled to fit new canvas size)
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
}

// Handle drawing
function startDrawing(e) {
  isDrawing = true;
  lastX = e.clientX;
  lastY = e.clientY;
}

function stopDrawing() {
  isDrawing = false;
}

function draw(e) {
  if (!isDrawing) return;

  ctx.strokeStyle = penColor;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.clientX, e.clientY);
  ctx.stroke();
  drawingPath.push([lastX, lastY, e.clientX, e.clientY, penColor]);
  lastX = e.clientX;
  lastY = e.clientY;
  console.log(drawingPath);
}

function drawEverything() {
  for (let i = 0; i < drawingPath.length; i++) {
    for (let j = 0; j < drawingPath[i].length; j += 5) {
      ctx.beginPath();
      ctx.strokeStyle = drawingPath[i][j + 4];
      ctx.moveTo(drawingPath[i][j], drawingPath[i][j + 1]);
      ctx.lineTo(drawingPath[i][j + 2], drawingPath[i][j + 3]);
      ctx.stroke();
      ctx.closePath();
    }
  }
}

clearButton.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawingPath = [];
});

// Event listeners
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", stopDrawing);

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
