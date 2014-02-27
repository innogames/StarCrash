/*------------- Data for Items ------------------------------------------------*/


/* List Items here:
			| ID	| Name		   | css class	   | damage min  | damage max | drop  | special | value */

var items = [[	1,	'Pipe',			'pipe',			2,				10,			"A",	"",				0 ],
			 [	2,	'Cloth',		'cloth',		1,				2,			"A",	"",				0 ],
			 [	3,	'Stone',		'stone',		2,				6,			"A",	"",				0 ],
			 [	4,	'Barbed Wire',	'wire',			2,				4,			"A",	"",				0 ],
			 [	8,	'Cord',			'cord',			1,				1,			"B",	"",				0 ],
			 [	9,	'Circuit Board','circuit',		1,				3,			"B",	"",				0 ],
			 [	11,	'Battery',		'battery',		1,				4,			"B",	"",				0 ],
			 [	12,	'Light Bulb',	'light',		1,				2,			"B",	"",				0 ],
			 [	13,	'Flashlight',	'flashlight',	2,				5,			"B",	"",				0 ],
			 [	14,	'Nail',			'nail',			2,				4,			"A",	"",				0 ],
			 [	16,	'Backpack',		'backpack',		1,				3,			"A",	"armor",		5 ],
			 [	18,	'Syringe',		'syringe',		1,				5,			"C",	"",				0 ],
			 [	19,	'Flexible Tube','tube',			1,				1,			"C",	"",				0 ],
			 [	21,	'First Aid Kit','firstAid',		2,				4,			"C",	"consumable", 100 ],
			 [	22,	'Drugs',		'drugs',		1,				3,			"C",	"consumable",  25 ],
			 [	23,	'Water',		'water',		1,				3,			"C",	"consumable",  10 ],
			 [	24,	'Bottle',		'bottle',		2,				5,			"C",	"",				0 ],
			 [	25,	'Alcohol',		'alc',			1,				5,			"C",	"consumable",  15 ],
			 [	27,	'Sling',		'sling',		3,				9,			"A",	"",				0 ],
			 [	28,	'Bandage',		'bandages',		1,				2,			"C",	"consumable",  25 ],
			 [	29,	'Duct Tape',	'tape',			1,				3,			"B",	"",				0 ],
			 [	31,	'Wrench',		'wrench',		3,			   11,			"A",	"",				0 ],
			 [	38,	'Rope',			'rope',			2,			    8,			"A",	"",				0 ]
			];


/* List Inventory here:
					| Item ID	| number of times in inventory |   */
 var myItems = [	[	1,			0	],
					[	2,			1	],
					[	3,			2	],
					[	4,			0	],
					[	8,			1	],
					[	9,			0	],
					[	11,			1	],
					[	12,			0	],
					[	13,			0	],
					[	14,			1	],
					[	16,			0	],
					[	18,			0	],
					[	19,			0	],
					[	21,			0	],
					[	22,			0	],
					[	23,			1	],
					[	24,			0	],
					[	25,			0	],
					[	27,			0	],
					[	28,			0	],
					[	29,			0	],
					[	31,			0	],
					[	38,			0	]
				];


/* List Recipes here:
				| Result Item ID | ID component 1  | ID component 2	 | ID component 3 |   */
 var recipes = [[	13,				11,				12,					8],
				[	21,				18,				22,				   28],
				[	22,				24,				25,					23],
				[	27,				 1,				19,					 3]
				];