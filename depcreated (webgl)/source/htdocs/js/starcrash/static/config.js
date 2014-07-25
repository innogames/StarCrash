define([], function() {
	return {

		logicLoopIntervalMillis : 100,

		gridCellSize : 100.0,
		movementDurationMillis : 300,

		debug: true,
		debug_draw_grid: false,


		mapViewElementsY: 100,

		renderSize : { "width" : window.innerWidth, "height" : window.innerHeight},
		viewPortContainerId : "canvasContainer",

		fogDensity : 0.002,

		farSight : 1000000,



		standardResources : [
			"model_aim",
			"audio_laser",
			"model_enemy"
		],

		texturePath : "img/textures/",


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
					z : 200
				},

				weaponOffset : {
					x : -1.5,
					y : 75,
					z : 25
				}


			}
		}

	};
});