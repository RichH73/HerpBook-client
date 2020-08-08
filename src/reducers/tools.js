const initial_state = {
	display: 'none',
};

export const spinner = (state = initial_state, spinner) => {
	switch (spinner.spinner) {
		case true:
			return {
				display: 'block',
			};
		case false:
			return {
				display: 'none',
			};
		default:
			return state;
	}
};
