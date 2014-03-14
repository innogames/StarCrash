define([
	"THREE",
	"starcrash/event_bus",
	"starcrash/static/config",
	"starcrash/graphic/animations/animation_transformation",
	"starcrash/resource_store",
	"starcrash/objects/creatures/creature",
	"starcrash/controller/controller_graphic",
	"starcrash/objects/weapons/weapon"
], function(
	THREE,
	bus,
	config,
	TransformationAnimation,
	resourceStore,
	Creature,
	graphics,
	Weapon
	) {


	var Enemy = function(pGridX, pGridZ, pGameId, pDirection) {
		Creature.call(this, pGridX, pGridZ, pGameId, pDirection);
		this.name = "An Enemy";

		this._aggroTarget = null;

		this.setEquipedWeapon(new Weapon());

		this._AI_CONFIG = {
			MOVEMENT_INITIATIVE : 10,
			MOVEMENT_CHANGE : 0.90,

			TURN_INITIATIVE : 1,
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

	Enemy.prototype.getAggroTarget = function() {
		return this._aggroTarget;
	};


	Enemy.prototype.act = function() {
		var self = this;

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

		if (this._aggroTarget != null) {
			var weapon = this.getEquipedWeapon();
			if (weapon != null) {
				var didTrigger = weapon.tryTrigger();
				if (didTrigger == true) {
					bus.post(bus.ATTEMPT_AI_ENEMY_ATTACK, self);
				}
			}
		}
	};


	return Enemy;

});