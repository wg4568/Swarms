
class Canvas {
	constructor(id, fullscreen=false) {
		this.id = id;
		
		this.div = document.getElementById(this.id);
		this.div.style.position = "relative";
		
		this.fullscreen = fullscreen;
		
		this.layers = [];
		
		var parent = this;
		window.addEventListener("load", function() {
			if (parent.fullscreen) parent.fullscreenLayers();
		});

		if (this.fullscreen) {
			document.body.style.margin = 0;

			window.addEventListener("resize", function(event) {
				parent.fullscreenLayers();
			});
		}
	}
	
	fullscreenLayers() {
		this.layers.forEach(function(layer) {
			layer.width  = window.innerWidth;
			layer.height = window.innerHeight;
		});
	}
	
	addLayer(layer) {
		this.layers.push(layer);
		this.div.appendChild(layer.canvas);
	}
}