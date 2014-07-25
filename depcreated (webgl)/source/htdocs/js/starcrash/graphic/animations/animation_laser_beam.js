define([
		"THREE",
		"starcrash/static/config",
		"starcrash/graphic/animations/animation"
	], function(
		THREE,
		config,
		Animation
	) {

	/**
	 * Creates a new Laser animation instance. Inherits from Animation.
	 * Usage: call 'animate' for every animation step.
	 * Inherits from Animation.
	 *
	 * @param pPlayerPosition {THREE.Vector3} The player position.
	 * @param pPlayerDirection {THREE.Vector3} The player direction.
	 * @param graphics The graphic controller.
 	 * @param pCallback {function} The function to on animation end.
	 * @constructor
	 * @author LucaHofmann@gmx.net
	 */
	var LaserBeamAnimation = function(pPlayerPosition, pPlayerDirection, pLaserBeamLength, pLeaserBeamColor, graphics, pCallback) {
		Animation.call(this);
		this.setDurationMillis(200);

		this.onAnimationEnds( function() {
			// use the light from graphics because add lights dynamically is not possible.
			graphics.laserBeamLight.intensity = 0;
			if (pCallback) pCallback();
		});

		this._beamLength = pLaserBeamLength;

		var cylinderGeometry = new THREE.CylinderGeometry(0.2, 0.2, this._beamLength, 20, 2, false);
		cylinderGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI / 2 ) );
		cylinderGeometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, 0, -(this._beamLength / 2)));
		cylinderGeometry.verticesNeedUpdate = true;

		var sphereGeometry = new THREE.SphereGeometry(0.8, 10, 10);

		this._laserMaterial = new THREE.MeshBasicMaterial({ transparent: true, color: pLeaserBeamColor	});
		this._torusMaterial = new THREE.MeshBasicMaterial({ transparent: true, color: pLeaserBeamColor	});

		this._laserBeam = new THREE.Mesh(cylinderGeometry, this._laserMaterial);

		this._laserShock = new THREE.Mesh(sphereGeometry, this._laserMaterial);


		this.position.set(
			pPlayerPosition.x,
			pPlayerPosition.y,
			pPlayerPosition.z
		);

		this._torusObjects = [];
		var torusGeometry = new THREE.TorusGeometry(0.2, 0.05, 2, 20);
		for (var i = 0; i < 100; i++) {
			var torusMesh = new THREE.Mesh(torusGeometry, this._torusMaterial);
			torusMesh.position.set(0, 0, (i * -1));
			torusMesh.fadeToX = (Math.random() - 0.5) * 0.1;
			torusMesh.fadeToY = (Math.random() - 0.5) * 0.1;

			this._torusObjects.push(torusMesh);

			this.add(torusMesh);
		}

		this._lightTarget = new THREE.Object3D();

		this._particleSystem = this.createParticles(new THREE.Vector3(0, 0, 0));

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
	LaserBeamAnimation.prototype = Object.create( Animation.prototype );


	/**
	 * Applies the animation progress to the graphic elements.
	 * @param animationProgress The progress starting by 0 ending at 1.
	 */
	LaserBeamAnimation.prototype.applyAnimationProgress = function(animationProgress) {
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
		this._lightTarget.position.z = animationProgress * -1000;
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
	 * Creates the particle system.
	 * @param pPosition {THREE.Vector3} The position for the system.
	 * @returns {THREE.ParticleSystem} The particle system.
	 */
	LaserBeamAnimation.prototype.createParticles = function(pPosition) {
		var particleCount = 100,
			particles = new THREE.Geometry(),
			pMaterial = new THREE.ParticleBasicMaterial({
				color: 0xFFFFFF,
				size: 0.08
			});
		// now create the individual particles
		for (var p = 0; p < particleCount; p++) {
			var pX = pPosition.x,
				pY = pPosition.y,
				pZ = pPosition.z,
				particle = 	new THREE.Vector3(pX, pY, pZ);

			// place velocity as a circle.
			particle.velocity = new THREE.Vector3(
				(Math.cos(p / particleCount * Math.PI * 2)) + (Math.random() - 0.5) * 0.2,
				(Math.sin(p / particleCount * Math.PI * 2)) + (Math.random() - 0.5) * 0.2,
				0
			);
			particles.vertices.push(particle);
		}
		// create the particle system
		var particleSystem = new THREE.ParticleSystem(
			particles,
			pMaterial);
		return particleSystem;

	};


	return LaserBeamAnimation;

});