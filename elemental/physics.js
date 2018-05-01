// handles multiple physics objects, entire scope of game mechanics
class Physics {
	constructor() {}
}

// what was a rigidbody in Elmnt v3 + lower
Physics.Body = class {
	constructor(posn=Vector.Empty, velocity=Vector.Empty) {
		this.posn = posn;
		this.velocity = velocity;

		this.rotation = 0;
		this.angular = 0;

		this.maxSpeed = null;
		this.zero_cap = 0.001;

		this.friction = 1;
	}

	static IsRigidbody(obj) {
		return obj instanceof Physics.Body;
	}

	addForce(force) {
		this.velocity = Vector.Add(this.velocity, force);
	}

	addRotation(speed) {
		this.angular += speed;
	}

	logic() {
		this.velocity = Vector.Multiply(this.velocity, this.friction);
		this.angular = this.angular * this.friction;

		if (this.maxSpeed) {
			if (this.velocity.x > this.maxSpeed) this.velocity.x = this.maxSpeed;
			if (this.velocity.x < -this.maxSpeed) this.velocity.x = -this.maxSpeed;
			if (this.velocity.y > this.maxSpeed) this.velocity.y = this.maxSpeed;
			if (this.velocity.y < -this.maxSpeed) this.velocity.y = -this.maxSpeed;
		}

		if (Math.abs(this.velocity.x) < this.zero_cap) this.velocity.x = 0;
		if (Math.abs(this.velocity.y) < this.zero_cap) this.velocity.y = 0;

		this.posn = Vector.Add(this.posn, this.velocity);
		this.rotation = this.rotation + this.angular;
	}
}

// basic 2D collider shapes
Physics.Collider = class {
	constructor() {}
}

Physics.Collisions = {
	CircleVSCircle: function(circle1, circle2, point1, point2) {
		var distance = Helpers.DistanceBetween(point1, point2);
		return circle1.radius + circle2.radius < distance;
	},
	PolygonVSPolygon: function(poly1, poly2, point1, point2) {
		lines1 = [];
		lines2 = [];

		poly1.points.forEach(function(pt, idx) {
			var pt2 = poly1.points[(idx + 1) % poly1.points.length];

			pt = Vector.Add(point1, pt);
			pt2 = Vector.Add(point2, pt2);

			var m = (pt.y - pt2.y) / (pt.x - pt2.x);
			var b = pt.y - (m * pt.x);
			lines1.push({m: m, b: b});
		});
		poly2.points.forEach(function(pt, idx) {
			var pt2 = poly2.points[(idx + 1) % poly2.points.length];

			pt = Vector.Add(point1, pt);
			pt2 = Vector.Add(point2, pt2);

			var m = (pt.y - pt2.y) / (pt.x - pt2.x);
			var b = pt.y - (m * pt.x);
			lines2.push({m: m, b: b});
		});

		lines1.forEach(function(line) {
			lines2.forEach(function(line2) {
				var intercept = (line2.b - line.b) / (line.m - line2.m);
				console.log(intercept);
			});
		});
	},
	CircleVSPolygon: function(circle, poly, point1, point2) {

	}
}

Physics.Collider.Circle = class {
	constructor(radius) {
		this.radius = radius;
	}
}

Physics.Collider.Polygon = class {
	constructor(points) {
		this.points = points;
	}
}

// combines body and collider, main game object implementation
Physics.Entity = class {
	constructor() {}
}