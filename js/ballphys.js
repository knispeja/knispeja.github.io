const REDRAW_INTERVAL = 10; // Time between frames
const VEL_LOWER_BOUND = 0.45;
const VEL_FASTER_BOUND = VEL_LOWER_BOUND*2;

var balls = [];
var xGrav = 0;
var yGrav = 0.1;
var drawLock = false;

function Ball(x, y){

	this.elasticity = 0.6;
	this.radius = randRange(8, 12);

	this.r = randRange(0, 190);
	this.g = randRange(180, 210);
	this.b = randRange(240, 255);
	this.color = "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + " 1.00)";
	
	this.x = x;
	this.y = y;
	
	this.xVel = 0;
	this.yVel = 0;

	this.draw = function(){
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.radius, 2*Math.PI, 0);
		ctx.fill();
	}
	
	this.update = function(){
		this.x += this.xVel;
		this.y += this.yVel;
		
		this.xVel += xGrav;
		this.yVel += yGrav;
		
		var xElast = this.elasticity;
		var yElast = this.elasticity;
		
		// Bottom bound
		if((this.y + this.radius) > canvas.height){
			this.y = canvas.height - this.radius;
			this.yVel *= -yElast;

			if(Math.abs(this.yVel) < VEL_LOWER_BOUND){
				this.yVel = 0;
			}
		}
		// Right bound
		if((this.x + this.radius) > canvas.width){
			this.x = canvas.width - this.radius;
			this.xVel *= -xElast;
			if(Math.abs(this.xVel) < VEL_LOWER_BOUND){
				this.xVel = 0;
			}
		}
		// Left bound
		else if((this.x - this.radius) < 0){
			this.x = this.radius;
			this.xVel *= -xElast;
			if(Math.abs(this.xVel) < VEL_LOWER_BOUND){
				this.xVel = 0;
			}
		}
	}

	this.isCollidingWith = function(other){
		var dist = Math.pow(this.x-other.x, 2) + Math.pow(this.y-other.y, 2);
		return dist <= Math.pow(this.radius + other.radius, 2); // change to return null or collision vector/point?
	}
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function randRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var drawLoop = function(){

	if(!drawLock){
		// Clear the background
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for(i=balls.length-1; i>=0; i--){
		
			// Draw the ball
			ball = balls[i];
			ball.draw();

			// Update the ball's position
			ball.update();
		}
	}
	else{
		drawLock = false;
	}
	
	// Set to redraw after a certain period
	drawtimerid = setTimeout(drawLoop, REDRAW_INTERVAL);
}

function init(){

	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');

	resize();

	canvas.style.backgroundColor = '#00003D'
	
	canvas.addEventListener('click', function(event) {
		balls.push(new Ball(event.pageX, event.pageY));
	});
	
	drawtimerid = setTimeout(drawLoop, REDRAW_INTERVAL);
}

function resize(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	drawLock = true;
}

window.onresize = resize;
window.onload = init;