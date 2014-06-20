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
	 */
	WalkAnimation.prototype = Object.create(TransformationAnimation.prototype);

	/**
	 * An animation step. Gets called every render frame.
	 * @param pAnimationProgress {Number} Progress from 0.0 to 1.0
	 */
	WalkAnimation.prototype.applyAnimationProgress = function(pAnimationProgress) {
		TransformationAnimation.prototype.applyAnimationProgress.call(this, pAnimationProgress);
		this._object3D.position.y =  Math.sin(pAnimationProgress * Math.PI) * 5;
	};

	return WalkAnimation;

});



