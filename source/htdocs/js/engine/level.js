define(["THREE", "entities/entityDefinition"], function(THREE, entityDefinition) {

	/**
	 * Constructor of a level.
	 * @param pLevelJSON The level data.
	 * @constructor
	 */
	var Level = function(pLevelJSON) {
		var tmpRawEntity,
			defIndex,
			i;

		this.rawLevelJSON = pLevelJSON;
		this.entities = [];

		if (!this.rawLevelJSON) 			console.error("Error loading level. Level json is null.");
		if (!this.rawLevelJSON.entities) 	console.error("Error loading level. The level data got no entities: ", this.rawLevelJSON);
		if (!this.rawLevelJSON.grid) 		console.error("Error loading level. Grid is not defined: ", this.rawLevelJSON);


		// Loading all entities of the level
		for (i = 0; i < this.rawLevelJSON.entities.length; i++) {
			tmpRawEntity = this.rawLevelJSON.entities[i];
			if (! tmpRawEntity.type) 	console.error("Error loading level. Entity 'type' is not defined in level data. ", tmpRawEntity);
			if (! tmpRawEntity.id) 		console.error("Error loading level. Entity 'id' is not defined in level data. ", tmpRawEntity);
			// Add the entity definition.
			for (defIndex = 0; defIndex < entityDefinition.length; defIndex++) {
				if (entityDefinition[defIndex].type == tmpRawEntity.type) {
					tmpRawEntity.definition = {};
					tmpRawEntity.definition = entityDefinition[defIndex];
				}
			}
			if (! tmpRawEntity.definition) console.error("Error loading level. The Entity of type '" + tmpRawEntity.type + "' has no definition: ", entityDefinition);
			this.entities.push(tmpRawEntity);
		}
		console.log("Level initialized. Entities: ", this.entities);
	};


	/**
	 * Returns an array of model names that are in this level.
	 * // TODO : implementation
	 */
	Level.prototype.getContainingModelNames = function() {
		return ['xcube', 'icube'];
	};


	Level.prototype.isWallBetween = function(gridPosition1, gridPosition2) {
		return true;
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
		for (var i = 0; i < this.entities.length; i++) {
			if (this.entities[i].gridPosition.x == x && this.entities[i].gridPosition.y == y) {
				returnValue.push(this.entities[i]);
			}
		}
		return returnValue;
	};

	return Level;

});