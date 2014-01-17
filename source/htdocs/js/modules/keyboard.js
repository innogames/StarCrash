define([], function() {
	return {
		pressed: [],

		init: function init() {
			// keydown-listener
			window.addEventListener('keydown', function(event) {
				that.pressed[event.keyCode] = true;
			}, false);

			// keyup-listener
			window.addEventListener('keyup', function(event) {
				that.pressed[event.keyCode] = false;
			}, false);
		}
	};
});