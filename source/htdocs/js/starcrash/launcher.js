define([
		"UTILS",
		"starcrash/controller/controller_graphic",
		"starcrash/objects/level",
		"starcrash/objects/player",
		"starcrash/controller/controller_input",
		"starcrash/controller/controller_game",
		"starcrash/graphic/model_store",
		"starcrash/debug/debug_tool",
		"starcrash/ui/map_view/controller_map_view",
		"starcrash/static/config"
	],
	function(
		UTILS,
		graphics,
		Level,
		Player,
		inputController,
		GameController,
		modelStore,
		debugTool,
		MapView,
		config
	) {

	var Launcher = function() {

	};

	/**
	 * Continues the game at the last save point.
	 */
	Launcher.prototype.continueGame = function() {
		inputController.init();

		var modelsToLoad = [],
			player,
			level,
			mapView;

		// TODO : get player progress from 'Web Storage' or cookies

		UTILS.fetchJSONFile("levels/level02.json", function(levelJSON) {

			level = new Level(levelJSON);
			modelsToLoad = modelStore.getModelFileList(level.getContainingEntityTypes());
			modelsToLoad.push("models/aim.js"); // add the player model

			modelStore.load(modelsToLoad, function(geometries, materials) {

				level.initEntities();
				graphics.scene.add(level);


				window.level = level;

				//world.initMap(geometries, materials);
				player = new Player(0, 0, graphics.getMainCamera(), geometries["models/aim.js"], materials["models/aim.js"]);

				window.player = player;

				graphics.addAnimation(player);
				mapView = new MapView(player, level);
				graphics.addAnimation(mapView);
				graphics.scene.add(player);

				/*var aLight = new THREE.AmbientLight( 0x404040 );
				 aLight.intensity = 100;
				 graphics.scene.add(aLight);*/

				new GameController(player, level, graphics);

				debugTool.init(player, level, graphics.getMainCamera(), graphics.renderer.domElement);

				graphics.animationCallback();


			});

		});
	};


	return new Launcher();
});