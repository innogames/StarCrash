define(["THREE", "engine/bus", "config", "engine/animation"], function(THREE, bus, config, Animation) {

	/**
	 * Creates a new player by its start position and the scene camera.
	 * @param gridStartX The x grid coordinate to start.
	 * @param gridStartZ The y grid coordinate to start.
	 * @param pCamera The camera of the scene.
	 * @param pPlayerModelGeometry THREE.Geometry of the player model.
	 * @param pPlayerModelMaterial THREE.Material of the player model.
	 *
	 * @constructor Creates a new player.
	 */
	var Player = function(gridStartX, gridStartZ, pCamera, pPlayerModelGeometry, pPlayerModelMaterial) {
		THREE.Object3D.call( this );
		this.name = "The Player";
		this.setGridPosition(gridStartX, gridStartZ);

		// Initialize the player model.
		this.playerModelStandardPosition = { "x" : 0, "y" : -81.5, "z" : -5 };
		this.playerModel = new THREE.Mesh(pPlayerModelGeometry, new THREE.MeshFaceMaterial( pPlayerModelMaterial ));
		this.playerModel.name = "The Player-Model";
		this.playerModel.position.set(this.playerModelStandardPosition.x, this.playerModelStandardPosition.y, this.playerModelStandardPosition.z);
		this.playerModel.rotation.y = 0;

		// Initialize animation
		this.currentMovingAnimation = null;
		this.playerModelAnimationCounter = 0;

		this.add(this.playerModel);
		this.add(pCamera);
		this.add(new THREE.PointLight(0x404040, 2.5, 450));

	};

	Player.prototype = Object.create( THREE.Object3D.prototype );

	/**
	 * Returns true if the player is currently walking.
	 * @returns {*} True if the player is currently walking.
	 */
	Player.prototype.isMoving = function() {
		return ((this.currentMovingAnimation != null));
	};


	Player.prototype.startMoveAnimation = function(positionOffset, rotationOffset, callback) {
		var self = this;
		if (!this.isMoving()) {
			this.currentMovingAnimation = new Animation(this, positionOffset, rotationOffset, config.movementDurationMillis, function() {
				self.currentMovingAnimation = null;
				if (callback != null) callback();
			});
		}
	};


	Player.prototype.turnLeft = function() {
		this.startMoveAnimation(null, { "x": 0, "y" : Math.PI / 2, "z" : 0}, function() {
			bus.post(bus.EVENT_PLAYER_TURNED, this);
		});
	};

	Player.prototype.turnRight = function() {
		this.startMoveAnimation(null, { "x": 0, "y" : -Math.PI / 2, "z" : 0}, function() {
			bus.post(bus.EVENT_PLAYER_TURNED, this);
		});
	};


	/**
	 * Starts a forward moving animation. Sets the grid position after animation.
	 */
	Player.prototype.moveForwards = function() {
		var self = this,
			facingDirection = this.getFacingDirection();
		// calculate movement by facing direction
		var movementOffset = {
			"x" : config.gridCellSize * facingDirection.x,
			"y" : config.gridCellSize * facingDirection.y,
			"z" : config.gridCellSize * facingDirection.z
		};
		this.startMoveAnimation(movementOffset, null, function() {
			self.gridPosition.x += facingDirection.x;
			self.gridPosition.y += facingDirection.y;
			self.gridPosition.z += facingDirection.z;
			self.playerModel.position.set(self.playerModelStandardPosition.x, self.playerModelStandardPosition.y, self.playerModelStandardPosition.z);
			bus.post(bus.EVENT_PLAYER_MOVED, self);
		});
	};

	/**
	 * Starts a backward moving animation. Sets the grid position after animation.
	 */
	Player.prototype.moveBackwards = function() {
		var self = this,
			facingDirection = this.getFacingDirection();

		// invert facing direction to move backwards
		facingDirection.x = facingDirection.x * -1;
		facingDirection.y = facingDirection.y * -1;
		facingDirection.z = facingDirection.z * -1;

		// calculate movement by facing direction
		var movementOffset = {
			"x" : config.gridCellSize * facingDirection.x,
			"y" : config.gridCellSize * facingDirection.y,
			"z" : config.gridCellSize * facingDirection.z
		};
		this.startMoveAnimation(movementOffset, null, function() {
			self.gridPosition.x += facingDirection.x;
			self.gridPosition.y += facingDirection.y;
			self.gridPosition.z += facingDirection.z;
			self.playerModel.position.set(self.playerModelStandardPosition.x, self.playerModelStandardPosition.y, self.playerModelStandardPosition.z);
			bus.post(bus.EVENT_PLAYER_MOVED, self);
		});
	};



	/**
	 * Call every render loop to animate the player.
	 */
	Player.prototype.animate = function() {
		if (this.isMoving()) {
			this.playerModelAnimationCounter = (this.playerModelAnimationCounter + 1) % (Math.PI * 2);
			this.currentMovingAnimation.animate();
			this.playerModel.position.y += Math.sin(this.playerModelAnimationCounter / 2) * 0.1;
		}
	};

	/**
	 * Gets a normal vector of the direction the player is facing.
	 * @returns { x: 1, y: 0, t: 0} A normal vector of the direction the player is facing.
	 */
	Player.prototype.getFacingDirection = function() {

		// calculate rotation to fit to the values 0, 1.57, 3.14 or 4.71
		var modulatedRotation = this.rotation.y % (Math.PI * 2);
		modulatedRotation = Math.round((modulatedRotation) * 100) / 100;
		if (modulatedRotation < 0) {
			console.log(modulatedRotation);
			modulatedRotation =  Math.round((6.28 + modulatedRotation) * 100) / 100;
		}

		if (modulatedRotation == 0) {
			// positive z
			return { "x": 0, "y" : 0, "z" : 1};
		} else if (modulatedRotation == 1.57) { // Math.PI / 2
			// positive x
			return { "x": 1, "y" : 0, "z" : 0};
		} else if (modulatedRotation == 3.14) { // Math.PI
			// negative z
			return { "x": 0, "y" : 0, "z" : -1};
		} else if (modulatedRotation == 4.71) { // Math.PI + (Math.PI / 2)
			// negative x
			return { "x": -1, "y" : 0, "z" : 0};
		} else {
			console.error("Player got undefined facing direction: " + modulatedRotation);
			return null;
		}
	};

	/**
	 * Sets the players grid position.
	 * @param gridX The grid x coordinate.
	 * @param gridZ The grid z coordinate.
	 */
	Player.prototype.setGridPosition = function(gridX, gridZ) {
		this.gridPosition = { "x": gridX, "z": gridZ };
		this.position.x = this.gridPosition.x * config.gridCellSize;
		this.position.z = this.gridPosition.z * config.gridCellSize;
	};

	/**
	 * Gets the players position in the grid.
	 */
	Player.prototype.getGridPosition = function() {
		return this.gridPosition;
	};

	return Player;

});