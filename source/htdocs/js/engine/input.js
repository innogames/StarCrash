define(["engine/bus"], function(bus) {

	return {
		init : function() {
			// KEYBOARD-Controls ===================================================================
			document.addEventListener("keydown", function(e) {
				if (e.keyCode == 37) bus.post(bus.EVENT_INPUT_TURN_LEFT);
				if (e.keyCode == 38) bus.post(bus.EVENT_INPUT_MOVE_FORWARDS);
				if (e.keyCode == 39) bus.post(bus.EVENT_INPUT_TURN_RIGHT);
				if (e.keyCode == 40) bus.post(bus.EVENT_INPUT_MOVE_BACKWARDS);
			});

			// MOUSE-Controls ======================================================================
			document.getElementById("input_turn_left").addEventListener("click", function() {
				bus.post(bus.EVENT_INPUT_TURN_LEFT);
			});
			document.getElementById("input_turn_right").addEventListener("click", function() {
				bus.post(bus.EVENT_INPUT_TURN_RIGHT);
			});
			document.getElementById("input_move_forward").addEventListener("click", function() {
				bus.post(bus.EVENT_INPUT_MOVE_FORWARDS);
			});
			document.getElementById("input_move_backward").addEventListener("click", function() {
				bus.post(bus.EVENT_INPUT_MOVE_BACKWARDS);
			});
		}
	}
});