define(["THREE", "engine/engine", "config", "engine/bus", "mapView/GridLine", "mapView/GridWalls"], function(THREE, engine, config, bus, GridLine, GridWalls) {


	var MapView = function(pPlayer, pLevel) {
		this._player = pPlayer;
		this._level = pLevel;
		this._visible = true;
		this._objectContainer = new THREE.Object3D();
		this._objectContainer.name = "Map View Objects";
		this._objectContainer.visible = false;
		this.hideMapViewObjects();

		bus.subscribe(bus.EVENT_INPUT_ZOOM_IN_MAP, this.zoomIn);
		bus.subscribe(bus.EVENT_INPUT_ZOOM_OUT_MAP, this.zoomOut);

		this._objectContainer.add(new GridLine(this._level.getWidth(), this._level.getHeight(), config.gridCellSize));
		this._objectContainer.add(new GridWalls(this._level));

		engine.scene.add(this._objectContainer);
	};

	MapView.prototype.render = function() {
		if (this._visible == true) {

			this.showMapViewObjects();

			engine.getMapCamera().position.x = this._player.position.x;
			engine.getMapCamera().position.z = this._player.position.z;

			engine.applyViewportSettings(engine.renderer, engine.getMapCamera());
			engine.renderer.render(engine.scene, engine.getMapCamera());

			this.hideMapViewObjects();
		}
	};

	/**
	 * Hides the map view.
	 */
	MapView.prototype.hide = function() {
		this._visible = false;
	};

	/**
	 * Shows the map view.
	 */
	MapView.prototype.show = function() {
		this._visible = true;
	};

	/**
	 * Hides objects that are visible only for the map view. (e.g. grid)
	 */
	MapView.prototype.hideMapViewObjects = function() {
		this._objectContainer.traverse(function (child) {
			child.visible = false;
		});
	};

	/**
	 * Shows objects that are visible only for the map view. (e.g. grid)
	 */
	MapView.prototype.showMapViewObjects = function() {
		this._objectContainer.traverse(function (child) {
			child.visible = true;
		});
	};

	MapView.prototype.zoomIn = function() {
		var length = engine.getMapCamera().scale.length();
		if (length > 0.3) {
			engine.getMapCamera().scale.setLength(length - 0.1);
		}
	};

	MapView.prototype.zoomOut = function() {
		var length = engine.getMapCamera().scale.length();
		if (length < 10) {
			engine.getMapCamera().scale.setLength(length + 0.1);
		}
	};

	return MapView;

});