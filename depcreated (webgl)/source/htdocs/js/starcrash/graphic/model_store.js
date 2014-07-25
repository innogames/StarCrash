define([
		"THREE"
	], function(
		THREE
	) {

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


	return ModelStore;


});