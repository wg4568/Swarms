class Layer {
	
	constructor() {
		this.canvas = document.createElement("canvas");
		this.canvas.addEventListener("contextmenu", event => event.preventDefault());

		this.canvas.style.visibility = "visible";
		this.canvas.style.position = "absolute";
		this.canvas.style.left = 0;
		this.canvas.style.top = 0;
		this.canvas.style["z-index"] = 0;

		this.context = this.canvas.getContext("2d");
		
		this._redraw = function() {};
	}
	
	get width()  { return this.canvas.width;  }
	get height() { return this.canvas.height; }
	
	set width(val) {
		this.canvas.width = val;
		this._redraw(this);
	}

	set height(val) {
		this.canvas.height = val;
		this._redraw(this);
	}
	
	get visible() {
		return this.canvas.style.visibility == "visible";
	}
	
	set visible(val) {
		this.canvas.style.visibility = val ? "visible" : "hidden";
	}
	
	redraw(func) {
		this._redraw = func;
		this._redraw(this);
	}

	hide() {
		this.visible = false;
	}
	
	show() {
		this.visible = true;
	}
	
	toggle() {
		this.visible = this.visible ? false : true;
	}

	fill(color) {
		this.context.fillStyle = color;
		this.context.fillRect(0, 0, this.width, this.height);
	}
	
	clear() {
		this.context.clearRect(0, 0, this.width, this.height);		
	}

	rect(posn, width, height, color) {
		this.context.fillStyle = color;
		this.context.fillRect(posn.x, posn.y, width, height);
	}
	
	sprite(posn, sprite, rotation=0, scale=0) {
		sprite.drawOnLayer(this, posn);
	}
}

Layer.World = class extends Layer {
	constructor(posn=Vector.Empty) {
		super();

		this.posn = posn;
	}

	worldToCanvas(posn) {
		return Vector.Subtract(posn, this.posn, new Vector(-this.width / 2, -this.height / 2));
	}

	canvasToWorld(posn) {
		return Vector.Add(this.posn, posn, new Vector(-this.width / 2, -this.height / 2));
	}

	rect(posn, width, height, color) {
		var cposn = this.worldToCanvas(posn)

		this.context.fillStyle = color;
		this.context.fillRect(cposn.x, cposn.y, width, height);
	}

	sprite(posn, sprite, rotation=0, scale=0) {
		var cposn = this.worldToCanvas(posn)
		sprite.drawOnLayer(this, cposn);
	}
}

Layer.UI = class extends Layer {
	constructor() {
		super();

		this.elements = [];
	}

	addElement(el) {
		el.layer = this;
		this.elements.push(el);
	}

	draw() {
		this.elements.forEach(function(e) {
			e.draw();
		});
	}
}

Layer.UI.Element = class {
	constructor(pin, offset, width, height) {
		this.pin = pin;
		this.offset = offset;

		this.width = width;
		this.height = height;

		this.layer = null;
	}

	drawFunc(posn) {
		// user defined
	}

	draw() {
		var posn = Vector.Empty;

		if (this.pin == Layer.UI.Pins.Center) {
			posn = new Vector((this.layer.width - this.width) / 2, (this.layer.height - this.height) / 2);
			posn = Vector.Add(posn, this.offset);
		}

		if (this.pin == Layer.UI.Pins.BottomLeft) {
			posn = new Vector(this.offset.x, this.layer.height - this.offset.y - this.height);
		}

		if (this.pin == Layer.UI.Pins.BottomRight) {
			posn = new Vector(this.layer.width - this.offset.x - this.width, this.layer.height - this.offset.y - this.height);
		}

		if (this.pin == Layer.UI.Pins.TopLeft) {
			posn = this.offset;
		}

		if (this.pin == Layer.UI.Pins.TopRight) {
			posn = new Vector(this.layer.width - this.offset.x - this.width, this.offset.y);
		}

		this.drawFunc(posn);
	}
}

Layer.UI.Element.HealthBar = class extends Layer.UI.Element {
	constructor(pin, offset, width, height, max, bgc="#000000", fgc="#ff0000", value=50, edge=5) {
		super(pin, offset, width, height);
		this.maxValue = max;
		this.value = value;
		this.edge = edge;
		this.bgc = bgc;
		this.fgc = fgc;
	}

	drawFunc(posn) {
		var scaleFactor = this.value / this.maxValue;

		this.layer.context.fillStyle = this.bgc;
		this.layer.rect(posn, this.width, this.height, this.bgc)
		this.layer.rect(Vector.Add(posn, this.edge), (this.width - (this.edge * 2)) * scaleFactor, this.height - (this.edge * 2), this.fgc);
	}
}

Layer.UI.Pins = {
	Center: 0,
	BottomLeft: 1,
	BottomRight: 2,
	TopLeft: 3,
	TopRight: 4
}
