const initial_state = {
	display: 'none',
};

export const spinner = (state = initial_state, spinner) => {
	switch (spinner.type) {
		case 'SPINNER_STATE':
			if (spinner.spinner === true) {
				return {
					display: 'block',
				};
			}
			if (spinner.spinner === false) {
				return {
					display: 'none',
				};
			}
			break;
		default:
			return state;
	}
};

const modalState = {
	modalIsOpen: false,
};
export const alertModal = (state = modalState, data) => {
	switch (data.type) {
		case 'modal_state':
			if (data.state === false)
				return {
					modalIsOpen: false,
				};
			if (data.state === true)
				return {
					modalIsOpen: true,
				};
			break;
		default:
			return state;
	}
};
