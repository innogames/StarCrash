define([], function() {

	var self = this;
	this.eventToListenersMap = {};

	return {

		PLAYER_MOVED : "player/moved", // @param { x: 0, y: 0 }

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
				console.log("[BUS] Nobody Subscribed to: " + eventName, this.eventToListenersMap[eventName]);
			}
		}
	}

});