define(["THREE", "engine/bus", "config"], function(THREE, bus, config) {

	var Player = function(gridStartX, gridStartZ, pCamera) {
		THREE.Object3D.call( this );
		this.name = "ThePlayer";
		this.setGridPosition(gridStartX, gridStartZ);
		this.add(pCamera);
		this.add(new THREE.PointLight(0x404040, 2.5, 450));

		this.currentWalkStartPosition = null;
		this.currentWalkDirection = null;
		this.currentWalkStartTime = null;


	};

	Player.prototype = Object.create( THREE.Object3D.prototype );

	/**
	 * Returns true if the player is currently walking.
	 * @returns {*} True if the player is currently walking.
	 */
	Player.prototype.isWalking = function() {
		return ((this.currentWalkDirection != null));
	};

	/**
	 * Starts walking in the assigned direction. Does not start if the player currently is walking.
	 * @param direction The direction "left", "right", "up" or "down"
	 */
	Player.prototype.walk = function(direction) {

		console.log("this.position.z: " + this.position.z);
		if (this.currentWalkStartPosition) {
			console.log("this.currentWalkStartPosition.z: " + this.currentWalkStartPosition.z);
		} else {
			console.log("this.currentWalkStartPosition is null");
		}


		if (! (direction == "left" ||  direction == "right" || direction == "up" || direction == "down")) {
			console.error("Player can not walk in this unknown direction: " + direction);
			return;
		}
		if (!this.isWalking()) {
			this.currentWalkStartPosition = { "x": this.position.x, "y": this.position.y, "z": this.position.z};
			this.currentWalkDirection = direction;
			this.currentWalkStartTime = new Date().getTime();

			this.gridPosition.x++;

			bus.post(bus.EVENT_PLAYER_MOVED, this);
		}
	};

	Player.prototype.animate = function() {
		if (this.isWalking()) {

			var alreadyWalkedTime = new Date().getTime() - this.currentWalkStartTime;
			if ((alreadyWalkedTime / config.walkDurationMillis) < 1) {
				// interpolate between start and target
				this.interpolateWalkAnimation((alreadyWalkedTime / config.walkDurationMillis));
			} else {
				// make sure the target has been reached exactly.
				this.interpolateWalkAnimation(1);
				this.currentWalkStartPosition = null;
				this.currentWalkDirection = null;
				this.currentWalkStartTime = null;
			}

		}
	};

	/**
	 * Interpolates the position of the player between the start and target position.
	 * @param interpolationFactor The progress of the animation between 0 (start) and 1 (end)
	 */
	Player.prototype.interpolateWalkAnimation = function(interpolationFactor) {
		var alreadyWalkedDistance =  interpolationFactor * config.gridCellSize;

		if (this.currentWalkDirection == "left") {
			this.position.x = this.currentWalkStartPosition.x - alreadyWalkedDistance;
		} else if (this.currentWalkDirection == "right") {
			this.position.x = this.currentWalkStartPosition.x + alreadyWalkedDistance;
		} else if (this.currentWalkDirection == "up") {
			this.position.z = this.currentWalkStartPosition.z + alreadyWalkedDistance;
		} else if (this.currentWalkDirection == "down") {
			this.position.z = this.currentWalkStartPosition.z - alreadyWalkedDistance;
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

	Player.prototype.getGridPosition = function() {
		return this.gridPosition;
	};


	return Player;

});