import React from 'react';
import './Gallery.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../../../actions/index';
//import ReactGA from 'react-ga';
import dayjs from 'dayjs';

class Gallery extends React.Component {
	state = {};

	componentDidMount() {
		this.props.setPageTitle(this.props.listTitle);
	}

	setTitle = (title) => {
		this.props.setPageTitle(title);
	};

	componentWillUnmount() {
		//this.props.loader(false);
		//this.props.clearClassifiedData();
	}

	close_floating_image = () => {
		this.setState({ floating_img: false });
		return;
	};

	display_image = (img) => {
		let largImage = img.replace('thumb', 'large');
		this.setState({
			file: largImage,
			floating_img: true,
		});
	};

	largImage = (img) => {
		this.props.displayLargeImage({
			display: 'block',
			img: `${img.URL}/${img.large}`,
			name: img.large,
		});
	};

	imageMap = () => {
		return this.props.images.map((image) => {
			return (
				<div className="classifieds-images-image-box">
					<div className="classifieds-images-image-header">{image.thumbnail.replace('thumb_', '')}</div>
					<div className="classifieds-images-imgage-body">
						<img src={`${image.URL}/${image.thumbnail}`} alt={image.thumbnail} onClick={() => this.largImage(image)} />
					</div>
					<div className="classifieds-images-imgage-body-info">
						<p>Name: {image.large}</p>
						<p>Uploaded: {dayjs(image.date).format('MM/DD/YYYY')}</p>
					</div>
					<div className="classifieds-images-imgage-footer"></div>
				</div>
			);
		});
	};

	render() {
		return <div className="classifieds-images-gallery">{this.imageMap()}</div>;
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	USERSURL: state.config.server.usersURL,
	URL: state.config.server.serverURL,
	uid: state.user_profile.uid,
	username: state.user_profile.username,
	albums: state.pictures.albums,
	thumbnails: state.classified.listData.images.thumbnail,
	//loading: state.loader.loading,
	visitor_get_username: state.classified.listData.username,
	listTitle: state.classified.listData.title,
	classified_listing: state.classified.listData,
	images: state.classified.listData.images,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Gallery);
