define([
		"THREE",
		"starcrash/debug/fly_controls",
		"starcrash/static/config",
		"starcrash/objects/creatures/creature"
	], function(
		THREE,
		FlyControls,
		config,
		Creature
	) {

	return {

		flyControls : null,
		flyControlsEnabled : false,
		debugCamera : null,
		player : null,
		level : null,

		init : function(pPlayer, pLevel, pCamera, rendererDomElement) {
			var self = this;

			this.domPlayerPosition = document.getElementById("debugPlayerPosition");
			this.domPlayerDirection = document.getElementById("debugPlayerDirection");
			this.domPlayerGrid = document.getElementById("debugPlayerGrid");
			this.domLevelModelCount = document.getElementById("debugLevelModelCount");
			this.domLevelSize = document.getElementById("debugLevelSize");

			this.player = pPlayer;
			this.level = pLevel;
			this.debugCamera = new THREE.PerspectiveCamera(60, config.renderSize.width / config.renderSize.height, 1, 4096);
			this.debugCamera.viewportSettings = pCamera.viewportSettings;
			this.debugCamera.position = pCamera.position.clone();
			this.debugCamera.up.set(0, 1 ,0);
			this.debugCamera.rotation = pCamera.rotation.clone();

			this.flyControls = new FlyControls(this.debugCamera);
			this.flyControls.movementSpeed = 200;
			this.flyControls.domElement = rendererDomElement;
			this.flyControls.rollSpeed = Math.PI / 3;
			this.flyControls.autoForward = false;
			this.flyControls.dragToLook = true;

			var debugInfo = document.getElementById("debugInfo");
			var debugHideButton = document.getElementById("debugHide");
			var debugShowButton = document.getElementById("debugShow");

			debugHideButton.addEventListener("click", function() {
				debugShowButton.style.visibility='visible';
				debugInfo.style.visibility='hidden';

			});

			debugShowButton.addEventListener("click", function() {
				debugShowButton.style.visibility='hidden';
				debugInfo.style.visibility='visible';
			});


			document.getElementById("debugUsePlayerCam").addEventListener("click", function() {
				self.flyControlsEnabled = false;
			});

			document.getElementById("debugUseFreeCam").addEventListener("click", function() {
				self.flyControlsEnabled = true;
			});


		},

		animate : function(delta) {
			this.flyControls.update(delta);
			this.domPlayerPosition.innerHTML = "position x:" + this.player.position.x + " y:" + this.player.position.y + " z:" + this.player.position.z;

			var direction = this.player.getOffsetToMove(Creature.MOVEMENT.FORWARDS);
			if (direction != null) {
				this.domPlayerDirection.innerHTML = "facing x:" + direction.x + " y:" + direction.y + " z:" + direction.z;
			} else {
				this.domPlayerDirection.innerHTML = " - turning -";
			}

			var grid = this.player.getGridPosition();
			this.domPlayerGrid.innerHTML = "grid x:" + grid.x + " z:" + grid.z;


			var modelCount = this.level.getContainingEntityTypes().length;
			this.domLevelModelCount.innerHTML = "models: " + modelCount;
			this.domLevelSize.innerHTML = "width(x):" + this.level.getWidth() + " height(z):" + + this.level.getHeight();

		}


	}

});