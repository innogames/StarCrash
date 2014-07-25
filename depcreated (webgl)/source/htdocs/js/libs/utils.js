define([], function() {

	return {

		fetchJSONFile : function (path, callback) {
			var httpRequest = new XMLHttpRequest();
			httpRequest.onreadystatechange = function() {
				if (httpRequest.readyState === 4) {
					if (httpRequest.status === 200) {
						var data = JSON.parse(httpRequest.responseText);
						if (callback) callback(data);
					}
				}
			};
			httpRequest.open('GET', path);
			httpRequest.send();
		},


		/**
		 * Inject a html-template to the assigned target-dom-element.
		 * @param templateURL The url of the template
		 * @param targetElementId The id of the element to inject to.
		 * @param callback The callback on finish.
		 */
		injectTemplate : function(templateURL, targetElementId, callback) {
				var element = document.getElementById(targetElementId),
					httpRequest = new XMLHttpRequest();
				httpRequest.open('get', templateURL);
				httpRequest.onreadystatechange = function() {
					if (httpRequest.readyState == 4) {
						element.innerHTML = httpRequest.responseText;
						callback();
					}
				};
				httpRequest.send(null);
		}

	}
});