define(["engine/Bus"], function(bus) {


	/**
	 * A top down view of the level. Displayed in dom elements.
	 * @see uimap.css
	 * @param pLevel The level.
	 * @param pPlayer The player.
	 * @constructor
	 */
	var UIMap = function(pLevel, pPlayer) {
		var uiMapContainerId = "UIMap",
			uiMapContainer,
			tmpArray,
			tmpMapElement
			self = this;

		this.level = pLevel;
		this.player = pPlayer;

		if(!this.level) console.error("Error creating UIMap. Level is null.");
		if(!this.player) console.error("Error creating UIMap. Player is null.");
		uiMapContainer = document.getElementById(uiMapContainerId);
		if(!uiMapContainer) console.error("Error creating UIMap. Can not find dom element with this id: " + uiMapContainerId);
		uiMapContainer.innerHTML = "";

		this.gridElements = [];

		// initialize dom element references
		for (var y = 0; y < this.level.getHeight(); y++) {
			tmpArray = [];
			for (var x = 0; x < this.level.getWidth(); x++) {
				tmpMapElement = document.createElement('div');
				tmpArray.push(tmpMapElement);
				uiMapContainer.appendChild(tmpMapElement);
			}
			this.gridElements.push(tmpArray);
		}

		this.update();


		bus.subscribe(bus.EVENT_PLAYER_MOVED, function(param) {
			self.update();
		})
	};

	/**
	 * Updates the map depending on the level entities.
	 */
	UIMap.prototype.update = function() {
		var tmpRowArray,
			domElementGirdCell,
			entitiesGridCell;

		console.log("Update UIMap");

		for (var y = 0; y < this.gridElements.length; y++) {
			tmpRowArray = this.gridElements[y];
			for (var x = 0; x < tmpRowArray.length; x++) {
				domElementGirdCell = tmpRowArray[x];


				domElementGirdCell.setAttribute("class", "uimap-grid-element");
				domElementGirdCell.innerHTML = " ";
				if (x == 0) {
					domElementGirdCell.className = domElementGirdCell.className + " clear-floating";
				}


				if(x == this.player.getGridPosition().x && y == this.player.getGridPosition().z) {
					domElementGirdCell.className = domElementGirdCell.className + " uimap-player";
				} else {
					entitiesGridCell = this.level.getEntitiesAt(x, y);
					if (entitiesGridCell != null) {
						if (entitiesGridCell.length > 0) {
							domElementGirdCell.className = domElementGirdCell.className + " uimap-corridor";

						}
					}
				}


			}

		}
	};


	return UIMap;

});