export function main(highestLeveli = 1) {
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
		text("AntiGravityZ", {
			font: "pixel",
			size: 45,
		})
	])

	add([
		pos(center().x, 90),
		anchor("top"),
		text("  A fun and free platformer game!", {
			font: "pixel",
			width: 250,
			size: 16,
		})
	])

	var st = add([
		pos(width() - 64, 32),
		anchor("right"),
		z(100),
		text("Settings", {
			font: "pixel",
			size: 24,
		})
	])
	
	const settingsGUI = add([
		pos(width() - 32, 32),
		anchor("center"),
		area(),
		z(100),
		sprite("settings", {
			height: 32,
			width: 32,
		}),
		"btn",
		{
			nohover: true,
			cl () {
				go("settings")
			}
		}
	])

	function createTextLevel(txt, px, py, cl=null, red=true, small=false, smallmult=0.75) {
		var d = add([
			pos(width() * px, height() * py),
			anchor("center"),
			z(101),
			text(txt, {
				font: "pixel",
				size: 32 * (small ? smallmult : 1),
			})
		])
		
		add([
			pos(width() * px, height() * py),
			color(...(red ? [227, 70, 70] : [88, 237, 93])),
			anchor("center"),
			rect(...(small ? [400 * smallmult, 64 * smallmult] : [400, 64])),
			area(),
			z(100),
			"btn",
			{ cl, d }
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
	
	onHover("btn", () => {
		// setCursor(choose(["pointer", "not-allowed"]))
		setCursor("pointer")
	})

	onClick("btn", (btn) => {
		btn.cl.bind(btn)()
	})

	onHover("btn", (btn) => {
		if (!btn.nohover) {
			square.height = btn.height;
			square.width = btn.width;
			square.opacity = 0.5;
			square.pos = vec2(btn.pos).add(3, 3)
		}
	})

	onHoverEnd("btn", () => {
		setCursor("default")
		square.opacity = 0;
	})
	
	createTextLevel("Select Level", 1 / 2, 1.675 / 4, () => {
		go("lobby")
	}, true, true)
	
	createTextLevel("Play!", 1 / 2, 2.25 / 4, () => {
		go("lobby")
	}, false)
	createTextLevel("Tutorial", 1 / 2, 3 / 4, () => {
		go("game", 0, true)
	}, true)

	createTextLevel("HARDCORE", 0.62, 3.675 / 4, function () {
		this.d.text = "GOOD LUCK!!!"
		st.text = "Hardcore"
		st.color = RED;
		window.enableHardMode()
		shake(50)
	}, true, true, 0.5)
	
	createTextLevel("more", 0.35, 3.675 / 4, () => {
		window.open(choose([
			"https://replit.com/@eliaslee123"
		]))
	}, true, true, 0.375)
}