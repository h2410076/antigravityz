export function lobby(highestLeveli = 1) {
	window.test = function (level) {
		if (typeof level === "string") {
			go("game", parseInt(level) - 1, true)
		} else {
			go("game", level - 1)
		}
	}

	let highestLevel;
	
	if (localStorage.getItem("level") != null) {
		highestLevel = localStorage.getItem("level")
	} else {
		highestLevel = highestLeveli;
	}
	
	add([
		opacity(0.25),
		sprite("lobby", {
			height: height(),
			width: width()
		})
	])
	
	add([
		pos(center().x, 45),
		anchor("top"),
		text("Select Level", {
			letterSpacing: 5,
			font: "Tahoma",
			size: 45,
		})
	])

	function createTextLevel(num, px, py, t=false) {
		add([
			pos(width() * px, height() * py),
			color(t ? RED : rgb(...(num > 15 ? [125, 67, 232] : (num > highestLevel ? [227, 70, 70] : [88, 237, 93])))),
			anchor("center"),
			rect(64, 64),
			area(),
			z(100),
			"btn",
			(num > highestLevel ? "no" : "yes"),
			{ num, t }
		])
	
		add([
			pos(width() * px, height() * py),
			anchor("center"),
			z(100),
			text(t ? "X" : num.toString(), {
				font: "pixel",
				size: 32,
			})
		])
	}

	const square = add([
		pos(center().scale(4)),
		anchor("center"),
		opacity(0.5),
		color(BLACK),
		rect(64, 64),
		z(50)
	])

	onHover("no", () => {
		setCursor("not-allowed")
	})
	
	onHover("yes", () => {
		setCursor("pointer")
	})

	onClick("yes", (btn) => {
		if (!btn.t) {
			go("game", btn.num - 1)
		}
	})

	onHover("btn", (btn) => {
		square.pos = vec2(btn.pos).add(3, 3)
	})

	onKeyPress("escape", (btn) => {
		enableHardMode(false)
		go("main")
	})

  onKeyPress("r", () => {
    localStorage.setItem("level",1);
    go("lobby")
  })

  onKeyPress("d", () => {
    localStorage.setItem("level",20);
    go("lobby")
  })

	onHoverEnd("btn", () => {
		setCursor("default")
	})
	
	for (let i = 0; i < 20; i++) {
		createTextLevel(1 + i, (1 + i % 5) / 6, (2 + Math.floor(i / 5)) / 6, window.hardMode && i > 0)
	}
}