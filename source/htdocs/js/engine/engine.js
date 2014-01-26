define(["THREE", "config"], function(THREE, config) {
	return {
		mainCamera: null,
		fpsDiv: null,
		scene: null,
		clock: null,
		renderer: null,
		tick: 0,
		viewPortContainer: null,
		renderSize : { "width" : 800, "height" : 600},
		//renderSize : { "width" : window.innerWidth, "height" : window.innerHeight},
		dpr: window.devicePixelRatio || 1,


	getMainCamera: function() {
		return this.mainCamera;
	},

	getMapCamera: function() {
		return this.mapCamera;
	},

	applyViewportSettings : function(renderer, camera) {
		var left = 		Math.floor(this.renderSize.width  * camera.viewportSettings.left) * this.dpr,
			bottom = 	Math.floor(this.renderSize.height * camera.viewportSettings.bottom) * this.dpr,
			width = 	Math.floor(this.renderSize.width  * camera.viewportSettings.width) * this.dpr,
			height = 	Math.floor(this.renderSize.height * camera.viewportSettings.height) * this.dpr;

		renderer.setViewport(left, bottom, width, height );
		renderer.setScissor( left, bottom, width, height );
		renderer.enableScissorTest(true);
		renderer.setClearColor(camera.viewportSettings.backgroundColor, 0.1);

		camera.aspect = width / height;
	},

	init: function() {
			this.viewPortContainer = document.getElementById('container');

			this.mainCamera = new THREE.PerspectiveCamera(60, this.renderSize.width / this.renderSize.height, 1, 10000);
			this.mainCamera.position.set(0, 2, 0);
			this.mainCamera.up.set(0, 1 ,0);
			this.mainCamera.rotation.set(0, Math.PI, 0);
			this.mainCamera.viewportSettings = {
				left: 0,
				bottom: 0,
				width: 1.0,
				height: 1.0,
				backgroundColor: new THREE.Color( 0x000000 )
			};

			this.mapCamera = new THREE.OrthographicCamera( this.renderSize.width / - 2, this.renderSize.width / 2, this.renderSize.height / 2, this.renderSize.height / - 2, 0, 10000 );
			//this.mapCamera = new THREE.PerspectiveCamera(60, this.renderSize.width / this.renderSize.height, 1, 10000);
			this.mapCamera.position.set(0, 1000, 0);
			this.mapCamera.up.set(0, 1 , 0);
			this.mapCamera.rotation.set(-Math.PI / 2, 0, - Math.PI);


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

			// init and append renderer
			this.renderer = new THREE.WebGLRenderer({antialias:false});
			this.renderer.setSize(this.renderSize.width, this.renderSize.height);

			this.viewPortContainer.appendChild(this.renderer.domElement);

			// resize-listener
			window.addEventListener('resize', function() {
				this.mainCamera.aspect = this.renderSize.width / this.renderSize.height;
				this.mainCamera.updateProjectionMatrix();
				this.renderer.setSize(this.renderSize.width, this.renderSize.height);
			}, false);

			// add scene to window in debug-mode
			if (config.debug) {
				window.scene = this.scene;
				window.engine = this;
			}
		}
	};
});