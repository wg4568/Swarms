class Controls {
	constructor(element) {
		var parent = this;

		element.addEventListener("mousemove", function(event) {
			parent.mouseMoveEvent(event);
		});

		document.addEventListener("keydown", function(event){
			parent.keyPressedEvent(event.keyCode);
		});
		document.addEventListener("keyup", function(event){
			parent.keyReleasedEvent(event.keyCode);
		});

		document.addEventListener("mousedown", function(event){
			parent.mousePressedEvent(event.button);
		});
		document.addEventListener("mouseup", function(event){
			parent.mouseReleasedEvent(event.button);
		});

		this.keyboardState = {pressed: {}, held: {}, released: {}};
		this.mouseState = {pressed: {}, held: {}, released: {}};

		this.mousePos = Vector.Empty;
	}

	keyPressed(keycode) {
		var value = this.keyboardState.pressed[keycode];
		if (value == 1) return true;
		else return false;
	}

	keyHeld(keycode) {
		var value = this.keyboardState.held[keycode];
		if (value == 1) return true;
		else return false;
	}

	keyReleased(keycode) {
		var value = this.keyboardState.released[keycode];
		if (value == 1) return true;
		else return false;
	}

	mousePressed(button) {
		var value = this.mouseState.pressed[button];
		if (value == 1) return true;
		else return false;
	}

	mouseHeld(button) {
		var value = this.mouseState.held[button];
		if (value == 1) return true;
		else return false;
	}

	mouseReleased(button) {
		var value = this.mouseState.released[button];
		if (value == 1) return true;
		else return false;
	}

	keyPressedEvent(keycode) {
		if (!this.keyHeld(keycode)) {
			this.keyboardState.pressed[keycode] = 1;
		}
		this.keyboardState.held[keycode] = 1;

		if (this.network) this.network.keyPressedEvent(keycode);
	}

	keyReleasedEvent(keycode) {
		this.keyboardState.released[keycode] = 1;
		this.keyboardState.held[keycode] = 0;

		if (this.network) this.network.keyReleasedEvent(keycode);
	}

	mousePressedEvent(button) {
		if (!this.mouseHeld(button)) {
			this.mouseState.pressed[button] = 1;
		}
		this.mouseState.held[button] = 1;

		if (this.network) this.network.mousePressedEvent(button);
	}

	mouseReleasedEvent(button) {
		this.mouseState.released[button] = 1;
		this.mouseState.held[button] = 0;

		if (this.network) this.network.mouseReleasedEvent(button);
	}

	mouseMoveEvent(event) {
		var mousePosRaw = new Vector(event.offsetX, event.offsetY);
		// this.mousePos = this.viewport.canvasToWorld(mousePosRaw);
		this.mousePos = mousePosRaw;

		if (this.network) this.network.mouseMoveEvent(this.viewport.canvasToWorld(this.mousePos));
	}

	frame() {
		parent.keyboardState.pressed = {};
		parent.keyboardState.released = {};

		parent.mouseState.pressed = {};
		parent.mouseState.released = {};
	}
}
