let canvas = document.getElementById("3body");
let ctx = canvas.getContext("2d");

let w = parseInt(canvas.getAttribute("width"));
let h = parseInt(canvas.getAttribute("height"));

class Planet {
    // Properties
    constructor (memory,maxmass,color) {
        // TODO: make a circular start in stead of a square start
        this.x = Math.random()*w/3+w/4;
        this.y = Math.random()*h/3+h/4;
        let angle = Math.random()*2*Math.PI;
        let velocity = (w+h)/100*Math.random();
        this.velocity = [0,0] //[velocity*Math.cos(angle),velocity*Math.sin(angle)];
        this.history = [];
        this.historylen = memory;
        this.mass = 100 //Math.random()*maxmass;
        this.r = 25;
        this.r_gradient = 50;
        this.color = color;
        this.lastPos = [this.x,this.y];
        this.a = [0,0];
    }
    draw() {
        //TODO: make gradient from this.color to black
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
        ctx.fill();

        // Draw speed vector
        ctx.beginPath();
        ctx.strokeStyle = "orange";
        ctx.lineWidth = 4;
        ctx.moveTo(this.x,this.y);
        let vscale = 10;
        ctx.lineTo(this.x+this.velocity[0]*vscale,this.y+this.velocity[1]*vscale)
        ctx.stroke();

        // Draw acceleration vector
        ctx.beginPath();
        ctx.strokeStyle = "green";
        let ascale = 100;
        ctx.moveTo(this.x,this.y);
        ctx.lineTo(this.x+this.a[0]*ascale,this.y+this.a[1]*ascale);
        ctx.stroke();
        console.log([this.x,this.y],[this.x+this.a[0]*ascale,this.y+this.a[1]*ascale]);
    }
    update(otherplanets) {
        // Move
        let alpha = 0.1
        this.x += this.velocity[0]*alpha;
        this.y += this.velocity[1]*alpha;
        // Accelerate
        this.a = [0, 0];
        let gamma = 1;

        for (let i = 0; i < otherplanets.length; i++) {
            let dx = this.x-otherplanets[i][0]; // x-distance between planets
            let dy = this.y-otherplanets[i][1]; // y-distance between planets
            let distkvadrat = Math.sqrt(dx**2+dy**2)
            let a = gamma*otherplanets[i][2] / (distkvadrat)
            let angle = 0;

            if (dx == 0) {
                angle = Math.PI/2*(dy/Math.abs(dy))
            } else {
                angle = Math.atan(Math.abs(dy/dx))
            }
            this.a[0] -= a*Math.cos(angle)*(dx/Math.abs(dx)) //gamma*otherplanets[i][2] / Math.ceil(distkvadrat)*(dx/Math.abs(dx));
            this.a[1] -= a*Math.sin(angle)*(dy/Math.abs(dy)) //gamma*otherplanets[i][2] / Math.ceil(distkvadrat)*(dy/Math.abs(dy));
        }

        this.velocity = [this.velocity[0]+this.a[0],this.velocity[1]+this.a[1]]
    }
    update_lastpos() {
        this.lastPos = [this.x,this.y];
    }
}

let planet1 = new Planet(100,300,"red");
let planet2 = new Planet(100,300,"blue");
let planets = [planet1, planet2];

// create n planets
for (let i = 0; i < 1; i++) {
    planets.push(new Planet(100,300,"yellow"));
}

function update() {
    for (i = 0; i < planets.length; i++) {
        let otherplanets = [];
        for (let ii = 0; ii < planets.length; ii++) {
            if (ii != i) {
                otherplanets.push([planets[ii].x,planets[ii].y,planets[ii].mass])
                //otherplanets.push([planets[ii].lastPos[0],planets[ii].lastPos[1],planets[ii].mass])
            }
        }
        planets[i].update(otherplanets);
    }
    for (let i = 0; i < planets.length; i++) {
        planets[i].update_lastpos()
    }
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,w,h);
    ctx.fill();
    for (i = 0; i<planets.length;i++) {
        planets[i].draw(ctx); 
    }
}

let looptest = 0;
let total_time = 0;
let lastframetime = 0;
function loop(time) {
    if (time >= lastframetime + 41) { // check if new frame
        looptest++;
        document.getElementById("looptest").innerHTML = looptest;
        lastframetime = time;
        update();
    }
    draw();
    requestAnimationFrame(loop);
}
//update();
//draw();
requestAnimationFrame(loop);