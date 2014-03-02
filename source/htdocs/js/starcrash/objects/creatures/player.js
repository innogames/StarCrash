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

	/**
	 * Creates a new player by its start position and the scene mainCamera. Inherits from Creature that is a THREE.Object3D
	 * @param gridStartX The x grid coordinate to start.
	 * @param gridStartZ The y grid coordinate to start.
	 * @param pCamera The mainCamera of the scene.
	 * @param playerModelGeometry THREE.Geometry of the player model.
	 * @param playerModelMaterial THREE.Material of the player model.
	 *
	 * @constructor Creates a new player.
	 */
	var Player = function(gridStartX, gridStartZ) {
		Creature.call(this, gridStartX, gridStartZ);
		this.name = "The Player";
		this._animationCounter = 0;
		this._camera = null;
	};

	/**
	 * Inherits from Creature
	 * @type {*}
	 */
	Player.prototype = Object.create( Creature.prototype );


	Player.prototype._createModel = function() {
		var returnModel = new THREE.Object3D();

		var playerModelGeometry = resourceStore.getGeometry("model_aim"),
			playerModelMaterial = resourceStore.getMaterial("model_aim");

		playerModelGeometry.computeVertexNormals();
		playerModelGeometry.computeFaceNormals();

		// Initialize the player model.
		this.playerModelStandardOffset = new THREE.Vector3(
			config.player.graphics.modelOffset.x,
			config.player.graphics.modelOffset.y,
			config.player.graphics.modelOffset.z);

		returnModel = new THREE.Mesh(playerModelGeometry, new THREE.MeshFaceMaterial( playerModelMaterial ));
		returnModel.receiveShadow = true;
		returnModel.position = this.playerModelStandardOffset.clone();
		returnModel.rotation.y = - Math.PI;

		this._weaponOffsetTarget = new THREE.Object3D();
		this._weaponOffsetTarget.position.set(
			config.player.graphics.weaponOffset.x,
			config.player.graphics.weaponOffset.y,
			config.player.graphics.weaponOffset.z
		);

		this._camera = graphics.getMainCamera();
		this._camera.position.set(
			config.player.graphics.headOffset.x,
			config.player.graphics.headOffset.y,
			config.player.graphics.headOffset.z);
		this.add(this._camera);

		var spotLight = new THREE.SpotLight(0xFFFFFF, 2);

		spotLight.position.set(
			config.player.graphics.spotLightOffset.x,
			config.player.graphics.spotLightOffset.y,
			config.player.graphics.spotLightOffset.z);

		spotLight.castShadow = true;
		spotLight.receiveShadow = true;
		spotLight.exponent = 10;
		spotLight.angle = 1;

		var target = new THREE.Object3D();
		target.position.set(
			config.player.graphics.spotLightTarget.x,
			config.player.graphics.spotLightTarget.y,
			config.player.graphics.spotLightTarget.z
		);

		returnModel.add(target);
		spotLight.target = target;

		var pointLight = new THREE.PointLight(0xFFFFFF, 0.5);

		pointLight.position.set(
			config.player.graphics.headOffset.x,
			config.player.graphics.headOffset.y,
			config.player.graphics.headOffset.z
		);

		returnModel.add(spotLight);
		returnModel.add(pointLight);
		returnModel.add(this._weaponOffsetTarget);

		return returnModel;
	};


	/**
	 * Gets the absolute position of the weapon.
	 * @returns {THREE.Vector3} The absolute position of the weapon.
	 */
	Player.prototype.getAbsoluteWeaponPosition = function() {
		this.updateMatrixWorld();
		var absolutePosition = new THREE.Vector3();
		absolutePosition.getPositionFromMatrix( this._weaponOffsetTarget.matrixWorld);
		return absolutePosition;
	};


	return Player;

});