const initialState = {
	images: [],
	sendFiles: [],
	image_array: [],
};

const imageHandler = (state = initialState, files) => {
	switch (files.type) {
		case 'NEW_IMAGES':
			return {
				...files,
			};
		case 'DELETE_IMAGE':
			return {
				...files,
				images: state.images.filter((image) => image.path !== files.path),
				sendFiles: state.sendFiles.filter((image) => image.path !== files.path),
				image_array: state.image_array.filter((image) => image.path !== files.path),
			};
		case 'RESET':
			return {
				images: [],
				sendFiles: [],
				immage_array: [],
			};
		default:
			return state;
	}
};

export default imageHandler;
