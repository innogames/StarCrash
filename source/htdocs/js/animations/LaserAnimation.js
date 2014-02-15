define(["THREE", "config"], function(THREE, config) {


	var LaserAnimation = function(pStartPosition, pDirection, pCallback, graphics) {
		THREE.Object3D.call(this);
		this._direction = pDirection;
		this._callback = pCallback;

		this._beamLength = 100;

		this._startTime = new Date().getTime();
		this._durration = 200;

		this._beamStartPosition = new THREE.Vector3(
			config.player.graphics.weaponOffset.x,
			config.player.graphics.weaponOffset.y,
			config.player.graphics.weaponOffset.z
		);

		var cylinderGeometry = new THREE.CylinderGeometry(0.4, 0.4, this._beamLength, 20, 2, false);
		cylinderGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI / 2 ) );
		cylinderGeometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, 0, -(this._beamLength / 2)));
		cylinderGeometry.verticesNeedUpdate = true;

		var sphereGeometry = new THREE.SphereGeometry(1);

		this._laserBeam = new THREE.Mesh(cylinderGeometry, new THREE.MeshBasicMaterial({color: 0xFFAA22	}));
		this._laserBeam.position = this._beamStartPosition;
		this._laserShock = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({color: 0xFFAA00}));
		this._laserShock.position = this._beamStartPosition.clone();

		this.position.set(
			pStartPosition.x,
			pStartPosition.y,
			pStartPosition.z
		);

		this.add(this._laserBeam);
		this.add(this._laserShock);

		this.rotation.y = pDirection.y;

		this.light = graphics.laserBeamLight;
		this.light.distance = 100;

		// add the start position for the light because it can not be added to this object3d
		this.light.position.set(
			this._beamStartPosition.x + pStartPosition.x,
			this._beamStartPosition.y + pStartPosition.y,
			this._beamStartPosition.z + pStartPosition.x
		);


		this._callback = function() {
			this.light.intensity = 0;
		};

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
		var invertedProgress = 1 - animationProgress;

		this._laserBeam.position.z = this._beamStartPosition.z +  animationProgress * -1000;
		this.light.position.z = this._beamStartPosition.z + animationProgress * -1000;
		this.light.intensity = invertedProgress * 5;

		this._laserShock.scale.set(invertedProgress, invertedProgress, invertedProgress);

	};

	LaserAnimation.prototype.clone = function ( object ) {
		if ( object === undefined ) object = new LaserAnimation(this._startPosition, this._direction, this._callback);
		THREE.Object3D.prototype.clone.call( this, object );
		return object;
	};

	return LaserAnimation;

});