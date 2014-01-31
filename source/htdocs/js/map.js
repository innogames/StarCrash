define([], function() {


	var MapController = function Map(pLevelData) {
		this.levelData = pLevelData;

		this.corridorMap = [];


		// initialize collisionMap in the size of the map (every grid item contains 3 cells)
		for (var i = 0; i < this.levelData.size.gridHeight; i++) {
			var tmpArray = [];
			for (var ii = 0; ii < this.levelData.size.gridWidth; ii++) {
				tmpArray.push(null);
			}
			this.corridorMap.push(tmpArray);
		}

		// iterate through the corridors of the map
		for(var i = 0; i < this.levelData.entities.corridors.length; i++) {

			var corridorInfo = this.levelData.entities.corridors[i];
			var corridorDefinition = corridorLoader.getCorridorDefinition(corridorInfo.type);


			this.corridorMap[corridorInfo.position.gridX][corridorInfo.position.gridY] = corridorDefinition;

			var corridorShape = corridorDefinition.shape;

			// copy the corridor shape to the collision map
			for (var sx = 0; sx < corridorShape.length; sx++) {
				for (var sy = 0; sy < corridorShape[sx].length; sy++) {
					this.collisionMap[corridorInfo.position.gridX + sx][corridorInfo.position.gridY + sy] = corridorShape[sx][sy];
				}
			}

		}

	};

	MapController.prototype.load = function() {
		this.map;

	};

	return MapController;

});