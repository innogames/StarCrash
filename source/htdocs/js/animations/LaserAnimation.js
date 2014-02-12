define(["THREE"], function(THREE) {


	var LaserAnimation = function(pStartPosition, pDirection, pCallback) {
		THREE.Object3D.call(this);
		this._startPosition = pStartPosition;
		this._direction = pDirection;
		this._callback = pCallback;

		this._startTime = new Date().getTime();
		this._durration = 1000;

		this._laserBeam = new THREE.Mesh(new THREE.CylinderGeometry(100, 100, 400, 50, 50, false), new THREE.MeshNormalMaterial());

		this.add(this._laserBeam);

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

	};

	LaserAnimation.prototype.clone = function ( object ) {
		if ( object === undefined ) object = new LaserAnimation(this._startPosition, this._direction, this._callback);
		THREE.Object3D.prototype.clone.call( this, object );
		return object;
	};

	return LaserAnimation;

});