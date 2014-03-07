define([
	"THREE",
	"starcrash/event_bus",
	"starcrash/static/config"


], function(
	THREE,
	bus,
	config
	) {

	var Weapon = function() {

		this._attributes = {
			coolDownMillis : 1000,
			lastShootTime : 0,
			maxAmmo : 100,
			ammo : 100,
			damage : 40
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


	return Weapon;


});