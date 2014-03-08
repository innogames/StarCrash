define([
	"THREE",
	"starcrash/graphic/animations/animation"
], function(
	THREE,
	Animation
	) {

	var EnemyLaserImpactAnimation = function(pLaserBeamImpactPosition, pShootDirection, graphics, pCallback) {
		Animation.call(this);

		this.setDurationMillis(200);
		this.onAnimationEnds(pCallback);

		var rotation = 0;

		if (pShootDirection.x > 0) {
			rotation = Math.PI / 2;
			this.position.x += 0.3;
		}
		if (pShootDirection.x < 0) {
			rotation = -Math.PI / 2;
			this.position.x -= 0.3;
		}
		if (pShootDirection.z > 0) {
			rotation = +Math.PI;
			this.position.z += 0.3;
		}
		if (pShootDirection.z < 0) {
			rotation = +Math.PI;
			this.position.z -= 0.3;
		}



		this.position = pLaserBeamImpactPosition;
		this._particleSystem = this._createParticles();
		this.add(this._particleSystem);

		this.rotation.y = rotation;
	};

	/**
	 * Inherits from THREE.Object3D
	 * @type {*}
	 */
	EnemyLaserImpactAnimation.prototype = Object.create( Animation.prototype );


	EnemyLaserImpactAnimation.prototype.applyAnimationProgress = function(animationProgress) {
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
	EnemyLaserImpactAnimation.prototype._createParticles = function() {
		var particleCount = 100,
			particles = new THREE.Geometry(),
			pMaterial = new THREE.ParticleBasicMaterial({
				color: 0xFF0000,
				size: 1.6
			});
		// now create the individual particles
		for (var p = 0; p < particleCount; p++) {
			var pX = 0,
				pY = 0,
				pZ = 0,
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

	return EnemyLaserImpactAnimation;
});