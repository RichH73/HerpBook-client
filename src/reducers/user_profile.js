const initialState = {
	uid: '',
	username: '',
	email: '',
	about: '',
	image: '',
	first_name: '',
	last_name: '',
	street: '',
	city: '',
	state: '',
	zip_code: '',
	website: '',
	business_name: '',
	// posts: []
};

const postsInitialState = {
	posts: [],
};

const clear_user = initialState;

export const user_profile = (state = initialState, user) => {
	switch (user.type) {
		case 'USER_LOOKUP':
			return {
				...state,
				uid: user.data._id,
				username: user.data.username,
				email: user.data.email,
				about: user.data.about,
				profile_pic: user.data.profile_pic,
				first_name: user.data.first_name,
				last_name: user.data.last_name,
				street: user.data.street,
				city: user.data.city,
				state: user.data.state,
				zip_code: user.data.zip_code,
				website: user.data.website,
				business_name: user.data.business_name,
			};
		case 'CLEAR_USER':
			return clear_user;

		default:
			return state;
	}
};

export const user_posts = (state = postsInitialState, posts) => {
	switch (posts.type) {
		case 'USER_POSTS':
			return {
				posts: posts.data,
			};
		case 'NEW_POST':
			return {
				...posts.data,
			};
		case 'user_created_a_post':
			return {
				...state,
				posts: (state.posts.unshift(posts.post), state.posts.map((post) => post)),
			};

		case 'a_new_user_comment':
			state.posts.map((post) => {
				if (post._id === posts.comment.id) {
					post.comments.push(posts.comment);
				}
				return post;
			});
			return {
				...state,
			};
		default:
			return state;
	}
};
