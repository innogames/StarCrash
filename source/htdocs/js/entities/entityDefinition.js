define([], function() {
	return  [
		{
			"type" : "corridorUp",
			"model" : "models/icube.json",

			"shape" : [
				[ 1, 0, 1 ],
				[ 1, 0, 1 ],
				[ 1, 0, 1 ]
			],

			"rotation" : {
				"x" : 0,
				"y" : 0,
				"z" : 0
			},

			"offset" : {
				"x" : 0,
				"y" : 0,
				"z" : 0
			}
		},

		{
			"type" : "corridorLeft",
			"model" : "models/icube.json",

			"shape" : [
				[ 1, 1, 1 ],
				[ 0, 0, 0 ],
				[ 1, 1, 1 ]
			],

			"rotation" : {
			"x" : 0,
				"y" : 90,
				"z" : 0
			},

			"offset" : {
				"x" : 0,
					"y" : 0,
					"z" : 0
			}
		},

		{
			"type" : "junction",
			"model" : "models/xcube.json",

			"shape" : [
				[ 1, 0, 1 ],
				[ 0, 0, 0 ],
				[ 1, 0, 1 ]
			],

			"rotation" : {
				"x" : 0,
				"y" : 0,
				"z" : 0
			},

			"offset" : {
				"x" : 0,
				"y" : 0,
				"z" : 0
			}
		}
]
});