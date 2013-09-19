var world = {
	cubes: ['xcube', 'icube'],
	cubeLen: 157.4,
	lights: [],
	map: [
		['x_0', 'i_90', 'x_0', 'i_90', 'x_0'],
		['i_0',     0,  'i_0',     0,  'i_0'],
		['x_0', 'i_90', 'x_0', 'i_90', 'x_0'],
		['i_0',     0,  'i_0',     0,  'i_0'],
		['x_0', 'i_90', 'x_0', 'i_90', 'x_0']
	],

	addLight: function addLight(xPos, zPos) {
		var intensity = 2.5,
			distance = 340,
			colors = new Array(0xff0040, 0x0040ff, 0x80ff80, 0xffaa00, 0x00ffaa),
			i = this.lights.length;

		this.lights.push(new THREE.PointLight(colors[Math.floor(Math.random() * 5)], intensity, distance));

		this.lights[i].position.x = xPos + this.cubeLen;
		this.lights[i].position.z = zPos + this.cubeLen;
		this.lights[i].position.y = 200;

		// decide whether we want this light be be a flickering light
		this.lights[i].flick = Math.random() > 0.7 ? true : false;

		game.engine.scene.add(this.lights[i]);
	},

	updateLights: function updateLights() {
		var i;

		if (game.engine.tick % 4 === 0) {
			for (i = 0; i < this.lights.length; i++) {
				if (this.lights[i].flick) {
					if (Math.random() > 0.7) {
						this.lights[i].intensity = Math.sin(game.engine.tick) * 3;
					}
				}
			}
		}
	},

	addMesh: function addMesh(x, y, geometries, materials) {
		var rot,
			name,
			mesh,
			xPos = x * this.cubeLen,
			zPos = y * this.cubeLen;

		// get name of the mesh
		switch(this.map[x][y].substring(0, this.map[x][y].indexOf('_'))) {
			case 'x':
				name = 'xcube';

				// add light to xcubes
				this.addLight(xPos, zPos);
				break;
			case 'i':
				name = 'icube';
				break;
		}

		// get rotation
		rot = parseInt(this.map[x][y].substring(this.map[x][y].indexOf('_') + 1, this.map[x][y].length), 10);

		// create mesh
		mesh = new THREE.Mesh(geometries[name], new THREE.MeshFaceMaterial(materials[name]));

		//rotate mesh
		mesh.rotation.set(0, rot * (Math.PI / 180), 0);

		// set position of the mesh
		mesh.position.set(xPos, 0, zPos);

		// add mesh to scene
		game.engine.scene.add(mesh);
	},

	loadMap: function loadMap(callback) {
		var x,
			y,
			name,
			geometries = {},
			materials = {},
			loader = new THREE.JSONLoader(),
			that = this,
			modelList = that.cubes;

		modelList.push('aim');

		// load models
		for (i = 0; i < this.cubes.length; i++) {
			(function(i) {
				loader.load("models/" + that.cubes[i] + ".js", function (geometry, material) {
					geometries[that.cubes[i]] = geometry;
					materials[that.cubes[i]] = material;

					// last model loaded -> add geometries to scene
					if (i === that.cubes.length - 1) {

						// TODO: i don't know why xcube isn't loaded on time...
						setTimeout(function() {


							// create mesh
							materials['aim'].shading = THREE.SmoothShading;
							game.player.model = new THREE.Mesh(geometries['aim'], new THREE.MeshFaceMaterial( materials['aim'] ));

							game.player.model.geometry.computeVertexNormals();
							game.player.model.geometry.computeFaceNormals();


							// add mesh to scene
							game.engine.scene.add(game.player.model);

							// iterate through map
							for (x = 0; x < that.map.length; x++) {
								for (y = 0; y < that.map.length; y++) {

									// coordinate has mesh
									if (that.map[x][y] !== 0) {
										// adds meshes and their lights
										that.addMesh(x, y, geometries, materials);
									}
								}
							}

							callback();
						}, 200);
					}
				});
			})(i);
		}
	}
};