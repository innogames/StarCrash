var inventory, recipes;


function init() {

	read_json();

	$("#test").click(function(){
		addItem("I5");
		listInventory();
		listRecipes();
	});
	$("#test1").click(function(){
		removeItem("I5", 1);
		listInventory();
		listRecipes();
	});
}

function read_json() {

	// read Item list
	 $.getJSON("items.json", function(myItemsData) {

		inventory = myItemsData["inventory"];
		listInventory();
	});

	// read recipes
	$.getJSON("recipes.json", function(recipeData) {

		recipes = recipeData["recipes"];
		listRecipes();
	});
}

function listInventory(){

	// make sure list is empty
	$("#inventory").html("");

	$.each(inventory, function(i) {

		if(inventory[i].numInInventory > 0){
			$("#inventory").append('<li><i class="icon-' + inventory[i].icon + ' icon-3x"><span class="num">' + inventory[i].numInInventory + '</span><span class="name">' + inventory[i].name + '</span></i></li>');
		}
	});
}

function listRecipes(){

	// make sure list is empty
	$("#recipes").html("");

	$.each(recipes, function(i) {
		var recipe = this;
		var recipeHTML;
		var craftable = true;
		recipeHTML = "<h3>" + recipe.name + ":</h3><ul>";

		$.each(recipe["needed"], function(j) {

			var itemId = (recipe["needed"][j]["id"]);
			var itemNum = (recipe["needed"][j]["num"]);
			var itemIcon = inventory[itemId].icon;
			var itemName = inventory[itemId].name;
			var itemAvaiable = "available";

			if(inventory[itemId].numInInventory < itemNum){
				itemAvaiable = "notAvailable";
				craftable = false;
			}

			recipeHTML += '<li class="' + itemAvaiable +'"><i class="icon-' + itemIcon + ' icon-3x"><span class="num">' + itemNum + '</span><span class="name">' + itemName + '</span></i></li>';

		});

		var resultId = (recipe["result"]);
		var resultIcon = inventory[resultId].icon;
		var resultName = inventory[resultId].name;

		recipeHTML +='<li><i class="icon-arrow-right icon-2x"></i><li class="result"><i class="icon-' + resultIcon + ' icon-3x"><span class="name">' + resultName + '</span></i> ';

		if(craftable){
			recipeHTML +='</li><button class="available" id="craft' + i + '" > Craft this</button>';
		}else{
			recipeHTML +="</li>";
		}

		$("#recipes").append(recipeHTML);

		$("#craft" + i).click(function(){craft(i);});
	});
}

function craft(recipeId){

	var recipe = recipes[recipeId];
	var feedback;
	var fade = "";

	addItem(recipe.result);

	feedback = "You crafted a " + inventory[recipe.result].name + ". These Items where removed from your Inventory: ";

	$.each(recipe["needed"], function(i) {
		var itemId = recipe["needed"][i]["id"];
		var itemNum = recipe["needed"][i]["num"];

		removeItem(itemId, itemNum);

		feedback += inventory[itemId].name + ", ";
		//fade += "#inventory .icon-" + inventory[itemId].icon + ", ";
	});

	//fade = fade.slice(0,-2);

	//$(fade).fadeOut(700, function(){

		listInventory();
		listRecipes();
	//});
	alert(feedback);
}

function removeItem(itemId, num){
	if(inventory[itemId].numInInventory>=num){
		inventory[itemId].numInInventory -= num;
	}
	else{
		alert("error!");
	}
}

function addItem(itemId){
	inventory[itemId].numInInventory += 1;
//	listInventory();
//	listRecipes();
}