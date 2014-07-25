define([
		"UTILS",
		"starcrash/controller/controller_graphic",
		"starcrash/objects/level",
		"starcrash/controller/controller_game",
		"starcrash/static/config",
		"starcrash/resource_store",
		"starcrash/controller/controller_ui"
	],
	function(
		UTILS,
		graphics,
		LevelClass,
		GameController,
		config,
		resourceStore,
		UIController
	) {

		/**
		 * Creates a new launcher for the game.
		 * This launcher injects the loading-screen, loads all necessary resources,
		 * injects the game-screen and creates the game controller.
		 *
		 * @param pGameContainerId The id of the dom-element to inject the game to.
		 * @constructor Creates a new instance.
		 */
		var Launcher = function(pGameContainerId) {
			this._gameContainerId = pGameContainerId;
		};


		/**
		 * Continues the game at the last save point.
		 */
		Launcher.prototype.continueGame = function() {
			var levelPath = "levels/level02.json",
				uiController = new UIController(),
				self = this;

			// TODO : get the levelPath depending on save point (web storage).
			// TODO : get player position, inventory etc. (web storage) and create a new player instance.

			UTILS.injectTemplate('js/starcrash/templates/loading_screen.html', self._gameContainerId, function() {
				// loading-screen html-elements are added to dom
				self.loadLevel(levelPath, function(levelInstance) {
					// level-file and the needed assets are loaded
					uiController.injectUI(self._gameContainerId, function() {
						// game-screen html-elements are added to dom
						new GameController(levelInstance, graphics, uiController);
					});
				});
			});
		};

		/**
		 * Starts the intro and the first level.
		 */
		Launcher.prototype.startNewGame = function() {
			// TODO : play intro, start with level 1
		};


		/**
		 * Loads needed resources / assets for the level.
		 * @param levelPath The path of the level.
		 * @param callback The callback on finish.
		 * @private
			 */
		Launcher.prototype.loadLevel = function(levelPath, callback) {
			var domElementLoadingProgressText = document.getElementById("loadingProgressText"),
				tmpLoadedCount = 0,
				levelInstance,
				self = this;

			UTILS.fetchJSONFile(levelPath, function(levelJSON) {
				// raw level file is loaded
				levelInstance = new LevelClass(levelJSON);

				resourceStore.loadLevelResources(levelInstance, function(resourceIndex, resourceCount, resourceDefinition) {
					// on resource loading progress
					if (domElementLoadingProgressText != null) {
						domElementLoadingProgressText.innerHTML = resourceDefinition.id + " (" + tmpLoadedCount + "/" + resourceCount + ")";
					}

					tmpLoadedCount++;

				}, function() {
					// on resource loading finished

					callback(levelInstance);

				});

			});
		};

	return Launcher;
});