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
	var Creature = function(gridX, gridZ, pGameId) {
		THREE.Object3D.call(this);
		this._gameId = pGameId;

		this._model = this._createModel();
		this._modelInitialPosition = this._model.position.clone();
		this.add(this._model);
		this.setGridPosition(gridX, gridZ);
		this._currentMoveAnimation = null;

		this._equipedWeapon = null;

		this.receiveShadow = true;

		this._attributes = {
			health : 100,
			maxHealth : 100,


			movementSpeedMillis : 300,
			maxMovementSpeedMillis : 300,


			turnSpeedMillis : 150,
			maxTurnSpeedMillis : 150,

			viewRangeCells : 10,
			maxViewRangeCells : 10
		};

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


	Creature.prototype.setEquipedWeapon = function(weapon) {
		this._equipedWeapon = weapon;
	};

	Creature.prototype.getEquipedWeapon = function() {
		return this._equipedWeapon;
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
				this._currentMoveAnimation = new WalkAnimation(this, positionOffset, self._attributes.movementSpeedMillis, function() {
					self._currentMoveAnimation = null;
					if (callback != null) callback();
				});
			} else {
				// turn
				this._currentMoveAnimation = new TransformationAnimation(this, positionOffset, rotationOffset, self._attributes.turnSpeedMillis, function() {
					self._currentMoveAnimation = null;
					if (callback != null) callback();
				});
			}
		}
	};


	/**
	 * Gets a grid offset to move in the assigned direction.
	 * @returns THREE.Vector3 A normal vector of the direction the player is facing.
	 */
	Creature.prototype.getOffsetToMove = function(creatureMovement) {

		var modulatedRotation = this.rotation.y;
		if (creatureMovement == Creature.MOVEMENT.STRAFE_RIGHT) {
			modulatedRotation -= Math.PI / 2;
		} else if (creatureMovement == Creature.MOVEMENT.STRAFE_LEFT) {
			modulatedRotation += Math.PI / 2;
		} else if (creatureMovement == Creature.MOVEMENT.BACKWARDS) {
			modulatedRotation += Math.PI;
		} else if (creatureMovement == Creature.MOVEMENT.FORWARDS){
			modulatedRotation += 0;
		} else {
			console.log("[Creature] Can not calculate 'offset to move' from parameter: " + creatureMovement);
			return null;
		}

		// calculate the current rotation to fit to the values 0, 1.57, 3.14 or 4.71
		modulatedRotation = modulatedRotation % (Math.PI * 2);
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
			console.log("[Creature] Can not calculate 'offset to move' from rotation: " + modulatedRotation);
			return null;
		}
	};



	/**
	 * Starts a turning left animation.
	 * Posts the EVENT_CREATURE_TURNED
	 */
	Creature.prototype.turnLeft = function() {
		var self = this;
		var rotationOffset = new THREE.Vector3(0, Math.PI / 2, 0);
		this._startMoveAnimation(null, rotationOffset, function() {
			self._model.position = self._modelInitialPosition;
			bus.post(bus.EVENT_CREATURE_TURNED, this);
		});
	};

	/**
	 * Starts a turning right animation.
	 * Posts the EVENT_CREATURE_TURNED
	 */
	Creature.prototype.turnRight = function() {
		var self = this;
		var rotationOffset = new THREE.Vector3(0, - Math.PI / 2, 0);
		this._startMoveAnimation(null, rotationOffset, function() {
			self._model.position = self._modelInitialPosition;
			bus.post(bus.EVENT_CREATURE_TURNED, this);
		});
	};


	Creature.prototype.move = function(movementDirection) {
		var facingDirection = this.getOffsetToMove(movementDirection),
			movementOffset,
			self = this;

		// invert facing direction to move backwards
		movementOffset = facingDirection.clone();
		movementOffset.setLength(config.gridCellSize);

		this._startMoveAnimation(movementOffset, null, function() {
			self._gridPosition.add(facingDirection);
			self._model.position = self._modelInitialPosition;
			bus.post(bus.EVENT_CREATURE_MOVED, self, movementDirection);
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
	};

	/**
	 * Gets the id of this creature.
	 * @returns {*}
	 */
	Creature.prototype.getGameId = function() {
		return this._gameId;
	};


	/**
	 * Deals damage to this creature. Returns true and
	 * posts an EVENT_CREATURE_DIED if the health is lower than 0.
	 * @param damage The damage deal to the health.
	 * @returns {boolean} True if the creature died.
	 */
	Creature.prototype.dealDamage = function(demage) {
		this._attributes.health -= demage;
		if (this._attributes.health < 0) {
			bus.post(bus.EVENT_CREATURE_DIED, this);
			return true;
		}
		return false;
	};


	Creature.prototype.getHealth = function() {
		return this._attributes.health;
	};


	/**
	 * Gets the creatures attributes.
	 * @returns {*}
	 */
	Creature.prototype.getAttributes = function() {
		return this._attributes;
	};


	// Static stuff
	Creature.MOVEMENT = {
		FORWARDS : "FORWARDS",
		BACKWARDS : "BACKWARDS",
		STRAFE_LEFT : "STRAFE_LEFT",
		STRAFE_RIGHT : "STRAFE_RIGHT"
	};

	return Creature;

});
