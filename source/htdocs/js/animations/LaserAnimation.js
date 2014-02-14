define(["THREE", "config"], function(THREE, config) {


	var LaserAnimation = function(pStartPosition, pDirection, pCallback, graphics) {
		THREE.Object3D.call(this);
		this._direction = pDirection;
		this._callback = pCallback;

		this._beamLength = 100;

		this._startTime = new Date().getTime();
		this._durration = 300;

		var cylinderGeometry = new THREE.CylinderGeometry(0.2, 0.2, this._beamLength, 20, 2, false);
		cylinderGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI / 2 ) );
		cylinderGeometry.applyMatrix( new THREE.Matrix4().makeTranslation(
			config.player.graphics.weaponOffset.x,
			config.player.graphics.weaponOffset.y,
				-(this._beamLength / 2) + config.player.graphics.weaponOffset.z)
			);
		cylinderGeometry.verticesNeedUpdate = true;

		this._laserBeam = new THREE.Mesh(cylinderGeometry, new THREE.MeshBasicMaterial({color: 0xFFAA22	}));

		this.position.set(
			pStartPosition.x,
			pStartPosition.y,
			pStartPosition.z
		);

		this.rotation.y = pDirection.y;

		this.light = graphics.laserBeamLight;
		this.light.intensity = 100;


		this._callback = function() {
			this.light.intensity = 0;
		};


		this.add(this._laserBeam);

		//this.rotateOnAxis(new THREE.Vector3(0, 1 ,0), pDirection.y);
		//this.rotateOnAxis(new THREE.Vector3(0, 0 ,1), Math.PI / 2);

	};

	/**
	 * Inherits from THREE.Object3D
	 * @type {*}
	 */
	LaserAnimation.prototype = Object.create( THREE.Object3D.prototype );


	/**
	 * Call this for every render loop.
	 */
	LaserAnimation.prototype.animate = function() {
		console.log("animate");

		var currentAnimationTime = new Date().getTime() - this._startTime;
		var animationProgress = (currentAnimationTime / this._durration);
		if (animationProgress < 1) {
			this.applyAnimationProgress(animationProgress);
		} else {


			this.applyAnimationProgress(1);

			if (this._callback) {
				this._callback();
			}

			return false;
		}
	};

	LaserAnimation.prototype.applyAnimationProgress = function(animationProgress) {
		this.position.z = animationProgress * -1000;

	};

	LaserAnimation.prototype.clone = function ( object ) {
		if ( object === undefined ) object = new LaserAnimation(this._startPosition, this._direction, this._callback);
		THREE.Object3D.prototype.clone.call( this, object );
		return object;
	};

	return LaserAnimation;

});