class Swarmer {
	constructor(sprite, uid="") {
		this.prevPosn = Vector.Empty;
		this.body = new Physics.Body();
		this.body.friction = 0.95;
		this.uid = uid;

		this.sprite = sprite;

		this.frame = 0;
	}

	logic(target) {
		this.prevPosn = this.body.posn;

		var distance = Helpers.DistanceBetween(this.body.posn, target);
		var offset = Vector.Multiply(Vector.Random(-3, 3, -3, 3), distance, 0.3);
		var m_target = Vector.Add(target, offset);

		var delta = Vector.Multiply(Helpers.StepBetween(this.body.posn, m_target), -2);
		var angle = Helpers.AngleBetween(this.body.posn, target);

		this.body.addForce(delta);
		this.body.rotation = angle;

		this.body.logic();

		this.frame++;
	}

	draw(layer) {
		this.sprite.rotation = this.body.rotation;
		layer.sprite(this.body.posn, this.sprite);
	}
}

class Swarm {
	constructor(swarmers, size, getTarget=function(t) {return Vector.Empty}, hue=255) {
		this.swarmers = swarmers;
		this.size = size;
		this.getTarget = getTarget;
		this.hue = hue;
		this.uid = Helpers.RandomString();

		this.sprites = [];

		var color = new Color(255, 0, 0);
		color.hue = this.hue;
		for (var i = 0; i < 255; i += 15) {
			var spr = new Sprite.Points([
				new Vector(0, 0),
				new Vector(10, 0),
				new Vector(5, 20)
			], {
				center: new Vector(5, 0),
				lineWidth: 0,
				fillColor: color.formatHEX()
			});
			color.value = Helpers.RandomInt(150, 255);
			this.sprites.push(spr);
		}

		var makeup = this.size - this.swarmers.length;
		if (makeup > 0) {

			for (var i = 0; i < makeup; i++) {
				var s = new Swarmer(this.sprites[Helpers.RandomInt(0, 17)], this.uid);
				this.swarmers.push(s);
			}

		}
	}

	logic() {
		var target = this.getTarget();
		this.swarmers.forEach(function(s) {
			s.logic(target);
		});
	}

	draw(layer) {
		var target = this.getTarget();
		this.swarmers.forEach(function(s) {
			s.draw(layer);
		});
	}

	logicDraw(layer) {
		var target = this.getTarget();
		this.swarmers.forEach(function(s) {
			s.logic(target);
			s.draw(layer);
		});
	}
}