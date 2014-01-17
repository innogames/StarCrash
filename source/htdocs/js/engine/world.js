define(["THREE", "engine/engine"], function(THREE, engine) {
	return {
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

			engine.scene.add(this.lights[i]);
		},

		updateLights: function updateLights() {
			var i;

			if (engine.tick % 4 === 0) {
				for (i = 0; i < this.lights.length; i++) {
					if (this.lights[i].flick) {
						if (Math.random() > 0.7) {
							this.lights[i].intensity = Math.sin(engine.tick) * 3;
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
			engine.scene.add(mesh);
		},


		initMap: function initMap(geometries, materials) {
			// iterate through map
			for (x = 0; x < this.map.length; x++) {
				for (y = 0; y < this.map.length; y++) {

					// coordinate has mesh
					if (this.map[x][y] !== 0) {
						// adds meshes and their lights
						this.addMesh(x, y, geometries, materials);
					}
				}
			}
		}
	};
});