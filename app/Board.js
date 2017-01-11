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
	};
	
	Board.prototype.init = function () {
		// Loop over x and y axis and generate a new blank
		// cell instance for each cell on the board
		var x, y;
		
		for (y = 0; y < this._height; y++) {
			for (x = 0; x < this._width; x++) {
				this._cells[x][y] = new Cell(this._renderTargetSelector, x, y);
			}
		}
	};
	
	return Board;
});