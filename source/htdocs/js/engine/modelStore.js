define(["THREE", "entities/entityDefinition"], function(THREE, entityDefinition) {

	var singletonInstance;

	var ModelStore = function() {
		this.jsonLoader = new THREE.JSONLoader();
		this.geometries = {};
		this.materials = {};

	};

	ModelStore.prototype.load = function(modelNameList, callback) {
		var self = this,
			i;

		for (i = 0; i < modelNameList.length; i++) {

			// do not load the same model more than once.
			if (self.geometries[modelNameList[i]] == null && self.materials[modelNameList[i]] == null) {

				(function(i) {
					self.jsonLoader.load(modelNameList[i], function (geometry, material) {

						//geometry.computeVertexNormals();
						//geometry.computeFaceNormals();

						material.shading = THREE.SmoothShading; // TODO : ..

						self.geometries[modelNameList[i]] = geometry;
						self.materials[modelNameList[i]] = material;

						if (i === modelNameList.length - 1) {
							// TODO: yeah, this kinda sucks, but else it will f**k up the last loaded model
							setTimeout(function() {
								callback(self.geometries, self.materials);
							}, 200);
						}
					});
				})(i);
			}
		}
	};

	ModelStore.prototype.getGeometry = function(modelName) {
		return this.geometries[modelName];
	};

	ModelStore.prototype.getMaterial = function(modelName) {
		return this.materials[modelName];
	};

	/**
	 * Gets a list of model-files that the entities use.
	 * @param entityTypeArray An array of types.
	 */
	ModelStore.prototype.getModelFileList = function(entityTypeArray) {
		var entityDefinition,
			entityTypeIndex,
			entityType,
			fileList = [],
			i;

		if (!entityTypeArray instanceof Array) {
			console.error("Error getting model files. Use an array as parameter instead of: " + entityTypeArray);
		}

		for (entityTypeIndex = 0; entityTypeIndex < entityTypeArray.length; entityTypeIndex++) {
			entityType = entityTypeArray[entityTypeIndex];
			entityDefinition = this.getEntityDefinition(entityType);

			if (!entityDefinition.models) console.error("Error getting model files. No models defined for entity: " + entityType);
			for (i = 0; i < entityDefinition.models.length; i++) {
				fileList.push(entityDefinition.models[i].file);
			}
		}

		return fileList;
	};

	/**
	 * Gets the entity definition by its type.
	 * @param entityType The type of the entity.
	 * @returns {*} The definition.
	 */
	ModelStore.prototype.getEntityDefinition = function(entityType) {
		var tmpDefinition,
			i;
		for (i = 0; i < entityDefinition.length; i++) {
			tmpDefinition = entityDefinition[i];
			if (tmpDefinition.type == entityType) {
				return tmpDefinition;
			}
		}
		console.error("Error loading entity. No entity definition found for entity type: " + entityType);
		return null;
	};

	singletonInstance = new ModelStore();
	return singletonInstance;


});