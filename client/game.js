var canvas = new Canvas("game", fullscreen=true);
var controls = new Controls(canvas.div);
var timer = new Timer();

var render = new Layer();
var interface = new Layer.UI();

canvas.addLayer(render);
canvas.addLayer(interface);

timer.Start(function() {

	render.rect(controls.mousePos, 100, 100, "red");

	if (!controls.mouseHeld(Mousecodes.LEFT)) {
		render.fill("#00000010");
	}

});