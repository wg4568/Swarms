var Diamonds = [];

var color = Color.RandomPastel;
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
	color.hue += spr;
	Diamonds.push(spr);
}