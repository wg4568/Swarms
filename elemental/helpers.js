class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	static get Empty() {
		return new Vector(0, 0);
	}

	static IsVector(vector) {
		return vector.hasOwnProperty("x") && vector.hasOwnProperty("y");
	}

	static Random(xmin, xmax, ymin, ymax) {
		var x = Helpers.RandomInt(xmin, xmax);
		var y = Helpers.RandomInt(ymin, ymax);
		return new Vector(x, y);
	}

	static Add() {
		var total = new Vector(0, 0);
		for (var i = 0; i < arguments.length; i++ ) {
			if (Vector.IsVector(arguments[i])) {
				total.x += arguments[i].x;
				total.y += arguments[i].y;
			} else {
				total.x += arguments[i];
				total.y += arguments[i];
			}
		}
		return total;
	}

	static Subtract() {
		var total = new Vector(arguments[0].x, arguments[0].y);
		for (var i = 1; i < arguments.length; i++ ) {
			if (Vector.IsVector(arguments[i])) {
				total.x -= arguments[i].x;
				total.y -= arguments[i].y;
			} else {
				total.x -= arguments[i];
				total.y -= arguments[i];
			}
		}
		return total;
	}

	static Multiply() {
		var total = new Vector(1, 1);
		for (var i = 0; i < arguments.length; i++ ) {
			if (Vector.IsVector(arguments[i])) {
				total.x *= arguments[i].x;
				total.y *= arguments[i].y;
			} else {
				total.x *= arguments[i];
				total.y *= arguments[i];
			}
		}
		return total;
	}

	static Divide() {
		var total = new Vector(arguments[0].x, arguments[0].y);
		for (var i = 1; i < arguments.length; i++ ) {
			if (Vector.IsVector(arguments[i])) {
				total.x /= arguments[i].x;
				total.y /= arguments[i].y;
			} else {
				total.x /= arguments[i];
				total.y /= arguments[i];
			}
		}
		return total;
	}
}

// from stackoverflow LOL (modified for ES6)
class Timer {
	constructor() {	
		this.lastTime = 0;
		this.gameTick = null;
		this.prevElapsed = 0;
		this.prevElapsed2 = 0;
	}

	Start(gameTick) {
		var prevTick = this.gameTick;
		this.gameTick = gameTick;
		if (this.lastTime == 0) {
			var bindThis = this;
			requestAnimationFrame(function() { bindThis.tick(); } );
			this.lastTime = 0;
		}
	}

	Stop() {
		this.Start(null);
	}

	tick() {
		if (this.gameTick != null) {
			var bindThis = this;
			requestAnimationFrame(function() { bindThis.tick(); } );
		}
		else {
			this.lastTime = 0;
			return;
		}
		var timeNow = Date.now();
		var elapsed = timeNow - this.lastTime;
		if (elapsed > 0) {
			if (this.lastTime != 0) {
				if (elapsed > 1000) // Cap max elapsed time to 1 second to avoid death spiral
				elapsed = 1000;
				// Hackish fps smoothing
				var smoothElapsed = (elapsed + this.prevElapsed + this.prevElapsed2)/3;
				this.gameTick(0.001*smoothElapsed);
				this.prevElapsed2 = this.prevElapsed;
				this.prevElapsed = elapsed;
			}
			this.lastTime = timeNow;
		}
	}
}

// Color class to represent color
Color = class {
	constructor() {
		this._red = 0;
		this._green = 0;
		this._blue = 0;

		if (arguments.length == 1) {
			var color = Color.ParseHEX(arguments[0]);
			this.red = color[0];
			this.green = color[1];
			this.blue = color[2];
		} else {
			this.red = arguments[0];
			this.green = arguments[1];
			this.blue = arguments[2];
		}
	}

	static get Random() {
		var r = Helpers.RandomInt(0, 255);
		var g = Helpers.RandomInt(0, 255);
		var b = Helpers.RandomInt(0, 255);
		var col = new Color(r, g, b);
		return col;
	}

	static get RandomPastel() {
		var r = Helpers.RandomInt(0, 255);
		var g = Helpers.RandomInt(0, 255);
		var b = Helpers.RandomInt(0, 255);
		var col = new Color(r, g, b);
		col.value = 255;
		col.saturation = 80;
		return col;
	}

	static get RandomDark() {
		var r = Helpers.RandomInt(0, 255);
		var g = Helpers.RandomInt(0, 255);
		var b = Helpers.RandomInt(0, 255);
		var col = new Color(r, g, b);
		col.value = 100;
		col.saturation = 255;
		return col;
	}

	static get RandomNeon() {
		var r = Helpers.RandomInt(0, 255);
		var g = Helpers.RandomInt(0, 255);
		var b = Helpers.RandomInt(0, 255);
		var col = new Color(r, g, b);
		col.value = 255;
		col.saturation = 255;
		return col;
	}


	get red() { return this._red; }
	get green() { return this._green; }
	get blue() { return this._blue; }

	get hue() { return this.hsv[0]; }
	get saturation() { return this.hsv[1]; }
	get value() { return this.hsv[2]; }

	get hsv() { return Color.RGBtoHSV(this.rgb); }
	get rgb() { return [this.red, this.green, this.blue]; }

	set red(val) { this._red = Math.floor(Helpers.Constrict(val, 0, 255)); }
	set green(val) { this._green = Math.floor(Helpers.Constrict(val, 0, 255)); }
	set blue(val) { this._blue = Math.floor(Helpers.Constrict(val, 0, 255)); }

	set hue(val) { this.hsv = [Helpers.Constrict(val, 0, 255), this.hsv[1], this.hsv[2]]; }
	set saturation(val) { this.hsv = [this.hsv[0], Helpers.Constrict(val, 0, 255), this.hsv[2]]; }
	set value(val) { this.hsv = [this.hsv[0], this.hsv[1], Helpers.Constrict(val, 0, 255)]; }

	set hsv(val) { this.rgb = Color.HSVtoRGB(val); }
	set rgb(val) { this.red = val[0]; this.green = val[1]; this.blue = val[2]; }

	formatRGB() {
		return `rgb(${this.red}, ${this.green}, ${this.blue})`
	}

	formatHEX() {
		var red = Helpers.PadZeros(this.red.toString(16), 2);
		var green = Helpers.PadZeros(this.green.toString(16), 2);
		var blue = Helpers.PadZeros(this.blue.toString(16), 2);

		return `#${red}${green}${blue}`;
	}

	static RGBtoHSV(color) {
		var r = color[0];
		var g = color[1];
		var b = color[2];
	    var max = Math.max(r, g, b), min = Math.min(r, g, b),
	        d = max - min,
	        h,
	        s = (max === 0 ? 0 : d / max),
	        v = max / 255;

	    switch (max) {
	        case min: h = 0; break;
	        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
	        case g: h = (b - r) + d * 2; h /= 6 * d; break;
	        case b: h = (r - g) + d * 4; h /= 6 * d; break;
	    }

	    return [h*255, s*255, v*255];
	}

	static HSVtoRGB(color) {
		var h = color[0] / 255;
		var s = color[1] / 255;
		var v = color[2] / 255;
	    var r, g, b, i, f, p, q, t;
	    i = Math.floor(h * 6);
	    f = h * 6 - i;
	    p = v * (1 - s);
	    q = v * (1 - f * s);
	    t = v * (1 - (1 - f) * s);
	    switch (i % 6) {
	        case 0: r = v, g = t, b = p; break;
	        case 1: r = q, g = v, b = p; break;
	        case 2: r = p, g = v, b = t; break;
	        case 3: r = p, g = q, b = v; break;
	        case 4: r = t, g = p, b = v; break;
	        case 5: r = v, g = p, b = q; break;
	    }
	    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}

	static ParseRGB(string) {
		var array = string.substring(4, string.length-1).replace(/ /g, '').split(',');
		array = array.map(function(x) { return parseInt(x) });
		var red = array[0];
		var green = array[1];
		var blue = array[2];
		return [red, green, blue];
	}

	static ParseHEX(hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		var red = parseInt(result[1], 16);
		var green = parseInt(result[2], 16);
		var blue = parseInt(result[3], 16);
		return [red, green, blue];
	}

	static IsColor(color) {
		return color instanceof Color;
	}
}

// Helper object filled with helper functions and classes
Helpers = {}

Helpers.ToRadians = function(degrees) {
	return degrees * Math.PI / 180;
}

Helpers.ToDegrees = function(radians) {
	return radians * 180 / Math.PI;
}

Helpers.AngleBetween = function(point1, point2) {
	var rads = Math.atan2(point1.x-point2.x, point1.y-point2.y);
	return -Helpers.ToDegrees(rads)+180;
}

Helpers.DistanceBetween = function(point1, point2) {
	return Math.sqrt(Math.pow(point1.x-point2.x, 2) + Math.pow(point1.y-point2.y, 2));
}

Helpers.StepBetween = function(point1, point2) {
	if (point1.x == 0 && point1.y == 0 && point2.x == 0 && point2.y == 0) return Vector.Empty;
	var hype = Helpers.DistanceBetween(point1, point2);
	var dx = (point1.x-point2.x)/hype;
	var dy = (point1.y-point2.y)/hype;
	return new Vector(dx, dy);
}

Helpers.Get = function(q, s) {
	s = (s) ? s : window.location.search;
	var re = new RegExp('&amp;'+q+'=([^&amp;]*)','i');
	return (s=s.replace(/^\?/,'&amp;').match(re)) ?s=s[1] :s='';
}

Helpers.RandomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

Helpers.LoadImage = function(url) {
	var img = new Image();
    img.src = url;
	return img;
}

Helpers.Now = function() {
	return new Date().getTime() / 1000;
}

Helpers.Constrict = function(val, min, max) {
	if (val < min) { return min; }
	if (val > max) { return max; }
	else { return val; }
}

Helpers.PadZeros = function(number, length) {
	var str = '' + number;
	while (str.length < length) {
		str = '0' + str;
	}
	return str;
}

Helpers.RandomString = function() {
	var s1 = Math.random().toString(36).substring(2, 15);
	var s2 = Math.random().toString(36).substring(2, 15);
	return s1 + s2
}

Helpers.Clone = function(obj) {
	return JSON.parse(JSON.stringify(obj));
}
