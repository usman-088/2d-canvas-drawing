const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Clear button
const clearButton = document.getElementById("clear");
clearButton.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// Set initial canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Variables to track drawing state
let isDrawing = false;
let lastX = 0;
let lastY = 0;

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

  ctx.strokeStyle = "white";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.clientX, e.clientY);
  ctx.stroke();

  lastX = e.clientX;
  lastY = e.clientY;
}

// Event listeners
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);
window.addEventListener("resize", resizeCanvas);
