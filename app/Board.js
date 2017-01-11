app.module('Board', function (Cell) {
	/**
	 * The board class. Handles setting up cell instances, rendering
	 * the game board and executing game ticks.
	 * @param {String} targetElementSelector The CSS selector of the
	 * element to render the game board to.
	 * @param {Number} width The width of the game board in cells.
	 * @param {Number} height The height of the game board in cells.
	 * @constructor
	 */
	var Board = function (targetElementSelector, width, height) {
		// Set some defaults
		this._width = width || 10;
		this._height = height || 10;
		
		// Setup the cell array
		this._cells = [];
		
		// Remember the target element we will render to
		this._renderTargetSelector = targetElementSelector;
		
		// Grab the render element
		this._elem = document
			.querySelector(this._renderTargetSelector);
		
		// Calculate the width and height in CSS of the board container element
		// ** with more time, I would have read the CSS styles in browser and used
		// that value instead of hard-coding 10 here ** - we add 2 to the end as the
		// board has a border of 1px on both sides of an axis === 2px.
		this._elem.style.width = String((width * 10) + 2); // Cells are 10 pixels width
		this._elem.style.height = String((height * 10) + 2); // Cells are 10 pixels height
	};
	
	/**
	 * Initialises a new board based on the board's width and height.
	 */
	Board.prototype.init = function () {
		var x, y;
		
		// Clear the board's HTML
		this._elem.innerHTML = "";
		
		// Loop over x and y axis and generate a new blank
		// cell instance for each cell on the board
		for (y = 0; y < this._height; y++) {
			for (x = 0; x < this._width; x++) {
				// Ensure we have a y axis array for this x axis
				this._cells[x] = this._cells[x] || [];
				
				// Create the new cell
				this._cells[x][y] = new Cell(this._renderTargetSelector, x, y);
			}
		}
	};
	
	/**
	 * Destroys all cells in the board and removes any reference to them.
	 */
	Board.prototype.destroy = function () {
		// Clear the board's HTML
		this._elem.innerHTML = "";
		
		// Clear references to all cells
		this._cells = [];
	};
	
	return Board;
});