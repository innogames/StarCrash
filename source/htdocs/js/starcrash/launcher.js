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


	inputController.init();

	var modelsToLoad = [],
		player,
		level,
		mapView;



		document.addEventListener("click", function() {
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
		});







});