define([
	"THREE",
	"starcrash/event_bus",
	"starcrash/static/config",
	"starcrash/graphic/animations/animation_transformation",
	"starcrash/graphic/animations/animation_walk"

], function(
	THREE,
	bus,
	config,
	TransformationAnimation,
    WalkAnimation
	) {


	/**
	 * Creature is the base class for life-forms like the player or enemies.
	 * Inherit from this class ant override the _createModel function to use a custom model.
	 * @constructor
	 */
	var Creature = function(gridX, gridZ) {
		THREE.Object3D.call(this);

		this._model = this._createModel();
		this._modelInitialPosition = this._model.position.clone();
		this.add(this._model);
		this.setGridPosition(gridX, gridZ);
		this._currentMoveAnimation = null;
		this._currentTurnAtAnimation = null; // do not mix that up with a turning-animation.. it is not.
		this.receiveShadow = true;
	};

	/**
	 * Inherits from THREE.Object3D
	 * @type {*}
	 */
	Creature.prototype = Object.create( THREE.Object3D.prototype );

	/**
	 * Creates the model for the creature. Override this function to create custom models for your child class.
	 * @returns {THREE.Mesh} The model.
	 * @private
	 */
	Creature.prototype._createModel = function() {
		return new THREE.Mesh(new THREE.CubeGeometry(30, 160, 30, 1, 1, 1), new THREE.MeshBasicMaterial());
	};

	/**
	 * Returns true if the player is currently walking.
	 * @returns {*} True if the player is currently walking.
	 */
	Creature.prototype.isMoving = function() {
		return ((this._currentMoveAnimation != null));
	};


	/**
	 * Sets the players grid position.
	 * @param gridX The grid x coordinate.
	 * @param gridZ The grid z coordinate.
	 */
	Creature.prototype.setGridPosition = function(gridX, gridZ) {
		if (this._gridPosition == null) {
			this._gridPosition = new THREE.Vector3(0, 0, 0);
		}
		this._gridPosition.x = gridX;
		this._gridPosition.z = gridZ;
		this.position.x = this._gridPosition.x * config.gridCellSize + (config.gridCellSize / 2);
		this.position.z = this._gridPosition.z * config.gridCellSize - (config.gridCellSize / 2);
	};


	/**
	 * Gets the players position in the grid.
	 */
	Creature.prototype.getGridPosition = function() {
		return this._gridPosition;
	};


	/**
	 * Starts a new moving animation.
	 * @param positionOffset THREE.Vector3 The target translation offset to move. (or null)
	 * @param rotationOffset THREE.Vector3 the target rotation offset to turn. (or null)
	 * @param callback The callback that should be triggered after animation.
	 */
	Creature.prototype._startMoveAnimation = function(positionOffset, rotationOffset, callback) {
		var self = this;
		if (!this.isMoving()) {
			if (rotationOffset == null) {
				// walk
				this._currentMoveAnimation = new WalkAnimation(this, positionOffset, config.movementDurationMillis, function() {
					self._currentMoveAnimation = null;
					if (callback != null) callback();
				});
			} else {
				// turn
				this._currentMoveAnimation = new TransformationAnimation(this, positionOffset, rotationOffset, config.movementDurationMillis, function() {
					self._currentMoveAnimation = null;
					if (callback != null) callback();
				});
			}
		}
	};


	/**
	 * Gets a normal vector of the direction the player is facing.
	 * @returns THREE.Vector3 A normal vector of the direction the player is facing.
	 */
	Creature.prototype.getFacingDirection = function(showErrorMessage) {

		// calculate rotation to fit to the values 0, 1.57, 3.14 or 4.71
		var modulatedRotation = this.rotation.y % (Math.PI * 2);
		modulatedRotation = Math.round((modulatedRotation) * 100) / 100;
		if (modulatedRotation < 0) {
			modulatedRotation =  Math.round((6.28 + modulatedRotation) * 100) / 100;
		}

		if (modulatedRotation == 0) {
			return new THREE.Vector3(0, 0, -1);
		} else if (modulatedRotation == 1.57) { // Math.PI / 2
			return new THREE.Vector3(-1, 0, 0);
		} else if (modulatedRotation == 3.14) { // Math.PI
			return new THREE.Vector3(0, 0, 1);
		} else if (modulatedRotation == 4.71) { // Math.PI + (Math.PI / 2)
			return new THREE.Vector3(1, 0, 0);
		} else {

			if (showErrorMessage) console.error("Creature got undefined facing direction: " + modulatedRotation);
			return null;
		}
	};



	/**
	 * Starts a turning left animation.
	 * Posts the EVENT_PLAYER_TURNED
	 */
	Creature.prototype.turnLeft = function() {
		var self = this;
		var rotationOffset = new THREE.Vector3(0, Math.PI / 2, 0);
		this._startMoveAnimation(null, rotationOffset, function() {
			self._model.position = self._modelInitialPosition;
			bus.post(bus.EVENT_PLAYER_TURNED, this);
		});
	};

	/**
	 * Starts a turning right animation.
	 * Posts the EVENT_PLAYER_TURNED
	 */
	Creature.prototype.turnRight = function() {
		var self = this;
		var rotationOffset = new THREE.Vector3(0, - Math.PI / 2, 0);
		this._startMoveAnimation(null, rotationOffset, function() {
			self._model.position = self._modelInitialPosition;
			bus.post(bus.EVENT_PLAYER_TURNED, this);
		});
	};


	/**
	 * Starts a forward moving animation.
	 * Sets the grid position after animation.
	 * Posts the EVENT_PLAYER_MOVED
	 */
	Creature.prototype.moveForwards = function() {
		var facingDirection = this.getFacingDirection(),
			movementOffset,
			self = this;

		movementOffset = facingDirection.clone();
		movementOffset.setLength(config.gridCellSize);

		this._startMoveAnimation(movementOffset, null, function() {
			self._gridPosition.add(facingDirection);
			self._model.position = self._modelInitialPosition;
			bus.post(bus.EVENT_PLAYER_MOVED, self);
		});
	};

	/**
	 * Starts a backward moving animation.
	 * Sets the grid position after animation.
	 * Posts the EVENT_PLAYER_MOVED
	 */
	Creature.prototype.moveBackwards = function() {
		var facingDirection = this.getFacingDirection(),
			movementOffset,
			self = this;

		// invert facing direction to move backwards
		facingDirection.negate();
		movementOffset = facingDirection.clone();
		movementOffset.setLength(config.gridCellSize);

		this._startMoveAnimation(movementOffset, null, function() {
			self._gridPosition.add(facingDirection);
			self._model.position = self._modelInitialPosition;
			bus.post(bus.EVENT_PLAYER_MOVED, self);
		});
	};

	/**
	 * Call every render loop to animate the player.
	 */
	Creature.prototype.animate = function() {
		if (this.isMoving()) {
			this._animationCounter = (this._animationCounter + 1) % (Math.PI * 2);
			this._currentMoveAnimation.animate();

		}

		if (this._currentTurnAtAnimation != null) {
			this._currentTurnAtAnimation.animate();
		}
	};

	return Creature;

});
