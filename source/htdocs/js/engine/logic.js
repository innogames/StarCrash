define(["THREE", "engine/bus"], function(THREE, bus) {


	var Logic = function(pPlayer) {
		this.player = pPlayer;

		bus.subscribe(bus.EVENT_INPUT_TURN_LEFT, function() {
			console.log("turn left");
		});

		bus.subscribe(bus.EVENT_INPUT_TURN_RIGHT, function() {
			console.log("turn left");
		});

		bus.subscribe(bus.EVENT_INPUT_MOVE_FORWARDS, function() {
			pPlayer.walk("up");
		});

		bus.subscribe(bus.EVENT_INPUT_MOVE_BACKWARDS, function() {
			pPlayer.walk("down");
		});

	};

	return Logic;


});