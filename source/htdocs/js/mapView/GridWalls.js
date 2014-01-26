define(["THREE"], function(THREE) {

	var GridWalls = function (pLevel, pGridCellSize) {

		THREE.Object3D.call(this);

		this._level = pLevel;
		this._gridCellSize = pGridCellSize;

		this.wallGeometry = new THREE.PlaneGeometry(this._gridCellSize, this._gridCellSize / 10);
		this.wallMaterial = new THREE.MeshBasicMaterial({	color: 0x999999	});




		//this.add(this.createWallPlane());


	};

	GridWalls.prototype.createWallPlane = function() {
		var plane = new THREE.Mesh(this.wallGeometry, this.wallMaterial);
		plane.rotation.x = - Math.PI / 2;
		plane.position.x -= this._gridCellSize / 2;
		plane.position.y = 100;
		return plane;
	};

	/**
	 * Inherits from THREE.Object3D
	 * @type {*}
	 */
	GridWalls.prototype = Object.create( THREE.Object3D.prototype );

	GridWalls.prototype.clone = function ( object ) {
		if ( object === undefined ) object = new GridWalls(this._level, this._gridCellSize);
		THREE.Object3D.prototype.clone.call( this, object );
		return object;
	};

	return GridWalls;

});