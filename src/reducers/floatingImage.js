const initialState = {
	display: 'none',
	img: '',
	name: '',
};

const showFloatingImage = (state = initialState, data) => {
	switch (data.type) {
		case 'floating_image':
			console.log(data);
			return {
				...state,
				display: data.display,
				img: data.img,
				name: data.name,
			};
		default:
			return state;
	}
};

export default showFloatingImage;
