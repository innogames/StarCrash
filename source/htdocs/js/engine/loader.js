define(["THREE", "engine/player", "engine/engine"], function(THREE, player, engine) {
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

					// is player model
					if (modelList[i] === 'aim') {
						// create mesh
						materials['aim'].shading = THREE.SmoothShading;

						// and add save it as the players model
						player.model = new THREE.Mesh(geometries['aim'], new THREE.MeshFaceMaterial( materials['aim'] ));
						player.model.geometry.computeVertexNormals();
						player.model.geometry.computeFaceNormals();

						// add mesh to scene
						engine.scene.add(player.model);
					}

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