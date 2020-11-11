import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';
import './LargeImage.css';
import _ from 'lodash';

class LargeImage extends Component {
	state = {};

	componentDidMount() {}

	thisHide = () => {
		this.props.hideLargeImage();
	};

	render() {
		return (
			<React.Fragment>
				<div className="display-larg-image" style={{ display: this.props.imgDisplay.display }} onClick={this.thisHide}>
					<div className="display-large-inner-display">
						<img src={this.props.imgDisplay.img} alt={this.props.imgDisplay.name} />
						<div className="display-large-image-attrs">
							ImageName: {this.props.imgDisplay.name}
							<br />
							ImageURL: {this.props.imgDisplay.img}
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	USERSURL: state.config.server.usersURL,
	URL: state.config.server.serverURL,
	imgDisplay: state.showFloatingImage,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(LargeImage);
