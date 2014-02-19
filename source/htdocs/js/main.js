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

require(["starcrash/launcher"], function(starCrashLauncher) {



		document.addEventListener("click", function() {
			starCrashLauncher.continueGame();
		});


});