var canvas = new Canvas("game", fullscreen=true);
var controls = new Controls(canvas.div);
var timer = new Timer();

var render = new Layer();
var interface = new Layer.UI();

canvas.addLayer(render);
canvas.addLayer(interface);

var swarmers = [];

for (var i = 0; i < 1000; i++) {
	swarmers.push(new Swarmer());
}

timer.Start(function() {

	swarmers.forEach(function(s) {
		s.logic(controls.mousePos);
		s.draw(render);
	});

	render.fill("#00000010");

});