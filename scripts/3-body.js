let canvas = document.getElementById("3body");
let ctx = canvas.getContext("2d");

let w = parseInt(canvas.getAttribute("width"));
let h = parseInt(canvas.getAttribute("height"));

let camcords = [0,0];

class Planet {
    // Properties
    constructor (memory,maxmass,color,x=undefined,y=undefined,v=undefined) {
        // TODO: make a circular start in stead of a square start
        this.x = Math.random()*w/2+w/4;
        this.y = Math.random()*h/2+h/4;
        let angle = Math.random()*2*Math.PI;
        let velocity = (w+h)/50*Math.random();
        this.velocity = [velocity*Math.cos(angle),velocity*Math.sin(angle)];
        this.history = [[0,0]];
        this.historylen = memory;
        this.mass = 100 //Math.random()*maxmass;
        this.r = 25;
        this.r_gradient = 50;
        this.color = color;
        this.lastPos = [this.x,this.y];
        this.a = [0,0];
    }
    drawhistory() {
        //Draw history
        ctx.moveTo(this.history[0][0]-camcords[0],this.history[0][1]-camcords[1]);
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        for (let i = 1; i < this.history.length; i++) {
            ctx.lineTo(this.history[i][0]-camcords[0],this.history[i][1]-camcords[1])
        }
        ctx.stroke();
    }
    draw() {
        
        //TODO: make gradient from this.color to black
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x-camcords[0], this.y-camcords[1], this.r, 0, 2*Math.PI);
        ctx.fill();

        // Draw speed vector
        ctx.beginPath();
        ctx.strokeStyle = "orange";
        ctx.lineWidth = 4;
        let vscale = 1;
        ctx.moveTo(this.x-camcords[0],this.y-camcords[1]);
        ctx.lineTo(this.x+this.velocity[0]*vscale-camcords[0],this.y+this.velocity[1]*vscale-camcords[1])
        ctx.stroke();

        // Draw acceleration vector
        ctx.beginPath();
        ctx.strokeStyle = "green";
        let ascale = 25;
        ctx.moveTo(this.x-camcords[0],this.y-camcords[1]);
        ctx.lineTo(this.x+this.a[0]*ascale-camcords[0],this.y+this.a[1]*ascale-camcords[1]);
        ctx.stroke();
    }
    update(otherplanets) {
        // Move
        let alpha = 0.1
        this.x += this.velocity[0]*alpha;
        this.y += this.velocity[1]*alpha;
        this.history.push([this.x,this.y]);
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
    let averagecord = [0,0];
    for (let i = 0; i < planets.length; i++) {
        planets[i].update_lastpos()
        averagecord[0] += planets[i].x;
        averagecord[1] += planets[i].y;
    }
    averagecord[0] = averagecord[0] / planets.length-w/2;
    averagecord[1] = averagecord[1] / planets.length-h/2;
    camcords = averagecord;
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,w,h);
    ctx.fill();
    for (i = 0; i<planets.length;i++) {
        planets[i].drawhistory(ctx); 
    }
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