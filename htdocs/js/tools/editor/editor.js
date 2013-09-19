/**
 * Created with JetBrains WebStorm.
 * User: luca
 * Date: 16.08.13
 * Time: 18:20
 * To change this template use File | Settings | File Templates.
 */
var EDIT_PLANE_POSITION = {
		TOP : 80 ,
		LEFT : 30
	},
	selectedBrush;



function initializeMap() {

	var width = document.getElementById("mapInitWidth").value,
		height = document.getElementById("mapInitHeight").value;


	document.getElementById("createNew").setAttribute("style", "display:none;");
	setCells(width, height);

	document.getElementById("interfaceTop").setAttribute("style", "display:inline-block;");
}

function setCells(width, height) {
	var x, y, tmpDivElement,
		editDiv = document.getElementById("editDiv");
	for (x = 0; x < width; x++) {
		for (y = 0; y < height; y++) {
			tmpDivElement = document.createElement("img");

			tmpDivElement.setAttribute("style" , 		"left: " + ((x * 30) + EDIT_PLANE_POSITION.LEFT) + "px; top: "
														+ ((y * 30) + EDIT_PLANE_POSITION.TOP) + "px;");
			tmpDivElement.setAttribute("class", 		"cell");
			tmpDivElement.setAttribute("onClick", 		"onClickCell(this," + x + "," + y + ")");
			tmpDivElement.setAttribute("onMouseOver", 	"onMouseOverCell(this," + x + "," + y + ")");
			tmpDivElement.setAttribute("onMouseOut", 	"onMouseOutCell(this," + x + "," + y + ")");
			tmpDivElement.setAttribute("x", 			""+x);
			tmpDivElement.setAttribute("y", 			""+y);

			editDiv.appendChild(tmpDivElement);
		}
	}
}

function selectBrush(brush) {
	selectedBrush = brush;
	brush.className = "selectedTool";
}

function onClickCell(cell, x, y) {
	if (selectedBrush) {
		cell.setAttribute("src", selectedBrush.src);
	}

	console.log("clicked on cell x: " + x + " y: " + y);
}

function onMouseOverCell(cell, x, y) {
	document.getElementById("cursorInfo").innerHTML = "x: " + x + " y: " + y;
}

function onMouseOutCell(cell, x, y) {
	document.getElementById("cursorInfo").innerHTML = "";
}