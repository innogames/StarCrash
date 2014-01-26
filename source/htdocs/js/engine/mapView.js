define(["THREE", "engine/engine", "config", "engine/bus"], function(THREE, engine, config, bus) {


	var MapView = function(pPlayer) {
		this.player = pPlayer;
		this.objectContainer = new THREE.Object3D();
		this.objectContainer.name = "Map View Objects";
		this.objectContainer.visible = false;

		bus.subscribe(bus.EVENT_INPUT_ZOOM_IN_MAP, this.zoomIn);
		bus.subscribe(bus.EVENT_INPUT_ZOOM_OUT_MAP, this.zoomOut);

		var material = new THREE.LineBasicMaterial({
			color: 0xffffff,
			opacity: 0.2,
			transparent : true
		});

		var geometry = new THREE.Geometry();

		geometry.vertices.push(new THREE.Vector3(0, 0, 0));

		var levelWidth = 10;
		var levelHeight = 10;

		for (var i = 0; i <= levelHeight; i = i + 2) {
			geometry.vertices.push(new THREE.Vector3(i * config.gridCellSize		, 100		, 0));
			geometry.vertices.push(new THREE.Vector3(i * config.gridCellSize		, 100		, levelHeight * config.gridCellSize));
			geometry.vertices.push(new THREE.Vector3((i + 1) * config.gridCellSize	, 100		, levelHeight * config.gridCellSize));
			geometry.vertices.push(new THREE.Vector3((i + 1) * config.gridCellSize	, 100		, 0));
			geometry.vertices.push(new THREE.Vector3((i + 2) * config.gridCellSize	, 100		, 0));
		}

		for (var ii = 0; ii <= levelWidth; ii = ii + 2) {
			geometry.vertices.push(new THREE.Vector3(0									, 100		, ii * config.gridCellSize));
			geometry.vertices.push(new THREE.Vector3(levelWidth * config.gridCellSize	, 100		, ii * config.gridCellSize));
			geometry.vertices.push(new THREE.Vector3(levelWidth * config.gridCellSize	, 100		, (ii + 1) * config.gridCellSize));
			geometry.vertices.push(new THREE.Vector3(0									, 100		, (ii + 1) * config.gridCellSize));
			geometry.vertices.push(new THREE.Vector3(0									, 100		, (ii + 2) * config.gridCellSize));
		}

		this.testObj = new THREE.Line(geometry, material);

		this.testObj.position.x -= config.gridCellSize / 2;
		this.testObj.position.z -= config.gridCellSize / 2;

		this.objectContainer.add(this.testObj);

		engine.scene.add(this.objectContainer);

	};

	MapView.prototype.render = function() {
		this.testObj.visible = true;



		engine.getMapCamera().position.x = this.player.position.x;
		engine.getMapCamera().position.z = this.player.position.z;

		engine.applyViewportSettings(engine.renderer, engine.getMapCamera());
		engine.renderer.render(engine.scene, engine.getMapCamera());

		this.testObj.visible = false;
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