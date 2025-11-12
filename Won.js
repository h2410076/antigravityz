export function win(l) {
	var h = !!localStorage.getItem("hardcore")
	
	setBackground(rgb(92, 187, 242))
	
	add([
		anchor("center"),
		pos(center()),
		text(`CONGRATS\nYOU WON!!!${h ? " HARDCORE" : ""}`, {
			letterSpacing: 2,
			align: "center",
			font: "pixel",
			size: 64,
		})
	])

	if (h) {
		var bad = add([
			anchor("center"),
			color(RED),
			area(),
			pos(0, 0),
			text("BAD SUM", {
				letterSpacing: 2,
				align: "center",
				font: "pixel",
				size: 32,
			})
		])
	
		var b = 0;
	
		var d = [
			"haha you didnt complete hard mode dont click this again",
			"really dont",
			"really dont",
			"no...",
			"DONT YOU THINK ABOUT IT.",
			"ONLY HARDCORE MODE BEATERS ARE SUPPOSED TO GET HERE!",
			"NO",
			"PLEASE",
			"one more click. And you are going to regret this very much.",
			"NOT UNTIL YOU KEEP ON CLICKING!!!"
		]
	
		bad.onClick(() => {
			var i = d?.[b++]
	
			if (!!i) {
				alert(i)
			} else {
				go("badsum1", l)
			}
		})
	
		onDraw(() => {
			setCursor(bad.isHovering() ? "pointer" : "default")
			bad.pos = vec2(center().x, height() - 32).add(rand(vec2(b * 2)))
		})
	}
}