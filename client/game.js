var canvas = new Canvas("game", fullscreen=true);
var controls = new Controls(canvas.div);
var timer = new Timer();

var render = new Layer();
canvas.addLayer(render);

var swarm = new Swarm([], 100, function() {
	return controls.mousePos;
}, hue=Helpers.RandomInt(0, 255));

// var swarm2 = new Swarm([], 100, function() {
// 	return new Vector((800 * Math.sin(Helpers.ToRadians(4 * FRAME))) + 600, 500);
// }, hue=Helpers.RandomInt(0, 255));

var quad = new QuadTree(0, window.innerWidth, 0, window.innerHeight);

// swarm.swarmers.forEach(function(s) {
// 	quad.insert(s.prevPosn);
// });


var FRAME = 0;
timer.Start(function() {

	render.fill("#00000020");


	if (controls.mouseHeld(Mousecodes.RIGHT)) {
		console.log(controls.mousePos);
		quad.insert(controls.mousePos);
	}

	if (controls.mousePressed(Mousecodes.LEFT)) {
		console.log(controls.mousePos);
		quad.insert(controls.mousePos);
	}

	quad.draw(render);

	swarm.logic();
	// swarm2.logicDraw(render);

	swarm.swarmers.forEach(function(s) {
		quad.remove(s.prevPosn);
		quad.insert(s.body.posn);
	});

	controls.frame();
	FRAME ++;
});