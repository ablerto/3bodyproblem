let canvas = document.getElementById("3body");
let ctx = canvas.getContext("2d");

let w = parseInt(canvas.getAttribute("width"));
let h = parseInt(canvas.getAttribute("height"));

class Planet {
    // Properties
    constructor (memory,maxmass,color) {
        // TODO: make a circular start in stead of a square start
        this.x = Math.random()*w/2+w/4;
        this.y = Math.random()*h/2+h/4;
        this.angle = Math.random()*2*Math.PI;
        this.velocity = (w+h)/100*Math.random();
        this.history = [];
        this.historylen = memory;
        this.mass = Math.random()*maxmass;
        this.r = 25;
        this.r_gradient = 50;
        this.color = color;
    }
    draw() {
        //TODO: make gradient from this.color to black
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
        ctx.fill();
        // Draw speed vector
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.moveTo(this.x,this.y);
        let vscale = 10;
        ctx.lineTo(this.x+Math.cos(this.angle)*this.velocity*vscale,
                   this.y+Math.sin(this.angle)*this.velocity*vscale);
        ctx.stroke();
    }
    update() {
        
    }
}

let planet1 = new Planet(100,300,"red");
let planet2 = new Planet(100,300,"blue");
let planets = [planet1, planet2];

// create n planets
for (let i = 0; i < 5; i++) {
    planets.push(new Planet(100,300,"yellow"));
}

function update() {

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
    if (time >= lastframetime + 100) { // check if 100ms has passed
        looptest++;
        document.getElementById("looptest").innerHTML = looptest;
        lastframetime = time;
    }
    draw();
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);