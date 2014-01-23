define(["THREE"], function(THREE) {

	var jsonLoader = new THREE.JSONLoader(),
		geometries = {},
		materials = {};

	return {

		load : function(modelNameList, callback) {
			var i;

			for (i = 0; i < modelNameList.length; i++) {
				(function(i) {
					jsonLoader.load("models/" + modelNameList[i] + ".js", function (geometry, material) {

						geometry.computeVertexNormals();
						geometry.computeFaceNormals();

						material.shading = THREE.SmoothShading;

						geometries[modelNameList[i]] = geometry;
						materials[modelNameList[i]] = material;

						if (i === modelNameList.length - 1) {
							// TODO: yeah, this kinda sucks, but else it will f**k up the last loaded model
							setTimeout(function() {
								callback(geometries, materials);
							}, 200);
						}
					});
				})(i);
			}
		},

		getGeometry : function(modelName) {
			return geometries[name];
		},

		getMaterial : function(modelName) {
			return materials[name];
		}

	}

});