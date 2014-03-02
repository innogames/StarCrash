define([], function() {

	var self = this;
	this.eventToListenersMap = {};

	return {

		// Events ===================
		EVENT_PLAYER_MOVED : "player/moved", // @param { x: 0, y: 0 }
		EVENT_PLAYER_TURNED : "player/turned", // @param { x: 0, y: 0 }

		EVENT_INPUT_TURN_LEFT : "input/turn_left",
		EVENT_INPUT_TURN_RIGHT : "input/turn_right",
		EVENT_INPUT_MOVE_BACKWARDS : "input/move_backwards",
		EVENT_INPUT_MOVE_FORWARDS : "input/move_forwards",

		EVENT_INPUT_ZOOM_IN_MAP : "input/zoom_in_map",
		EVENT_INPUT_ZOOM_OUT_MAP : "input/zoom_out_map",

		EVENT_INPUT_SHOOT : "input/shoot",


		ATTEMPT_AI_ENEMY_MOVE : "attempt/at_enemy_move",
		ATTEMPT_AI_ENEMY_TURN : "attempt/at_enemy_turn",


		subscribe: function subscribe(eventName, callback) {

			if (!self.eventToListenersMap[eventName]) {
				self.eventToListenersMap[eventName] = [];
			}

			self.eventToListenersMap[eventName].push(callback);

			console.log("[BUS] Subscribed: " + eventName, self.eventToListenersMap);
		},


		post: function(eventName, parameter) {
			var listeners,
				i;

			if (self.eventToListenersMap[eventName]) {
				listeners = self.eventToListenersMap[eventName];
				if (listeners) {
					for(i = 0; i < listeners.length; i++) {
						listeners[i](parameter);
					}
					console.log("[BUS] " + eventName + " posted to " + listeners.length + " listeners.");
				}
			} else {
				console.log("[BUS] Nobody Subscribed to: " + eventName);
			}
		}
	}

});