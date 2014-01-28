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
				"engine/debugTool",
				"mapView/mapView"
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
				debugTool,
				MapView
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
		level,
		mapView;




	var animationCallback = function() {
		player.animate();
		world.updateLights();

		var camera;
		// == render main view-port ==========
		if (debugTool.flyControlsEnabled) {
			// use debug camera
			camera = debugTool.debugCamera;
		} else {
			// use main camera
			camera = engine.getMainCamera();
		}
		engine.applyViewportSettings(engine.renderer, camera);
		engine.renderer.render(engine.scene, camera);


		// == render map view-port ===========
		mapView.render();


		engine.tick += 1;
		debugTool.update();
		requestAnimationFrame(animationCallback);
	};


	fetchJSONFile("levels/level01.json", function(levelJSON) {

		level = new Level(levelJSON);
		modelsToLoad = modelStore.getModelFileList(level.getContainingEntityTypes());
		modelsToLoad.push("models/aim.js"); // add the player model

		modelStore.load(modelsToLoad, function(geometries, materials) {

			level.initEntities();
			engine.scene.add(level);

			//world.initMap(geometries, materials);
			player = new Player(1, 6, engine.getMainCamera(), geometries["models/aim.js"], materials["models/aim.js"]);
			mapView = new MapView(player, level);
			engine.scene.add(player);
			new GameController(player);
			//new UIMap(level, player);

			debugTool.init(player, level);
			animationCallback();
		});

	});

});