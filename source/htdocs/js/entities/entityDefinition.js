define(["config"], function(config) {
	return  [
		{
			"class" : "corridor",
			"type" : "zdirection",
			"models" : [ {
					"file": "models/icube.js",
					"rotationOffset" : { "x" : 0, "y" : -Math.PI / 2, "z" : 0},
					"positionOffset" : {
						"x" : config.gridCellSize / 2,
						"y" : 0,
						"z" : -config.gridCellSize / 2
					}
				}
			],
			"walls" : [
				[ 5 ]
			]
		},

		{
			"class" : "corridor",
			"type" : "xdirection",
			"models" : [ {
				"file": "models/icube.js",
				"rotationOffset" : { "x" : 0, "y" : 0,    "z" : 0 },
				"positionOffset" : {
					"x" : config.gridCellSize / 2,
					"y" : 0,
					"z" : -config.gridCellSize / 2
				}
			}
			],
			"walls" : [
				[ 10 ]
			]
		},

		{
			"class" : "corridor",
			"type" : "junction",
			"models" : [ {
					"file": "models/xcube.js",
					"rotationOffset" : { "x" : 0, "y" : 0, "z" : 0 },
					"positionOffset" : {
						"x" : config.gridCellSize * 1.5,
						"y" : 0,
						"z" : -config.gridCellSize * 1.5
					}
				}
			],
			"walls" : [
				[ 0, 5, 0 ],
				[ 10, 0, 10 ],
				[ 0, 5, 0 ]
			]
		}
]
});