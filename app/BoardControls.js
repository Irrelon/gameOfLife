app.module('Controls', function (Board) {
	var view = document.querySelector('#boardControls');
	
	// Handle the user clicking the next tick button
	view
		.querySelector('#nextTick')
		.addEventListener('click', function () {
			if (!app.state.board) {
				return alert('No board has been set up!');
			}
			
			// Execute a board tick
			app.state.board.tick();
		});
});