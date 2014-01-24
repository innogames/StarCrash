define(["THREE", "config"], function(THREE, config) {
	return {
		camera: null,
		fpsDiv: null,
		scene: null,
		clock: null,
		renderer: null,
		tick: 0,
		cameraOffset: {
			x: 0,
			y: 2,
			z: 0
		},
		cameraRot: Math.PI,
		viewPortContainer: null,
		renderSize : { "width" : 400, "height" : 300},

		init: function() {
			this.viewPortContainer = document.getElementById('container');


			//var renderSize = { "width" : window.innerWidth, "height" : window.innerHeight};

			this.camera = new THREE.PerspectiveCamera(60, this.renderSize.width / this.renderSize.height, 1, 4096);
			this.camera.name = "The Camera";
			this.camera.position.set(this.cameraOffset.x, this.cameraOffset.y, this.cameraOffset.z);
			this.camera.rotation.y = this.cameraRot;


			this.fpsDiv =  document.getElementById('fps');
			this.scene =  new THREE.Scene();
			this.clock = new THREE.Clock();

			// add cam
			//this.scene.add(this.camera);

			// init and append renderer
			this.renderer = new THREE.WebGLRenderer({antialias:false});
			this.renderer.setSize(this.renderSize.width, this.renderSize.height);


			this.viewPortContainer.appendChild(this.renderer.domElement);

			// resize-listener
			window.addEventListener('resize', function() {
				this.camera.aspect = this.renderSize.width / this.renderSize.height;
				this.camera.updateProjectionMatrix();
				this.renderer.setSize(this.renderSize.width, this.renderSize.height);
			}, false);

			// add scene to window in debug-mode
			if (config.debug) {
				window.scene = this.scene;
			}
		}
	};
});