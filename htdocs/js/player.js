var player = {
	curMovement: {},
	camAnimDuration: 0,
	oldRot: 0,
	model: {},
	walkingAnimationStep: 0,
	walkingAnimationSpeed: 0.2,
	walkingAnimationAmplitude: 0.1,
	cameraRoatationFactor: 0.003,

	init: function init() {
		// add player-light
		var light = new THREE.PointLight(0x404040, 2.5, 450);
		light.position = game.engine.camera.position;
		game.engine.scene.add(light);

		// setup camera
		game.engine.camera.rotation.y = Math.PI;
		game.engine.camera.position.y = 2;

		// rotate mesh
		game.engine.camera.add(this.model);

		// setup player-model
		this.model.position.set(-1.5, -81.5, 11);
		this.model.rotation.y = Math.PI;
	},

	walk: function walk(direction) {
		var arrows = document.getElementsByClassName('arrow');

		// player is already walking
		if (this.camAnimDuration !== 0) {
			return;
		}

		this.curMovement[direction] = true;
		this.oldRot = game.engine.camera.rotation.y;
		this.setHUD(false);
	},

	control: function control(tDelta) {
		var camera = game.engine.camera,
			keyboard = game.controls.keyboard;

		tDelta = tDelta * 100;

		// arrow up - move up
		if (keyboard[38]) {
			camera.translateY(tDelta);
		}

		// arrow down - move down
		if (keyboard[40]) {
			camera.translateY(-tDelta);
		}

		// arrow left - turn left
		if (keyboard[37]) {
			camera.rotation.y += tDelta * (Math.PI / 180);
		}

		// arrow right - turn right
		if (keyboard[39]) {
			camera.rotation.y -= tDelta * (Math.PI / 180);
		}

		// a - move left
		if (keyboard[65]) {
			camera.translateX(-tDelta);
		}

		// d - move right
		if (keyboard[68]) {
			camera.translateX(tDelta);
		}

		// w - move forward
		if (keyboard[87]) {
			camera.translateZ(-tDelta);
		}

		// s - move backwards
		if (keyboard[83]) {
			camera.translateZ(tDelta);
		}
	},

	addWalkingOffset: function addWalkingOffset() {
		this.model.position.y += Math.sin(this.walkingAnimationStep) * this.walkingAnimationAmplitude;
		game.engine.camera.rotation.z = -(this.cameraRoatationFactor/2) + Math.sin(this.walkingAnimationStep) * this.cameraRoatationFactor;
		this.walkingAnimationStep += this.walkingAnimationSpeed;
	},

	handleMovement: function handleMovement(tDelta) {
		var walkSpeed = tDelta * 175,
			rotSpeed = tDelta * 250,
			world = game.world,
			camera = game.engine.camera;

		// walk up
		if (this.curMovement.up) {
			if (this.camAnimDuration < world.cubeLen) {
				this.camAnimDuration += walkSpeed;
				this.addWalkingOffset();
				camera.translateZ(-walkSpeed);
			} else {
				this.curMovement.up = false;
				camera.translateZ(-(world.cubeLen - this.camAnimDuration));
				this.camAnimDuration = 0;
				this.setHUD(true);
			}
		}

		// walk down
		if (this.curMovement.down) {
			if (this.camAnimDuration < world.cubeLen) {
				this.camAnimDuration += walkSpeed;
				this.addWalkingOffset();
				camera.translateZ(walkSpeed);
			} else {
				this.curMovement.down = false;
				camera.translateZ(world.cubeLen - this.camAnimDuration);
				this.camAnimDuration = 0;
				this.setHUD(true);
			}
		}

		// turn left
		if (this.curMovement.left) {
			if (this.camAnimDuration < 90) {
				this.camAnimDuration += rotSpeed;
				camera.rotation.y = this.oldRot + (this.camAnimDuration * Math.PI / 180);
			} else {
				this.curMovement.left = false;
				camera.rotation.y = this.oldRot + (90 * Math.PI / 180);
				this.camAnimDuration = 0;
				this.setHUD(true);
			}
		}

		// turn right
		if (this.curMovement.right) {
			if (this.camAnimDuration < 90) {
				this.camAnimDuration += rotSpeed;
				camera.rotation.y = this.oldRot + (-this.camAnimDuration * Math.PI / 180);
			} else {
				this.curMovement.right = false;
				camera.rotation.y = this.oldRot + (-90 * Math.PI / 180);
				this.camAnimDuration = 0;
				this.setHUD(true);
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
	}
};