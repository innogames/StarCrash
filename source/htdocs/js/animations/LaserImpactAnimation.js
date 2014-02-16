define(["THREE", "animations/Animation"], function(THREE,  Animation) {

	var LaserImpactAnimation = function(pLaserBeamImpactPosition, pShootDirection, graphics, pCallback) {
		Animation.call(this);
		this.setDurationMillis(2000);
		this.onAnimationEnds(pCallback);

		this._impactMaterial = new THREE.MeshBasicMaterial({ transparent: true, color : 0xFF0000});
		this._torusMaterial = new THREE.MeshBasicMaterial({ transparent: true, color : 0xFFAA22, opacity : 0.3});

		this._glowImpact = new THREE.Mesh(new THREE.SphereGeometry(1), this._impactMaterial);
		this._glowImpact.position = pLaserBeamImpactPosition.clone();

		var rotation = 0;

		if (pShootDirection.x > 0) {
			rotation = Math.PI / 2;
		}
		if (pShootDirection.x < 0) {
			rotation = -Math.PI / 2;
		}
		if (pShootDirection.z > 0) {
			rotation = +Math.PI;
		}

		this._torusObjects = [];
		var torusGeometry = new THREE.TorusGeometry(0.1, .005, 2, 40);
		for (var i = 0; i < 3; i++) {
			var torusMesh = new THREE.Mesh(torusGeometry, this._torusMaterial);
			torusMesh.position.set(
				pLaserBeamImpactPosition.x,
				pLaserBeamImpactPosition.y,
				pLaserBeamImpactPosition.z
			);
			torusMesh.rotation.y = rotation;
			this._torusObjects.push(torusMesh);
			this.add(torusMesh);
		}


		this.add(this._particleSystem);

		this.add(this._glowImpact);

	};

	/**
	 * Inherits from THREE.Object3D
	 * @type {*}
	 */
	LaserImpactAnimation.prototype = Object.create( Animation.prototype );


	/**
	 * Applies the animation progress to the graphic elements.
	 * @param animationProgress The progress starting by 0 ending at 1.
	 */
	LaserImpactAnimation.prototype.applyAnimationProgress = function(animationProgress) {
		var invertedProgress = 1 - animationProgress;
		this._impactMaterial.opacity = invertedProgress;

		this._glowImpact.scale.set(invertedProgress + 0.5, invertedProgress  + 0.5, invertedProgress + 0.5);

		var torusProgress = animationProgress * 15;
		var torusScaleFactor = 50;
		for (var i = 0; i < this._torusObjects.length; i++) {
			if (torusProgress < 1) {
				var scale = 1 + torusProgress * torusScaleFactor * i;
				this._torusObjects[i].scale.set(scale, scale, scale);
			} else {
				this._torusMaterial.opacity = 0;
			}
		}

	};



	return LaserImpactAnimation;


});