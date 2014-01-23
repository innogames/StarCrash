define(["THREE", "engine/engine"], function(THREE, engine) {
	return function loader(callback) {
		var that = this,
			geometries = {},
			materials = {},
			jsonLoader = new THREE.JSONLoader(),
			modelList = ['xcube', 'icube', 'aim'],
			i;

		for (i = 0; i < modelList.length; i++) {
			(function(i) {
				jsonLoader.load("models/" + modelList[i] + ".js", function (geometry, material) {
					geometries[modelList[i]] = geometry;
					materials[modelList[i]] = material;


					// last model loaded -> add geometries to scene
					if (i === modelList.length - 1) {
						// TODO: yeah, this kinda sucks, but else it will f**k up the last loaded model
						setTimeout(function() {
							callback(geometries, materials);
						}, 200);
					}
				});
			})(i);
		}
	};
});