var express = require("express"),
	http = require("http"),
	app = express(),
	server = http.createServer(app);

app.use(express.static(__dirname + '/htdocs'));

server.listen(80);
console.log("Server started");