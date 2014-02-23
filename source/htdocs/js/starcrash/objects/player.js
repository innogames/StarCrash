define([
		"THREE",
		"starcrash/event_bus",
		"starcrash/static/config",
		"starcrash/graphic/animations/animation_transformation",
		"starcrash/resource_store"
	], function(
		THREE,
		bus,
		config,
		TransformationAnimation,
		resourceStore
	) {

	/**
	 * Creates a new player by its start position and the scene mainCamera. Inherits from THREE.Object3D
	 * @param gridStartX The x grid coordinate to start.
	 * @param gridStartZ The y grid coordinate to start.
	 * @param pCamera The mainCamera of the scene.
	 * @param playerModelGeometry THREE.Geometry of the player model.
	 * @param playerModelMaterial THREE.Material of the player model.
	 *
	 * @constructor Creates a new player.
	 */
	var Player = function(gridStartX, gridStartZ, pCamera) {
		THREE.Object3D.call( this );

		var playerModelGeometry = resourceStore.getGeometry("model_aim"),
			playerModelMaterial = resourceStore.getMaterial("model_aim");


		this.name = "The Player";
		this.gridPosition = new THREE.Vector3(0, 0, 0);
		this._camera = pCamera;
		this._camera.position.set(
			config.player.graphics.headOffset.x,
			config.player.graphics.headOffset.y,
			config.player.graphics.headOffset.z);

		this.receiveShadow = true;
		this.setGridPosition(gridStartX, gridStartZ);

		// Initialize the player model.
		this.playerModelStandardOffset = new THREE.Vector3(
			config.player.graphics.modelOffset.x,
			config.player.graphics.modelOffset.y,
			config.player.graphics.modelOffset.z);

		this.playerModel = new THREE.Mesh(playerModelGeometry, new THREE.MeshFaceMaterial( playerModelMaterial ));

		//playerModelGeometry.computeVertexNormals();
		//playerModelGeometry.computeFaceNormals();

		this.playerModel.receiveShadow = true;
		this.playerModel.name = "The Player-Model";
		this.playerModel.position = this.playerModelStandardOffset.clone();
		this.playerModel.rotation.y = - Math.PI;

		// Initialize animation
		this.currentMovingAnimation = null;
		this.currentLookAtAnimation = null; // do not mix that up with a turning-animation.. it is not.
		this.playerModelAnimationCounter = 0;

		this._weaponOffsetTarget = new THREE.Object3D();
		this._weaponOffsetTarget.position.set(
			config.player.graphics.weaponOffset.x,
			config.player.graphics.weaponOffset.y,
			config.player.graphics.weaponOffset.z
		);


		this.add(this.playerModel);
		this.add(this._camera);

		var spotLight = new THREE.SpotLight(0xFFFFFF, 2);

		spotLight.position.set(
			config.player.graphics.spotLightOffset.x,
			config.player.graphics.spotLightOffset.y,
			config.player.graphics.spotLightOffset.z);

		spotLight.castShadow = true;
		spotLight.receiveShadow = true;
		spotLight.exponent = 10;
		spotLight.angle = 1;


		var target = new THREE.Object3D();
		target.position.set(
			config.player.graphics.spotLightTarget.x,
			config.player.graphics.spotLightTarget.y,
			config.player.graphics.spotLightTarget.z
		);

		this.add(target);
		spotLight.target = target;

		var pointLight = new THREE.PointLight(0xFFFFFF, 0.5);

		pointLight.position.set(
			config.player.graphics.headOffset.x,
			config.player.graphics.headOffset.y,
			config.player.graphics.headOffset.z
		);

		this.add(spotLight);
		this.add(pointLight);
		this.add(this._weaponOffsetTarget);

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

	/**
	 * Gets the absolute position of the weapon.
	 * @returns {THREE.Vector3} The absolute position of the weapon.
	 */
	Player.prototype.getAbsoluteWeaponPosition = function() {
		this.updateMatrixWorld();
		var absolutePosition = new THREE.Vector3();
		absolutePosition.getPositionFromMatrix( this._weaponOffsetTarget.matrixWorld);
		return absolutePosition;
	};


	return Player;

});