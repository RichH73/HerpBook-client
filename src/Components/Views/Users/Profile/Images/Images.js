import React, { Component } from 'react';
import axios from 'axios';
import './Images.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../../../../../actions/index';
//import Spinner from 'react-spinner-material';
//Google analytics
//import ReactGA from "react-ga";

class Profile extends Component {
	state = {
		album: [],
		files: [],
		loading: true,
		floating_img: false,
		directory: '',
	};

	componentDidMount() {
		this.props.loader(true);
		axios({
			method: 'post',
			url: `${this.props.server_address}/pictures/albums/`,
			data: {
				username: this.props.username,
				uid: this.props.uid,
			},
		}).then((response) => {
			this.props.loader(false);
			this.props.user_pictures(response.data);
			this.setState({
				loading: false,
			});
		});
	}

	componentWillUnmount() {
		this.props.clear_props();
		this.props.loader(false);
	}

	click_handler = (album_name, album_files) => {
		this.setState({
			album: album_name,
			files: album_files,
		});
	};

	hide_img = () => {
		this.setState({
			floating_img: true,
		});
	};

	close_floating_image = () => {
		this.setState({ floating_img: false });
		return;
	};

	display_image = (file) => {
		this.setState({
			file: file,
			floating_img: true,
		});
	};

	display_album = () => {
		return (
			<div className="public-profile-user-pictures">
				{this.state.files.map((file) => (
					<div>
						<img
							src={`${this.props.USERSURL}/${this.props.username}/images/${this.state.album}/${file}`}
							alt=""
							onClick={() => this.display_image(file)}
						/>
					</div>
				))}
			</div>
		);
	};

	/*
  {this.state.floating_img === true ? <div className='public-profile-user-picture-display'>
    <img src={`${this.props.USERSURL}/${this.props.username}/images/${this.state.album}/${file}`} alt=''/></div> : ''}
*/

	render() {
		return (
			<div className="public-profile-album-body">
				{this.state.floating_img === true ? (
					<div className="public-profile-user-picture-display-gray-back" onClick={this.close_floating_image}>
						<div className="public-profile-user-picture-display">
							<img src={`${this.props.USERSURL}/${this.props.username}/images/${this.state.album}/${this.state.file}`} alt="" />
						</div>
					</div>
				) : (
					''
				)}

				<div className="public-profile-user-albums">
					{this.props.albums.map((album) => (
						<div className="publick-profile-album-gray-box">
							<div className="public-profile-album-link" onClick={() => this.click_handler(album.directory, album.files)}>
								{album.name}
							</div>
							{album.description !== '' ? <div className="public-profile-album-description">{album.description}</div> : ''}
						</div>
					))}
				</div>
				<div className="public-profile-album-box">
					<this.display_album />
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		uid: state.user_profile.uid,
		username: state.user_profile.username,
		server_address: state.config.server_address,
		albums: state.pictures.albums,
		loading: state.loader.loading,
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
