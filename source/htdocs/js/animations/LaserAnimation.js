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

		var sphereGeometry = new THREE.SphereGeometry(1, 10, 10);

		this._laserMaterial = new THREE.MeshBasicMaterial({ transparent: true, color: 0xFFAA22	});
		this._torusMaterial = new THREE.MeshBasicMaterial({ transparent: true, color: 0xFFAA22	});

		this._laserBeam = new THREE.Mesh(cylinderGeometry, this._laserMaterial);
		this._laserBeam.position = this._beamStartPosition;
		this._laserShock = new THREE.Mesh(sphereGeometry, this._laserMaterial);
		this._laserShock.position = this._beamStartPosition.clone();

		this.position.set(
			pStartPosition.x,
			pStartPosition.y,
			pStartPosition.z
		);

		this._torusObjects = [];
		var torusGeometry = new THREE.TorusGeometry(0.4, 0.05, 2, 20);
		for (var i = 0; i < 20; i++) {
			var torusMesh = new THREE.Mesh(torusGeometry, this._torusMaterial);
			torusMesh.position.set(
				this._beamStartPosition.x,
				this._beamStartPosition.y,
				this._beamStartPosition.z + (i * -10)
			);
			this._torusObjects.push(torusMesh);
			this.add(torusMesh);
		}

		this.add(this._laserBeam);
		this.add(this._laserShock);


		this.rotation.y = pDirection.y;

		this.light = graphics.laserBeamLight;
		this.light.distance = 100;

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
		var self = this;
		var invertedProgress = 1 - animationProgress;

		this._laserBeam.position.z = this._beamStartPosition.z +  animationProgress * -1000;

		this._laserMaterial.opacity = invertedProgress;
		this._torusMaterial.opacity = invertedProgress * 0.1;

		for (var i = 0; i < this._torusObjects.length; i++) {
			this._torusObjects[i].scale.set(1 + animationProgress * 3 / (i * 0.5), 1 + animationProgress * 3 / (i * 0.5), 1);
		}




		// getting the absolute position of the beam for the light. (because the light can not be added to this object3)
		this.updateMatrixWorld();
		var absolutePosition = new THREE.Vector3();
		absolutePosition.getPositionFromMatrix( self._laserBeam.matrixWorld);

		this.light.position = absolutePosition;
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