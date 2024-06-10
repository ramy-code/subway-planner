const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const colorPickerContainer = document.getElementById('color-picker-container');
const colorOptions = document.querySelectorAll('.color-option');

let nodes = [];
let isConnecting = false;
let startNode = null;
let currentColor = 'red';  // Default color

colorOptions.forEach(option => {
    option.addEventListener('click', (event) => {
        currentColor = event.target.dataset.color;
        colorOptions.forEach(opt => opt.style.borderColor = '#fff');  // Reset border color
        event.target.style.borderColor = '#000';  // Highlight selected color
    });
});

canvas.addEventListener('click', (event) => {
    const x = event.clientX;
    const y = event.clientY;
    const radius = 10;
    const color = currentColor;

    if (!isConnecting) {
        // Create a new node
        nodes.push({ x, y, radius, color });
        drawNode(x, y, radius, color);
    } else {
        // Find the nearest node to connect to
        const nearestNode = findNearestNode(x, y);
        if (nearestNode && nearestNode !== startNode) {
            // Draw path from startNode to nearestNode
            drawPath(startNode, nearestNode);
            isConnecting = false;
            startNode = null;
        }
    }
});

canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    const x = event.clientX;
    const y = event.clientY;

    // Find the nearest node to start connecting from
    startNode = findNearestNode(x, y);
    if (startNode) {
        isConnecting = true;
    }
});

function drawNode(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawPath(startNode, endNode) {
    ctx.beginPath();
    ctx.moveTo(startNode.x, startNode.y);
    ctx.lineTo(endNode.x, endNode.y);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

function findNearestNode(x, y) {
    let minDist = Infinity;
    let nearestNode = null;

    nodes.forEach(node => {
        const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
        if (dist < minDist) {
            minDist = dist;
            nearestNode = node;
        }
    });

    return nearestNode;
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    redraw();
});

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach(node => {
        drawNode(node.x, node.y, node.radius, node.color);
    });
    // Redraw paths
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            drawPath(nodes[i], nodes[j]);
        }
    }
}
