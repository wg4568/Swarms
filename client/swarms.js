class Swarmer {
	constructor() {
		this.body = new Physics.Body();
		this.body.friction = 0.95;

		this.sprite = Helpers.RandomInt(0, 17);

		this.pulser = Helpers.RandomInt(30, 60)
		this.counter = 0;
	}

	logic(target) {
		this.counter ++;

		if (this.counter % this.pulser == 0) {
			this.body.addForce(Vector.Random(20, 30, 20, 30));
		}

		var delta = Vector.Multiply(Helpers.StepBetween(this.body.posn, target), -2);
		var angle = Helpers.AngleBetween(this.body.posn, target);

		this.body.addForce(delta);
		this.body.rotation = angle;

		this.body.logic();
	}

	draw(layer) {
		Diamonds[this.sprite].rotation = this.body.rotation;
		layer.sprite(this.body.posn, Diamonds[this.sprite]);
	}
}