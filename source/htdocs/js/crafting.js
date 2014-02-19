function init() {

	// Init buttons
	$("#test").click(function(){
		crafting.webdb.addToInventory(11, 1, true);
	});
	$("#test1").click(function(){
		crafting.webdb.removeFromInventory(11, 1, true);
	});

	// Init Database
	crafting.webdb.open();
	crafting.webdb.createTable();
	crafting.webdb.flushDB();

	crafting.webdb.addItems();
	crafting.webdb.addInventoryItems();
	crafting.webdb.addRecipes();

	crafting.webdb.getAllItems();
	crafting.webdb.getMyItems();
	crafting.webdb.getRecipes();
}



/* Local Storage DB Test */

var crafting = {};
crafting.webdb = {};

crafting.webdb.db = null;

crafting.webdb.open = function() {
  var dbSize = 5 * 1024 * 1024; // 5MB
  crafting.webdb.db = openDatabase("Crafting", "1", "Crafting Items", dbSize);
};

crafting.webdb.onError = function(tx, e) {
  alert("There has been an error: " + e.message);
};

crafting.webdb.onSuccess = function(tx, r) {
  	console.log("Success");
};

crafting.webdb.createTable = function() {

	crafting.webdb.db.transaction(function(tx) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS " +
					  "item(ID INTEGER PRIMARY KEY, name TEXT, class TEXT, dmgMin INTEGER, dmgMax INTEGER)", []);
		tx.executeSql("CREATE TABLE IF NOT EXISTS " +
					  "inventory(itemID INTEGER PRIMARY KEY, number INTEGER)", []);
		tx.executeSql("CREATE TABLE IF NOT EXISTS " +
					  "recipes(resultID INTEGER PRIMARY KEY, component1ID INTEGER, component2ID INTEGER, component3ID INTEGER)", []);
  });
};

crafting.webdb.flushDB = function(id) {

  crafting.webdb.db.transaction(function(tx){

    tx.executeSql("DELETE FROM item",		[], crafting.webdb.onSuccess, crafting.webdb.onError);
	tx.executeSql("DELETE FROM inventory",	[], crafting.webdb.onSuccess, crafting.webdb.onError);
	tx.executeSql("DELETE FROM recipes",	[], crafting.webdb.onSuccess, crafting.webdb.onError);

  });
};

var flushScreen = function(){

	console.log("flush!");

  	crafting.webdb.getAllItems();
	crafting.webdb.getMyItems();
	crafting.webdb.getRecipes();
};


/* -------------  Fill Database with values ---------------------------- */

crafting.webdb.addItems = function() {

	crafting.webdb.db.transaction(function(tx){
		for (var i in items) {
			tx.executeSql("INSERT INTO item(ID, name, class, dmgMin, dmgMax) VALUES (?,?,?,?,?)",
				[items[i][0], items[i][1], items[i][2], items[i][3], items[i][4] ],
				crafting.webdb.onSuccess, crafting.webdb.onError);
		}
	});
};

crafting.webdb.addInventoryItems = function() {

	crafting.webdb.db.transaction(function(tx){
		for (var i in myItems) {
			tx.executeSql("INSERT INTO inventory(itemID, number) VALUES (?,?)",
				[myItems[i][0], myItems[i][1] ],
				crafting.webdb.onSuccess, crafting.webdb.onError);
		}
	});
};

crafting.webdb.addRecipes = function() {

	crafting.webdb.db.transaction(function(tx){
		for (var i in recipes) {
			tx.executeSql("INSERT INTO recipes(resultID, component1ID, component2ID, component3ID) VALUES (?,?,?,?)",
				[recipes[i][0], recipes[i][1], recipes[i][2], recipes[i][3] ],
				crafting.webdb.onSuccess, crafting.webdb.onError);
		}
	});
};

/* Add Item to inventory */

crafting.webdb.addToInventory = function(itemID, num, flush) {

	crafting.webdb.db.transaction(function(tx) {

		tx.executeSql("INSERT OR IGNORE INTO inventory VALUES (?, 0); ", [itemID], crafting.webdb.onSuccess ,crafting.webdb.onError);
		tx.executeSql("UPDATE inventory SET number = number + ? WHERE itemID = ?", [num, itemID], function (tx, results) {

			crafting.webdb.onSuccess;

			if(flush){
				flushScreen();
			}
			console.log("update");

		},crafting.webdb.onError);
  });
};


/* remove item from inventory */
crafting.webdb.removeFromInventory = function(itemID, num, flush) {

	crafting.webdb.db.transaction(function(tx) {

		// Check if there are enough items available
		tx.executeSql("SELECT number FROM inventory WHERE itemID = ?", [itemID], function (tx, results) {

			// if yes, remove them
			if(results.rows.item(0).number >= num){

				tx.executeSql("UPDATE inventory SET number = number - ? WHERE itemID = ?", [num, itemID], function (tx, results) {

					crafting.webdb.onSuccess;
					if(flush){
						flushScreen();
					}
					console.log("update");

				},crafting.webdb.onError);
			}
			else{ alert("Cannot remove Item! Not enough left."); }

		},crafting.webdb.onError);
  });
};



/* --------------- Display Items ---------------------- */

crafting.webdb.getAllItems = function() {

	var allItems = document.getElementById("itemlist");
	allItems.innerHTML = "";

	crafting.webdb.db.transaction(function(tx) {
		tx.executeSql("SELECT ID FROM item", [], function (tx, results) {

			for(var i=0; i < results.rows.length; i++) {
				crafting.webdb.showItem(results.rows.item(i).ID, allItems);
			}
		},crafting.webdb.onError);
  });
};

crafting.webdb.getMyItems = function() {

	var myItems = document.getElementById("inventory");
	myItems.innerHTML = "";

	crafting.webdb.db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM item INNER JOIN inventory ON item.ID = inventory.itemID", [], function (tx, results) {

			for(var i=0; i < results.rows.length; i++) {
				crafting.webdb.showInventoryItem(results.rows.item(i).ID, myItems);
			}
		}, crafting.webdb.onError);
	});
};

crafting.webdb.getRecipes = function() {

	var recipes = document.getElementById("recipes");
	recipes.innerHTML = "";

	crafting.webdb.db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM recipes", [], function (tx, results) {

			for(var i=0; i < results.rows.length; i++) {

				var items = [results.rows.item(i).component1ID, results.rows.item(i).component2ID, results.rows.item(i).component3ID];
				crafting.webdb.showRecipe(items, results.rows.item(i).resultID, recipes);
			}
		},crafting.webdb.onError);
	});
};

crafting.webdb.showItem = function (itemID, goal) {

	crafting.webdb.db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM item WHERE ID = ?", [itemID], function (tx, results) {

			for(var i=0; i < results.rows.length; i++) {
				goal.innerHTML += renderItem(results.rows.item(i));
			}
		},crafting.webdb.onError);
	});
};

crafting.webdb.showInventoryItem = function (itemID, goal) {

	crafting.webdb.db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM item INNER JOIN inventory ON item.ID = inventory.itemID WHERE ID = ?", [itemID], function (tx, results) {

			for(var i=0; i < results.rows.length; i++) {
				goal.innerHTML += renderInventory(results.rows.item(i));
			}
		},crafting.webdb.onError);
	});
};

crafting.webdb.showRecipe = function (recipeItems, resultID, goal) {

		var available = 0;

		crafting.webdb.db.transaction(function(tx) {

			for(var i=0; i < recipeItems.length; i++){
					tx.executeSql("SELECT * FROM item INNER JOIN inventory ON item.ID = inventory.itemID WHERE ID = ?", [recipeItems[i]], function (tx, results) {

						goal.innerHTML += renderIngedient(results.rows.item(0));

						if(results.rows.item(0).number > 0){ available++; }

				},crafting.webdb.onError);
			}

			tx.executeSql("SELECT * FROM item WHERE ID = ?", [resultID], function (tx, results) {

					goal.innerHTML += '<li><i class="icon-arrow-right"> > </</li>';
					goal.innerHTML += renderItem(results.rows.item(0));

					if(available === recipeItems.length){
						goal.innerHTML += "<button id=" + resultID + ">Craft this</button>";
						$('#'+resultID).click(function(){
							crafting.webdb.craft(resultID);
						});
					}

			},crafting.webdb.onError);
		});
};

function renderItem(row) {
	return '<li><i class="item ' + row.class + ' "><span class="name">' + row.name + '</span></i></li>';
}

function renderInventory(row) {
	if(row.number === 0){
		return "";
	}
	else{
		return '<li><i class="item ' + row.class + ' "><span class="num">' + row.number + '</span><span class="name">' + row.name + '</span></i></li>';
	}
}

function renderIngedient(row) {
	var available;

	if(row.number>0){ available = "available";}
	else{ available = "notAvailable";}

	return '<li><i class="item ' + row.class + ' "><span class="num ' +available+'">' + row.number + '</span><span class="name">' + row.name + '</span></i></li>';
}

/* Craft */
crafting.webdb.craft = function (resultID) {

	crafting.webdb.db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM recipes WHERE resultID = ?", [resultID], function (tx, results) {

			crafting.webdb.removeFromInventory(results.rows.item(0).component1ID, 1, false);
			crafting.webdb.removeFromInventory(results.rows.item(0).component2ID, 1, false);
			crafting.webdb.removeFromInventory(results.rows.item(0).component3ID, 1, false);

			crafting.webdb.addToInventory(results.rows.item(0).resultID, 1, false);
			flushScreen();
			console.log("Craft + flush!");

		},crafting.webdb.onError);
	});
};