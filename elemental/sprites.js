// Sprite class, and all extension classes
class Sprite {
	constructor() {
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d");
		this.layer = 0;
		this.scale = 1;
		this.center = Vector.Empty;
		this.canvOffset = Vector.Empty;
		this.rotation = 0;
		this.alpha = 1;
		this.draws = 0;

		this.drawScale = 1;
	}

	get width()  { return this.canvas.width;  }
	get height() { return this.canvas.height; }

	permaScale(scaleFactor) {
		var newCanvas = document.createElement("canvas");
		var newContext = newCanvas.getContext("2d");

		newCanvas.width = this.width * scaleFactor;
		newCanvas.height = this.height * scaleFactor;
		newContext.drawImage(
			this.canvas, 0, 0,
			newCanvas.width,
			newCanvas.height
		);

		this.center = Vector.Multiply(this.center, scaleFactor);

		this.canvas = newCanvas;
		this.context = newContext;
	}

	drawOnLayer(layer, posn) {
		// TODO: phase out this function
		this.drawOnContext(layer.context, posn);
	}

	drawOnContext(context, posn) {
		this.draws ++;
		this.preDraw();

		context.translate(posn.x, posn.y);
		context.rotate(Helpers.ToRadians(this.rotation));
		context.translate(
			-(this.center.x*this.drawScale)-this.canvOffset.x,
			-(this.center.y*this.drawScale)-this.canvOffset.y
		);

		var width = this.width * this.drawScale;
		var height = this.height * this.drawScale;
		context.drawImage(this.canvas, 0, 0, width, height);

		context.translate(
			(this.center.x*this.drawScale)+this.canvOffset.x,
			(this.center.y*this.drawScale)+this.canvOffset.y
		);
		context.rotate(-Helpers.ToRadians(this.rotation));
		context.translate(-posn.x, -posn.y);
	}

	canvasDim(width, height) {
		this.canvas.width = width;
		this.canvas.height = height;
	}

	preDraw() {
		// pass
	}

	render() {
		// pass
	}

	inherit(data) {
		for (var property in data) {
			if (data.hasOwnProperty(property)) {
				this[property] = data[property]
			}
		}
	}
}

Sprite.Ellipse = class extends Sprite {
	constructor(size, config={}) {
		super();

		this.radius = size;
		this.start = 0;
		this.end = 360;
		this.lineWidth = 1;
		this.lineColor = "black";
		this.lineCaps = "round";
		this.lineCorners = "round";
		this.lineMiterLimit = null;
		this.lineDashWidth = null;
		this.lineDashSpacing = null;

		this.fillColor = "white";
		this.closePath = true;
		this.strokeFirst = false;

		this.inherit(config);
		this.render();
	}

	render() {
		var dim = (2 * this.radius) + this.lineWidth;
		this.canvasDim(dim, dim);
		this.canvOffset = new Vector(dim / 2, dim / 2);

		this.context.strokeStyle = this.lineColor;
		this.context.lineWidth = this.lineWidth;
		this.context.lineCap = this.lineCaps;
		this.context.lineJoin = this.lineCorners;
		this.context.miterLimit = this.lineMiterLimit;
		this.context.lineDashOffset = this.lineDashOffset;
		this.context.fillStyle = this.fillColor;
		this.context.setLineDash([this.lineDashWidth, this.lineDashSpacing]);

		this.context.beginPath();

		this.context.arc(
			this.canvOffset.x,
			this.canvOffset.y,
			this.radius,
			Helpers.ToRadians(this.start),
			Helpers.ToRadians(this.end)
		);

		if (this.closePath) {
			this.context.closePath();
		}

		if (this.strokeFirst) {
			if (this.lineWidth > 0) { this.context.stroke(); }
			this.context.fill();
		} else {
			this.context.fill();
			if (this.lineWidth > 0) { this.context.stroke(); }
		}
	}
}

Sprite.Polygon = class extends Sprite {
	constructor(sides, size, config={}) {
		super();

		this.size = size;
		this.sides = sides;

		this.lineWidth = 1;
		this.lineColor = "black";
		this.lineCaps = "round";
		this.lineCorners = "round";
		this.lineMiterLimit = null;
		this.lineDashWidth = null;
		this.lineDashSpacing = null;

		this.fillColor = "white";
		this.strokeFirst = false;

		this.inherit(config);
		this.render();
	}

	render() {
		var dim = (2 * this.size) + this.lineWidth;
		this.canvasDim(dim, dim);
		this.canvOffset = new Vector(dim / 2, dim / 2);

		this.context.strokeStyle = this.lineColor;
		this.context.lineWidth = this.lineWidth;
		this.context.lineCap = this.lineCaps;
		this.context.lineJoin = this.lineCorners;
		this.context.miterLimit = this.lineMiterLimit;
		this.context.lineDashOffset = this.lineDashOffset;
		this.context.fillStyle = this.fillColor;
		this.context.setLineDash([this.lineDashWidth, this.lineDashSpacing]);

		this.context.beginPath();
		this.context.moveTo(this.size + this.canvOffset.x, this.canvOffset.y);


		for (var angle = 360/this.sides; angle < 360; angle += 360/this.sides) {
			this.context.lineTo(
				(Math.cos(Helpers.ToRadians(angle))*this.size) + this.canvOffset.x,
				(Math.sin(Helpers.ToRadians(angle))*this.size) + this.canvOffset.y
			);
		}

		this.context.closePath();

		if (this.strokeFirst) {
			if (this.lineWidth > 0) { this.context.stroke(); }
			this.context.fill();
		} else {
			this.context.fill();
			if (this.lineWidth > 0) { this.context.stroke(); }
		}
	}
}

Sprite.Points = class extends Sprite {
	constructor(points, config={}) {
		super();

		this.points = points;

		this.lineWidth = 1;
		this.lineColor = "black";
		this.lineCaps = "round";
		this.lineCorners = "round";
		this.lineMiterLimit = null;
		this.lineDashWidth = null;
		this.lineDashSpacing = null;

		this.fillColor = "white";
		this.closePath = true;
		this.strokeFirst = false;

		this.inherit(config);
		this.render();
	}

	render() {
		var xmin = 0, xmax = 0;
		var ymin = 0, ymax = 0;
		this.points.forEach(function(point) {
			if (point.x < xmin) xmin = point.x;
			if (point.x > xmax) xmax = point.x;
			if (point.y < ymin) ymin = point.y;
			if (point.y > ymax) ymax = point.y;
		});

		this.canvasDim(
			xmax - xmin + this.lineWidth,
			ymax - ymin + this.lineWidth
		);

		this.canvOffset = new Vector(
			-xmin + (this.lineWidth / 2),
			-ymin + (this.lineWidth / 2)
		);

		this.context.strokeStyle = this.lineColor;
		this.context.lineWidth = this.lineWidth;
		this.context.lineCap = this.lineCaps;
		this.context.lineJoin = this.lineCorners;
		this.context.miterLimit = this.lineMiterLimit;
		this.context.lineDashOffset = this.lineDashOffset;
		this.context.fillStyle = this.fillColor;
		this.context.setLineDash([this.lineDashWidth, this.lineDashSpacing]);

		this.context.beginPath();

		this.context.moveTo(
			this.points[0].x + this.canvOffset.x,
			this.points[0].y + this.canvOffset.y
		);

		for (var i=1; i<this.points.length; i++) {
			this.context.lineTo(
				this.points[i].x + this.canvOffset.x,
				this.points[i].y + this.canvOffset.y
			);
		}

		if (this.closePath) {
			this.context.closePath();
		}

		if (this.strokeFirst) {
			if (this.lineWidth > 0) { this.context.stroke(); }
			this.context.fill();
		} else {
			this.context.fill();
			if (this.lineWidth > 0) { this.context.stroke(); }
		}
	}
}

Sprite.Image = class extends Sprite {
	constructor(image, config={}) {
		super();

		var parent = this;
		this.image = Helpers.LoadImage(image);
		this.image.onload = function() {
			parent.render();
			parent.onLoad(parent);
		}

		this.inherit(config);
	}

	onLoad(img) {
		// pass
	}

	render() {
		this.canvasDim(this.image.width, this.image.height);
		this.context.drawImage(this.image, 0, 0);
	}
}

Sprite.Composite = class extends Sprite {
	constructor(shapes, config={}) {
		super();

		this.shapes = shapes;

		this.inherit(config);
		this.render();
	}

	render() {
		var shapes = [];

		for (var index in this.shapes) {
		   if (this.shapes.hasOwnProperty(index)) {
			   var shape = this.shapes[index];
			   shapes.push(shape);
		   }
		}

		shapes.sort(function(a, b) {
			if (a.layer > b.layer) return 1;
			if (a.layer < b.layer) return -1;
			return 0;
		});

		var xmaxO = 0, ymaxO = 0;
		var xmax = 0, ymax = 0;
		shapes.forEach(function(shape) {
			if (shape.canvOffset.x > xmaxO) xmaxO = shape.canvOffset.x;
			if (shape.canvOffset.y > ymaxO) ymaxO = shape.canvOffset.y;

			if (shape.width  > xmax) xmax = shape.width;
			if (shape.height > ymax) ymax = shape.height;
		});

		this.canvasDim(xmax, ymax);
		this.canvOffset = new Vector(xmaxO, ymaxO);

		var parent = this;
		shapes.forEach(function(shape) {
			shape.drawOnContext(parent.context, parent.canvOffset);
		});
	}
}

Sprite.Animation = class extends Sprite {
	constructor(frames, speed, config={}) {
		super();

		this.frames = frames;
		this.renders = [];
		this.speed = speed;
		this.framecount = this.frames.length;

		this.inherit(config);
		this.render();
	}

	preDraw() {
		var frame = (this.draws / this.speed) % this.framecount;

		this.canvas = this.renders[Math.floor(frame)];
	}

	render() {
		this.renders = [];

		var xmaxO = 0, ymaxO = 0;
		var xmax = 0, ymax = 0;
		this.frames.forEach(function(frame) {
			if (frame.canvOffset.x > xmaxO) xmaxO = frame.canvOffset.x;
			if (frame.canvOffset.y > ymaxO) ymaxO = frame.canvOffset.y;

			if (frame.width  > xmax) xmax = frame.width;
			if (frame.height > ymax) ymax = frame.height;
		});

		this.canvasDim(xmax, ymax);
		this.canvOffset = new Vector(xmaxO, ymaxO);

		var parent = this;
		this.frames.forEach(function(frame) {
			var cnv = document.createElement("canvas");
			var ctx = cnv.getContext("2d");
			cnv.width = parent.width;
			cnv.height = parent.height;

			frame.drawOnContext(ctx, parent.canvOffset);
			parent.renders.push(cnv);
		});
	}
}
