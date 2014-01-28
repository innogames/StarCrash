define([], function() {
	return  [
		{
			"class" : "corridor",
			"type" : "zdirection",
			"models" : [ {
					"file": "models/icube.json",
					"rotationOffset" : { "x" : 0, "y" : 0, "z" : 0 },
					"positionOffset" : { "x" : 0, "y" : 0, "z" : 0 }
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
				"file": "models/icube.json",
				"rotationOffset" : { "x" : 0, "y" : 90, "z" : 0 },
				"positionOffset" : { "x" : 0, "y" : 0,  "z" : 0 }
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
					"file": "models/xcube.json",
					"rotationOffset" : { "x" : 0, "y" : 0, "z" : 0 },
					"positionOffset" : { "x" : 0, "y" : 0, "z" : 0 }
				}
			],
			"walls" : [
				[ 0 ]
			]
		}
]
});