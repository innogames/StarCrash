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
				"mapView/mapView",
				"config"
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
				MapView,
                config
			) {


	inputController.init();

	var modelsToLoad = [],
		player,
		level,
		mapView;







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
			graphics.addAnimatable(player);
			mapView = new MapView(player, level);
			graphics.addAnimatable(mapView);
			graphics.scene.add(player);

			graphics.scene.fog = new THREE.FogExp2( 0x333333, config.fogDensity );

			new GameController(player, level);
			//new UIMap(level, player);

			debugTool.init(player, level, graphics.getMainCamera(), graphics.renderer.domElement);
			graphics.animationCallback();
		});

	});

});