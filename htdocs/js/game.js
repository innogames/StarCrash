// game-namespace
var game = {
	config: {
		debug: true
	},
	controls: {
		keyboard: []
	},
	engine: {
		camera: {},
		fpsDiv: null,
		scene: {},
		renderer: {},
		clock: {},
		tick: 0,
		animate: null,
		particleEngine: null

	},
	init: null,
	util: {},
	player: player,
	world: world
};

// animation-loop
game.engine.animate = function animate() {
	var tDelta = game.engine.clock.getDelta();

	// fps
	if (this.tick % 30 === 0) {
		console.log(this.fpsDiv, document.getElementById('fps)'), 1 / tDelta);
		this.fpsDiv.innerHTML = ~~(1 / tDelta);
	}

	// debug-controls
	if (game.config.debug) {
		game.player.control(tDelta);
	}

	// movement
	game.player.handleMovement(tDelta);

	// lights
	game.world.updateLights();

	// request next frame
	requestAnimationFrame(animate);

	//update particle-engine
	game.engine.particleEngine.update(tDelta * 0.5);

	// render
	game.engine.renderer.render(game.engine.scene, game.engine.camera);

	// tick
	this.tick += 1;
};

game.util.loader = function loader(callback) {
	var that = this,
		geometries = {},
		materials = {},
		jsonLoader = new THREE.JSONLoader(),
		modelList = ['xcube', 'icube', 'aim'],
		i;

	for (i = 0; i < modelList.length; i++) {
		(function(i) {
			jsonLoader.load("models/" + modelList[i] + ".js", function (geometry, material) {
				geometries[modelList[i]] = geometry;
				materials[modelList[i]] = material;

				// is player model
				if (modelList[i] === 'aim') {
					// create mesh
						materials['aim'].shading = THREE.SmoothShading;

						// and add save it as the players model
						game.player.model = new THREE.Mesh(geometries['aim'], new THREE.MeshFaceMaterial( materials['aim'] ));
						game.player.model.geometry.computeVertexNormals();
						game.player.model.geometry.computeFaceNormals();

						// add mesh to scene
						game.engine.scene.add(game.player.model);
				}

				// last model loaded -> add geometries to scene
				if (i === modelList.length - 1) {
					// TODO: yeah, this kinda sucks, but else it will fuck up the last model loaded
					setTimeout(function() {
						callback(geometries, materials);
					}, 200);
				}
			});
		})(i);
	}
};

// initializes the game
game.init = function init() {
	var engine = game.engine,
		container = document.getElementById('container');

	engine.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 4096);
	engine.fpsDiv =  document.getElementById('fps');
	engine.scene =  new THREE.Scene();
	engine.clock = new THREE.Clock();

	// add cam
	engine.scene.add(this.engine.camera);

	// init and append renderer
	engine.renderer = new THREE.WebGLRenderer({antialias:true});
	engine.renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(engine.renderer.domElement);

	// keydown-listener
	window.addEventListener('keydown', function(event) {
		game.controls.keyboard[event.keyCode] = true;
	}, false);

	// keyup-listener
	window.addEventListener('keyup', function(event) {
		game.controls.keyboard[event.keyCode] = false;
	}, false);

	// resize-listener
	window.addEventListener('resize', function() {
		engine.camera.aspect = window.innerWidth / window.innerHeight;
		engine.camera.updateProjectionMatrix();
		engine.renderer.setSize(window.innerWidth, window.innerHeight);
	}, false);

	// load models
	game.util.loader(function(geometries, materials) {
		game.world.initMap(geometries, materials);

		// setup particle-engine
		game.engine.particleEngine = new ParticleEngine();
		Examples.candle.positionBase = new THREE.Vector3(0,-55,350);
		game.engine.particleEngine.setValues(Examples.candle);
		game.engine.particleEngine.initialize();

		game.player.init();

		// start animation loop
		engine.animate();
	});
};