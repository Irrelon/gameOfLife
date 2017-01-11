app.module('Controls', function (Board) {
	var view = document.querySelector('#boardControls'),
		handleTimerTick;
	
	handleTimerTick = function () {
		// Execute a board tick
		app.state.board.tick();
		
		if (app.state.autoTick) {
			setTimeout(handleTimerTick, app.state.autoTickInterval);
		}
	};
	
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
	
	// Handle the user clicking the toggle timer button
	view
		.querySelector('#toggleTimer')
		.addEventListener('click', function () {
			if (!app.state.board) {
				return alert('No board has been set up!');
			}
			
			if (app.state.autoTick) {
				// Turn off auto-tick
				app.state.autoTick = false;
				
				// Set button to "Start"
				this.innerHTML = 'Start';
			} else {
				// Turn off auto-tick
				app.state.autoTick = true;
				
				// Set button to "Stop"
				this.innerHTML = 'Stop';
				
				// Enable the timer
				handleTimerTick();
			}
		});
	
	// Handle the user changing the auto-tick interval
	view
		.querySelector('#autoTickInterval')
		.addEventListener('change', function () {
			if (this.value && parseInt(this.value, 10) > 0) {
				app.state.autoTickInterval = parseInt(this.value, 10);
			}
		});
});