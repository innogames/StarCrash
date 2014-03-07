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


	var Enemy = function(pGridX, pGridZ, pGameId) {
		Creature.call(this, pGridX, pGridZ, pGameId);
		this.name = "An Enemy";

		this._aggroTarget = null;

		this._AI_CONFIG = {
			MOVEMENT_INITIATIVE : 100,
			MOVEMENT_CHANGE : 0.90,
			TURN_INITIATIVE : 10,
			TURN_CHANGE : 0.60
		};

		this._AIStatus =  {
			movementInitiativeCount : 0,
			turnInitiativeCount : 0
		};

	};

	/**
	 * Inherits from Creature
	 * @type {*}
	 */
	Enemy.prototype = Object.create( Creature.prototype );


	Enemy.prototype._createModel = function() {
		var returnModel = new THREE.Object3D();

		var enemyGeometry = resourceStore.getGeometry("model_enemy"),
			enemyMaterial = resourceStore.getMaterial("model_enemy");

		enemyGeometry.computeVertexNormals();
		enemyGeometry.computeFaceNormals();

		returnModel = new THREE.Mesh(enemyGeometry, new THREE.MeshLambertMaterial( { color: 0x050505} ));
		returnModel.receiveShadow = true;
		returnModel.position.y = 30;
		returnModel.rotation.y = - Math.PI;

		return returnModel;
	};

	Enemy.prototype.setAggroTarget = function(target) {
		this._aggroTarget = target;
	};


	Enemy.prototype.act = function() {

		this._AIStatus.movementInitiativeCount++;
		this._AIStatus.turnInitiativeCount++;

		if (this._AIStatus.movementInitiativeCount >= this._AI_CONFIG.MOVEMENT_INITIATIVE) {
			if (Math.random() <= this._AI_CONFIG.MOVEMENT_CHANGE) {
				bus.post(bus.ATTEMPT_AI_ENEMY_MOVE, this);
			}
			this._AIStatus.movementInitiativeCount = 0;
		}


		if (this._AIStatus.turnInitiativeCount >= this._AI_CONFIG.TURN_INITIATIVE) {
			if (Math.random() <= this._AI_CONFIG.TURN_CHANGE) {
				bus.post(bus.ATTEMPT_AI_ENEMY_TURN, this);
			}
			this._AIStatus.turnInitiativeCount = 0;
		}
	};


	return Enemy;

});