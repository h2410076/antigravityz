// 0xAF9B809F80B9868570C697CC89B667B98A686C675 = BAD_SUM_???

export function badsum1(goodsum) {
	setBackground(BLACK)

	var BADSUM1 = [
		"",
		"...",
		"Do you think this is a GAME?",
		"I am getting enough of you.",
		"This is not a joke.",
		"You are not going to like this.",
		"GOODBYE."
	]

	var BADSUM2 = 0;

	add([
		color(0, 0, 50),
		text("Encountered a major error within the system. Fixing now. Glitch is never fixed. The mask equals the BAD SUM BAD SUM BAD SUM BAD SUM BAD SUM BAD SUM BAD SUM.", {
			width: width(),
			size: 100,
			font: "pixel",
		})
	])

	var BADSUM3 = add([
		color(50, 0, 0),
		pos(center()),
		anchor("center"),
		text("", {
			width: width() / 1.25,
			anchor: "center",
			size: 32,
		})
	])

	/// Loop by an indeterminate amount of time.
	async function next() {
		if (BADSUM2 >= BADSUM1.length) {
			go("game", goodsum)
			return;
		}
		console.log("exec")
		BADSUM3.text = BADSUM1[BADSUM2 ++]
		await wait(rand() * 3 * BADSUM2)
		requestAnimationFrame(next)
	}

	requestAnimationFrame(next)

	onDraw(() => {
		BADSUM3.pos = center().add(rand(vec2(20)))
	})
}