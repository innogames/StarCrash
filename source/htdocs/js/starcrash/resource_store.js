define([
	"starcrash/static/config",
	"starcrash/graphic/model_store",
	"starcrash/static/resource_definition"],
	function(
		config,
		ModelStore,
		resourceDefinition
		) {

		var singletonInstance;

		var ResourceStore = function() {
			this._modelStore = new ModelStore();

		};

		ResourceStore.prototype.load = function(resourceIDArray, onProgressCallback, onFinishCallback) {
			var resourceDefinitionsToLoad = this._getResourceDefinitions(resourceIDArray);

		};

		/**
		 * Returns an array of resource definitions by an array of ids.
		 * @param resourceIDArray The ids to get the resource definitions.
		 * @returns {Array} An array of resource definitions.
		 * @private
		 */
		ResourceStore.prototype._getResourceDefinitions = function(resourceIDArray) {
			var returnValue = [],
				tmpDefinition,
				i;
			for (i = 0; i < resourceIDArray.length; i++) {
				tmpDefinition = this._getResourceDefinition(resourceIDArray[i]);
				if (tmpDefinition != null) {
					returnValue.push(tmpDefinition);
				}
			}
		};

		/**
		 * Returns the resource definition by its id.
		 * @param resourceID The id of the resource definition to get.
		 * @returns {*} The resource definition.
		 * @private
		 */
		ResourceStore.prototype._getResourceDefinition = function(resourceID) {
			for (var i = 0; i < resourceDefinition.length; i++) {
				if (resourceDefinition[i].id == resourceID) {
					return resourceDefinition[i];
				}
			}
			console.log("[ResourceStore] Resource definition for id '" + resourceID + "' was not found.");
			return null;
		};

		ResourceStore.prototype.getImage = function(resourceID) {

		};

		ResourceStore.prototype.getAudio = function(resourceID) {

		};

		ResourceStore.prototype.getGeometry = function(resourceID) {

		};

		ResourceStore.prototype.getMaterial = function(resourceID) {

		};

		singletonInstance = new ResourceStore();
		return singletonInstance;

});