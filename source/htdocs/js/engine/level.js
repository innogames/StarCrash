define(["THREE", "entities/Entity", "config"], function(THREE, Entity, config) {

	/**
	 * Constructor of a level.
	 * @param pLevelJSON The level data.
	 * @constructor
	 */
	var Level = function(pLevelJSON) {

		THREE.Object3D.call(this);

		this.rawLevelJSON = pLevelJSON;

		if (!this.rawLevelJSON) 			console.error("Error loading level. Level json is null.");
		if (!this.rawLevelJSON.entities) 	console.error("Error loading level. The level data got no entities: ", this.rawLevelJSON);
		if (!this.rawLevelJSON.grid) 		console.error("Error loading level. Grid is not defined: ", this.rawLevelJSON);

	};

	/**
	 * Inherits from THREE.Object3D
	 * @type {*}
	 */
	Level.prototype = Object.create( THREE.Object3D.prototype );


	Level.prototype.initEntities = function() {
		var tmpEntityInstance,
			tmpRawEntity,
			i;
		// Loading all entities of the level
		for (i = 0; i < this.rawLevelJSON.entities.length; i++) {
			tmpRawEntity = this.rawLevelJSON.entities[i];
			if (! tmpRawEntity.type) 	console.error("Error loading level. Entity 'type' is not defined in level data. ", tmpRawEntity);
			if (! tmpRawEntity.id) 		console.error("Error loading level. Entity 'id' is not defined in level data. ", tmpRawEntity);

			tmpEntityInstance = new Entity(tmpRawEntity.id, tmpRawEntity.type);

			if (tmpRawEntity.gridPosition.x == null || tmpRawEntity.gridPosition.z == null) console.error("Error loading level. Grid position of entity "+ tmpEntityInstance.id +" is not defined: ", tmpRawEntity);

			tmpEntityInstance.position.x = tmpRawEntity.gridPosition.x * config.gridCellSize + (config.gridCellSize / 2);
			tmpEntityInstance.position.z = tmpRawEntity.gridPosition.z * config.gridCellSize + (config.gridCellSize / 2);

			this.add(tmpEntityInstance);
		}
	};

	/**
	 * Returns an array of model names that are in this level.
	 * // TODO : implementation
	 */
	Level.prototype.getContainingEntityTypes = function() {
		var entityTypes = [],
			tmpType,
			i;

		for (i = 0; i < this.rawLevelJSON.entities.length; i++) {
			tmpType = this.rawLevelJSON.entities[i].type;
			if (!tmpType) console.error("Error loading level. Entity 'type' is not defined for entity with index: " + i);
			if (entityTypes.indexOf(tmpType) == -1) {
				// push types only once.
				entityTypes.push(tmpType);
			}
		}
		return entityTypes;
	};

	/**
	 * Returns true if there is a wall between the assigned grid coordinates.
	 * // TODO : implementation
	 * @param grid1X The x coordinate of the first grid cell.
	 * @param grid1Z The z coordinate of the first grid cell.
	 * @param grid2X The x coordinate of the second grid cell.
	 * @param grid2Z The z coordinate of the second grid cell.
	 * @returns {boolean} True if there is a wall between the grid cells.
	 */
	Level.prototype.isWallBetween = function(grid1X, grid1Z, grid2X, grid2Z) {
		return Math.random() > 0.7;
	};

	/**
	 * Gets the width of the level.
	 * @returns The width f the level.
	 */
	Level.prototype.getWidth = function() {
		return this.rawLevelJSON.grid.width;
	};

	/**
	 * Gets the height of the level.
	 * @returns The height f the level.
	 */
	Level.prototype.getHeight = function() {
		return this.rawLevelJSON.grid.height;
	};

	/**
	 * Gets an array of entity that are collisions at this grid position.
	 * @param x The grid x-position.
	 * @param y The grid y-position.
	 */
	Level.prototype.getEntitiesAt = function(x, y) {
		var returnValue = [];
		for (var i = 0; i < this.rawLevelJSON.entities.length; i++) {
			if (this.rawLevelJSON.entities[i].gridPosition.x == x && this.rawLevelJSON.entities[i].gridPosition.y == y) {
				returnValue.push(this.rawLevelJSON.entities[i]);
			}
		}
		return returnValue;
	};


	Level.prototype.clone = function ( object ) {
		if ( object === undefined ) object = new Level(this._level);
		THREE.Object3D.prototype.clone.call( this, object );
		return object;
	};


	return Level;

});