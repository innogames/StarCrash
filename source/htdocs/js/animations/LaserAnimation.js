define(["THREE", "config"], function(THREE, config) {

	/**
	 * Creates a new Laser animation instance.
	 * Call 'animate' for every animation step.
	 *
	 * @param pPlayerPosition {THREE.Vector3} The player position.
	 * @param pPlayerDirection {THREE.Vector3} The player direction.
	 * @param pCallback {function} The function to on animation end.
	 * @param graphics The graphic controller.
	 * @constructor
	 */
	var LaserAnimation = function(pPlayerPosition, pPlayerDirection, pCallback, graphics) {
		THREE.Object3D.call(this);
		this._direction = pPlayerDirection;
		this._callback = pCallback;

		this._beamLength = 10000;

		this._startTime = new Date().getTime();
		this._durration = 200;

		this._beamStartPosition = new THREE.Vector3(
			config.player.graphics.weaponOffset.x,
			config.player.graphics.weaponOffset.y,
			config.player.graphics.weaponOffset.z
		);

		var cylinderGeometry = new THREE.CylinderGeometry(0.2, 0.2, this._beamLength, 20, 2, false);
		cylinderGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI / 2 ) );
		cylinderGeometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, 0, -(this._beamLength / 2)));
		cylinderGeometry.verticesNeedUpdate = true;

		var sphereGeometry = new THREE.SphereGeometry(0.8, 10, 10);

		this._laserMaterial = new THREE.MeshBasicMaterial({ transparent: true, color: 0xFFAA22	});
		this._torusMaterial = new THREE.MeshBasicMaterial({ transparent: true, color: 0xFFAA22	});

		this._laserBeam = new THREE.Mesh(cylinderGeometry, this._laserMaterial);
		this._laserBeam.position = this._beamStartPosition;
		this._laserShock = new THREE.Mesh(sphereGeometry, this._laserMaterial);
		this._laserShock.position = this._beamStartPosition.clone();

		this.position.set(
			pPlayerPosition.x,
			pPlayerPosition.y,
			pPlayerPosition.z
		);

		this._torusObjects = [];
		var torusGeometry = new THREE.TorusGeometry(0.2, 0.05, 2, 20);
		for (var i = 0; i < 100; i++) {
			var torusMesh = new THREE.Mesh(torusGeometry, this._torusMaterial);
			torusMesh.position.set(
				this._beamStartPosition.x,
				this._beamStartPosition.y,
				this._beamStartPosition.z + (i * -1)
			);
			torusMesh.fadeToX = (Math.random() - 0.5) * 0.1;
			torusMesh.fadeToY = (Math.random() - 0.5) * 0.1;

			this._torusObjects.push(torusMesh);

			this.add(torusMesh);
		}

		this._lightTarget = new THREE.Object3D();

		this._particleSystem = this.createParticles(this._beamStartPosition);

		this._lightTarget.position.set(
			this._beamStartPosition.x,
			this._beamStartPosition.y,
			this._beamStartPosition.z
		);

		this.add(this._laserBeam);
		this.add(this._laserShock);
		this.add(this._lightTarget);
		this.add(this._particleSystem);

		this.rotation.y = pPlayerDirection.y;

		this.light = graphics.laserBeamLight;
		this.light.distance = 100;

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
				this.light.intensity = 0;
				this._callback();
			}
			return false;
		}
	};

	/**
	 * Applies the animation progress to the graphic elements.
	 * @param animationProgress The progress starting by 0 ending at 1.
	 */
	LaserAnimation.prototype.applyAnimationProgress = function(animationProgress) {
		var self = this;
		var invertedProgress = 1 - animationProgress;

		this._laserMaterial.opacity = invertedProgress;
		this._torusMaterial.opacity = invertedProgress * 0.4;

		for (var i = 0; i < this._torusObjects.length; i++) {
			this._torusObjects[i].scale.set(1 + animationProgress * 5 / (i * 0.5), 1 + animationProgress * 5 / (i * 0.5), 1);
			this._torusObjects[i].position.x += this._torusObjects[i].fadeToX;
			this._torusObjects[i].position.y += this._torusObjects[i].fadeToY;
		}

		// getting the absolute position of the beam for the light. (because the light can not be added to this object3)
		this._lightTarget.position.z = this._beamStartPosition.z +  animationProgress * -1000;
		this.updateMatrixWorld();
		var absolutePosition = new THREE.Vector3();
		absolutePosition.getPositionFromMatrix( self._lightTarget.matrixWorld);

		this.light.position = absolutePosition;
		this.light.intensity = invertedProgress * 5;

		this._laserShock.scale.set(invertedProgress, invertedProgress, invertedProgress);


		for (var particleIndex = 0; particleIndex < this._particleSystem.geometry.vertices.length; particleIndex++) {
			var particle = this._particleSystem.geometry.vertices[particleIndex];
			particle.x += particle.velocity.x * 0.4;
			particle.y += particle.velocity.y * 0.4;
			particle.z += particle.velocity.z * 0.4;
		}
		this._particleSystem.geometry.verticesNeedUpdate = true;

	};

	/**
	 * Creates the particle system where every vertex has an random velocity.
	 * @param pPosition The position for the system.
	 * @returns {THREE.ParticleSystem} The particle system.
	 */
	LaserAnimation.prototype.createParticles = function(pPosition) {
		var particleCount = 100,
			particles = new THREE.Geometry(),
			pMaterial = new THREE.ParticleBasicMaterial({
				color: 0xFFFFFF,
				size: 0.08
			});
		// now create the individual particles
		for (var p = 0; p < particleCount; p++) {
			// create a particle with random
			// position values, -250 -> 250

			var pX = pPosition.x,
				pY = pPosition.y,
				pZ = pPosition.z,
				particle = new THREE.Vertex(
					new THREE.Vector3(pX, pY, pZ)
				);

			particle.velocity = new THREE.Vector3(
				(Math.cos(p / particleCount * Math.PI * 2)) + (Math.random() - 0.5) * 0.2,
				(Math.sin(p / particleCount * Math.PI * 2)) + (Math.random() - 0.5) * 0.2,
				0
			);
			// add it to the geometry
			particles.vertices.push(particle);
		}
		// create the particle system
		var particleSystem = new THREE.ParticleSystem(
			particles,
			pMaterial);
		return particleSystem;

	};

	/**
	 * Clone the object.
	 * @param object
	 * @returns {*}
	 */
	LaserAnimation.prototype.clone = function ( object ) {
		if ( object === undefined ) object = new LaserAnimation(this._startPosition, this._direction, this._callback);
		THREE.Object3D.prototype.clone.call( this, object );
		return object;
	};


	return LaserAnimation;

});