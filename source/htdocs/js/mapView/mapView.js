define(["THREE", "engine/graphicController", "config", "engine/Bus", "mapView/GridLine", "mapView/GridWalls"], function(THREE, graphics, config, bus, GridLine, GridWalls) {


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

		graphics.scene.add(this._objectContainer);
	};

	MapView.prototype.animate = function() {
		if (this._visible == true) {

			this.showMapViewObjects();

			graphics.getMapCamera().position.x = this._player.position.x;
			graphics.getMapCamera().position.z = this._player.position.z;

			graphics.applyViewportSettings(graphics.renderer, graphics.getMapCamera());
			graphics.renderer.render(graphics.scene, graphics.getMapCamera());

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
		var length = graphics.getMapCamera().scale.length();
		if (length > 0.3) {
			graphics.getMapCamera().scale.setLength(length - 0.1);
		}
	};

	MapView.prototype.zoomOut = function() {
		var length = graphics.getMapCamera().scale.length();
		if (length < 10) {
			graphics.getMapCamera().scale.setLength(length + 0.1);
		}
	};

	return MapView;

});