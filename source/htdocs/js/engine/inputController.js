define(["engine/Bus"], function(bus) {

	return {
		init : function() {
			// KEYBOARD-Controls ===================================================================
			document.addEventListener("keydown", function(e) {
				if (e.keyCode == 37) bus.post(bus.EVENT_INPUT_TURN_LEFT);
				if (e.keyCode == 38) bus.post(bus.EVENT_INPUT_MOVE_FORWARDS);
				if (e.keyCode == 39) bus.post(bus.EVENT_INPUT_TURN_RIGHT);
				if (e.keyCode == 40) bus.post(bus.EVENT_INPUT_MOVE_BACKWARDS);

				if (e.keyCode == 107) bus.post(bus.EVENT_INPUT_ZOOM_IN_MAP);
				if (e.keyCode == 109) bus.post(bus.EVENT_INPUT_ZOOM_OUT_MAP)
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


			// scroll
			var onScroll = function(e) {
				var evt = window.event || e //equalize event object
				var delta = evt.detail? evt.detail*(-120) : evt.wheelDelta
				if(delta > 0) bus.post(bus.EVENT_INPUT_ZOOM_IN_MAP);
				else bus.post(bus.EVENT_INPUT_ZOOM_OUT_MAP);
			};

			var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x
			if (document.attachEvent) {
				//if IE (and Opera depending on user setting)
				document.attachEvent("on"+mousewheelevt, onScroll);
			} else if (document.addEventListener) {
				//WC3 browsers
				document.addEventListener(mousewheelevt, onScroll, 	false);
			}

		}
	}
});