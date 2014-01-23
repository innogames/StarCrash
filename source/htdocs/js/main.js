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

require(    [	"modules/keyboard",
				"engine/engine",
				"engine/world",
				"engine/loader",
				"engine/level",
				"ui/UIMap",
				"engine/player",
				"engine/input",
				"engine/logic",
				"engine/modelStore"
			],

    function(	keyboardModule,
				engine,
				world,
				loader,
				Level,
				UIMap,
				Player,
				input,
				Logic,
				modelStore
			) {

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

		var player;

		var animationCallback = function() {
			player.animate();
			world.updateLights();
			engine.renderer.render(engine.scene, engine.camera);
			engine.tick += 1;
			requestAnimationFrame(animationCallback);
		};


		fetchJSONFile("levels/level01.json", function(levelJSON) {

			modelStore.load(['xcube', 'icube', 'aim'], function(geometries, materials) {

				player = new Player(0, 0, engine.camera, geometries["aim"], materials["aim"]);

				engine.scene.add(player);
				var gameController = new Logic(player);
				var debugInfoElement = document.getElementById("debugInfo");
				setInterval(function() {
					debugInfoElement.innerHTML = "player absolute x: " + player.position.x + " y: " + player.position.y + " z: " + player.position.z;
				}, 300);

				var myLevel = new Level(levelJSON);
				var myUIMap = new UIMap(myLevel, player);
				animationCallback();

			});

		});
	});
});