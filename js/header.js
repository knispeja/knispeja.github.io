
//                    12         1        2         3         4          5    6(dwn/dsk)    7         8         9		  10        11
//var timeToColor = ['000029', '00003D', '000042', '000048', '000054', '000066', 'E68240', 'FFCC99', '4775FF', '3366FF', '2E5CE6', '1947D1', 		// AM
//				   '1947D1', '2E5CE6', '3366FF', '4775FF', 'FFCC99', 'E68240', '000066', '000054', '000048', '000042', '00003D', '000029'];		// PM

const REDRAW_INTERVAL = 10; // Time between frames
const TIME_INTERVAL = 30000; // How often to check if the time has changed
const OOB_INTERVAL = 200;
const LANDSCAPE_DRAW_WAIT = 80;

const PERCENT_SKY = 1;
const PERCENT_LANDSCAPE = .3;

const LSCAPE_MAX_STEEPNESS = 5;
const LSCAPE_MAX_SLOPE_CHANGE = 1;

const MOON_X = 900;
const MOON_Y = 10;
const MOON_RAD = 45;

var maxClouds = 6;
var clouds = [];
var drawLock = false;

var stars = [];
var numStars = 300;

var landscape = [];
var lastSlope = LSCAPE_MAX_STEEPNESS + 1;

var now = new Date();

var initialized = false;

var canvas;
var ctx;

var drawtimerid;

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function randRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Cloud()
{
	this.radj = 0;

	this.r = randRange(17, 19);
	this.g = randRange(18, 21);
	this.b = randRange(27, 30);

	this.width = randRange(76, 150);
	this.height = randRange(8, 23);
	
	this.velocity = randRange(1, 30)/10;

	this.x = -this.width;
	this.yRatio = randRange(-4, PERCENT_SKY*100)/100;
	
	this.lumps = [];
	this.splits = [];
	this.lumpOverlap = this.width/20;
	this.numLumps = randRange(2, this.width/33);
	this.minLumpSize = this.width/5;
	this.splits.push(0);
	for(i=0; i<this.numLumps-1; i++){
		if(this.numLumps == 2)
			this.splits.push(randRange(this.minLumpSize, this.width-this.minLumpSize));
		else
		{
			this.splits.push(randRange(this.minLumpSize, (this.width/2)-this.minLumpSize));
			this.splits.push(randRange((this.width/2)+this.minLumpSize, this.width-this.minLumpSize));
			break;
		}
	}
	this.splits.push(this.width);
	for(i=0; i<this.numLumps; i++){
		this.lumps.push((this.splits[i+1] - this.splits[i])/2);
	}

	// TODO: Make clouds light up more when near the moon
	this.draw = function(ctx, canvas){
		this.y = this.yRatio * canvas.height;
		this.halfHeight = this.height/2;
		
		ctx.fillStyle = this.color;
		roundRect(ctx, this.x, this.y, this.width, this.height, this.halfHeight, true, false);

		for(var i=0; i<this.numLumps; i++){
			ctx.beginPath();
			var adjust = 0;
			if(i != 0)
				adjust = this.lumpOverlap;

			ctx.arc(this.x + this.splits[i] + this.lumps[i] - adjust, this.y+this.halfHeight, this.lumps[i] + (adjust), Math.PI, 0);
			ctx.fill();
		}
	}

	this.moveRight = function() {
		this.x += this.velocity;
		this.radj = Math.floor(Math.abs(canvas.width - (MOON_X - this.x)) * (50/canvas.width));
		this.rx = this.r + this.radj;
		this.gx = this.g + this.radj;
		this.bx = this.b + this.radj;
		this.color = "rgba(" + this.rx + ", " + this.gx + ", " + this.bx + ", " + " 1)";
	}
	
	this.speedUp = function(){
		this.velocity += 1;
	}
	
	this.slowDown = function(){
		this.velocity -= 1;
	}
}

/**
 * Star
 * 
 * @param int x
 * @param int y
 * @param int length
 * @param opacity
 */
function Star(x, y, length, opacity) {

	this.x = parseInt(x);
	this.y = parseInt(y);
	this.length = parseInt(length);
	this.opacity = opacity;
	this.factor = 1;
	this.increment = Math.random() * .03;

	this.draw = function(ctx, canvas) {

		// Save the context
		ctx.save();
		
		// move into the middle of the canvas, just to make room
		ctx.translate(this.x, this.y);
		
		// Change the opacity
		if(this.opacity > 1) {
			this.factor = -1;
		}
		else if(this.opacity <= 0) {
			this.factor = 1;
			
			this.x = Math.round(Math.random() * maxW);
			this.y = Math.round(Math.random() * maxH);
		}
			
		this.opacity += this.increment * this.factor;
		
		ctx.beginPath();
		ctx.arc(this.x, this.y,this.length,0,2*Math.PI);

		ctx.shadowBlur = 5;
		ctx.shadowColor = '#ffff33';

		ctx.fillStyle = "rgba(255, 255, 200, " + this.opacity + ")";
		ctx.fill();
		
		ctx.restore();
	}
}

function generateClouds()
{
	if(clouds.length < maxClouds)
	{
		clouds.push(new Cloud());
	}
	setTimeout(generateClouds, randRange(250, 32000));
}

function generateStars()
{
	stars = [];

	// Calculate the screen size
	maxH = canvas.height * PERCENT_SKY * .5;
	maxW = canvas.width;
	
	// Create all the stars
	for(var i = 0; i < numStars; i++) {
		var x = Math.round(Math.random() * maxW);
		var y = Math.round(Math.random() * maxH)
		var length = 1 + Math.random() * 2;
		var opacity = Math.random();
		
		// Create a new star and draw
		var star = new Star(x, y, length, opacity);
		
		// Add the the stars array
		stars.push(star);
	}
}

function generateLandscape()
{
	while(landscape.length > canvas.width)
		landscape.pop();

	var maxHeight = PERCENT_LANDSCAPE * canvas.height;
	var minHeight = PERCENT_SKY * canvas.height;

	var pixel = 0;
	var height = (landscape.length == 0) ? Math.random() * maxHeight : landscape[landscape.length - 1];
	var slope = (lastSlope > LSCAPE_MAX_STEEPNESS) ? ((Math.random() - 0.5) * 2) * LSCAPE_MAX_STEEPNESS : lastSlope;
	var slopechange;

	while(landscape.length < canvas.width)
	{
		landscape.push(height);

		height += slope;
		if(height > maxHeight || height < minHeight)
		{
			slope = -slope;
			height += slope * 2;
		}

		slopechange = ((Math.random() - 0.5) * 2) * LSCAPE_MAX_SLOPE_CHANGE;
		slope += slopechange;
		if(slope > LSCAPE_MAX_STEEPNESS)
			slope -= slopechange * 2;
	}
}

/**
* Draws a rounded rectangle using the current state of the canvas. 
* If you omit the last three params, it will draw a rectangle 
* outline with a 5 pixel border radius 
* @param {CanvasRenderingContext2D} ctx
* @param {Number} x The top left x coordinate
* @param {Number} y The top left y coordinate 
* @param {Number} width The width of the rectangle 
* @param {Number} height The height of the rectangle
* @param {Number} radius The corner radius. Defaults to 5;
* @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
* @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
*/
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
	if (typeof stroke == "undefined" ) {
		stroke = true;
	}
	if (typeof radius === "undefined") {
		radius = 5;
	}
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
	if (stroke) {
		ctx.stroke();
	}
	if (fill) {
		ctx.fill();
	}        
}

var drawLoop = function(){

	// Clear the background
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Display test
	ctx.font="76px Tahoma";
	ctx.fillStyle='white';
	ctx.fillText("Jacob Knispel", 150, 100);
	
	// Draw the stars
	for(i=stars.length-1; i>=0; i--){
		stars[i].draw(ctx, canvas);
	}

	// Color of moon
	ctx.fillStyle = '#FFFFFF';

	// Draw moon
	ctx.beginPath();
	ctx.arc(MOON_X,MOON_Y,MOON_RAD,0,2*Math.PI);	// TODO: make sun/moon travel vertically as well as horz
	ctx.fill();

	// Draw the clouds & move them along
	for(i=clouds.length-1; i>=0; i--){
		cloud = clouds[i];
		cloud.draw(ctx, canvas);

		if(!drawLock)
		{
			cloud.moveRight();
			if(cloud.x > canvas.width)
				clouds.splice(i, 1);
		}
	}
	
	// Draw the landscape
	ctx.strokeStyle = "#111111";
	ctx.lineWidth = 2;
	for(i=0; i<landscape.length; i++){
		ctx.beginPath();
		ctx.moveTo(i, canvas.height);
		ctx.lineTo(i, canvas.height - landscape[i]);
		ctx.stroke();
	}
	
	// Set to redraw after a certain period
	if(drawLock)
		drawLock = false;
	else
		drawtimerid = setTimeout(drawLoop, REDRAW_INTERVAL);
	
}

var landscapetimer;
var oobstarstimer;
function resize(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	clearTimeout(landscapetimer);
	landscapetimer = setTimeout(generateLandscape, LANDSCAPE_DRAW_WAIT);

	clearTimeout(oobstarstimer);
	oobstarstimer = setTimeout(generateStars, OOB_INTERVAL);
	
	drawLock = true;
	drawLoop();
}

function init(){

	if(!initialized) {
		canvas = document.getElementById('canvas');
		ctx = canvas.getContext('2d');
	}

	resize();

	generateClouds();

	canvas.style.backgroundColor = '#00003D'
	
	drawtimerid = setTimeout(drawLoop, REDRAW_INTERVAL);
}

window.onresize = resize;
window.onload = init;