define(["THREE", "engine/engine", "libs/FlyControls"], function(THREE, engine, FlyControls) {

	return {

		flyControls : null,
		flyControlsEnabled : false,
		debugCamera : null,
		player : null,
		level : null,

		domPlayerPosition : document.getElementById("debugPlayerPosition"),
		domPlayerDirection : document.getElementById("debugPlayerDirection"),
		domPlayerGrid : document.getElementById("debugPlayerGrid"),
		domLevelModelCount : document.getElementById("debugLevelModelCount"),
		domLevelSize : document.getElementById("debugLevelSize"),



		init : function(pPlayer, pLevel) {
			var self = this;

			this.player = pPlayer;
			this.level = pLevel;
			this.debugCamera = new THREE.PerspectiveCamera(60, engine.renderSize.width / engine.renderSize.height, 1, 4096);
			this.debugCamera.viewportSettings = engine.getMainCamera().viewportSettings;
			this.debugCamera.rotation.y = Math.PI;

			this.flyControls = new FlyControls(this.debugCamera);
			this.flyControls.movementSpeed = 200;
			this.flyControls.domElement = engine.renderer.domElement;
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

		update : function() {
			this.flyControls.update(engine.clock.getDelta());
			this.domPlayerPosition.innerHTML = "position x:" + this.player.position.x + " y:" + this.player.position.y + " z:" + this.player.position.z;

			var direction = this.player.getFacingDirection(false);
			if (direction != null) {
				this.domPlayerDirection.innerHTML = "facing x:" + direction.x + " y:" + direction.y + " z:" + direction.z;
			} else {
				this.domPlayerDirection.innerHTML = " - turning -";
			}

			var grid = this.player.getGridPosition();
			this.domPlayerGrid.innerHTML = "grid x:" + grid.x + " z:" + grid.z;


			var modelCount = this.level.getContainingModelNames().length;
			this.domLevelModelCount.innerHTML = "models: " + modelCount;
			this.domLevelSize.innerHTML = "width(x):" + this.level.getWidth() + " height(z):" + + this.level.getHeight();

		}


	}

});