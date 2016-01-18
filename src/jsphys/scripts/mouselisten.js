var polypoints = [];
var circles = [];

var finalizePolygon = function(){
    
	var centroid = Physics.geometry.getPolygonCentroid(polypoints);
	
	if(polypoints.length > 2){
//			try{
//				var newBody = Physics.body('convex-polygon', {
//					x: centroid.x,
//					y: centroid.y,
//					restitution: restitution,
//					vertices: polypoints
//				});
//				
//				world.add(newBody);
//				objects.push(newBody);
//				
//			} catch(err) {
//				alert("Only make CONVEX polygons! Try again.");
//			}
			
			var concave = new decomp.Polygon();

			for(var x=0; x<polypoints.length; x++){
				concave.vertices.push(polypoints[x]);
			}
			
			// Fast decomposition (broken for some reason)
			// var convexes = concave.quickDecomp();
			
			// Slow (but optimal) decomposition
			var convexes = concave.decomp();

			var convexesToAdd = [];
			var centroids = [];
			for(var i=0; i<convexes.length; i++){
				var convex = convexes[i];
				var convexVertices = [];
				for(var j=0; j<convex.vertices.length; j++){
					var x=convex.vertices[j][0];
					var y=convex.vertices[j][1];
					convexVertices.push({x: x, y: y});
				}
				
				var centroid = Physics.geometry.getPolygonCentroid(convexVertices);
				centroids.push(centroid);
				var newBody = Physics.body('convex-polygon', {
					x: centroid.x,
					y: centroid.y,
					vertices: convexVertices
				});
				
				convexesToAdd.push(newBody);
			}
			
			var center = Physics.geometry.getPolygonCentroid(centroids);
			
			var compound = Physics.body('compound', {
					x: center.x,
					y: center.y,
					restitution: restitution,
					children: convexesToAdd
			});
			
			world.add(compound);
			objects.push(compound);
			
			gravity.applyTo(objects);
			b1.applyTo(objects);
			b2.applyTo(objects);
			b3.applyTo(objects);
			
			polypoints = [];
			world.remove(circles);
			circles = [];

	}
};

document.onkeypress = function(e){
	e = e || window.event;
	
	if(e.keyCode == 13){
		finalizePolygon();
	}
};

function getPosition(event)
{
  var x = event.x;
  var y = event.y;

  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;

  // Do something with the coordinates
  polypoints.push([x, y]);
  
  var newCircle = Physics.body('stationary_circle', {
		x: x,
		y: y,
		radius: 3.0
  });
  
  world.add(newCircle);
  circles.push(newCircle);
}

canvas.addEventListener("mousedown", getPosition, false);