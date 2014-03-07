define([
		"THREE",
		"starcrash/event_bus",
		"starcrash/graphic/animations/animation_laser_beam",
		"starcrash/graphic/animations/animation_laser_impact",
		"starcrash/controller/controller_input",
		"starcrash/static/config",
		"starcrash/objects/map_entity",
		"starcrash/objects/creatures/player",
		"starcrash/objects/creatures/enemy",
		"starcrash/ui/map_view/controller_map_view",
		"starcrash/debug/debug_tool",
		"starcrash/resource_store"
	], function(
		THREE,
		bus,
		LaserBeamAnimation,
		LaserImpactAnimation,
		inputController,
		config,
		Entity,
		PlayerClass,
		EnemyClass,
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
	var GameController = function(pLevel, pGraphics) {
		var self = this;
		this._level = pLevel;
		this._graphics = pGraphics;

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
			var facingDirection = self._player.getFacingDirection(false);
			var nextX = self._player.getGridPosition().x + facingDirection.x;
			var nextZ = self._player.getGridPosition().z + facingDirection.z;
			var facingWall = self._level.isWallBetween(self._player.getGridPosition().x, self._player.getGridPosition().z, nextX, nextZ);
			if(!facingWall) self._player.moveForwards();
		});

		bus.subscribe(bus.EVENT_INPUT_MOVE_BACKWARDS, function() {
			var backDirection = self._player.getFacingDirection(false).negate();
			var nextX = self._player.getGridPosition().x + backDirection.x;
			var nextZ = self._player.getGridPosition().z + backDirection.z;
			var backWall = self._level.isWallBetween(self._player.getGridPosition().x, self._player.getGridPosition().z, nextX, nextZ);
			if(!backWall) self._player.moveBackwards();
		});


		bus.subscribe(bus.EVENT_INPUT_SHOOT, function() {
			// TODO : Use equipped weapon for weapon properties
			var weaponRange = 10000;
			var weaponLaserBeamColor = 0xFFAA22;
			//var weaponLaserBeamColor = 0x22AAFF;

			var laserStartPosition = self._player.getAbsoluteWeaponPosition();

			console.log(laserStartPosition);
			var shootDirection = self._player.getFacingDirection();
			var shootRayCaster = new THREE.Raycaster(laserStartPosition, shootDirection, 0, weaponRange);
			// TODO : do not check intersections for the whole scene.. only check objects that are in the direction.
			var intersectObjects = shootRayCaster.intersectObjects(pGraphics.scene.children, true);
			// TODO : check if the intersected object is shootable  (maybe also use a 'shootable' flag?)

			var laserTargetPosition = null;
			var laserBeamLength = 10000;
			var targetEntity = null;

			for (var i = 0; i < intersectObjects.length; i++) {
				if (intersectObjects[i].object instanceof Entity || intersectObjects[i].object.parent instanceof Entity) {
					laserTargetPosition = intersectObjects[i].point;
					laserBeamLength = laserTargetPosition.clone().sub(laserStartPosition).length();
					targetEntity = intersectObjects[i];
					break;
				}
			}

			resourceStore.getAudio("audio_laser").play();

			var beamAnimation = new LaserBeamAnimation(laserStartPosition.clone(), self._player.rotation, laserBeamLength, weaponLaserBeamColor, self._graphics, null);
			self._graphics.addAnimation(beamAnimation, true);

			if (laserTargetPosition != null) {
				var impactAnimation = new LaserImpactAnimation(laserTargetPosition.clone(), shootDirection, self._graphics, null)
				self._graphics.addAnimation(impactAnimation, true);
			}

		});


		bus.subscribe(bus.ATTEMPT_AI_ENEMY_MOVE, function(pEnemy) {
			if (!pEnemy.isMoving()) {
				var facingDirection = pEnemy.getFacingDirection(false);
				var nextX = pEnemy.getGridPosition().x + facingDirection.x;
				var nextZ = pEnemy.getGridPosition().z + facingDirection.z;
				var facingWall = self._level.isWallBetween(pEnemy.getGridPosition().x, pEnemy.getGridPosition().z, nextX, nextZ);
				if(!facingWall) {
					pEnemy.moveForwards();
				}
			}
		});


		bus.subscribe(bus.ATTEMPT_AI_ENEMY_TURN, function(pEnemy) {
			if (!pEnemy.isMoving()) {
				var facingDirection = pEnemy.getFacingDirection(false);
				var nextX = pEnemy.getGridPosition().x + facingDirection.x;
				var nextZ = pEnemy.getGridPosition().z + facingDirection.z;
				var facingWall = self._level.isWallBetween(pEnemy.getGridPosition().x, pEnemy.getGridPosition().z, nextX, nextZ);
				if(facingWall) {
					if (Math.random() > 0.5) {
						pEnemy.turnLeft();
					} else {
						pEnemy.turnRight();
					}
				}
			}
		});


		window.setInterval(this._logicLoop.bind(this), 10);
	};


	GameController.prototype._logicLoop = function() {
		var enemyArray = this._level.getEnemies();

		for (var i = 0; i < enemyArray.length; i++) {
			enemyArray[i].act();
		}

	};

	return GameController;


});