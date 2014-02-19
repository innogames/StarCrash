define(["THREE", "engine/Bus", "animations/LaserBeamAnimation", "animations/LaserImpactAnimation", "config", "entities/Entity"], function(THREE, bus, LaserBeamAnimation, LaserImpactAnimation, config, Entity) {


	/**
	 * Singleton of the game controller. Implements game logic.
	 *
	 * @param pPlayer The player.
	 * @param pLevel The loaded level
	 * @param pGraphics The graphic controller.
	 * @constructor
	 * @author LucaHofmann@gmx.net
	 */
	var GameController = function(pPlayer, pLevel, pGraphics) {
		var self = this;
		this._player = pPlayer;
		this._level = pLevel;
		this._graphics = pGraphics;

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

			self._graphics.addAnimation(new LaserBeamAnimation(self._player.position, self._player.rotation, laserBeamLength, weaponLaserBeamColor, self._graphics, null), true);

			if (laserTargetPosition != null) {
				self._graphics.addAnimation(new LaserImpactAnimation(laserTargetPosition, shootDirection, self._graphics, null), true);
			}

		});
	};

	return GameController;


});