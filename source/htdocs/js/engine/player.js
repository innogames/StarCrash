define(["THREE", "engine/bus", "config", "animations/TransformationAnimation"], function(THREE, bus, config, TransformationAnimation) {

	/**
	 * Creates a new player by its start position and the scene mainCamera. Inherits from THREE.Object3D
	 * @param gridStartX The x grid coordinate to start.
	 * @param gridStartZ The y grid coordinate to start.
	 * @param pCamera The mainCamera of the scene.
	 * @param pPlayerModelGeometry THREE.Geometry of the player model.
	 * @param pPlayerModelMaterial THREE.Material of the player model.
	 *
	 * @constructor Creates a new player.
	 */
	var Player = function(gridStartX, gridStartZ, pCamera, pPlayerModelGeometry, pPlayerModelMaterial) {
		THREE.Object3D.call( this );

		var headPositionY = 50;

		this.name = "The Player";
		this.gridPosition = new THREE.Vector3(0, 0, 0);
		this._camera = pCamera;
		this._camera.position.y = headPositionY;
		this.receiveShadow = true;
		this.setGridPosition(gridStartX, gridStartZ);

		// Initialize the player model.
		this.playerModelStandardOffset = new THREE.Vector3(0, -81.5 + headPositionY, -5);

		pPlayerModelGeometry.computeVertexNormals();
		pPlayerModelGeometry.computeFaceNormals();

		this.playerModel = new THREE.Mesh(pPlayerModelGeometry, new THREE.MeshFaceMaterial( pPlayerModelMaterial ));

		this.playerModel.receiveShadow = true;
		this.playerModel.name = "The Player-Model";
		this.playerModel.position = this.playerModelStandardOffset.clone();
		this.playerModel.rotation.y = - Math.PI;

		// Initialize animation
		this.currentMovingAnimation = null;
		this.currentLookAtAnimation = null; // do not mix that up with a turning-animation.. it is not.
		this.playerModelAnimationCounter = 0;

		this.add(this.playerModel);
		this.add(this._camera);

		var spotLight = new THREE.SpotLight(0xFFFFFF, 2);
		spotLight.position.set(0, headPositionY + 20, -60);
		spotLight.castShadow = true;
		spotLight.receiveShadow = true;
		spotLight.exponent = 10;
		spotLight.angle = 1;
		var target = new THREE.Object3D();
		target.position.y = headPositionY - 10;
		target.position.z = -100;
		this.add(target);
		spotLight.target = target;

		//window.spotL = spotLight;
		//window.targ = target;

		var pointLight = new THREE.PointLight(0xFFFFFF, 0.5);
		pointLight.position.y = headPositionY;
		window.pl = pointLight;

		this.add(spotLight);
		this.add(pointLight);

		// (debug) add a cylinder to find the player easy
		//this.add(new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 10, 10, 10, false),new THREE.MeshBasicMaterial({	color: 0xCC0000	})));

	};

	/**
	 * Inherits from THREE.Object3D
	 * @type {*}
	 */
	Player.prototype = Object.create( THREE.Object3D.prototype );

	/**
	 * Returns true if the player is currently walking.
	 * @returns {*} True if the player is currently walking.
	 */
	Player.prototype.isMoving = function() {
		return ((this.currentMovingAnimation != null));
	};

	/**
	 * Starts a new moving animation.
	 * @param positionOffset THREE.Vector3 The target translation offset to move. (or null)
	 * @param rotationOffset THREE.Vector3 the target rotation offset to turn. (or null)
	 * @param callback The callback that should be triggered after animation.
	 */
	Player.prototype.startMoveAnimation = function(positionOffset, rotationOffset, callback) {
		var self = this;
		if (!this.isMoving()) {
			this.currentMovingAnimation = new TransformationAnimation(this, positionOffset, rotationOffset, config.movementDurationMillis, function() {
				self.currentMovingAnimation = null;
				if (callback != null) callback();
			});
		}
	};

	/**
	 * Starts a turning left animation.
	 * Posts the EVENT_PLAYER_TURNED
	 */
	Player.prototype.turnLeft = function() {
		var self = this;
		var rotationOffset = new THREE.Vector3(0, Math.PI / 2, 0);
		this.startMoveAnimation(null, rotationOffset, function() {
			self.justifyPlayerModel();
			bus.post(bus.EVENT_PLAYER_TURNED, this);
		});
	};

	/**
	 * Starts a turning right animation.
	 * Posts the EVENT_PLAYER_TURNED
	 */
	Player.prototype.turnRight = function() {
		var self = this;
		var rotationOffset = new THREE.Vector3(0, - Math.PI / 2, 0);
		this.startMoveAnimation(null, rotationOffset, function() {
			self.justifyPlayerModel();
			bus.post(bus.EVENT_PLAYER_TURNED, this);
		});
	};


	/**
	 * Starts a forward moving animation.
	 * Sets the grid position after animation.
	 * Posts the EVENT_PLAYER_MOVED
	 */
	Player.prototype.moveForwards = function() {
		var facingDirection = this.getFacingDirection(),
			movementOffset,
			self = this;

		movementOffset = facingDirection.clone();
		movementOffset.setLength(config.gridCellSize);

		this.startMoveAnimation(movementOffset, null, function() {
			self.gridPosition.add(facingDirection);
			self.justifyPlayerModel();
			bus.post(bus.EVENT_PLAYER_MOVED, self);
		});
	};

	/**
	 * Starts a backward moving animation.
	 * Sets the grid position after animation.
	 * Posts the EVENT_PLAYER_MOVED
	 */
	Player.prototype.moveBackwards = function() {
		var facingDirection = this.getFacingDirection(),
			movementOffset,
			self = this;

		// invert facing direction to move backwards
		facingDirection.negate();
		movementOffset = facingDirection.clone();
		movementOffset.setLength(config.gridCellSize);

		this.startMoveAnimation(movementOffset, null, function() {
			self.gridPosition.add(facingDirection);
			self.justifyPlayerModel();
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

		if (this.currentLookAtAnimation != null) {
			this.currentLookAtAnimation.animate();
		}
	};

	/**
	 * Gets a normal vector of the direction the player is facing.
	 * @returns THREE.Vector3 A normal vector of the direction the player is facing.
	 */
	Player.prototype.getFacingDirection = function(showErrorMessage) {

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

			if (showErrorMessage) console.error("Player got undefined facing direction: " + modulatedRotation);
			return null;
		}
	};

	/**
	 * Sets the players grid position.
	 * @param gridX The grid x coordinate.
	 * @param gridZ The grid z coordinate.
	 */
	Player.prototype.setGridPosition = function(gridX, gridZ) {
		this.gridPosition.x = gridX;
		this.gridPosition.z = gridZ;
		this.position.x = this.gridPosition.x * config.gridCellSize + (config.gridCellSize / 2);
		this.position.z = this.gridPosition.z * config.gridCellSize - (config.gridCellSize / 2);
	};

	/**
	 * Gets the players position in the grid.
	 */
	Player.prototype.getGridPosition = function() {
		return this.gridPosition;
	};

	Player.prototype.justifyPlayerModel = function() {
		this.playerModel.position.set(this.playerModelStandardOffset.x, this.playerModelStandardOffset.y, this.playerModelStandardOffset.z);
	};

	return Player;

});