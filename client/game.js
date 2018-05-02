var canvas = new Canvas("game", fullscreen=true);
var controls = new Controls(canvas.div);
var timer = new Timer();

var render = new Layer();
var interface = new Layer.UI();

var hb = new Layer.UI.Element.HealthBar(Layer.UI.Pins.Center, new Vector(0, 0), 300, 40, 100, "black", "#ff0000", 100);
interface.addElement(hb);
interface.hide();

canvas.addLayer(render);
canvas.addLayer(interface);

// var swarmers = [];

// for (var i = 0; i < 300; i++) {
// 	swarmers.push(new Swarmer());
// }

var FRAME = 0;

var swarm = new Swarm([], 100, function() {
	return controls.mousePos;
}, hue=Helpers.RandomInt(0, 255));

var swarm2 = new Swarm([], 100, function() {
	return new Vector((800 * Math.sin(Helpers.ToRadians(4 * FRAME))) + 600, 500);
}, hue=Helpers.RandomInt(0, 255));

timer.Start(function() {

	FRAME ++;

	swarm.logicDraw(render);
	swarm2.logicDraw(render);

	// swarmers.forEach(function(s) {
	// 	s.logic(controls.mousePos);
	// 	s.draw(render);
	// });

	render.fill("#00000020");

	interface.clear();
	interface.draw();

});