define([
	"THREE",
	"starcrash/graphic/animations/animation_transformation"
], function(
	THREE,
	TransformationAnimation
	) {

	var WalkAnimation = function(pObject3D, pPositionOffset, pDurationMillis, pCallback) {
		TransformationAnimation.call(this, pObject3D, pPositionOffset, null, pDurationMillis, pCallback);

	};

	/**
	 * Inherits from TransformationAnimation
	 * @type {*}
	 */
	WalkAnimation.prototype = Object.create( TransformationAnimation.prototype );

	/**
	 * An animation step. Interpolates the position and/or rotation depending on the animation progress.
	 * @param animationProgress {Number} Progress from 0.0 to 1.0
	 */
	WalkAnimation.prototype.applyAnimationProgress = function(animationProgress) {
		TransformationAnimation.prototype.applyAnimationProgress.call(this, animationProgress);
		this._object3D.position.y =  Math.sin(animationProgress * Math.PI) * 5;
	};

	return WalkAnimation;

});