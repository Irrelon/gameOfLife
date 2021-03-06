app.module('Controls', function (Board) {
	var view = document.querySelector('#appControls'),
		width,
		height;
	
	// Handle user clicking "createBoard" button
	view
		.querySelector('#createBoard')
		.addEventListener('click', function () {
			var width,
				height;
			
			// Create a new board based on the width and height selected by the user
			width = parseInt(view.querySelector('#boardWidth').value, 10);
			height = parseInt(view.querySelector('#boardHeight').value, 10);
			
			if (!width || width < 10) {
				return alert('Please select a board width greater or equal to 10!');
			}
			
			if (!height || height < 10) {
				return alert('Please select a board height greater or equal to 10!');
			}
			
			// Destroy any old board we might have
			if (app.state.board) {
				app.state.board.destroy();
				delete app.state.board;
			}
			
			// We have a width and height, create the board with the target
			// element "mainBoard"
			app.state.board = new Board('#mainBoard', width, height);
			app.state.board.init();
		});
	
	// Create a new board by default
	width = parseInt(view.querySelector('#boardWidth').value, 10);
	height = parseInt(view.querySelector('#boardHeight').value, 10);
	
	app.state.board = new Board('#mainBoard', width, height);
	app.state.board.init();
});