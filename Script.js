import { badsum1 } from "./Badsum.js"
import { settings } from "./Settings.js"
import { lobby } from "./Lobby.js"
import { game } from "./Game.js"
import { win } from "./Won.js"
import { main } from "./Main.js"
import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

kaboom({
	pixelDensity: 2,
	debug: false,
})

setBackground(92, 187, 242)

loadSprite("settings", "./settings.png")
loadSprite("damage", "./damage.png")
loadSprite("grass", "./grass.png")
loadSprite("lobby", "./newlobby.png")
loadSprite("dirt", "./dirt.png")
loadSprite("lock", "./lock.png")
loadSprite("key", "./key.png")

loadFont("pixel", "./pixel.otf")

loadSound("spoop", "./spoop.ogg")
loadSound("jump", "./jump.mp3")
loadSound("fly", "./fly.mp3")
loadSound("oof", "./oof.mp3")

scene("badsum1", badsum1)

scene("settings", settings)
scene("lobby", lobby)
scene("game", game)
scene("main", main)
scene("win", win)

if (localStorage.getItem("level") == null) {
	localStorage.setItem("level", "1")
}

if (localStorage.getItem("hardcore") == null) {
	localStorage.setItem("hardcore", "")
}

onLoad(() => {
	go("main")
})