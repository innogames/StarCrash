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

require(    [
				"engine/engine",
				"engine/world",
				"engine/level",
				"ui/UIMap",
				"engine/player",
				"engine/inputController",
				"engine/gameController",
				"engine/modelStore",
				"engine/debugTool"
			],

    function(
				engine,
				world,
				Level,
				UIMap,
				Player,
				inputController,
				GameController,
				modelStore,
				debugTool
			) {

	// setup particle-engine
	//engine.particleEngine = new ParticleEngine();
	//Examples.candle.positionBase = new THREE.Vector3(0,-55,350);
	//game.engine.particleEngine.setValues(Examples.candle);
	//game.engine.particleEngine.initialize();

	engine.init();
	inputController.init();

	var modelsToLoad = [],
		player,
		level;




	var animationCallback = function() {
		player.animate();
		world.updateLights();

		if (debugTool.flyControlsEnabled) {
			engine.renderer.render(engine.scene, debugTool.debugCamera);
		} else {
			engine.renderer.render(engine.scene, engine.camera);
		}


		engine.tick += 1;
		requestAnimationFrame(animationCallback);

		debugTool.update();
	};


	fetchJSONFile("levels/level01.json", function(levelJSON) {

		level = new Level(levelJSON);
		modelsToLoad = level.getContainingModelNames();
		modelsToLoad.push("aim"); // add the player model

		modelStore.load(modelsToLoad, function(geometries, materials) {

			world.initMap(geometries, materials);
			player = new Player(0, 0, engine.camera, geometries["aim"], materials["aim"]);
			engine.scene.add(player);
			new GameController(player);
			new UIMap(level, player);

			debugTool.init(player, level);
			animationCallback();
		});

	});

});