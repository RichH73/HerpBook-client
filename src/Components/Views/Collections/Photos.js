import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/index';

class Photos extends Component {
	state = {};

	componentDidMount() {}

	largImage = (img) => {
		this.props.displayLargeImage({
			display: 'block',
			img: `${img.URL}/${img.large}`,
			name: img.large,
		});
	};

	imageMap = () => {
		return this.props.moreImages.map((image) => {
			return (
				<div className={`collections-animal-image-${image.thumbnail}`}>
					<img src={`${image.URL}/${image.thumbnail}`} alt={image.thumbnail} onClick={() => this.largImage(image)} />
					<label>{image.large}</label>
				</div>
			);
		});
	};

	render() {
		return <div className="collections-animal-more-images">{this.imageMap()}</div>;
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	USERSURL: state.config.server.usersURL,
	URL: state.config.server.serverURL,
	userInfo: state.user,
	React: state.config.analytics,
	moreImages: state.viewAnimal.images,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Photos);
