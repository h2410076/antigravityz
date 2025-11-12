import { levels, tutorial } from "./levels.js"

function keysDown(...args) {
	return args.filter(a => isKeyDown(a)).length > 0;
}

let deathScreenEnabled = true;
let helperTextScale = 1;
let total_attempts = 1;
let hardCoreMode = false;

window.disableAllHelperText = function () {
	helperTextScale = 0;
}

window.disableDeathScreen = function () {
	deathScreenEnabled = false;
}

window.enableHardMode = function (i = true) {
	window.hardMode = i;
}

export function game(levelidx = 0, tutoriali = false, hardCoreHealth = 10) {
	const hardCoreMode = window.hardMode;
	let leveldata = levels[levelidx]
	let oofTimer = 0;

	if (tutoriali) {
		console.log("leveldata tutorial")
		leveldata = tutorial[levelidx]
	} else {
		if (parseInt(localStorage.getItem("level") ?? "0") < levelidx + 1) {
		 	localStorage.setItem("level", (levelidx + 1).toString())
		}
	}

	if (tutoriali) {
		if (levelidx >= tutorial.length) {
			go("main")
			return;
		}
	} else {
		if (levelidx >= levels.length) {
			go("win")
			return;
		}
	}

	//BAD SUM
	
	let BADSUM = 19;

	console.log(levelidx)
	
	setBackground(levelidx <= BADSUM ? rgb(92, 187, 242) : rgb(30, 30, 30))
	
	const flyingSoundLoop = play("fly", {
		loop: true,
		volume: 0,
	})

	let backgroundLoopSpoop = play("spoop", {
		loop: true,
		volume: 0,
	})

	let backgroundSpoop = 30;
	let tutorialidx = 0;
	let attempts = 1;
	let hardCoreHealthBar;

	if (hardCoreMode) {
		hardCoreHealthBar = add([
			pos(center().x, 32),
			anchor("center"),
			color(RED),
			fixed(),
			z(100),
			text("HARDCORE", {
				size: 32,
			})
		])
	}
	
	add([
		pos(center().x, height() - 100),
		anchor("center"),
		opacity(helperTextScale),
		fixed(),
		color(levelidx > BADSUM ? rgb(175, 0, 0) : WHITE),
		text(leveldata.message ?? "", {
			anchor: "center",
			width: width() / 1.5,
			size: 32,
		}),
		z(100)
	])

	const totalAttemptsGUI = add([
		pos(width() - 16, height() - 64),
		anchor("botright"),
		color(BLUE),
		fixed(),
		z(102),
		text(`Total Attempts: ${levelidx > BADSUM ? "∞" : total_attempts}`, {
			font: "pixel",
			size: 32,
		})
	])
	
	const attemptsGUI = add([
		pos(width() - 16, height() - 16),
		anchor("botright"),
		color(BLUE),
		fixed(),
		z(102),
		text(`Attempt ${attempts}`, {
			font: "pixel",
			size: 32,
		})
	])

	add([
		pos(32, height() - 32),
		anchor("botleft"),
		rect(200, 20),
		color(RED),
		fixed(),
		z(101)
	])

	const STAMINOMETER = add([
		pos(32, height() - 32),
		anchor("botleft"),
		rect(200, 20),
		color(GREEN),
		fixed(),
		z(102)
	])
	
	const level = addLevel(leveldata.level, {
		tileHeight: 64,
		tileWidth: 64,

		tiles: {
			"G": () => [
				// The walls are super bad.
				sprite("grass", {
					height: 16,
					width: 64,
				}),
				anchor("botleft"),
				pos(0, 64),
				area(),
				body({
					isStatic: true,
				})
			],

			"D": () => [
				// The walls are super bad.
				sprite("dirt", {
					height: 64,
					width: 64,
				}),
				area(),
				body({
					isStatic: true,
				})
			],

			"T": () => [
				// The walls are super bad.
				text(leveldata?.tutorial?.[tutorialidx++], {
					size: 16,
					width: 200,
				}),
				opacity(helperTextScale * (hardCoreMode ? 0 : 1)),
				anchor("center"),
				color(BLACK),
				pos(32, 32),
				"helpers"
			],
			
			"L": () => [
				// The walls are super bad.
				sprite("damage", {
					height: 64,
					width: 64,
				}),
				anchor("center"),
				pos(32, 32),
				area(),
				"damage"
			],
			
			"X": () => [
				// The walls are super bad.
				sprite("damage", {
					height: 45,
					width: 45,
				}),
				anchor("center"),
				pos(32, 32),
				rotate(0),
				area(),
				"damage",
				"rot"
			],

			"J": () => [
				// The walls are super bad.
				anchor("center"),
				rect(25, 25),
				pos(32, 32),
				color(30, 170, 250),
				outline(1, BLACK),
				opacity(1),
				rotate(45),
				area(),
				"jump",
				"rot",
				{
					canjump: true,
				}
			],

			"F": () => [
				// The walls are super bad.
				color(WHITE),
				circle(16),
				pos(32, 32),
				area(),
				"goal",
				"rot"
			],

			"!": () => [
				// The walls are super bad.
				sprite("key", {
					height: 45,
					width: 45,
				}),
				anchor("center"),
				pos(32, 32),
				area(),
				"key",
				"rot"
			],

			"?": () => [
				// The walls are super bad.
				sprite("lock", {
					height: 64,
					width: 64,
				}),
				anchor("center"),
				color(YELLOW),
				pos(32, 32),
				opacity(1),
				area({
					collisionIgnore: []
				}),
				body({
					isStatic: true,
				}),
				"lock"
			],
	
			"@": () => [
				// The player is a small square.
				anchor("center"),
				rect(32, 32),
				pos(32, 32),
        color(RED),
				area(),
				body(),
				z(5),
				"player",
				{
					checkpointpos: vec2(0, 0),
					jumpscale: 1,
					power: 100,
					speed: 200,
					speedf: 200,
					i: 0,
				}
			]
		}
	})

	setGravity(1700)

	const failedGUI = add([
		rect(width(), height()),
		opacity(0),
		fixed(),
		z(20),
		color(RED),
		{
			o: 0.5,
		}
	])

	failedGUI.add([
		anchor("center"),
		pos(center().add(0, 50)),
		opacity(0),
		fixed(),
		color(WHITE),
		text("Click to continue or wait 1 second!", {
			font: "Trebuchet MS",
			align: "center",
			size: 35,
		})
	])

	failedGUI.add([
		anchor("center"),
		pos(center()),
		opacity(0),
		fixed(),
		color(WHITE),
		text("You Failed", {
			font: "Trebuchet MS",
			align: "center",
			size: 75,
		})
	])
	
	const player = level.get("player")[0]
  
  onUpdate("player", (player) => {
      player.color = hsl2rgb(wave(0, 1, time()/5), 0.6, 0.6)
  })
	
	player.checkpointpos = vec2(player.pos)
	let campos = vec2(player.pos)
	let jetvel = 1;

	function oof() {
		if (hardCoreMode) {
			if (hardCoreHealth <= 1) {
				flyingSoundLoop.paused = true;
				flyingSoundLoop.volume = 0;
				enableHardMode(false)
				go("main")
				return;
			} else {
				hardCoreHealth --
			}
		}
		
		campos = vec2(player.pos = vec2(player.checkpointpos))
		if (deathScreenEnabled) { 
			failedGUI.children.forEach(a => { a.opacity = a.o ?? 1 })
			failedGUI.opacity = failedGUI.o;
			player.jumpscale = 0.01;
			player.speed = 0;
      setGravity(1700)
		}
		console.log(oofTimer)
		if (oofTimer < 1) {
			attempts += 1;
			total_attempts += 1;
		}
		oofTimer = 30;
		totalAttemptsGUI.text = levelidx <= BADSUM ? `Total Attempts: ${total_attempts}` : "∞"
		attemptsGUI.text = `Attempt ${attempts}`
		play("oof")
		player._key = false;
		level.get("jump").forEach(jump => { jump.canjump = true; jump.opacity = 1 })
		level.get("lock").forEach((lock) => {
			const key = level.get("key")[0]
			lock.collisionIgnore = []
			lock.opacity = 1;
			key.opacity = 1;
		})
		setTimeout(() => {
			failedGUI.children.forEach(a => { a.opacity = 0 })
			failedGUI.opacity = 0;
			player.jumpscale = 1;
			player.speed = player.speedf;
		}, 1000)
	}
	
	player.onCollide("damage", () => {
    setGravity(1700)
		oof()
	})

	player.onCollide("key", (key) => {
		key.opacity = 0;
		player._key = true;
	})

	player.onCollide("lock", () => {
		level.get("lock").forEach((lock) => {
			if (lock.opacity > 0 && !!player._key) {
				lock.collisionIgnore.push("player")
				lock.opacity = 0;
			}
		})
	})

	player.onCollide("goal", () => {
		backgroundLoopSpoop.paused = true;
		flyingSoundLoop.paused = true;
		flyingSoundLoop.volume = 0;
		setBackground(rgb(92, 187, 242))
		if (levelidx === BADSUM) {
			// HE IS APPROACHING. APPROACHING.
			if (hardCoreMode) {
				localStorage.setItem("hardcore", "BADSUM")
			}
			go("win", levelidx + 1)
		} else {
			go("game", levelidx + 1, tutoriali, hardCoreHealth)
		}
	})

	player.onCollide("jump", (jump) => {
		if (jump.canjump) {
			player.jump(750 * player.jumpscale)
			jump.canjump = false;
			T = 0;
			play("jump", {
				volume: 0.75,
				detune: -200,
				seek: 0.25,
			})
		}
	})

	onClick(() => {
		failedGUI.children.forEach(a => { a.opacity = 0 })
		failedGUI.opacity = 0;
		player.jumpscale = 1;
		player.speed = player.speedf;
	})

	onKeyPress("escape", () => {
		flyingSoundLoop.paused = true;
		flyingSoundLoop.volume = 0;
		go("lobby", levelidx + 1)
	})

	onKeyPress("q", () => {
    if (hardCoreMode) {} else {
      if (camscale >= 0.25) {
		    camscale = camscale - 0.125;
      }
    }
	})

  onKeyPress("p", () => {
    if (hardCoreMode) {} else {
      if (camscale <= 0.875) {
        camscale = camscale + 0.125;
      }
    }
  })

	onKeyPress("h", () => {
		if (!tutoriali) {
			level.get("helpers").forEach(helper => {
				helper.opacity ^= 1;
			})
		}
	})

	let A = true, B = null, T = 0, camscale = 1;
	
	onDraw(() => {
		if (helperTextScale === 0) {
			level.get("helpers").forEach(helper => {
				helper.opacity = 0;
			})
		}
		
		oofTimer -= 1;
		
		STAMINOMETER.width = Math.max(1, player.power * 2)

    if (hardCoreMode) {
      camScale(-(3 * Math.min(width() / 1879, height() / 962) ** 0.5 * camscale))
    } else {
		  camScale(3 * Math.min(width() / 1879, height() / 962) ** 0.5 * camscale)
    }
		
		if (keysDown("a", "left")) {
      if (hardCoreMode) {
			 player.move(player.speed, 0)
      } else {
        player.move(-player.speed, 0)
      }
		}

		if (player.pos.y > level.numRows() * 64 + 250) {
			oof()
		}
		
		if (keysDown("d", "right")) {
      if (hardCoreMode) {
       player.move(-player.speed, 0)
      } else {
        player.move(player.speed, 0)
      }
		}

		level.get("jump").forEach((jump) => {
			if (!jump.canjump && jump.opacity > 0) {
				jump.opacity -= 3 * dt()
			}
		})
		
		if (player.isGrounded()) {
			if (A) {
				add([
					anchor("center"),
					pos(player.pos),
					opacity(1),
					z(15),
					"powder",
					text("RECHARGED", {
						size: 16,
					}),
					{
						f: 50,
						i: 50,
					}
				])
				A = false;
			}
			jetvel = 1;
			player.power = 100;
		} else {
			A = true;
		}

		T += 1;
		
		if (keysDown("w", "up")) {
			if (B == null) {
				B = player.isGrounded()
			} else {
				if (B) {
					if (levelidx <= BADSUM) {
						play("jump", {
							volume: 0.75,
							detune: -100,
							seek: 0.25,
						})
					}

					player.jump(400 * player.jumpscale)
					T = 0;
					B = null;
				} else {
					if (player.power > 0 && T > 20) {
						if (flyingSoundLoop.volume < 1 && levelidx <= BADSUM) {
							flyingSoundLoop.volume += dt()
						}
            setGravity(-1700)
						if (player.i % 60 < 50) {
							add([
								rotate(rand(360)),
								pos(player.pos),
								opacity(1),
								color(WHITE),
								rect(10, 10),
								"powder",
								{
									f: 15,
									i: 15,
								}
							])
						}
					} else {
						jetvel = 1;
						if (flyingSoundLoop.volume > 0) {
							flyingSoundLoop.volume -= 0.2 * dt()
            }
					}
				}
			}
		} else {
			if (flyingSoundLoop.volume > 0) {
				flyingSoundLoop.volume -= 2 * dt()
			}
			if (B != null) {
				player.power -= 10;
			}
			B = null;
		}

    if (player.power <= 0) {
      setGravity(1700);
    }

    if (getGravity()==-1700) {
      player.power -= 30 * dt()
    }

		player.i += 1;

		for (const damageBlock of level.get("rot")) {
			damageBlock.angle += 75 * dt()
		}

		for (const powder of get("powder")) {
			powder.opacity = powder.i / powder.f;
			powder.i -= 1;
			if (powder.i < 0) {
				destroy(powder)
			}
		}

		if (hardCoreMode) {
			hardCoreHealthBar.text = `HARDCORE (${hardCoreHealth})`
		}
		if (levelidx > BADSUM) {
			if (backgroundLoopSpoop.volume < 0.75) {
				backgroundLoopSpoop.volume += dt() / 20;
			}
			
			backgroundSpoop = 20 * Math.abs(Math.cos(time()))
			
			if (time() % 3 < rand() / 5) {
				setBackground(rgb(backgroundSpoop * 5, 0, 0))
			} else {
				setBackground(rgb(backgroundSpoop, backgroundSpoop, backgroundSpoop))
			}

			drawRect({
				height: height(),
				width: width(),
				fixed: true,
				color: BLACK,
				opacity: 0.75 + 0.25 * Math.abs(Math.sin(backgroundSpoop * (time() % 1))),
			})
		}
		
		campos = campos.scale(0.95).add(player.pos.scale(0.05))
		camPos(campos)
	})
}