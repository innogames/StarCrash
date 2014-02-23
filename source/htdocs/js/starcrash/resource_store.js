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
			this._resources["audio"] = {};
			this._resources["3dmodel"] = {};

			this._resources["3dmodel"]["material"] = {};
			this._resources["3dmodel"]["geometry"] = {};

		};

		/**
		 * Loads the standard resources needed and the resources needed for the assigned level.
		 * Does not load already loaded resources again (progress and finish callbacks will be called anyway).
		 *
		 * @param levelInstance The levels to load resources for.
		 * @param onProgressCallback {Function} A callback for a loading progress. It gets called with this parameters:
		 *                                      {Number} The index of the loaded resource.
		 *                                      {Number} The count of all resources to load.
		 *                                      {ResourceDefinition} The definition of the loaded resource.
		 *
		 * @param onFinishCallback {Function} A callback on finish loading.
		 */
		ResourceStore.prototype.loadLevelResources = function(levelInstance, onProgressCallback, onFinishCallback) {
			var levelEntityTypes,
				levelResourceIDs,
				resourceIDs = [],
				i;

			// add standard resources
			for (i = 0; i < config.standardResources.length; i++) {
				resourceIDs.push(config.standardResources[i]);
			}

			// get a list of entity types needed used in the level.
			levelEntityTypes = levelInstance.getContainingEntityTypes();
			// get a list of resource ids of the level entities.
			levelResourceIDs = this.getResourceIDsByEntityTypes(levelEntityTypes);
			resourceIDs = resourceIDs.concat(levelResourceIDs);

			this.loadResources(resourceIDs, onProgressCallback, onFinishCallback);
		};


		/**
		 * Loads multiple resources by an array of resource ids.
		 * Does not load already loaded resources again (progress and finish callbacks will be called anyway).
		 *
		 * @param resourceIDs The resources to load.
		 * @param onProgressCallback {Function} A callback for a loading progress. It gets called with this parameters:
		 *                                      {Number} The index of the loaded resource.
		 *                                      {Number} The count of all resources to load.
		 *                                      {ResourceDefinition} The definition of the loaded resource.
		 *
		 * @param onFinishCallback {Function} A callback on finish loading.
		 */
		ResourceStore.prototype.loadResources = function(resourceIDs, onProgressCallback, onFinishCallback) {
			var resourceCount = resourceIDs.length - 1,
				i;

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
								// call the finish callback
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
			var resourceDefinition = this.getResourceDefinition(resourceID),
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


				if (resourceDefinition.type == "audio") {
					// load a audio resource
					var audio = new Audio(resourceDefinition.url);
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
				tmpDefinition = this.getResourceDefinition(resourceIDArray[i]);
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
		ResourceStore.prototype.getResourceDefinition = function(resourceID) {
			for (var i = 0; i < resourceDefinition.length; i++) {

				if (resourceDefinition[i].id == resourceID) {
					return resourceDefinition[i];
				}
			}
			console.log("[ResourceStore] Resource definition for id '" + resourceID + "' was not found.");
			return null;
		};

		/**
		 * Gets a preloaded image.
		 * @param resourceID The resource id of the image.
		 * @returns {Image} The image or null.
		 */
		ResourceStore.prototype.getImage = function(resourceID) {
			var returnValue = this._resources["image"][resourceID];
			if (returnValue == null) {
				console.log("[ResourceStore] The requested image has not been preloaded. ", resourceID);
			}
			return returnValue;
		};

		/**
		 * Gets a preloaded audio.
		 * @param resourceID The resource id of the audio.
		 * @returns {Audio} The audio or null.
		 */
		ResourceStore.prototype.getAudio = function(resourceID) {
			var returnValue = this._resources["audio"][resourceID];
			if (returnValue == null) {
				console.log("[ResourceStore] The requested audio has not been preloaded. ", resourceID);
			}
			return returnValue;
		};

		/**
		 * Gets a preloaded geometry.
		 * @param resourceID The resource id of the geometry.
		 * @returns {THREE.Geometry} The geometry or null.
		 */
		ResourceStore.prototype.getGeometry = function(resourceID) {
			var returnValue = this._resources["3dmodel"]["geometry"][resourceID];
			if (returnValue == null) {
				console.log("[ResourceStore] The requested geometry has not been preloaded. ", resourceID);
			}
			return returnValue;
		};

		ResourceStore.prototype.getMaterial = function(resourceID) {
			var returnValue = this._resources["3dmodel"]["material"][resourceID];
			if (returnValue == null) {
				console.log("[ResourceStore] The requested material has not been preloaded. ", resourceID);
			}
			return returnValue;
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
				console.error("[ResourceStore] Error getting resource ids. Use an array as parameter instead of: " + entityTypeArray);
			}

			for (entityTypeIndex = 0; entityTypeIndex < entityTypeArray.length; entityTypeIndex++) {
				entityType = entityTypeArray[entityTypeIndex];
				entityDefinition = this.getEntityDefinition(entityType);
				if (!entityDefinition.models) console.error("[ResourceStore] Error getting resource ids. No models defined for entity: " + entityType);
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
			console.error("[ResourceStore] Error getting entity definition. No entity definition found for entity type: " + entityType);
			return null;
		};


		singletonInstance = new ResourceStore();
		return singletonInstance;

});