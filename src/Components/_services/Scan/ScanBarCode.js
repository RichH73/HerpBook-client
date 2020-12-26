import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import QrReader from 'react-qr-reader';

// import query from 'query-string';
import './ScanBarCode.css';

class ScanQr extends Component {
	state = {
		data: false,
	};

	componentDidMount() {}

	handleScan = (data) => {
		// example https://www.herpbook.com/view_animal?id=5fb2b403aafd835967422be0
		if (data) {
			let idCode = data.split('?id=')[1];
			console.log('some data', idCode);
			if (!!idCode.length) {
				this.props.newBarCode(idCode);
				this.props.history.push(`/search_collections/${idCode}`);
			}
		}
	};

	render() {
		//let id = !!this.state.result ? query.parse(this.state.result).id : 'No Results';
		return (
			// <div className='collections-bar-code-scanner'>
			<QrReader
				delay={300}
				onError={this.handleError}
				onScan={this.handleScan}
				style={{ width: '50%', margin: '3em', position: 'fixed', zIndex: '1' }}
			/>
			// </div>
		);
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	USERSURL: state.config.server.usersURL,
	URL: state.config.server.serverURL,
	userInfo: state.user,
	currentAnimal: state.viewAnimal,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ScanQr);
