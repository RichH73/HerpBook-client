import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import Modal from 'react-modal';
import './alert-modal.css';

class AlertModal extends React.Component {
	state = {};

	componentDidMount() {}

	render() {
		return (
			<Modal
				isOpen={this.props.modalState}
				className="Modal"
				overlayClassName="Overlay"
				shouldCloseOnOverlayClick={false}
				contentLabel="Modal"
				//onAfterOpen={this.afterOpenModal}
				//onRequestClose={closeModal}
				//style={customStyles}
				//contentLabel="Example Modal"
			>
				Update Success
			</Modal>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		API: state.config.server.serverAPI,
		modalState: state.alertModal.modalIsOpen,
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AlertModal);
