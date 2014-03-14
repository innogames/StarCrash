define([
		"THREE",
		"starcrash/event_bus",
		"starcrash/graphic/animations/animation_laser_beam",
		"starcrash/graphic/animations/animation_laser_impact",
		"starcrash/graphic/animations/animation_enemy_laser_impact",
		"starcrash/controller/controller_input",
		"starcrash/static/config",
		"starcrash/objects/map_entity",
		"starcrash/objects/creatures/player",
		"starcrash/objects/creatures/enemy",
		"starcrash/objects/creatures/creature",
		"starcrash/ui/map_view/controller_map_view",
		"starcrash/debug/debug_tool",
		"starcrash/resource_store"
	], function(
		THREE,
		bus,
		LaserBeamAnimation,
		LaserImpactAnimation,
		EnemyLaserImpactAnimation,
		inputController,
		config,
		Entity,
		PlayerClass,
		EnemyClass,
		Creature,
		MapView,
		debugTool,
		resourceStore) {


	/**
	 * Singleton of the game controller. Implements game logic.
	 *
	 * @param pLevel The loaded level
	 * @param pGraphics The graphic controller.
	 * @constructor
	 * @author LucaHofmann@gmx.net
	 */
	var GameController = function(pLevel, pGraphics, pUIController) {
		var self = this;
		this._level = pLevel;
		this._graphics = pGraphics;
		this._uiController = pUIController;

		this._graphics.init();
		this._level.initEntities();
		this._graphics.scene.add(this._level);
		this._player = new PlayerClass(0, 0, this._graphics.getMainCamera());
		this._graphics.scene.add(this._player);
		this._graphics.addAnimation(this._player);
		this._graphics.addAnimation(new MapView(this._player, this._level));
		this._graphics.animationCallback();

		var enemies = this._level.getEnemies();
		for (var i = 0; i < enemies.length; i++) {
			this._graphics.addAnimation(enemies[i]);
		}

		inputController.init();
		debugTool.init(this._player, this._level, this._graphics.getMainCamera(), this._graphics.renderer.domElement);
		this._graphics.addAnimation(debugTool);


		bus.subscribe(bus.EVENT_INPUT_TURN_LEFT, function() {
			self._player.turnLeft();
		});

		bus.subscribe(bus.EVENT_INPUT_TURN_RIGHT, function() {
			self._player.turnRight();
		});

		bus.subscribe(bus.EVENT_INPUT_MOVE_FORWARDS, function() {
			if (!self._player.isMoving() && self.canCreatureMoveInDirection(self._player, Creature.MOVEMENT.FORWARDS)) {
				self._player.move(Creature.MOVEMENT.FORWARDS);
			}
		});

		bus.subscribe(bus.EVENT_INPUT_MOVE_BACKWARDS, function() {
			if (!self._player.isMoving() && self.canCreatureMoveInDirection(self._player, Creature.MOVEMENT.BACKWARDS)) {
				self._player.move(Creature.MOVEMENT.BACKWARDS);
			}
		});

		bus.subscribe(bus.EVENT_INPUT_STRAFE_LEFT, function() {
			if (!self._player.isMoving() && self.canCreatureMoveInDirection(self._player, Creature.MOVEMENT.STRAFE_LEFT)) {
				self._player.move(Creature.MOVEMENT.STRAFE_LEFT);
			}
		});

		bus.subscribe(bus.EVENT_INPUT_STRAFE_RIGHT, function() {
			if (!self._player.isMoving() && self.canCreatureMoveInDirection(self._player, Creature.MOVEMENT.STRAFE_RIGHT)) {
				self._player.move(Creature.MOVEMENT.STRAFE_RIGHT);
			}
		});


		bus.subscribe(bus.EVENT_INPUT_SHOOT, function() {
			var weapon = self._player.getEquipedWeapon();
			var didTrigger = weapon.tryTrigger();

			if (didTrigger == true){

				var weaponRange = 10000;
				var weaponLaserBeamColor = 0xFFAA22;
				//var weaponLaserBeamColor = 0x22AAFF;

				var laserStartPosition = self._player.getAbsoluteWeaponPosition();


				var shootDirection = self._player.getOffsetToMove(Creature.MOVEMENT.FORWARDS);
				var shootRayCaster = new THREE.Raycaster(laserStartPosition, shootDirection, 0, weaponRange);
				// TODO : do not check intersections for the whole scene.. only check objects that are in the direction.
				var intersectObjects = shootRayCaster.intersectObjects(pGraphics.scene.children, true);


				var hitTarget = self.getHitTarget(intersectObjects);
				var laserTargetPosition = hitTarget.point;
				var laserBeamLength = laserTargetPosition.clone().sub(laserStartPosition).length();

				if (hitTarget.object instanceof EnemyClass) {
					bus.post(bus.EVENT_CREATURE_WAS_ATTACKED, hitTarget.object, self._player);
				}

				if (resourceStore.getAudio("audio_laser") != null) {
					resourceStore.getAudio("audio_laser").play();
				}

				var beamAnimation = new LaserBeamAnimation(laserStartPosition.clone(), self._player.rotation, laserBeamLength, weaponLaserBeamColor, self._graphics, null);
				self._graphics.addAnimation(beamAnimation, true);

				if (laserTargetPosition != null) {
					if (hitTarget.object instanceof EnemyClass) {
						var impactAnimation = new EnemyLaserImpactAnimation(laserTargetPosition.clone(), shootDirection, self._graphics, null);
						self._graphics.addAnimation(impactAnimation, true);
					} else {
						var impactAnimation = new LaserImpactAnimation(laserTargetPosition.clone(), shootDirection, self._graphics, null);
						self._graphics.addAnimation(impactAnimation, true);
					}
				}
    		}
		});

		bus.subscribe(bus.EVENT_CREATURE_WAS_ATTACKED, function(victim, attacker) {
			victim.dealDamage(attacker.getEquipedWeapon().getAttributes().damage);

			if (victim instanceof EnemyClass) {
				victim.setAggroTarget(attacker);
			}

		});


		bus.subscribe(bus.ATTEMPT_AI_ENEMY_MOVE, function(pEnemy) {
			if (!pEnemy.isMoving() && self.canCreatureMoveInDirection(pEnemy, Creature.MOVEMENT.FORWARDS)) {
					pEnemy.move(Creature.MOVEMENT.FORWARDS);
			}
		});

		bus.subscribe(bus.ATTEMPT_AI_ENEMY_ATTACK, function(pEnemy) {
			if(self.canCreatureAttackCreature(pEnemy, pEnemy.getAggroTarget())) {
				var laserPosition = pEnemy.position.clone();
				laserPosition.y = 50;
				var beamAnimation = new LaserBeamAnimation(laserPosition, pEnemy.rotation, 10000, 0x0000FF, self._graphics, null);
				self._graphics.addAnimation(beamAnimation, true);
				pEnemy.resetActionPoints();
				bus.post(bus.EVENT_CREATURE_WAS_ATTACKED, pEnemy.getAggroTarget(), pEnemy);
			}
		});


		bus.subscribe(bus.ATTEMPT_AI_ENEMY_TURN, function(pEnemy) {
			if (!pEnemy.isMoving() && !self.canCreatureMoveInDirection(pEnemy, Creature.MOVEMENT.FORWARDS)) {

				var canMoveLeft = self.canCreatureMoveInDirection(pEnemy, Creature.MOVEMENT.STRAFE_LEFT);
				var canMoveRight = self.canCreatureMoveInDirection(pEnemy, Creature.MOVEMENT.STRAFE_RIGHT);

				if ((canMoveLeft && canMoveRight) || (!canMoveLeft && ! canMoveRight)) {
					if (Math.random() > 0.5) pEnemy.turnLeft();
					else pEnemy.turnRight();
				} else {
					if (canMoveLeft) {
						pEnemy.turnLeft();
					}
					if (canMoveRight) {
						pEnemy.turnRight();
					}
				}


			}
		});


		bus.subscribe(bus.EVENT_CREATURE_DIED, function(creature) {
			self._level.removeEnemy(creature.getGameId());
		});

		window.setInterval(this._logicLoop.bind(this), config.logicLoopIntervalMillis);


		window.check = this.getCreatureViewCellPositions.bind(this);
		window.player = this._player;
	};


	GameController.prototype._logicLoop = function() {
		var enemyArray = this._level.getEnemies();

		for (var i = 0; i < enemyArray.length; i++) {
			enemyArray[i].act();
		}

		this._uiController.update(this._player);

	};

	/**
	 * Checks if a creature can move in a direction.
	 *
	 * @param creature Creature The creature to check.
	 * @param direction Creature.MOVEMENT The direction to check
	 * @return Boolean True if the creature can move forward.
	 */
	GameController.prototype.canCreatureMoveInDirection = function(creature, direction) {
		var facingDirection,
			nextX,
			nextZ;

		facingDirection = creature.getOffsetToMove(direction);

		if (facingDirection != null) {
			nextX = creature.getGridPosition().x + facingDirection.x;
			nextZ = creature.getGridPosition().z + facingDirection.z;
			return !this._level.isWallBetween(creature.getGridPosition().x, creature.getGridPosition().z, nextX, nextZ);
		} else {
			return false;
		}

	};

	/**
	 * Returns the target object that has been hit.
	 * @param intersectObjects Objects returned by a ray caster.
	 * @returns {*} The object that was hit.
	 */
	GameController.prototype.getHitTarget = function(intersectObjects) {
		for (var i = 0; i < intersectObjects.length; i++) {
			var currentObject = intersectObjects[i].object;
			while (currentObject != null) {
				if (currentObject instanceof Entity || currentObject instanceof Creature) {
					return { object : currentObject, point :  intersectObjects[i].point };
				}
				currentObject = currentObject.parent;
			}
		}
		return null;
	};


	/**
	 * Returns true if a creature can attack another.
	 * Takes care of the equipped weapon range, the view range and level walls.
	 * @param attackCreature The creature to check if it can attack.
	 * @param victimCreature The creature to attack.
	 */
	GameController.prototype.canCreatureAttackCreature = function(attackCreature, victimCreature) {
		if (attackCreature instanceof Creature && victimCreature instanceof Creature) {
			var cellPositionsInSight = this.getCreatureViewCellPositions(attackCreature);
			if (cellPositionsInSight != null) {
				for (var i = 0; i < cellPositionsInSight.length; i++) {
					var tmpCellPosition = cellPositionsInSight[i];
					if (tmpCellPosition.equals(victimCreature.getGridPosition())) {
						return true;
					}
				}
			}
		} else {
			console.log("[GameController] The arguments have to be instance of Creature.", attackCreature, victimCreature);
		}
		return false;
	};


	/**
	 * Returns an array of cell positions that a creature can see.
	 * Takes care of view range and facing direction.
	 * @param creature The creature to get the view for.
	 */
	GameController.prototype.getCreatureViewCellPositions = function(creature) {
		var self = this;
		if (creature instanceof Creature) {
			var returnValue = [];
			var facingOffset = creature.getOffsetToMove(Creature.MOVEMENT.FORWARDS);
			var viewRange = creature.getAttributes().viewRangeCells;

			var tmpPosition1 = creature.getGridPosition().clone();
			var tmpPosition2 = creature.getGridPosition().clone().add(facingOffset);

			for (var i = 0; i < viewRange; i++) {
				if (!self._level.isWallBetween(tmpPosition1.x, tmpPosition1.z, tmpPosition2.x, tmpPosition2.z)) {
					returnValue.push(tmpPosition2.clone());
				} else {
					return returnValue;
				}
				tmpPosition1 = tmpPosition2.clone();
				tmpPosition2.add(facingOffset);
			}
		} else {
			console.log("[GameController] The argument have to be an instance of Creature.", creature);
		}
	};

	return GameController;


});