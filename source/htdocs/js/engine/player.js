define(["THREE", "engine/engine", "engine/world", "modules/keyboard", "engine/bus"], function(THREE, engine, world, keyboardModule, bus) {
	return {
		curMovement: {},
		camAnimDuration: 0,
		oldRot: 0,
		model: {},
		walkingAnimationStep: 0,
		walkingAnimationSpeed: 0.2,
		walkingAnimationAmplitude: 0.1,
		cameraRoatationFactor: 0.003,
		oldDirection: "down",
		position: {
			x: 0,
			y: 0
		},

		fakePosition : {
			x: 0,
			y: 0
		},

		init: function init() {
			// add player-light
			var light = new THREE.PointLight(0x404040, 2.5, 450),
				directions = ['left', 'up', 'right', 'down'],
				that = this,
				elem,
				i;

			light.position = engine.camera.position;
			engine.scene.add(light);

			// setup camera
			engine.camera.rotation.y = engine.cameraRot;
			engine.camera.position.y = engine.cameraOffset.y;

			// rotate mesh
			engine.camera.add(this.model);

			console.log(this.model);

			// setup player-model
			this.model.position.set(-1.5, -81.5, 11);
			this.model.rotation.y = Math.PI;

			// init player-events
			for (i = 0; i < directions.length; i++) {
				(function(i) {
					elem = document.getElementById(directions[i]);

					elem.addEventListener('click', function(event) {
						that.walk(directions[i]);
					}, false);
				}) (i);
			}
		},

		walk: function walk(direction) {
			// player is already walking
			if (this.camAnimDuration !== 0) {
				return;
			}

			this.curMovement[direction] = true;
			this.oldRot = engine.camera.rotation.y;
			this.setHUD(false);

			bus.post(bus.EVENT_PLAYER_MOVED, this);
		},

		updateNewPosition: function updateNewPosition(direction) {
			this.curMovement[direction] = false;
			this.camAnimDuration = 0;
			this.setHUD(true);

			switch (direction) {
				case "up":
					switch(this.oldDirection) {
						case "up":
							this.position.y--;
							break;
						case "down":
							this.position.y++;
							break;
					}
					break;
				case "down":
					switch(this.oldDirection) {
						case "up":
							this.position.y++;
							break;
						case "down":
							this.position.y--;
							break;
					}
					break;
				case "left":
					switch(this.oldDirection) {
						case "up":
							this.position.y++;
							break;
						case "down":
							this.position.y--;
							break;
					}
					break;
				case "right":
					switch(this.oldDirection) {
						
					}
					break;
			}

			this.oldDirection = direction;
		},

		control: function control(tDelta) {
			tDelta = tDelta * 100;

			// arrow up - move up
			if (keyboardModule.pressed[38]) {
				engine.camera.translateY(tDelta);
			}

			// arrow down - move down
			if (keyboardModule.pressed[40]) {
				engine.camera.translateY(-tDelta);
			}

			// arrow left - turn left
			if (keyboardModule.pressed[37]) {
				engine.camera.rotation.y += tDelta * (Math.PI / 180);
			}

			// arrow right - turn right
			if (keyboardModule.pressed[39]) {
				engine.camera.rotation.y -= tDelta * (Math.PI / 180);
			}

			// a - move left
			if (keyboardModule.pressed[65]) {
				engine.camera.translateX(-tDelta);
			}

			// d - move right
			if (keyboardModule.pressed[68]) {
				engine.camera.translateX(tDelta);
			}

			// w - move forward
			if (keyboardModule.pressed[87]) {
				engine.camera.translateZ(-tDelta);
			}

			// s - move backwards
			if (keyboardModule.pressed[83]) {
				engine.camera.translateZ(tDelta);
			}
		},

		addWalkingOffset: function addWalkingOffset() {
			this.model.position.y += Math.sin(this.walkingAnimationStep) * this.walkingAnimationAmplitude;
			engine.camera.rotation.z = -(this.cameraRoatationFactor/2) + Math.sin(this.walkingAnimationStep) * this.cameraRoatationFactor;
			this.walkingAnimationStep += this.walkingAnimationSpeed;
		},

		handleMovement: function handleMovement(tDelta) {
			var walkSpeed = tDelta * 175,
				rotSpeed = tDelta * 250;

			// walk up
			if (this.curMovement.up) {
				if (this.camAnimDuration < world.cubeLen) {
					this.camAnimDuration += walkSpeed;
					this.addWalkingOffset();
					engine.camera.translateZ(-walkSpeed);
				} else {
					engine.camera.translateZ(-(world.cubeLen - this.camAnimDuration));
					this.updateNewPosition('up');
				}
			}

			// walk down
			if (this.curMovement.down) {
				if (this.camAnimDuration < world.cubeLen) {
					this.camAnimDuration += walkSpeed;
					this.addWalkingOffset();
					engine.camera.translateZ(walkSpeed);
				} else {
					engine.camera.translateZ(world.cubeLen - this.camAnimDuration);
					this.updateNewPosition('down');
				}
			}

			// turn left
			if (this.curMovement.left) {
				if (this.camAnimDuration < 90) {
					this.camAnimDuration += rotSpeed;
					engine.camera.rotation.y = this.oldRot + (this.camAnimDuration * Math.PI / 180);
				} else {
					engine.camera.rotation.y = this.oldRot + (90 * Math.PI / 180);
					this.updateNewPosition('left');
				}
			}

			// turn right
			if (this.curMovement.right) {
				if (this.camAnimDuration < 90) {
					this.camAnimDuration += rotSpeed;
					engine.camera.rotation.y = this.oldRot + (-this.camAnimDuration * Math.PI / 180);
				} else {
					engine.camera.rotation.y = this.oldRot + (-90 * Math.PI / 180);
					this.updateNewPosition('right');
				}
			}
		},

		setHUD: function setHUD(state) {
			var arrows = document.getElementsByClassName('arrow');

			for (i = 0; i < arrows.length; i++) {
				if (!state) {
					arrows[i].className = "arrow inactive";
				} else {
					arrows[i].className = "arrow";
				}
			}
		},


		getPosition : function getPosition() {
			return this.fakePosition;
		}
	};
});