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

		this.mainCamera = new THREE.PerspectiveCamera(60, config.renderSize.width / config.renderSize.height, 1, 10000);
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


		this.mapCamera = new THREE.OrthographicCamera( config.renderSize.width / - 2, config.renderSize.width / 2, config.renderSize.height / 2, config.renderSize.height / - 2, 0, 10000 );
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

		this.scene.fog = new THREE.FogExp2( 0x333333, config.fogDensity );
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
			singletonInstance._debugGridHelper.visible = true;
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

		debugTool.animate(singletonInstance.clock.getDelta());

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
		renderer.setClearColor(camera.viewportSettings.backgroundColor, 0.1);

		camera.aspect = width / height;
	};


	GraphicController.prototype.addAnimation = function(animatable, addToScene) {
		if (!animatable instanceof THREE.Object3D) {
			console.error("[GraphicController] You can only add instances of THREE.Object3D to the animations: " + animatable);
			return;
		}

		this._animationList.push(animatable);
		if (addToScene) {
			this._animationGroup.add(animatable);
		}
		if (config.debug) console.log("[GraphicController] Added animation: ",  animatable);
	};

	GraphicController.prototype.removeAnimation = function(animatable) {
		var index = this._animationList.indexOf(animatable);
		if (index > -1) { this._animationList.splice(index, 1); }
		this._animationGroup.remove(animatable);
		if (config.debug) console.log("[GraphicController] Removed animation: ", animatable);
	};

	singletonInstance = new GraphicController();
	return singletonInstance;





});