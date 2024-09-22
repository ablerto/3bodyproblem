let canvas = document.getElementById("3body");
let ctx = canvas.getContext("2d");

let width = parseInt(canvas.getAttribute("width"));
let height = parseInt(canvas.getAttribute("height"));

class Planet {
    // Properties
    constructor (canvas_width,canvas_height,memory,maxmass,color) {
        this.x = Math.random()*canvas_width/2+canvas_width/4;
        this.y = Math.random()*canvas_height/2+canvas_height/4;
        this.angle = Math.random()*2*Math.PI;
        this.velocity = (canvas_width+canvas_height)/10*Math.random();
        this.history = [];
        this.historylen = memory;
        this.mass = Math.random()*maxmass;
        this.r = 25;
        this.r_gradient = 50;
        this.color = color;
    }
    draw(ctx) {
        console.log(this.color);
        ctx.fillStyle = this.color;
        ctx.arc(this.x,this.y,this.r,0,2*Math.PI)
        ctx.fill();
    }
}
function draw(ctx,w,h,planets) {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,w,h);
    ctx.fill();
    ctx.fillStyle = "blue";
    for (i = 0; i<planets.length;i++) {
        planets[i].draw(ctx);
    }
}
let planet1 = new Planet(width,height,100,300,"red");
let planet2 = new Planet(width,height,100,300,"orange");
let planets = [planet1, planet2];
draw(ctx,width,height,planets);