define(["THREE", "config"], function(THREE, config) {

	/**
	 * Abstract base class for animations that inherits from THREE.Object3D.

	 * Inherit from this class,
	 * call 'setDurationMillis' to set the duration,
	 * and implement the function 'applyAnimationProgress' in your child class.
	 * Call 'animate' on this every render loop for animation.
	 * @constructor
	 * @author LucaHofmann@gmx.net
	 */
	var Animation = function() {
		THREE.Object3D.call(this);
		this._startTime = new Date().getTime();
		this._durrationMillis = null;
		this._callback = null;
	};

	/**
	 * Inherits from THREE.Object3D
	 * @type {*}
	 */
	Animation.prototype = Object.create( THREE.Object3D.prototype );

	/**
	 * Set the duration of this animation.
	 * @param pDurationMillis The duration in milliseconds.
	 */
	Animation.prototype.setDurationMillis = function(pDurationMillis) {
		this._durrationMillis = pDurationMillis;
	};

	/**
	 * Sets the callback that gets called after the animation.
	 * @param pDurationMillis A function that gets called after the animation.
	 */
	Animation.prototype.onAnimationEnds = function(pCallback) {
		this._callback = pCallback;
	};

	/**
	 * Call this for every render loop. It will call the function 'applyAnimationProgress' with a parameter 0.0 - 1.0.
	 * You have to implement this function to your child class.
	 */
	Animation.prototype.animate = function() {
		if (this._durrationMillis == null) console.log("No animation duration has been set. Call 'setDurationMillis'.", this);
		if (!this.applyAnimationProgress) console.log("The function 'applyAnimationProgress' is not implemented in your child class.", this);

		var currentAnimationTime = new Date().getTime() - this._startTime;
		var animationProgress = (currentAnimationTime / this._durrationMillis);
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

	return Animation;


});