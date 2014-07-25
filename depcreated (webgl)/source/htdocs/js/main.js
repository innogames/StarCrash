require.config({
	baseUrl: "js",
	paths: {
		THREE: "libs/three.min",
		UTILS: "libs/utils"
	},
	shim: {
		THREE: {
			exports: "THREE"
		},
		UTILS: {
			exports: "UTILS"
		}
	}
});

require(["starcrash/launcher"], function(StarCrashLauncher) {

	var launcher = new StarCrashLauncher("gameContainer");

	document.getElementById("start_button").addEventListener("click", function() {
		launcher.continueGame();
	});


});