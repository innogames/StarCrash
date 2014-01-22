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

		init: function() {
			var container = document.getElementById('container');

			this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 4096);
			this.camera.name = "TheCamera";
			this.camera.position.set(this.cameraOffset.x, this.cameraOffset.y, this.cameraOffset.z);
			this.camera.rotation.y = this.cameraRot;


			this.fpsDiv =  document.getElementById('fps');
			this.scene =  new THREE.Scene();
			this.clock = new THREE.Clock();

			// add cam
			//this.scene.add(this.camera);

			// init and append renderer
			this.renderer = new THREE.WebGLRenderer({antialias:true});
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			container.appendChild(this.renderer.domElement);

			// resize-listener
			window.addEventListener('resize', function() {
				this.camera.aspect = window.innerWidth / window.innerHeight;
				this.camera.updateProjectionMatrix();
				this.renderer.setSize(window.innerWidth, window.innerHeight);
			}, false);

			// add scene to window in debug-mode
			if (config.debug) {
				window.scene = this.scene;
			}
		}
	};
});