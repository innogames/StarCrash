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
		}

	}

});