var canvas = new Canvas("game", fullscreen=true);
var controls = new Controls(canvas.div);
var timer = new Timer();

var render = new Layer();
canvas.addLayer(render);

var swarm = new Swarm([], 100, function() {
	return controls.mousePos;
}, hue=Helpers.RandomInt(0, 255));

var swarm2 = new Swarm([], 100, function() {
	return new Vector((800 * Math.sin(Helpers.ToRadians(4 * FRAME))) + 600, 500);
}, hue=Helpers.RandomInt(0, 255));

var quad = new QuadTree(0, window.innerWidth, 0, window.innerHeight, max_size=10);

var DEBUG = prompt("DEBUG (y/n)?");
var SPEED = prompt("SPEED");

var FRAME = 0;
setInterval(function() {

	render.fill("#00000020");

	if (DEBUG == "y") {
		quad.draw(render);
	}

	swarm.logicDraw(render);
	swarm2.logicDraw(render);

	swarm.swarmers.forEach(function(s) {
		var v = s.body.posn;
		v.uid = swarm.uid;
		quad.remove(s.prevPosn);
		quad.insert(v);
	});

	swarm2.swarmers.forEach(function(s) {
		var v = s.body.posn;
		v.uid = swarm2.uid;
		quad.remove(s.prevPosn);
		quad.insert(v);
	});

	swarm.swarmers.forEach(function(s) {
		var close = quad.retrieve(s.body);
		close.forEach(function(c) {
			if (c.uid != s.uid) {
				var d = Helpers.DistanceBetween(c, s.body);
				if (d < 5) {
					render.rect(s.body, 20, 20, "red");
				}
			}
		});
	});

	controls.frame();
	FRAME ++;
}, SPEED);