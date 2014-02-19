define([], function() {
	return {
		gridCellSize : 100.0,
		movementDurationMillis : 300,
		debug: true,
		mapViewElementsY: 100,

		renderSize : { "width" : window.innerWidth, "height" : window.innerHeight},
		viewPortContainerId : "canvasContainer",

		fogDensity : 0.002,

		player : {

			graphics : {

				headOffset : {
					x : 0,
					y : 70,
					z : 0
				},

				modelOffset : {
					x : 0,
					y : -15,
					z : 0
				},

				spotLightOffset : {
					x : 0,
					y : 70,
					z : 0
				},

				spotLightTarget : {
					x : 0,
					y : 40,
					z : -30
				},

				weaponOffset : {
					x : 1.5,
					y : 60,
					z : -25
				}


			}
		}

	};
});