define(["engine/bus"], function(bus) {

	return {

		init : function() {

			document.addEventListener("keydown", function(e) {
				if (e.keyCode == 37) bus.post(bus.EVENT_INPUT_TURN_LEFT);
				if (e.keyCode == 38) bus.post(bus.EVENT_INPUT_MOVE_FORWARDS);
				if (e.keyCode == 39) bus.post(bus.EVENT_INPUT_TURN_RIGHT);
				if (e.keyCode == 40) bus.post(bus.EVENT_INPUT_MOVE_BACKWARDS);
			});

		}

	}



});