define([], function() {

	var self = this;
	this.eventToListenersMap = {};

	return {

		// Events ===================
		EVENT_INPUT_TURN_LEFT : "input/turn_left",
		EVENT_INPUT_TURN_RIGHT : "input/turn_right",
		EVENT_INPUT_MOVE_BACKWARDS : "input/move_backwards",
		EVENT_INPUT_MOVE_FORWARDS : "input/move_forwards",
		EVENT_INPUT_STRAFE_LEFT : "input/strafe_left",
		EVENT_INPUT_STRAFE_RIGHT : "input/strafe_right",

		EVENT_INPUT_ZOOM_IN_MAP : "input/zoom_in_map",
		EVENT_INPUT_ZOOM_OUT_MAP : "input/zoom_out_map",


		EVENT_OPEN_SCREEN : "input/open_screen", // @param screen name
		EVENT_CLOSE_SCREEN : "input/close_screen", // @param screen name

		EVENT_INPUT_SHOOT : "input/shoot",


		EVENT_CREATURE_DIED : "creature/died", // @param Creature
		EVENT_CREATURE_MOVED : "creature/moved", // @param Creature
		EVENT_CREATURE_TURNED : "creature/turned", // @param Creature

		EVENT_CREATURE_WAS_ATTACKED : "creature/was_attacked", // @param [Creature, Creature (attacker)]

		ATTEMPT_AI_ENEMY_MOVE : "attempt/ai_enemy_move",
		ATTEMPT_AI_ENEMY_TURN : "attempt/ai_enemy_turn",
		ATTEMPT_AI_ENEMY_ATTACK : "attempt/ai_enemy_attack", // @param Creature


		subscribe: function subscribe(eventName, callback) {

			if (!self.eventToListenersMap[eventName]) {
				self.eventToListenersMap[eventName] = [];
			}

			self.eventToListenersMap[eventName].push(callback);

			//console.log("[BUS] Subscribed: " + eventName, self.eventToListenersMap);
		},


		post: function(eventName, parameter) {
			var listeners,
				param1 = null,
				param2 = null,
				i;

			if (arguments.length > 2) {
				param1 = arguments[1];
				param2 = arguments[2];
			}

			if (self.eventToListenersMap[eventName]) {
				listeners = self.eventToListenersMap[eventName];
				if (listeners) {
					for(i = 0; i < listeners.length; i++) {
						if (param1 != null && param2 != null) {
							listeners[i](param1, param2);
						} else {
							listeners[i](parameter);
						}

					}
					//console.log("[BUS] " + eventName + " posted to " + listeners.length + " listeners.");
				}
			} else {
				//console.log("[BUS] Nobody Subscribed to: " + eventName);
			}
		}
	}

});