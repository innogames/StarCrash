define([
	"THREE",
	"starcrash/event_bus",
	"starcrash/static/config",
	"starcrash/graphic/animations/animation_transformation",
	"starcrash/resource_store",
	"starcrash/objects/creatures/creature",
	"starcrash/controller/controller_graphic"
], function(
	THREE,
	bus,
	config,
	TransformationAnimation,
	resourceStore,
	Creature,
	graphics
	) {


	var Enemy = function(gridX, gridZ) {
		Creature.call(this, gridX, gridZ);
		this.name = "An Enemy";


		this._AI_CONFIG = {
			MOVEMENT_INITIATIVE : 100,
			MOVEMENT_CHANGE : 0.90
		};


		this._AIStatus =  {
			movement : 0
		};

	};

	/**
	 * Inherits from Creature
	 * @type {*}
	 */
	Enemy.prototype = Object.create( Creature.prototype );



	Enemy.prototype.act = function() {

		this._AIStatus.movement++;


		if (this._AIStatus.movement >= this._AI_CONFIG.MOVEMENT_INITIATIVE) {
			if (Math.random() <= this._AI_CONFIG.MOVEMENT_CHANGE) {
				var gridPosition = this.getGridPosition();
				this.setGridPosition(gridPosition.x, gridPosition.z + 1);
			}
			this._AIStatus.movement = 0;
		}
	};


	return Enemy;

});