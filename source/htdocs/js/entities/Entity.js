define(["THREE", "engine/modelStore"], function(THREE, modelStore) {

	var Entity = function(gameId, entityType) {
		THREE.Object3D.call(this);

		console.log("Creating entity: " + entityType);

		var tmpModelPositionOffset,
			tmpModelRotationOffset,
			tmpModelName,
			tmpMaterial,
			tmpGeometry,
			tmpMesh,
			i;

		this._gameId = gameId;
		this._definition = modelStore.getEntityDefinition(entityType);

		for (i = 0; i < this._definition.models.length; i++) {
			tmpModelName = this._definition.models[i].file;
			tmpModelPositionOffset = this._definition.models[i].positionOffset;
			tmpModelRotationOffset = this._definition.models[i].rotationOffset;

			tmpGeometry = modelStore.getGeometry(tmpModelName);
			tmpMaterial = modelStore.getMaterial(tmpModelName);
			if (tmpGeometry == null || tmpMaterial == null) console.error("Error creating entity "+ entityType + ". Model file was not loaded to the modelStore.");

			tmpMesh = new THREE.Mesh(tmpGeometry, tmpMaterial[0]); // TODO : take care of multiple materials

			if (tmpModelPositionOffset != null) {
				if (tmpModelPositionOffset.x != null) tmpMesh.position.x = tmpModelPositionOffset.x;
				if (tmpModelPositionOffset.y != null) tmpMesh.position.y = tmpModelPositionOffset.y;
				if (tmpModelPositionOffset.z != null) tmpMesh.position.z = tmpModelPositionOffset.z;
			}

			if (tmpModelRotationOffset != null) {
				console.log(tmpModelRotationOffset);
				if (tmpModelRotationOffset.x != null) tmpMesh.rotation.x = tmpModelRotationOffset.x;
				if (tmpModelRotationOffset.y != null) tmpMesh.rotation.y = tmpModelRotationOffset.y;
				if (tmpModelRotationOffset.z != null) tmpMesh.rotation.z = tmpModelRotationOffset.z;
			}

			this.add(tmpMesh);
		}
	};


	/**
	 * Inherits from THREE.Object3D
	 * @type {*}
	 */
	Entity.prototype = Object.create( THREE.Object3D.prototype );


	Entity.prototype.clone = function ( object ) {
		if ( object === undefined ) object = new Entity(this._level);
		THREE.Object3D.prototype.clone.call( this, object );
		return object;
	};

	return Entity;

});