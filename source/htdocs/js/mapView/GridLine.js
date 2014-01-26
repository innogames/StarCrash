define(["THREE"], function(THREE) {

	/**
	 * Creates a new GridLine by its line counts and grid cell size.
	 * Inherits from THREE.Line.
	 *
	 * @param pLineCountX The count of lines in x direction.
	 * @param pLineCountZ The count of lines in z direction.
	 * @param pGridCellSize The size of a cell.
	 * @constructor Creates a new instance.
	 */

	var GridLine = function (pLineCountX, pLineCountZ, pGridCellSize) {

		THREE.Line.call( this );

		this._lineCountX = pLineCountX;
		this._lineCountZ = pLineCountZ;
		this._gridCellSize = pGridCellSize;

		this.geometry = new THREE.Geometry();
		this.material = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.2, transparent : true });

		this.type = THREE.LinePieces;

		// create the geometry
		for (var x = 0; x <= this._lineCountX; x++) {
			this.geometry.vertices.push(new THREE.Vector3(x * this._gridCellSize, 100, 0));
			this.geometry.vertices.push(new THREE.Vector3(x * this._gridCellSize, 100, this._lineCountZ * this._gridCellSize));
		}
		for (var z = 0; z <= this._lineCountZ; z++) {
			this.geometry.vertices.push(new THREE.Vector3(0									, 100, z * this._gridCellSize));
			this.geometry.vertices.push(new THREE.Vector3(this._lineCountX * this._gridCellSize, 100, z * this._gridCellSize));
		}
	};

	GridLine.prototype = Object.create( THREE.Line.prototype );

	GridLine.prototype.clone = function ( object ) {
		if ( object === undefined ) object = new GridLine( this._lineCountX, this._lineCountZ, this._gridCellSize );
		THREE.Line.prototype.clone.call( this, object );
		return object;
	};

	return GridLine;

});