var world;
var objects = [];
var restitution = 0;
var edgeBorder;

var gravity = Physics.behavior('constant-acceleration');
var b1 = Physics.behavior('body-impulse-response');
var b2 = Physics.behavior('body-collision-detection');
var b3 = Physics.behavior('sweep-prune');
var canvas = document.getElementById("viewport");

Physics(function (w) {

   world = w;

   var renderer = Physics.renderer('canvas', {
		el: 'viewport',
		width: canvas.width,
		height: canvas.height,
		styles: {
			'circle': {
				strokeStyle: 'rgb(0, 50, 0)',
				lineWidth: 1,
				fillStyle: 'rgb(151, 255, 151)',
				angleIndicator: false
			},
			'convex-polygon' : {
				strokeStyle: 'rgb(0, 5, 0)',
				lineWidth: 4,
				fillStyle: 'rgb(51, 255, 51)',
				angleIndicator: false
			}
		}
	});
	world.add(renderer);
	
	world.render();
	
	Physics.util.ticker.on(function(time, dt){
		world.step(time);
	});
	
	Physics.util.ticker.start();
	
	world.on('step', function(){
		world.render();
	});
	
	gravity.applyTo(objects);
	world.add(gravity);
	
	b1.applyTo(objects);
	b2.applyTo(objects);
	b3.applyTo(objects);
	world.add(b1);
	world.add(b2);
	world.add(b3);

	
});

var refreshBorder = function(){
	// Delete old border
	if(edgeBorder)
		world.remove(edgeBorder);
		
	// Add a new border
	var bounds = Physics.aabb(0,0,canvas.width,canvas.height);
	edgeBorder = Physics.behavior('edge-collision-detection', {
		aabb: bounds,
		restitution: restitution
	});
	world.add(edgeBorder);
	
	// Wake up objects that may be affected
	world.wakeUpAll();
};

// Resize canvas and reconstruct borders on window resize
window.onload = window.onresize = function() {
	// Resize canvas
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight
	
	refreshBorder();
}