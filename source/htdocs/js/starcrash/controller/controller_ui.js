define([
	"starcrash/event_bus",
	"starcrash/static/config",
	"UTILS"
], function(
	bus,
	config,
	UTILS
	) {


	var UIController = function() {

		this._domElementPlayerHealth = null;
		this._domElementPlayerWeaponAmmo = null;

	};

	UIController.UI_TEMPLATE_PATH = 'js/starcrash/templates/game_screen.html';

	/**
	 * Injects the screen template to the dom.
	 * @param parentDomElementId The parent element to inject to.
	 * @param callback The callback if the template is injected.
	 */
	UIController.prototype.injectUI = function(parentDomElementId, callback) {
		var self = this;
		UTILS.injectTemplate(UIController.UI_TEMPLATE_PATH, parentDomElementId, function() {
			self._initialize();
			if (callback != null) callback();
		});
	};

	/**
	 * Subscribes elements to open / close screens.
	 * @private
	 */
	UIController.prototype._initialize = function() {
		var self = this;

		this._domElementPlayerHealth = document.getElementById("playerHealth");
		this._domElementPlayerWeaponAmmo = document.getElementById("playerWeaponAmmo");


		bus.subscribe(bus.EVENT_OPEN_SCREEN, function(screenName) {
			self.openScreen(screenName);
		});
		bus.subscribe(bus.EVENT_CLOSE_SCREEN, function(screenName) {
			self.closeScreen(screenName);
		});

		document.getElementById("settingsOpenButton").addEventListener("click", function() {
			bus.post(bus.EVENT_OPEN_SCREEN, "settings");
		});
		document.getElementById("settingsCloseButton").addEventListener("click", function() {
			bus.post(bus.EVENT_CLOSE_SCREEN, "settings");
		});
	};

	/**
	 * Shows the screen with the assigned name.
	 * @param screenName The name of the screen (dome element-ids are constructed out of this name)
	 */
	UIController.prototype.openScreen = function(screenName) {
		var screenElementId = screenName + "Screen";
		var screenOpenButtonElementId = screenName + "OpenButton";

		var screenElement = document.getElementById(screenElementId);
		var screenOpenButton = document.getElementById(screenOpenButtonElementId);

		if (screenElement != null) {
			screenElement.style.visibility='visible';
		} else {
			console.log("[UIController] Dom element not found " + screenElementId);
		}

		if (screenOpenButton != null) {
			screenOpenButton.style.visibility='hidden';
		}
	};

	/**
	 * Hides the screen with the assigned name.
	 * @param screenName The name of the screen (dome element-ids are constructed out of this name)
	 */
	UIController.prototype.closeScreen = function(screenName) {
		var screenElement = document.getElementById(screenName + "Screen");
		var screenOpenButton = document.getElementById(screenName + "OpenButton");
		screenElement.style.visibility='hidden';
		screenOpenButton.style.visibility='visible';
	};


	UIController.prototype.update = function(pPlayer) {
		if (pPlayer != null) {
			if (this._domElementPlayerHealth != null) {
				this._domElementPlayerHealth.innerHTML = pPlayer.getHealth();
			}
			if (this._domElementPlayerWeaponAmmo != null) {
				var weapon = pPlayer.getEquipedWeapon();
				if (weapon != null) {
					this._domElementPlayerWeaponAmmo.innerHTML = weapon.getAttributes().ammo + " / " + weapon.getAttributes().maxAmmo;
				}
			}
		}


	};



	return UIController;
});