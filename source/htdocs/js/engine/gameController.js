define(["THREE", "engine/Bus", "animations/LaserAnimation"], function(THREE, bus, LaserAnimation) {


	var GameController = function(pPlayer, pLevel, pGraphics) {
		var self = this;
		this._player = pPlayer;
		this._level = pLevel;
		this._graphics = pGraphics;

		bus.subscribe(bus.EVENT_INPUT_TURN_LEFT, function() {
			self._player.turnLeft();
		});

		bus.subscribe(bus.EVENT_INPUT_TURN_RIGHT, function() {
			self._player.turnRight();
		});

		bus.subscribe(bus.EVENT_INPUT_MOVE_FORWARDS, function() {
			var facingDirection = self._player.getFacingDirection(false);
			var nextX = self._player.getGridPosition().x + facingDirection.x;
			var nextZ = self._player.getGridPosition().z + facingDirection.z;
			var facingWall = self._level.isWallBetween(self._player.getGridPosition().x, self._player.getGridPosition().z, nextX, nextZ);
			if(!facingWall) self._player.moveForwards();
		});

		bus.subscribe(bus.EVENT_INPUT_MOVE_BACKWARDS, function() {
			var backDirection = self._player.getFacingDirection(false).negate();
			var nextX = self._player.getGridPosition().x + backDirection.x;
			var nextZ = self._player.getGridPosition().z + backDirection.z;
			var backWall = self._level.isWallBetween(self._player.getGridPosition().x, self._player.getGridPosition().z, nextX, nextZ);
			if(!backWall) self._player.moveBackwards();
		});


		bus.subscribe(bus.EVENT_INPUT_SHOOT, function() {
			//var weapon = self._player.getEquipedWeapon();


			self._graphics.addAnimation(new LaserAnimation(self._player.position, self._player.rotation, null, self._graphics), true);



		});


	};

	return GameController;


});