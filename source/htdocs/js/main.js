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

require(    ["modules/keyboard",    "engine/engine",    "engine/world", "engine/loader",    "engine/player",	"engine/level", "ui/UIMap", 	"engine/player2", 	"engine/input", "engine/logic"],
    function(keyboardModule,        engine,             world,          loader,             player,				Level, 			UIMap,			Player2, 			input,			Logic) {
	// init keyboard-module
	keyboardModule.init();

	// init engine
	engine.init();



	input.init();


	// load models
	loader(function(geometries, materials) {
		world.initMap(geometries, materials);

		// setup particle-engine
		//engine.particleEngine = new ParticleEngine();
		//Examples.candle.positionBase = new THREE.Vector3(0,-55,350);
		//game.engine.particleEngine.setValues(Examples.candle);
		//game.engine.particleEngine.initialize();

		//player.init();

		// start animation loop


		var animationCallback = function() {
			player2.animate();
			world.updateLights();
			engine.renderer.render(engine.scene, engine.camera);
			engine.tick += 1;
			requestAnimationFrame(animationCallback);
		};

		var player2 = new Player2(0, 0, engine.camera);
		engine.scene.add(player2);

		var gameController = new Logic(player2);

		//animate(player2);

		fetchJSONFile("levels/level01.json", function(levelJSON) {
			var myLevel = new Level(levelJSON);
			var myUIMap = new UIMap(myLevel, player2);
			animationCallback();
		});
	});
});