define([
		"THREE",
		"starcrash/static/constants",
		"starcrash/static/config"
	], function(
		THREE,
		constants,
		config
	) {

	/**
	 * An object 3d containing meshes that representing the walls of a level.
	 * @param pLevel The level to get wall information from.
	 * @constructor Creates a new instance.
	 */
	var GridWalls = function (pLevel) {
		THREE.Object3D.call(this);
		this._level = pLevel;
		this.wallGeometry = new THREE.PlaneGeometry(config.gridCellSize, config.gridCellSize / 10);
		this.wallMaterial = new THREE.MeshBasicMaterial({	color: 0x999999	});
		this.update();
	};

	/**
	 * Inherits from THREE.Object3D
	 * @type {*}
	 */
	GridWalls.prototype = Object.create( THREE.Object3D.prototype );

	/**
	 * Updates the walls depending on the level.
	 * Iterates through the whole level and adds new meshes.
	 * This is expensive. Call this only if the walls have changed.
	 * // TODO : merge geometries for performance
	 * // TODO : maybe subscribe this to an event like: event_level_walls_changed?
	 */
	GridWalls.prototype.update = function() {
		this.clear();
		for (var x = -1; x <= this._level.getWidth(); x++) {
			for (var z = 1; z >= -this._level.getHeight(); z--) {
				if(this._level.isWallBetween(x, z, x -1, z)) {
					this.add(this.createWallPlane(x, z, constants.NEGATIVE_X));
				}
				if(this._level.isWallBetween(x, z, x, z - 1)) {
					this.add(this.createWallPlane(x, z, constants.NEGATIVE_Z));
				}
			}
		}
	};

	/**
	 * Clears all walls.
	 */
	GridWalls.prototype.clear = function() {
		while (this.children.length > 0) {
			this.remove(this.children[0]);
		}
	};

	/**
	 * Creates a new plane representing a wall at the
	 * assigned grid position and direction.
	 *
	 * @param gridX The grid x coordinate.
	 * @param gridZ The grid y coordinate.
	 * @param direction The direction (defined in constants).
	 * @returns {THREE.Mesh}
	 */
	GridWalls.prototype.createWallPlane = function(gridX, gridZ, direction) {
		var plane = new THREE.Mesh(this.wallGeometry, this.wallMaterial);
		plane.rotation.x = - Math.PI / 2;
		plane.position.x = (gridX * config.gridCellSize) + (config.gridCellSize / 2);
		plane.position.z = (gridZ * config.gridCellSize);
		plane.position.y = config.mapViewElementsY;

		if (direction == constants.NEGATIVE_Z) {
			plane.position.z -= config.gridCellSize;
		} else if (direction == constants.NEGATIVE_X) {
			plane.rotation.z = Math.PI / 2;
			plane.position.x -= config.gridCellSize / 2;
			plane.position.z -= config.gridCellSize / 2;
		}
		return plane;
	};

	GridWalls.prototype.clone = function ( object ) {
		if ( object === undefined ) object = new GridWalls(this._level);
		THREE.Object3D.prototype.clone.call( this, object );
		return object;
	};

	return GridWalls;

});