define(["THREE"], function(THREE) {

	/**
	 * An animation that animates the assigned object3d to the assigned position and rotation.
	 * Call the 'animate' function for ever render loop.
	 * Remove references to this animation object in the callback.
	 *
	 * @param pObject3D THREE.Object3D An object3d to animate.
	 * @param pPositionOffset The position to animate to or null. { x : 0, y : 0, z : 0 }
	 * @param pRotationOffset The rotation to animate to or null. { x : 0, y : 0, z : 0 }
	 * @param pDurationMillis The duration for the animation in milli seconds.
	 * @param pCallback Will be called if the animation is over. Delete the animation object.
	 * @constructor Creates a new instance.
	 */
	var TransformationAnimation = function(pObject3D, pPositionOffset, pRotationOffset, pDurationMillis, pCallback) {
		THREE.Object3D.call(this);

		this._object3D = pObject3D;
		this._callback = pCallback;
		this._startTime = new Date().getTime();
		this._durration = pDurationMillis;

		this._startPosition = { "x" : this._object3D.position.x , "y" : this._object3D.position.y, "z" : this._object3D.position.z };
		this._startRotation = { "x" : this._object3D.rotation.x , "y" : this._object3D.rotation.y, "z" : this._object3D.rotation.z };

		if (pPositionOffset != null) {
			this._positionOffset = { "x" : pPositionOffset.x, "y" : pPositionOffset.y, "z" : pPositionOffset.z };
		}
		if (pRotationOffset != null) {
			this._rotationOffset = { "x" : pRotationOffset.x, "y" : pRotationOffset.y, "z" : pRotationOffset.z };
		}
	};

	/**
	 * Inherits from THREE.Object3D
	 * @type {*}
	 */
	TransformationAnimation.prototype = Object.create( THREE.Object3D.prototype );


	/**
	 * Call this for every render loop.
	 */
	TransformationAnimation.prototype.animate = function() {
		var currentAnimationTime = new Date().getTime() - this._startTime;
		var animationProgress = (currentAnimationTime / this._durration);
		if (animationProgress < 1) {
			this.applyAnimationProgress(animationProgress);
		} else {
			this.applyAnimationProgress(1);
			this._callback();
			return false;
		}
	};

	TransformationAnimation.prototype.applyAnimationProgress = function(animationProgress) {
		if (this._positionOffset != null) {
			this._object3D.position.set(
				this._startPosition.x + (this._positionOffset.x * animationProgress),
				this._startPosition.y + (this._positionOffset.y * animationProgress),
				this._startPosition.z + (this._positionOffset.z * animationProgress));
		}
		if (this._rotationOffset != null) {
			this._object3D.rotation.set(
				this._startRotation.x + (this._rotationOffset.x * animationProgress),
				this._startRotation.y + (this._rotationOffset.y * animationProgress),
				this._startRotation.z + (this._rotationOffset.z * animationProgress));
		}
	};

	TransformationAnimation.prototype.clone = function ( object ) {
		if ( object === undefined ) object = new TransformationAnimation(this._object3D, this._positionOffset, this._rotationOffset, this._durration, this._callback);
		THREE.Object3D.prototype.clone.call( this, object );
		return object;
	};


	return TransformationAnimation;

});