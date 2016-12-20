var canvas = document.getElementById('derp');
var ctx = canvas.getContext('2d');
var nodes = [];
var MAX_NODES = 100;
var MAX_DISTANCE = 100;

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    clear();
    spawnNodes();
    requestAnimationFrame(loop);
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fill();
}

function loop() {
    update();
    clear();
    draw();
    requestAnimationFrame(loop);
}

function update() {
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].update();
    }
}

function draw() {
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].draw();
    }
}

function spawnNodes() {
    for (var i = 0; i < MAX_NODES; i++) {
        var rx = Math.floor(Math.random() * canvas.width);
        var ry = Math.floor(Math.random() * canvas.height);
        nodes.push(new Node(rx, ry));
    }
}

function getNonZeroRandom(){
    var random = Math.floor(Math.random() * 5) - 2.5;
    if (random == 0) return getNonZeroRandom();
    return random;
}

function Node(x, y) {
    this.x = x;
    this.y = y;
    this.dx = getNonZeroRandom();
    this.dy = getNonZeroRandom();
    this.radius = 1;
    this.color = 'rgba(255, 255, 255, 0.5)';
    this.connections = [];
}

Node.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x + 3, this.y + 3, this.radius * 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    this.drawConnections();
}

Node.prototype.update = function () {
    this.checkConnections();
    if (this.x - this.radius * 2 < 0 || this.x + this.radius * 2 > canvas.width) this.dx = -this.dx;
    if (this.y - this.radius * 2 < 0 || this.y + this.radius * 2 > canvas.height) this.dy = -this.dy;
    this.x += this.dx;
    this.y += this.dy;
}

Node.prototype.checkConnections = function () {
    this.connections = [];
    for (var i = 0; i < nodes.length; i++) {
        var checkDistance = this.getDistance(nodes[i].x, nodes[i].y);
        if (nodes[i] !== this && (checkDistance <= MAX_DISTANCE && checkDistance >= -MAX_DISTANCE)) {
            var obj = {
                x: nodes[i].x,
                y: nodes[i].y,
                distance: checkDistance
            };
            this.connections.push(obj);
        }
    }
}

Node.prototype.getDistance = function (x2, y2) {
    return Math.sqrt(Math.pow(x2 - this.x, 2) + Math.pow(y2 - this.y, 2));
}

Node.prototype.drawConnections = function () {
    for (var i = 0; i < this.connections.length; i++) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.connections[i].x, this.connections[i].y);
        var opacity = this.connections[i].distance / 100;
        opacity = 1 - opacity;
        ctx.strokeStyle = 'rgba(255, 255, 255, ' + opacity + ')';
        ctx.stroke();
    }
}

init();