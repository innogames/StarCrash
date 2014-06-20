define([
	"THREE",
	"starcrash/event_bus",
	"starcrash/static/config"


], function(
	THREE,
	bus,
	config
	) {

	var Weapon = function(pDamage) {

		pDamage = pDamage ? pDamage : 40;


		this._attributes = {
			coolDownMillis : 500,
			lastShootTime : 0,
			maxAmmo : 100,
			ammo : 90,
			damage : pDamage,

			rangeCells : 10
		}

	};


	/**
	 * Tries to trigger the weapon. Returns true if triggering was possible.
	 * @returns {boolean} True if triggering was possible.
	 */
	Weapon.prototype.tryTrigger = function() {
		var now = new Date().getTime();
		if (this._attributes.lastShootTime + this._attributes.coolDownMillis < now) {
			if (this._attributes.ammo > 0) {
				this._attributes.lastShootTime = now;
				this._attributes.ammo--;
				return true;
			}
		}
		return false;
	};

	Weapon.prototype.getDamage = function() {
		return this._attributes.damage;
	};

	Weapon.prototype.getAttributes = function() {
		return this._attributes;
	};


	return Weapon;


});