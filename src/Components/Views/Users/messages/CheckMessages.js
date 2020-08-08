import React from 'react';
// import axios from "axios";
import { connect } from 'react-redux';
// import {server_address} from "../../functions/helper_functions/Data";

class CheckMessages extends React.Component {
	componentDidMount() {
		if (localStorage.token) {
			//   axios({
			//     method: "get",
			//     url: `${this.props.server_address}/users/api/message-view`,
			//     responseType: "json",
			//     headers: { Authorization: "token " + localStorage.token }
			//   }).then(res => {
			//     // eslint-disable-next-line
			//     if (res.status === 200 && res.data.length > 0) {
			//       this.props.dispatch({
			//         type: "NEW_MESSAGES",
			//         messageCount: res.data.length,
			//         messages: res.data
			//       });
			//     }
			//   });
		}
	}

	render() {
		return <div></div>;
	}
}

const mapStateToProps = (state) => ({
	// newUser: state.user.username,
	// loggedIn: state.userLogin
});

export default connect(mapStateToProps)(CheckMessages);
