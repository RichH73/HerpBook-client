const initialPage = 'Welcome';
const pageId = (state = initialPage, page) => {
	switch (page.type) {
		case 'PageTitle':
			return page.pageTitle;
		default:
			return state;
	}
};

export default pageId;
