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
				"engine/graphicController",
				"engine/LevelController",
				"ui/UIMap",
				"engine/Player",
				"engine/inputController",
				"engine/gameController",
				"engine/modelStore",
				"engine/debugTool",
				"mapView/mapView"
			],

    function(
				graphics,
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

	inputController.init();

	var modelsToLoad = [],
		player,
		level,
		mapView;




	var animationCallback = function() {
		player.animate();

		var camera;
		// == render main view-port ==========
		if (debugTool.flyControlsEnabled) {
			// use debug camera
			camera = debugTool.debugCamera;
		} else {
			// use main camera
			camera = graphics.getMainCamera();
		}
		graphics.applyViewportSettings(graphics.renderer, camera);
		graphics.renderer.render(graphics.scene, camera);


		// == render map view-port ===========
		mapView.render();

		debugTool.update();
		requestAnimationFrame(animationCallback);
	};


	fetchJSONFile("levels/level02.json", function(levelJSON) {

		level = new Level(levelJSON);
		modelsToLoad = modelStore.getModelFileList(level.getContainingEntityTypes());
		modelsToLoad.push("models/aim.js"); // add the player model

		modelStore.load(modelsToLoad, function(geometries, materials) {

			level.initEntities();
			graphics.scene.add(level);
			window.level = level;

			//world.initMap(geometries, materials);
			player = new Player(0, 0, graphics.getMainCamera(), geometries["models/aim.js"], materials["models/aim.js"]);
			mapView = new MapView(player, level);
			graphics.scene.add(player);

			graphics.scene.fog = new THREE.FogExp2( 0x333333, 0.003 );

			new GameController(player, level);
			//new UIMap(level, player);

			debugTool.init(player, level);
			animationCallback();
		});

	});

});