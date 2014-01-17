require.config({
	baseUrl: "js",
	paths: {
		THREE: "libs/three.min",
		ParticleEngine: "libs/ParticleEngine"
	},
	shim: {
		THREE: {
			exports: "THREE"
		},
		ParticleEngine: {
			exports: "ParticleEngine"
		}
	}
});

require(["modules/keyboard", "engine/engine", "engine/world", "engine/loader", "engine/player", "engine/animate"], function(keyboardModule, engine, world, loader, player, animate) {
	// init keyboard-module
	keyboardModule.init();

	// init engine
	engine.init();

	// load models
	loader(function(geometries, materials) {
		world.initMap(geometries, materials);

		// setup particle-engine
		//engine.particleEngine = new ParticleEngine();
		//Examples.candle.positionBase = new THREE.Vector3(0,-55,350);
		//game.engine.particleEngine.setValues(Examples.candle);
		//game.engine.particleEngine.initialize();

		player.init();

		// start animation loop
		animate();
	});
});