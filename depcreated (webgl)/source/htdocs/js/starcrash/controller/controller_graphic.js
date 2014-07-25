define([
		"THREE",
		"starcrash/static/config",
		"starcrash/debug/debug_tool"
	], function(
		THREE,
		config,
		debugTool
	) {

	var singletonInstance;

	var GraphicController = function() {};


	GraphicController.prototype.init = function() {
		this._debugAxisHelper = new THREE.AxisHelper(100);
		this._debugAxisHelper.visible = false;
		this._debugGridHelper = new THREE.GridHelper(100 *  config.gridCellSize,  config.gridCellSize);
		this._debugGridHelper.visible = false;


		this.mainCamera = null;
		this.scene = null;
		this.clock = null;
		this.renderer = null;
		this.viewPortContainer = null;

		this.dpr = window.devicePixelRatio || 1;



		this.viewPortContainer = document.getElementById(config.viewPortContainerId);

		this.mainCamera = new THREE.PerspectiveCamera(60, config.renderSize.width / config.renderSize.height, 1, config.farSight);
		this.mainCamera.position.set(0, 0, 0);
		this.mainCamera.up.set(0, 1 ,0);
		this.mainCamera.rotation.set(0, 0, 0);
		this.mainCamera.viewportSettings = {
			left: 0,
			bottom: 0,
			width: 1.0,
			height: 1.0,
			backgroundColor: new THREE.Color( 0x000000 )
		};
		this.mainCamera.receiveShadow = true;


		this.mapCamera = new THREE.OrthographicCamera( config.renderSize.width / - 2, config.renderSize.width / 2, config.renderSize.height / 2, config.renderSize.height / - 2, 1, config.farSight );
		//this.mapCamera = new THREE.PerspectiveCamera(60, this.renderSize.width / this.renderSize.height, 1, 10000);
		this.mapCamera.position.set(0, config.mapViewElementsY + 1, 0);
		this.mapCamera.up.set(0, 1 , 0);
		this.mapCamera.rotation.set(-Math.PI / 2, 0, 0);

		this._animationList = [];
		this._animationGroup = new THREE.Object3D();
		this._animationGroup.name = "Animations";

		this.mapCamera.viewportSettings = {
			left: 0.7,
			bottom: 0.7,
			width: 0.3,
			height: 0.3,
			backgroundColor: new THREE.Color( 0x0B0B3B )
		};


		this.fpsDiv =  document.getElementById('fps');
		this.scene =  new THREE.Scene();
		this.clock = new THREE.Clock();

		this.scene.receiveShadow = true;
		this.scene.castShadow = true;

		// TODO : maybe use a 'light pool' object to get lights from?
		this.laserBeamLight = new THREE.PointLight(0xffFF00, 0, 10000);
		this.laserImpactLight = new THREE.PointLight(0xFF0000, 0, 50);
		this.scene.add(this.laserBeamLight);
		this.scene.add(this.laserImpactLight);


		this.scene.add(this._debugAxisHelper);
		this.scene.add(this._debugGridHelper);
		this.scene.add(this._animationGroup);


		// init and append renderer
		this.renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
		this.renderer.setSize(config.renderSize.width, config.renderSize.height);
		this.renderer.shadowMapEnabled = true;

		this.viewPortContainer.appendChild(this.renderer.domElement);

		// resize-listener
		window.addEventListener('resize', function() {
			this.mainCamera.aspect = config.renderSize.width / config.renderSize.height;
			this.mainCamera.updateProjectionMatrix();
			this.renderer.setSize(config.renderSize.width, config.renderSize.height);
		}, false);

		// add scene to window in debug-mode
		if (config.debug) {
			window.scene = this.scene;
			window.engine = this;
		}

		//this.scene.fog = new THREE.FogExp2( 0x333333, config.fogDensity );
		this._initSkyBox();
	};

	GraphicController.prototype._initSkyBox = function() {
		var urls = [
			'img/textures/skybox/skybox_universe_pos_x.jpg',
			'img/textures/skybox/skybox_universe_neg_x.jpg',
			'img/textures/skybox/skybox_universe_pos_y.jpg',
			'img/textures/skybox/skybox_universe_neg_y.jpg',
			'img/textures/skybox/skybox_universe_pos_z.jpg',
			'img/textures/skybox/skybox_universe_neg_z.jpg'
		];


		urls = [
			'img/textures/skybox/posx.png',
			'img/textures/skybox/negx.png',
			'img/textures/skybox/posy.png',
			'img/textures/skybox/negy.png',
			'img/textures/skybox/posz.png',
			'img/textures/skybox/negz.png'
		];

		var cubemap = THREE.ImageUtils.loadTextureCube(urls);
		cubemap.format = THREE.RGBFormat;

		var shader = THREE.ShaderLib['cube'];

		shader.uniforms['tCube'].value = cubemap;

		var skyBoxMaterial = new THREE.ShaderMaterial( {
			fragmentShader: shader.fragmentShader,
			vertexShader: shader.vertexShader,
			uniforms: shader.uniforms,
			depthWrite: false,
			side: THREE.BackSide,
			receiveShadow: false
		});

		var skybox = new THREE.Mesh(
			new THREE.CubeGeometry(config.farSight - 10, config.farSight - 10, config.farSight - 10),
			skyBoxMaterial
		);


		var geometry = new THREE.PlaneGeometry( config.farSight, config.farSight);


		var texture = THREE.ImageUtils.loadTexture("img/textures/skybox/skybox_universe_neg_y.jpg");
		var material = new THREE.MeshLambertMaterial({map: texture});
		var floor = new THREE.Mesh( geometry, material );
		floor.rotation.x = -Math.PI / 2;

		this.scene.add(skybox);
		this.scene.add(floor);

	};


	GraphicController.prototype.animationCallback = function() {
		var animationsToRemoveList = [],
			tmpAnimation,
			camera;

		// == render main view-port ==========
		if (debugTool.flyControlsEnabled) {
			// use debug camera
			camera = debugTool.debugCamera;
			singletonInstance._debugAxisHelper.visible = true;
			singletonInstance._debugGridHelper.visible = config.debug_draw_grid;
			if (singletonInstance.scene.fog != null) {
				singletonInstance.scene.fog.density = 0;
			}

		} else {
			// use main camera
			camera = singletonInstance.mainCamera;
			singletonInstance._debugAxisHelper.visible = false;
			singletonInstance._debugGridHelper.visible = false;

			if (singletonInstance.scene.fog != null) {
				singletonInstance.scene.fog.density = config.fogDensity;
			}
		}

		singletonInstance.applyViewportSettings(singletonInstance.renderer, camera);
		singletonInstance.renderer.render(singletonInstance.scene, camera);


		// animate animatables
		for (var i = 0; i < singletonInstance._animationList.length; i++) {
			var animationStillRunning = singletonInstance._animationList[i].animate(singletonInstance.clock.getDelta());
			if (animationStillRunning == false) {
				animationsToRemoveList.push(singletonInstance._animationList[i]);
			}
		}

		// removed expired animations
		for (var i = 0; i < animationsToRemoveList.length; i++) {
			singletonInstance.removeAnimation(animationsToRemoveList[i]);
		}


		requestAnimationFrame(singletonInstance.animationCallback);
	};


	GraphicController.prototype.getMainCamera = function() {
		return this.mainCamera;
	};


	GraphicController.prototype.getMapCamera = function() {
		return this.mapCamera;
	};


	GraphicController.prototype.applyViewportSettings = function(renderer, camera) {
		var left = 		Math.floor(config.renderSize.width  * camera.viewportSettings.left) * this.dpr,
			bottom = 	Math.floor(config.renderSize.height * camera.viewportSettings.bottom) * this.dpr,
			width = 	Math.floor(config.renderSize.width  * camera.viewportSettings.width) * this.dpr,
			height = 	Math.floor(config.renderSize.height * camera.viewportSettings.height) * this.dpr;

		renderer.setViewport(left, bottom, width, height );
		renderer.setScissor( left, bottom, width, height );
		renderer.enableScissorTest(true);
		//renderer.setClearColor(camera.viewportSettings.backgroundColor, 0.1);
		renderer.setClearColor( 0x000000, 0.1);

		camera.aspect = width / height;
	};


	GraphicController.prototype.addAnimation = function(animatable, removeOnEnd) {
		this._animationList.push(animatable);
		if (removeOnEnd) {
			this._animationGroup.add(animatable);
		}
		//if (config.debug) console.log("[GraphicController] Added animation: ",  animatable);
	};

	GraphicController.prototype.removeAnimation = function(animatable) {
		var index = this._animationList.indexOf(animatable);
		if (index > -1) { this._animationList.splice(index, 1); }
		this._animationGroup.remove(animatable);
		//if (config.debug) console.log("[GraphicController] Removed animation: ", animatable);
	};

	singletonInstance = new GraphicController();
	return singletonInstance;





});