define([
		"starcrash/event_bus",
		"starcrash/static/config"
	], function(
		bus,
		config
	) {

	var mouseX = 0,
		mouseY = 0;

	return {
		init : function() {
			// KEYBOARD-Controls ===================================================================
			document.addEventListener("keydown", function(e) {

				if (e.keyCode == 37 && e.ctrlKey) { bus.post(bus.EVENT_INPUT_STRAFE_LEFT); return; }
				if (e.keyCode == 39 && e.ctrlKey) { bus.post(bus.EVENT_INPUT_STRAFE_RIGHT); return; }

				if (e.keyCode == 37) { bus.post(bus.EVENT_INPUT_TURN_LEFT); return; }
				if (e.keyCode == 38) { bus.post(bus.EVENT_INPUT_MOVE_FORWARDS); return; }
				if (e.keyCode == 39) { bus.post(bus.EVENT_INPUT_TURN_RIGHT); return; }
				if (e.keyCode == 40) { bus.post(bus.EVENT_INPUT_MOVE_BACKWARDS); return; }

				if (e.keyCode == 107) { bus.post(bus.EVENT_INPUT_ZOOM_IN_MAP); return; }
				if (e.keyCode == 109) { bus.post(bus.EVENT_INPUT_ZOOM_OUT_MAP); return; }

				if (e.keyCode == 32) { bus.post(bus.EVENT_INPUT_SHOOT); return; }

				if (e.keyCode == 27) { bus.post(bus.EVENT_CLOSE_SCREEN_ALL); return; }

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


			document.getElementById(config.viewPortContainerId).addEventListener("mousemove", function(evt) {
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				mouseX = evt.clientX;
				mouseY = evt.clientY;
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