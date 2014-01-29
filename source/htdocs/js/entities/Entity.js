define(["THREE", "engine/modelStore", "config"], function(THREE, modelStore, config) {

	var Entity = function(rawEntityInfo) {
		THREE.Object3D.call(this);

		var tmpModelPositionOffset,
			tmpModelRotationOffset,
			tmpModelName,
			tmpMaterial,
			tmpGeometry,
			tmpMesh,
			i;

		this._rawEntityInfo = rawEntityInfo;

		if (this._rawEntityInfo.id == null)                 console.error("Error constructing entity. Entity id is null.");
		if (this._rawEntityInfo.type == null)               console.error("Error constructing entity. Entity type is null.");
		if (this._rawEntityInfo.gridPosition.x == null ||
			this._rawEntityInfo.gridPosition.z == null)     console.error("Error constructing entity. Grid position of entity with the id: "+ gameId +" is invalid.");

		this._definition = modelStore.getEntityDefinition(this._rawEntityInfo.type);

		// Loop through every model of this entity
		for (i = 0; i < this._definition.models.length; i++) {
			tmpModelName = this._definition.models[i].file;

			// create the mesh
			tmpGeometry = modelStore.getGeometry(tmpModelName);
			tmpMaterial = modelStore.getMaterial(tmpModelName);
			if (tmpGeometry == null || tmpMaterial == null) console.error("Error constructing entity "+ this._rawEntityInfo.type + ". Model file was not loaded to the modelStore.");
			tmpMesh = new THREE.Mesh(tmpGeometry, tmpMaterial[0]); // TODO : take care of multiple materials

			// add optional entity position- and rotation-offset
			tmpModelPositionOffset = this._definition.models[i].positionOffset;
			tmpModelRotationOffset = this._definition.models[i].rotationOffset;
			if (tmpModelPositionOffset != null) {
				if (tmpModelPositionOffset.x != null) tmpMesh.position.x = tmpModelPositionOffset.x;
				if (tmpModelPositionOffset.y != null) tmpMesh.position.y = tmpModelPositionOffset.y;
				if (tmpModelPositionOffset.z != null) tmpMesh.position.z = tmpModelPositionOffset.z;
			}
			if (tmpModelRotationOffset != null) {
				if (tmpModelRotationOffset.x != null) tmpMesh.rotation.x = tmpModelRotationOffset.x;
				if (tmpModelRotationOffset.y != null) tmpMesh.rotation.y = tmpModelRotationOffset.y;
				if (tmpModelRotationOffset.z != null) tmpMesh.rotation.z = tmpModelRotationOffset.z;
			}

			// add the grid position
			this.position.x = this._rawEntityInfo.gridPosition.x * config.gridCellSize;
			this.position.z = this._rawEntityInfo.gridPosition.z * config.gridCellSize;

			this.add(tmpMesh);
		}
	};

	/**
	 * Inherits from THREE.Object3D
	 * @type {*}
	 */
	Entity.prototype = Object.create( THREE.Object3D.prototype );

	/**
	 * Returns true if this entity contains a wall at the grid-position
	 * in the assigned position.
	 * @param gridX The grid x-position
	 * @param gridZ The grid z-position
	 * @param direction A normal vector in x or z direction.
	 * @returns {boolean}
	 */
	Entity.prototype.isWallAt = function(gridX, gridZ, direction) {
		var wallIndicator,
			wallOffsetX,
			wallOffsetZ;

		// calculate offset for wall-array
		wallOffsetX = gridX - this._rawEntityInfo.gridPosition.x;
		wallOffsetZ = this.getSize().z - ((gridZ - this._rawEntityInfo.gridPosition.z) *-1) -1; // invert walls-array access to make entity definition more human readable

		if (wallOffsetX < 0 || wallOffsetZ < 0) console.error("Error checking walls. The entity is not at the requested position x:" + gridX + " y:" + gridZ, this);

		// get the wall indicator
		wallIndicator = this._definition.walls[wallOffsetZ][wallOffsetX];

		if (direction.x == -1) { // left
			return (wallIndicator == 4 ||
					wallIndicator == 5 ||
					wallIndicator == 6 ||
					wallIndicator == 7 ||
					wallIndicator == 12 ||
					wallIndicator == 13 ||
					wallIndicator == 14 ||
					wallIndicator == 15);
		}

		if (direction.x == 1) { // right
			return (wallIndicator == 1 ||
					wallIndicator == 3 ||
					wallIndicator == 5 ||
					wallIndicator == 7 ||
					wallIndicator == 9 ||
					wallIndicator == 11 ||
					wallIndicator == 13 ||
					wallIndicator == 15);
		}

		if (direction.z == 1) { // top
			return (wallIndicator == 8 ||
					wallIndicator == 9 ||
					wallIndicator == 10 ||
					wallIndicator == 11 ||
					wallIndicator == 12 ||
					wallIndicator == 13 ||
					wallIndicator == 14 ||
					wallIndicator == 15);
		}

		if (direction.z == -1) { // bottom
			return (wallIndicator == 2 ||
					wallIndicator == 3 ||
					wallIndicator == 6 ||
					wallIndicator == 7 ||
					wallIndicator == 10 ||
					wallIndicator == 11 ||
					wallIndicator == 14 ||
					wallIndicator == 15);
		}

		return false;
	};

	/**
	 * Gets the grid x position.
	 * @returns {Number} The grid x position.
	 */
	Entity.prototype.getGridX = function() {
		return this._rawEntityInfo.gridPosition.x;
	};

	/**
	 * Gets the grid z position.
	 * @returns {Number} The grid z position.
	 */
	Entity.prototype.getGridZ = function() {
		return this._rawEntityInfo.gridPosition.z;
	};

	/**
	 * Gets the grid size of the entity defined by the walls.
	 * @returns {{x: Number, z: Number}}
	 */
	Entity.prototype.getSize = function(){
		return {
			x : this._definition.walls[0].length,
			z : this._definition.walls.length
		};
	};

	Entity.prototype.clone = function ( object ) {
		if ( object === undefined ) object = new Entity(this._level);
		THREE.Object3D.prototype.clone.call( this, object );
		return object;
	};

	return Entity;

});