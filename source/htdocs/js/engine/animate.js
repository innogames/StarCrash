define(["engine/engine", "engine/player", "engine/world", "config"], function(engine, player, world, config) {
	var animate = function animate() {
		var tDelta = engine.clock.getDelta();

		// fps
		if (engine.tick % 30 === 0) {
			engine.fpsDiv.innerHTML = ~~(1 / tDelta);
		}

		// debug-controls
		if (config.debug) {
			player.control(tDelta);
		}

		// movement
		player.handleMovement(tDelta);

		// lights
		world.updateLights();

		// request next frame
		requestAnimationFrame(animate);

		//update particle-engine
		//engine.particleEngine.update(tDelta * 0.5);

		// render
		engine.renderer.render(engine.scene, engine.camera);

		// tick
		engine.tick += 1;
	};

	return animate;
});