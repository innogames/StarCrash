/**
 * Created with JetBrains WebStorm.
 * User: luca
 * Date: 16.08.13
 * Time: 18:20
 * To change this template use File | Settings | File Templates.
 */
var EDIT_PLANE_POSITION = {
		TOP : 50 ,
		LEFT : 250
	},
	selectedBrush,
	scripts;

function initializeMap() {

	var width = document.getElementById("mapInitWidth").value,
		height = document.getElementById("mapInitHeight").value;

	scripts = [];

	document.getElementById("createNew").setAttribute("style", "display:none;");
	setCells(width, height);

	document.getElementById("interfaceLeft").setAttribute("style", "display:inline-block;");
}

function setCells(width, height) {
	var x, y, tmpDivElement,
		editDiv = document.getElementById("grid");

	for (x = 0; x < width; x++) {
		for (y = 0; y < height; y++) {
			tmpDivElement = document.createElement("div");

			tmpDivElement.setAttribute("style" , 		"left: " + ((x * 30) + EDIT_PLANE_POSITION.LEFT) + "px; top: "
														+ ((y * 30) + EDIT_PLANE_POSITION.TOP) + "px;");
			tmpDivElement.setAttribute("class", 		"cell");
			tmpDivElement.setAttribute("onClick", 		"onClickCell(this," + x + "," + y + ")");
			tmpDivElement.setAttribute("onMouseOver", 	"onMouseOverCell(this," + x + "," + y + ")");
			tmpDivElement.setAttribute("onMouseOut", 	"onMouseOutCell(this," + x + "," + y + ")");
			tmpDivElement.setAttribute("x", 			""+x);
			tmpDivElement.setAttribute("y", 			""+y);

			grid.appendChild(tmpDivElement);
		}
	}
}

function selectBrush(brush) {
	selectedBrush = brush;
	brush.className = "selectedTool";
}

var selectedCell = null;

function onClickCell(cell, x, y) {
	var imgChild;

	if (selectedBrush) {

		if (selectedBrush.getAttribute("id") == "brush_delete") {
			cell.innerHTML = "";
			cell.removeAttribute("type");
			return;
		}

		if (selectedBrush.getAttribute("id") == "brush_select") {
				if (selectedCell != null) {
				 selectedCell.classList.remove("selectedCell");
				}
			selectedCell = cell;
			selectedCell.classList.add("selectedCell");
		 	return;
		}


		imgChild = document.createElement("img");
		imgChild.setAttribute("src", selectedBrush.src);
		cell.innerHTML = "";
		cell.setAttribute("type", selectedBrush.src.substr(selectedBrush.src.length - 6, 2));
		cell.appendChild(imgChild);
	}

	console.log("clicked on cell x: " + x + " y: " + y);
}

function onMouseOverCell(cell, x, y) {
	document.getElementById("cursorInfo").innerHTML = "position: x: " + x + " y: " + y;
}

function onMouseOutCell(cell, x, y) {
	document.getElementById("cursorInfo").innerHTML = "-";
}


function getMapArray() {
	var tiles = document.getElementById("grid").children,
		i,
		tile,
		tileType,
		tilePosition;

	for (i = 0; i < tiles.length; i++) {
		tile = tiles[i];
		if (tile.children.length > 0) {

			tileType = tile.getAttribute("type");
			tilePosition = cellToPosition(tile);
			console.log( "type: " + tileType + " x: " + tilePosition.x + " y: " + tilePosition.y);
		}
	}

}

function cellToPosition(domTile) {
	return { x: domTile.getAttribute("x"), y: domTile.getAttribute("y") };
}

function onTabButtonClick(pageId, button) {

	var pos,
		posString,
		s;

	if (selectedCell != null) {
		pos = cellToPosition(selectedCell);
		if(pageId == "page1") {

			setScriptForPosition(pos);
		}

		if(pageId == "page2") {
			s = getScriptByPosition(pos);
			if(s != null) {
				editor.setValue(s.script);
			} else {
				 setStandardText(pos);
			}

		}

	} else {
		alert("Select a cell first. You can only write a script for a selected cell.")
		return;
	}

	var buttons = document.getElementsByClassName("tabButton");

	for (var i = 0; i < buttons.length; i++){
		buttons[i].classList.remove("selected");
	}
	button.classList.add("selected");


	var tabCtrl = document.getElementById('tabCtrl');
	var pageToActivate = document.getElementById(pageId);
	for (var i = 0; i < tabCtrl.childNodes.length; i++) {
		var node = tabCtrl.childNodes[i];
		if (node.nodeType == 1) { /* Element */
			node.style.display = (node == pageToActivate) ? 'block' : 'none';
		}
	}
}


function setScriptForPosition(position) {
	var s,
		script = editor.getValue();

	s = getScriptByPosition(position);
	if (s != null) {
		s.script = script;
	} else {
		scripts.push( { position : position, script: script });
	}

}

function getScriptByPosition(position) {
	for(i = 0; i < scripts.length; i++) {
		if(scripts[i].position.x = position.x && scripts[i].position.y == position.y) {
			return scripts[i];
		}
	}
}

function setStandardText(position) {
	editor.insert("// Script for tile x: " + position.x + " y: " + position.y);
	editor.gotoLine(2, 0);
	editor.insert("function onPlayerEnter(scope) { }");
	editor.gotoLine(3, 0);
	editor.insert("function onPlayerLeaves(scope) { }");
}