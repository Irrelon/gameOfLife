(function () {
	/**
	 * The main application class that ties all the application
	 * modules together and exposes the app to the global scope
	 * via window.app.
	 *
	 * Most of this class is a module loader system that I put
	 * together quickly as part of this test because I hate
	 * shoving everything into the global scope - Rob.
	 * @constructor
	 */
	var App = function () {
		// The object that holds references to all the app's
		// modules that are defined by app.module().
		this._modules = {};
		
		// The object that holds a reference to callbacks that
		// are waiting for a module to become available / loaded
		this._waiting = {};
	};
	
	/**
	 * Gets / registers a module with the application and executes the
	 * module's function once all it's required dependencies
	 * have loaded.
	 * @param {String} moduleName The name of the module to define.
	 * @param {Function=} moduleDefinition Optinal. The function that
	 * returns the module. If omitted we will return the module
	 * specified by the "name" argument if it exists.
	 * @returns {Function|App} If "moduleDefinition" is provided, returns
	 * "this" to allow chaining. If "moduleDefinition" is omitted,
	 * returns the module specified by the "name" argument.
	 */
	App.prototype.module = function (moduleName, moduleDefinition) {
		var self = this,
			moduleString,
			moduleRegExp = /^function(.*?)\((.*?)\)/gi,
			moduleDeps,
			moduleDepsArr,
			dependenciesSatisfied = 0, gotDependency, depIndex;
		
		if (!moduleName) {
			throw('You must name your module!');
		}
		
		if (!moduleDefinition) {
			throw('You must provide a function as the second argument to app.module()!');
		}
		
		// Stringify the module function
		moduleString = moduleDefinition.toString();
		
		// Scan module function string to extract dependencies
		// via the regular expression. The dependencies this module
		// has will be a string in the moduleDeps array at index 2
		// if any dependencies were provided.
		moduleDeps = moduleRegExp.exec(moduleString);
		
		// Check if the module has dependencies
		if (!moduleDeps || !moduleDeps.length || moduleDeps[2] === "") {
			// No dependencies were found, just register the module
			return this._registerModule(moduleName, moduleDefinition, []);
		}
		
		// Clean the dependency list by removing whitespace
		moduleDeps[2] = moduleDeps[2].replace(/ /gi, '');
		
		// Convert dependency list to an array
		moduleDepsArr = moduleDeps[2].split(',');
		
		// Grab the dependencies we need - this is a really simple way
		// to check we got our dependencies by how many times this function
		// gets called. Quick and dirty - I'm writing a game of life sim
		// here rather than a dependency injection lib after all.
		gotDependency = function (dependencyName, dependency) {
			var depArgumentArr = [],
				depArgumentIndex;
			
			dependenciesSatisfied++;
			
			console.log('Module "' + moduleName + '" found dependency "' + dependencyName + '"');
			
			// Check which index this dependency should be in
			depArgumentIndex = moduleDepsArr.indexOf(moduleName);
			
			// Assign the dependency to the correct argument index
			depArgumentArr[depArgumentIndex] = dependency;
			
			// Check if we have all the dependencies we need
			if (dependenciesSatisfied === moduleDepsArr.length) {
				// We have our dependencies, load the module! YAY!
				console.log('Module "' + moduleName + '" has all required dependencies, loading...');
				return self._registerModule(moduleName, moduleDefinition, depArgumentArr);
			}
		};
		
		// Register our dependency handler for each dependency
		for (depIndex = 0; depIndex < moduleDepsArr.length; depIndex++) {
			this._waitForModule(moduleDepsArr[depIndex], gotDependency);
		}
	};
	
	/**
	 * Adds the passed callback function to an array that will be
	 * processed once the named module has loaded.
	 * @param {String} name The name of the module to wait for.
	 * @param {Function} callback The function to call once the
	 * named module has loaded.
	 * @returns {App} Returns "this" for method chaining.
	 * @private
	 */
	App.prototype._waitForModule = function (name, callback) {
		// Add the callback to the waiting list for this module
		this._waiting[name] = this._waiting[name] || [];
		this._waiting[name].push(callback);
		
		return this;
	};
	
	/**
	 * Called when a module has loaded and will loop the array of
	 * waiting functions that have registered to be called when the
	 * named module has loaded, telling them the module is now
	 * available to use.
	 * @param {String} name The name of the module that has loaded.
	 * @private
	 */
	App.prototype._moduleLoaded = function (name) {
		var waitingArr,
			waitingIndex;
		
		// Tell any modules waiting for this one that we are
		// loaded and ready
		waitingArr = this._waiting[name];
		
		if (!waitingArr || !waitingArr.length) {
			// Nothing is waiting for us, exit
			return;
		}
		
		// Loop the waiting array and tell the receiver that
		// this module has loaded
		for (waitingIndex = 0; waitingIndex < waitingArr.length; waitingIndex++) {
			waitingArr[waitingIndex](name, this._modules[name]);
		}
		
		// Clear the waiting array for this module
		delete this._waiting[name];
	};
	
	/**
	 * Registers a module by executing the module function and
	 * storing the result under the _modules object by name.
	 * @param {String} name The name of the module to store.
	 * @param {Function} func The module function to execute and
	 * store the return value of.
	 * @param {Array} args The array of modules that this module
	 * asked for as dependencies.
	 * @private
	 */
	App.prototype._registerModule = function (name, func, args) {
		console.log('Module "' + name + '" loaded');
		this._modules[name] = func.apply(func, args);
		this._moduleLoaded(name);
	};
	
	window.app = new App();
})();