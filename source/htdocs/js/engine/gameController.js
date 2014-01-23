define(["THREE", "engine/bus"], function(THREE, bus) {


	var GameController = function(pPlayer) {
		this.player = pPlayer;

		bus.subscribe(bus.EVENT_INPUT_TURN_LEFT, function() {
			pPlayer.turnLeft();
		});

		bus.subscribe(bus.EVENT_INPUT_TURN_RIGHT, function() {
			pPlayer.turnRight();
		});

		bus.subscribe(bus.EVENT_INPUT_MOVE_FORWARDS, function() {
			pPlayer.moveForwards();
		});

		bus.subscribe(bus.EVENT_INPUT_MOVE_BACKWARDS, function() {
			pPlayer.moveBackwards();
		});

	};

	return GameController;


});