app.module('Cell', function () {
	/**
	 * Cell class. Used to instantiate new cells on the game board.
	 * @param {String} boardElementSelector The board's render target
	 * element where this cell will create its DOM element.
	 * @param {Number} x The cell's x co-ordinate (zero-based index).
	 * @param {Number} y The cell's y co-ordinate (zero-based index).
	 * @constructor
	 */
	var Cell = function (boardElementSelector, x, y) {
		// Check for required params
		if (isNaN(parseInt(x, 10))) {
			throw('Cell must be given an x co-ordinate as an integer!');
		}
		
		if (isNaN(parseInt(y, 10))) {
			throw('Cell must be given an y co-ordinate as an integer!');
		}
		
		// Store the board's element
		this._boardElementSelector = boardElementSelector;
		
		// Create a DOM element for this cell
		this._elem = document.createElement('div');
		
		// Set defaults
		this.x(x);
		this.y(y);
		this.alive(false);
		
		// Append the cell DOM element to the board's DOM container
		document
			.querySelector(this._boardElementSelector)
			.appendChild(this._elem);
		
		// Register DOM events for this cell
		this.registerEvents();
	};
	
	/**
	 * Registers DOM events for this cell.
	 */
	Cell.prototype.registerEvents = function () {
		var self = this;
		
		this._elem.addEventListener('click', function () {
			// The cell has been clicked, toggle the alive status
			self.toggleAlive();
		});
	};
	
	/**
	 * Toggles the alive flag for the cell.
	 */
	Cell.prototype.toggleAlive = function () {
		this.alive(!this.alive());
	};
	
	/**
	 * Gets / sets the cell's x co-ordinate.
	 * @param {Number=} val Optional. If provided, sets the cell's
	 * x co-ordinate on the game board. If omitted, gets the cell's
	 * current x co-ordinate and returns it.
	 * @returns {Cell|Number} If "val" is provided, returns "this"
	 * to allow method chaining. If omitted, returns the current
	 * value.
	 */
	Cell.prototype.x = function (val) {
		if (val !== undefined) {
			this._x = val;
			return this;
		}
		
		return this._x;
	};
	
	/**
	 * Gets / sets the cell's y co-ordinate.
	 * @param {Number=} val Optional. If provided, sets the cell's
	 * y co-ordinate on the game board. If omitted, gets the cell's
	 * current y co-ordinate and returns it.
	 * @returns {Cell|Number} If "val" is provided, returns "this"
	 * to allow method chaining. If omitted, returns the current
	 * value.
	 */
	Cell.prototype.y = function (val) {
		if (val !== undefined) {
			this._y = val;
			return this;
		}
		
		return this._y;
	};
	
	/**
	 * Gets / sets the cell's alive flag.
	 * @param {Boolean=} val Optional. If provided, sets the cell's
	 * alive flag and subsequent colour on the game board. If omitted,
	 * gets the cell's current alive flag value and returns it.
	 * @returns {Cell|Boolean} If "val" is provided, returns "this"
	 * to allow method chaining. If omitted, returns the current
	 * value.
	 */
	Cell.prototype.alive = function (val) {
		if (val !== undefined) {
			// Store alive flag
			this._alive = val;
			
			// Set CSS for the cell element
			this._elem.className = 'cell ' + (this._alive ? 'alive' : 'dead');
			
			return this;
		}
		
		return this._alive;
	};
	
	/**
	 * Process a game tick for this cell.
	 * @param {Board} board The current game board instance that this
	 * cell belongs to.
	 * @returns {Boolean} True if the cell is alive or false if dead /
	 * clear.
	 */
	Cell.prototype.tick = function (board) {
		var neighbours,
			neighbourCount = 0,
			index;
		
		// Get the number of neighbours for this cell
		neighbours = board.getCellNeighbours(this.x(), this.y());
		
		// Count neighbours that are alive
		for (index = 0; index < neighbours.length; index++) {
			if (neighbours[index] && neighbours[index].alive()) {
				neighbourCount++;
			}
		}
		
		// Check if this cell is currently alive
		if (this.alive()) {
			// Check for solitude
			if (neighbourCount < 2) {
				return false;
			}
			
			// Check for overpopulation
			if (neighbourCount > 3) {
				return false;
			}
			
			// This cell has survived this tick!
			return true;
		}
		
		// Check for new population
		if (neighbourCount === 3) {
			return true;
		}
	};
	
	return Cell;
});

