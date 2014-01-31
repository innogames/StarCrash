define(["THREE", "engine/Bus"], function(THREE, bus) {


	var GameController = function(pPlayer, pLevel) {
		var self = this;
		this.player = pPlayer;
		this.level = pLevel;

		bus.subscribe(bus.EVENT_INPUT_TURN_LEFT, function() {
			self.player.turnLeft();
		});

		bus.subscribe(bus.EVENT_INPUT_TURN_RIGHT, function() {
			self.player.turnRight();
		});

		bus.subscribe(bus.EVENT_INPUT_MOVE_FORWARDS, function() {
			var facingDirection = self.player.getFacingDirection(false);
			var nextX = self.player.getGridPosition().x + facingDirection.x;
			var nextZ = self.player.getGridPosition().z + facingDirection.z;
			var facingWall = self.level.isWallBetween(self.player.getGridPosition().x, self.player.getGridPosition().z, nextX, nextZ);
			if(!facingWall) self.player.moveForwards();
		});

		bus.subscribe(bus.EVENT_INPUT_MOVE_BACKWARDS, function() {
			var backDirection = self.player.getFacingDirection(false).negate();
			var nextX = self.player.getGridPosition().x + backDirection.x;
			var nextZ = self.player.getGridPosition().z + backDirection.z;
			var backWall = self.level.isWallBetween(self.player.getGridPosition().x, self.player.getGridPosition().z, nextX, nextZ);
			if(!backWall) self.player.moveBackwards();
		});


	};

	return GameController;


});