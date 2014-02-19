define([
		"UTILS",
		"starcrash/controller/controller_graphic",
		"starcrash/objects/level",
		"starcrash/controller/controller_game",
		"starcrash/static/config",
		"starcrash/graphic/model_store"
	],
	function(
		UTILS,
		graphics,
		LevelClass,
		GameController,
		config,
	    modelStore
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
				self = this;

			// TODO : get the levelPath depending on save point (web storage).
			// TODO : get player position, inventory etc. (web storage) and create a new player instance.

			UTILS.injectTemplate('js/starcrash/templates/loading_screen.html', self._gameContainerId, function() {
				// loading-screen html-elements are added to dom
				self._loadResources(levelPath, function(levelInstance) {
					// level-file and the needed assets are loaded
					UTILS.injectTemplate('js/starcrash/templates/game_screen.html', self._gameContainerId, function() {
						// game-screen html-elements are added to dom
						new GameController(levelInstance, graphics);
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
		Launcher.prototype._loadResources = function(levelPath, callback) {
			var modelsToLoad = [],
				levelInstance;

			UTILS.fetchJSONFile(levelPath, function(levelJSON) {
				// raw level file is loaded
				levelInstance = new LevelClass(levelJSON);
				modelsToLoad = modelStore.getModelFileList(levelInstance.getContainingEntityTypes());
				modelsToLoad.push("models/aim.js"); // hack.. add the player model

				modelStore.load(modelsToLoad, function() {
					// models of the level are loaded

					// TODO : remove this hack to play the laser sound.
					window.laserSoundHack = new Audio("sounds/laser.mp3");
					laserSoundHack.load();
					laserSoundHack.addEventListener('canplaythrough', function() {
						callback(levelInstance);
					});

				});

			});
		};

	return Launcher;
});