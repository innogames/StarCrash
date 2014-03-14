define([
		"THREE",
		"starcrash/objects/map_entity",
		"starcrash/objects/creatures/enemy"
	], function(
		THREE,
		Entity,
        Enemy
	) {

	/**
	 * Constructor of a level.
	 * @param pLevelJSON The level data.
	 * @constructor
	 */
	var Level = function(pLevelJSON) {

		THREE.Object3D.call(this);

		this._rawLevelJSON = pLevelJSON;

		if (!this._rawLevelJSON) 			console.error("Error loading level. Level json is null.");
		if (!this._rawLevelJSON.entities) 	console.error("Error loading level. The level data got no entities: ", this._rawLevelJSON);
		if (!this._rawLevelJSON.grid) 		console.error("Error loading level. Grid is not defined: ", this._rawLevelJSON);

		this._entityLookupList = {}; // a list that maps a grid coordinate key (e.g. 'x9y2') to all entities at this position.


		var testCube = new THREE.Mesh(new THREE.CubeGeometry(10,10,10), new THREE.MeshLambertMaterial({	color: 0x000055	}));
		testCube.position.z = -785;
		testCube.position.y = 5;
		testCube.position.x = 300;


		this.receiveShadow = true;
		this.castShadow = true;

		this._enemies = [];


	};

	/**
	 * Inherits from THREE.Object3D
	 * @type {*}
	 */
	Level.prototype = Object.create( THREE.Object3D.prototype );


	/**
	 * Initializes the entities (incl. the graphics). This depends on loading all needed models before.
	 */
	Level.prototype.initEntities = function() {
		var tmpEntityInstance,
			tmpRawEntityInfo,
			i;

		// loop through all entities of the level
		for (i = 0; i < this._rawLevelJSON.entities.length; i++) {
			tmpRawEntityInfo = this._rawLevelJSON.entities[i];
			tmpEntityInstance = new Entity(tmpRawEntityInfo);
			this.add(tmpEntityInstance);
			this._addToLookupList(tmpEntityInstance);
		}

		// TODO: get the enemies from the level.
		this._enemies.push(new Enemy(0, -5, "myEnemyId1"));
		this._enemies.push(new Enemy(5, -1, "myEnemyId2"));

		var enemyDirection = new THREE.Vector3(0, 0, 1);
		this._enemies.push(new Enemy(0, -3, "myEnemyId3", enemyDirection));


		for (i = 0; i < this._enemies.length; i++) {
			this.add(this._enemies[i]);
		}
	};

	/**
	 * Returns an array of entity types that are in this level.
	 */
	Level.prototype.getContainingEntityTypes = function() {
		var entityTypes = [],
			tmpType,
			i;

		for (i = 0; i < this._rawLevelJSON.entities.length; i++) {
			tmpType = this._rawLevelJSON.entities[i].type;
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
		var directionToCheck1,
			directionToCheck2,
			entitiesToCheck1,
			entitiesToCheck2,
			entityIndex,
			tmpEntity;

		// create directions for both grid cells
		directionToCheck1 = new THREE.Vector3(grid2X - grid1X, 0, grid1Z - grid2Z);
		directionToCheck2 =  directionToCheck1.clone().negate();
		if (directionToCheck1.length() != 1 || directionToCheck2.length() != 1) {
			//console.log("Error checking for walls. The grid positions to check are no neighbours. x1:" + grid1X + " z1:" + grid1Z + " x2:" + grid2X + " z2:" + grid2Z);
			return false;
		}

		// get the entities at the positions
		entitiesToCheck1 = this.getEntitiesAt(grid1X, grid1Z);
		entitiesToCheck2 = this.getEntitiesAt(grid2X, grid2Z);

		// check walls for the first grid cell
		if (entitiesToCheck1 != null) {
			for (entityIndex = 0; entityIndex < entitiesToCheck1.length; entityIndex++) {
				tmpEntity = entitiesToCheck1[entityIndex];
				if (tmpEntity.isWallAt(grid1X, grid1Z, directionToCheck1)) {
					return true;
				}
			}
		}

		// check walls for the second grid cell
		if (entitiesToCheck2 != null) {
			for (entityIndex = 0; entityIndex < entitiesToCheck2.length; entityIndex++) {
				tmpEntity = entitiesToCheck2[entityIndex];
				if (tmpEntity.isWallAt(grid2X, grid2Z, directionToCheck2)) {
					return true;
				}
			}
		}

		return false;

	};

	/**
	 * Gets the width of the level.
	 * @returns The width f the level.
	 */
	Level.prototype.getWidth = function() {
		return this._rawLevelJSON.grid.width;
	};

	/**
	 * Gets the height of the level.
	 * @returns The height f the level.
	 */
	Level.prototype.getHeight = function() {
		return this._rawLevelJSON.grid.height;
	};

	/**
	 * Gets an array of entity that are at this grid position.
	 * @param x The grid x-position.
	 * @param y The grid y-position.
	 */
	Level.prototype.getEntitiesAt = function(x, y) {
		return this._entityLookupList[this._getGridKey(x, y)];
	};

	/**
	 * Adds the entity to a lookup list. This list maps the entity-grid-position (as a key: 'x9y2')
	 * to an array of entities at this position. This list can be used to easy find all
	 * entities at a position.
	 * Attention:   Entities that are bigger than one grid cell are added to every overlapping coordinate.
	 *              Take care of the entity origin in some cases.
	 * @private
	 */
	Level.prototype._addToLookupList = function(entity) {
		var entitySizeX = entity.getSize().x,
			entitySizeZ = entity.getSize().z,
			gridKey,
			x,
			z;

		// add the entity to every cell position it overlaps.
		for (x = 0; x < entitySizeX; x++) {
			for (z = 0; z > -entitySizeZ; z--) {
				gridKey = this._getGridKey(entity.getGridX() + x, entity.getGridZ() + z);
				if (this._entityLookupList[gridKey] == null) {
					this._entityLookupList[gridKey] = [];
				}
				this._entityLookupList[gridKey].push(entity);
			}
		}

	};

	/**
	 * Gets the key of the grid position (e.g. 'x2y9').
	 * @returns {string} The key of the grid position.
	 */
	Level.prototype._getGridKey = function(gridX, gridZ) {
		return "x" + gridX + "z" + gridZ;
	};


	Level.prototype.clone = function ( object ) {
		if ( object === undefined ) object = new Level(this._level);
		THREE.Object3D.prototype.clone.call( this, object );
		return object;
	};

	Level.prototype.getEnemies = function() {
		return this._enemies;
	};


	Level.prototype.removeEnemy = function(gameId) {
		for (var i = 0; i < this._enemies.length; i++) {
			if (this._enemies[i].getGameId() == gameId) {
				this.remove(this._enemies[i]);
				this._enemies.splice(i, 1);
				return;
			}
		}
	};


	return Level;

});