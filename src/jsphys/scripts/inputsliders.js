var slider = document.getElementById("restSlider");
//edgeBorder.restitution = slider.value;

slider.onchange = function() {
		
	restitution = slider.value/100;
	refreshBorder();
	
};