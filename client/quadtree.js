class QuadTree {
	constructor(xmin, xmax, ymin, ymax, max_size=4, points=[], min_width=25) {
		this.max_size = max_size;
		this.min_width = min_width

		this.xmin = xmin;
		this.xmax = xmax;
		this.ymin = ymin;
		this.ymax = ymax;

		this.xdivide = this.xmin + ((this.xmax - this.xmin) / 2);
		this.ydivide = this.ymin + ((this.ymax - this.ymin) / 2);

		this.quadrants = [
			new QuadTree.Quad(),
			new QuadTree.Quad(),
			new QuadTree.Quad(),
			new QuadTree.Quad()
		];

		var parent = this;
		points.forEach(function(p) {
			parent.insert(p);
		});
	}

	get size() {
		return this.all.length;
	}

	get all() {
		var all = [];
		this.quadrants.forEach(function(q) {
			q.all.forEach(function(p) {
				all.push(p);
			});
		});
		return all;
	}

	retrieve(point) {
		var idx;
		if (point.x <= this.xdivide && point.y <= this.ydivide) idx = 0;
		if (point.x <= this.xdivide && point.y >= this.ydivide) idx = 1;
		if (point.x >= this.xdivide && point.y <= this.ydivide) idx = 2;
		if (point.x >= this.xdivide && point.y >= this.ydivide) idx = 3;

		var quad = this.quadrants[idx];
		return quad.retrieve(point);
	}

	insert(point) {
		var idx;
		if (point.x <= this.xdivide && point.y <= this.ydivide) idx = 0;
		if (point.x <= this.xdivide && point.y >= this.ydivide) idx = 1;
		if (point.x >= this.xdivide && point.y <= this.ydivide) idx = 2;
		if (point.x >= this.xdivide && point.y >= this.ydivide) idx = 3;

		var quad = this.quadrants[idx];
		quad.insert(point);

		if (quad.size >= this.max_size && quad instanceof QuadTree.Quad && (this.xmax - this.xmin) > this.min_width) {

			var range;

			if (idx == 0) range = [this.xmin, this.xdivide, this.ymin, this.ydivide];
			if (idx == 1) range = [this.xmin, this.xdivide, this.ydivide, this.ymax];
			if (idx == 2) range = [this.xdivide, this.xmax, this.ymin, this.ydivide];
			if (idx == 3) range = [this.xdivide, this.xmax, this.ydivide, this.ymax];

			var nQuad = new QuadTree(
				range[0], range[1],
				range[2], range[3],
				this.max_size,
				quad.all
			);

			this.quadrants[idx] = nQuad;
		}
	}

	remove(point) {
		var idx = 0;
		if (point.x <= this.xdivide && point.y <= this.ydivide) idx = 0;	// top left
		if (point.x <= this.xdivide && point.y >= this.ydivide) idx = 1;	// bottom left
		if (point.x >= this.xdivide && point.y <= this.ydivide) idx = 2;	// top right
		if (point.x >= this.xdivide && point.y >= this.ydivide) idx = 3;	// bottom right

		var quad = this.quadrants[idx];
		quad.remove(point);

		if (quad.size <= this.max_size && quad instanceof QuadTree) {
			var nQuad = new QuadTree.Quad(quad.all);
			this.quadrants[idx] = nQuad;
		}
	}

	drawRecursive(quad, layer) {
		layer.context.strokeStyle = "white";
		layer.context.strokeWidth = 5;

		if (quad instanceof QuadTree) {

			layer.context.beginPath();
			layer.context.moveTo(quad.xdivide, quad.ymin);
			layer.context.lineTo(quad.xdivide, quad.ymax);
			layer.context.stroke();

			layer.context.beginPath();
			layer.context.moveTo(quad.xmin, quad.ydivide);
			layer.context.lineTo(quad.xmax, quad.ydivide);
			layer.context.stroke();

			this.drawRecursive(quad.quadrants[0], layer);
			this.drawRecursive(quad.quadrants[1], layer);
			this.drawRecursive(quad.quadrants[2], layer);
			this.drawRecursive(quad.quadrants[3], layer);
		} else {

			quad.all.forEach(function(p) {
				layer.rect(p, 5, 5, "red");
			});

		}
	}

	draw(layer) {
		this.drawRecursive(this, layer);
	}
}

QuadTree.Quad = class {
	constructor(points=[]) {
		this.points = points;
	}

	get all() {
		return this.points;
	}

	get size() {
		return this.all.length;
	}

	retrieve(point) {
		return this.all;
	}

	insert(point) {
		this.points.push(point);
	}

	remove(point) {
		var index = this.points.indexOf(point);
		if (index != -1) this.points.splice(index, 1);
	}
}