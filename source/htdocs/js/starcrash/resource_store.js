define([
	"starcrash/static/config",
	"starcrash/graphic/model_store",
	"starcrash/static/resource_definition",
	"starcrash/static/map_entity_types"],
	function(
		config,
		ModelStore,
		resourceDefinition,
	    mapEntityTypes
		) {

		var singletonInstance;

		var ResourceStore = function() {
			this._modelLoader = new THREE.JSONLoader();

			this._resources = {};

			this._resources["image"] = {};
			this._resources["sound"] = {};
			this._resources["3dmodel"] = {};

			this._resources["3dmodel"]["material"] = {};
			this._resources["3dmodel"]["geometry"] = {};

		};

		/**
		 * Loads the standard resources needed and the resources needed for a assigned level.
		 * @param levelInstance The levels to load resources for.
		 * @param onProgressCallback {Function} A callback for a loading progress. It gets called with this parameters:
		 *                                      {Number} The index of the loaded resource.
		 *                                      {Number} The count of all resources to load.
		 *                                      {ResourceDefinition} The definition of the loaded resource.
		 *
		 * @param onFinishCallback {Function} A callback on finish loading.
		 */
		ResourceStore.prototype.loadResources = function(levelInstance, onProgressCallback, onFinishCallback) {
			var tmpResourceDefinition,
				levelEntityTypes,
				levelResourceIDs,
				resourceIDs = [],
				resourceCount = 0,
				self = this,
				i;

			resourceIDs.push("image_background");

			// add standard resources
			resourceIDs.push("model_aim");
			resourceIDs.push("sound_laser");

			// get a list of entity types needed used in the level.
			levelEntityTypes = levelInstance.getContainingEntityTypes();
			// get a list of resource ids of the level entities.
			levelResourceIDs = this.getResourceIDsByEntityTypes(levelEntityTypes);
			resourceIDs = resourceIDs.concat(levelResourceIDs);
			resourceCount = resourceIDs.length - 1;

			// load every resource..
			for (i = 0; i < resourceIDs.length; i++) {
				this.loadResource(
					resourceIDs[i],
					// closure to pass the current index 'i':
					(function(theIndex){
						// callback function on load:
						return function(loadedResourceDefinition){
							// call the progress callback
							if (onProgressCallback) onProgressCallback(theIndex, resourceCount, loadedResourceDefinition);
							if (theIndex == resourceCount) {
								// cal the finish callback
								onFinishCallback();
							}
						}
					})(i)
				);
			}


		};

		/**
		 * Loads one resource by its id.
		 * @param resourceID The id to load the resource.
		 * @param callback The callback to call if the resource was loaded.
		 */
		ResourceStore.prototype.loadResource = function(resourceID, callback) {
			var resourceDefinition = this._getResourceDefinition(resourceID),
				self = this;

			if (resourceDefinition != null) {
				// error handling
				if (!this._resources[resourceDefinition.type]) {
					console.log("[ResourceStore] Unknown resource type. ", resourceDefinition);
					if (callback) callback(resourceDefinition);
					return;
				}

				// callback if the resource is already loaded
				if (this._resources[resourceDefinition.type][resourceDefinition.id] != null) {
					// resource already loaded.
					if (callback) callback(resourceDefinition);
					return;
				}
				if (resourceDefinition.type == "3dmodel" &&  this._resources["3dmodel"]["geometry"][resourceDefinition.id] != null) {
					// resource already loaded.
					if (callback) callback(resourceDefinition);
					return;
				}


				if (resourceDefinition.type == "sound") {
					// load a sound resource
					var audio = new Audio("sounds/laser.mp3");
					audio.addEventListener('canplaythrough', function() {
						self._resources[resourceDefinition.type][resourceDefinition.id] = audio;
						callback(resourceDefinition);
					});
					audio.load();


				} else if (resourceDefinition.type == "3dmodel") {
					// load a model resource
					this._modelLoader.load(resourceDefinition.url, function (geometry, material) {
						material.shading = THREE.SmoothShading; // TODO : use smooth shading for every material?
						self._resources["3dmodel"]["geometry"][resourceDefinition.id] = geometry;
						self._resources["3dmodel"]["material"][resourceDefinition.id] = material;
						callback(resourceDefinition);

					});

				} else if (resourceDefinition.type == "image") {
					// load a image resource
					var img = new Image();
					img.onload = function () {
						self._resources[resourceDefinition.type][resourceDefinition.id] = img;
						callback(resourceDefinition);
					};
					img.src = resourceDefinition.url;
				}
			}

		};

		/**
		 * Returns an array of resource definitions by an array of ids.
		 * @param resourceIDArray The ids to get the resource definitions.
		 * @returns {Array} An array of resource definitions.
		 * @private
		 */
		ResourceStore.prototype._getResourceDefinitions = function(resourceIDArray) {
			var returnValue = [],
				tmpDefinition,
				i;
			for (i = 0; i < resourceIDArray.length; i++) {
				tmpDefinition = this._getResourceDefinition(resourceIDArray[i]);
				if (tmpDefinition != null) {
					returnValue.push(tmpDefinition);
				}
			}
			return returnValue;
		};

		/**
		 * Returns the resource definition by its id.
		 * @param resourceID The id of the resource definition to get.
		 * @returns {*} The resource definition.
		 * @private
		 */
		ResourceStore.prototype._getResourceDefinition = function(resourceID) {
			for (var i = 0; i < resourceDefinition.length; i++) {

				if (resourceDefinition[i].id == resourceID) {
					return resourceDefinition[i];
				}
			}
			console.log("[ResourceStore] Resource definition for id '" + resourceID + "' was not found.");
			return null;
		};

		ResourceStore.prototype.getImage = function(resourceID) {

		};

		ResourceStore.prototype.getAudio = function(resourceID) {

		};

		ResourceStore.prototype.getGeometry = function(resourceID) {
			return this._resources["3dmodel"]["geometry"][resourceID];
		};

		ResourceStore.prototype.getMaterial = function(resourceID) {
			return this._resources["3dmodel"]["material"][resourceID];
		};


		/**
		 * Gets an array of resources ids that are used by the assigned entity types.
		 * @param {Array} entityTypeArray An array of types.
		 * @return {Array} An array our resources ids.
		 */
		ResourceStore.prototype.getResourceIDsByEntityTypes = function(entityTypeArray) {
			var entityDefinition,
				entityTypeIndex,
				entityType,
				resourceIDs = [],
				i;

			if (!entityTypeArray instanceof Array) {
				console.error("Error getting model files. Use an array as parameter instead of: " + entityTypeArray);
			}

			for (entityTypeIndex = 0; entityTypeIndex < entityTypeArray.length; entityTypeIndex++) {
				entityType = entityTypeArray[entityTypeIndex];
				entityDefinition = this.getEntityDefinition(entityType);

				if (!entityDefinition.models) console.error("Error getting model files. No models defined for entity: " + entityType);
				for (i = 0; i < entityDefinition.models.length; i++) {
					resourceIDs.push(entityDefinition.models[i].resourceID);
				}
			}

			return resourceIDs;
		};


		/**
		 * Gets the entity definition by its type.
		 * @param entityType The type of the entity.
		 * @returns {*} The definition.
		 */
		ResourceStore.prototype.getEntityDefinition = function(entityType) {
			var tmpDefinition,
				i;
			for (i = 0; i < mapEntityTypes.length; i++) {
				tmpDefinition = mapEntityTypes[i];
				if (tmpDefinition.type == entityType) {
					return tmpDefinition;
				}
			}
			console.error("Error loading entity. No entity definition found for entity type: " + entityType);
			return null;
		};


		singletonInstance = new ResourceStore();
		return singletonInstance;

});