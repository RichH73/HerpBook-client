import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../../actions/index';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './Collections.css';
import Pairings from './Records/Pairing/Pairings';
import Feedings from './Records/Feeding/Feedings';
import Sheddings from './Records/Shedding/Sheddings';
import Weight from './Records/Weights/Weight';
import Animal from './AnimalView/Animal';
import Photos from './Photos';
import PrintRecords from './Activity/Printing/PrintRecords';
import CollectionList from './Activity/Classified/CollectionList';
import Activity from './Activity/Activity';
import axios from 'axios';
import ScanQr from '../../../_services/Scan/ScanBarCode';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ToPrint from '../../../_services/Print/PrintCards/ToPrint';
import Settings from './Activity/Settings/Settings';

import Button from 'react-bootstrap/Button';
import ReactToPrint from 'react-to-print';
import { NavItem } from 'react-bootstrap';

class Main extends Component {
	state = {
		viewing: 'ANIMAL',
	};

	componentDidMount() {
		if (this.props.location.searchString) {
			axios({
				method: 'post',
				url: `${this.props.API}/collections/search`,
				headers: {
					Authorization: `Bearer ${localStorage.token}`,
				},
				data: {
					id: this.props.location.searchString, //query.parse(this.props.location.search).id,
				},
			})
				.then((response) => {
					if (response.status === 201) {
						this.props.currentAnimalDisplay(response.data[0]);
						//this.props.setPageTitle(`Viewing Collection: ${this.props.currentAnimal._id}`);
						//this.props.history.push('/view_animal')
					}
				})
				.catch((error) => {
					if (error) {
						console.log('An error has occured', error);
					}
				});
		}

		this.props.setPageTitle(`Viewing Collection: ${this.props.currentAnimal._id}`);
	}

	componentWillUnmount() {
		this.props.hideLargeImage();
		this.props.clearCurrentAnimalDisplay();
		this.props.clearRecordsEditor();
	}

	showHideScanner = () => {
		if (!!this.state.showScanner) {
			this.setState({
				showScanner: false,
			});
		}
		if (!this.state.showScanner) {
			this.setState({
				showScanner: true,
			});
		}
	};

	tabs = () => {
		return (
			<div className="collections-tab-header">
				<div className="my-collections-qr-search">
					<img src="/images/scan_100.png" alt="scan" onClick={this.showHideScanner} />
					{!!this.state.showScanner ? <ScanQr history={this.props.history} /> : ''}
				</div>
				<Tabs>
					<TabList>
						<Tab>Animal</Tab>
						<Tab>Records</Tab>
						<Tab>Activity</Tab>
						<Tab>Photos</Tab>
					</TabList>
					<div className="collections-tab-body">
						<TabPanel>
							<Animal searchString={''} />
						</TabPanel>
						<TabPanel>
							<Tabs>
								<TabList>
									<Tab>Feedings</Tab>
									<Tab>Pairings</Tab>
									<Tab>Sheddings</Tab>
									<Tab>Weights</Tab>
								</TabList>
								<TabPanel>
									<Feedings />
								</TabPanel>
								<TabPanel>
									<Pairings />
								</TabPanel>
								<TabPanel>
									<Sheddings history={this.props.history} />
								</TabPanel>
								<TabPanel>
									<Weight history={this.props.history} />
								</TabPanel>
							</Tabs>
						</TabPanel>
						<TabPanel>
							<Activity history={this.props.history} />
						</TabPanel>
						<TabPanel>
							<Photos />
						</TabPanel>
					</div>
				</Tabs>
			</div>
		);
	};

	printIdCard = () => {
		return (
			<React.Fragment>
				<div className="id-card-preview">
					<ToPrint ref={(el) => (this.componentRef = el)} />
				</div>
				<ReactToPrint
					copyStyles={false}
					trigger={() => {
						return (
							//TODO review this a href ref
							// eslint-disable-next-line
							<div style={{ textAlign: 'center', width: '50%' }}>
								<a href="#">
									<Button className="button" style={{ width: '120px', marginLeft: '20px' }}>
										Print ID Card
									</Button>
								</a>
							</div>
						);
					}}
					content={() => this.componentRef}
				/>
			</React.Fragment>
		);
	};

	componentSelector = (viewtype) => {
		this.setState({
			viewing: viewtype,
		});
	};

	componentView = () => {
		switch (this.state.viewing) {
			case 'ANIMAL':
				return <Animal />;
			case 'FEEDINGS':
				return <Feedings />;
			case 'PRINTRECORDS':
				return <PrintRecords />;
			case 'SHEDDING':
				return <Sheddings />;
			case 'WEIGHT':
				return <Weight />;
			case 'PAIRINGS':
				return <Pairings />;
			case 'IDCARD':
				return <this.printIdCard />;
			case 'CLASSIFIEDLIST':
				return <CollectionList />;
			case 'SETTINGS':
				return <Settings history={this.props.history} />;
			case 'GALLERY':
				return <Photos />;
			default:
				return <Animal />;
		}
	};

	render() {
		if (!this.props.currentAnimal._id.length) {
			return <div style={{ margin: 'auto', textAlign: 'center' }}>No collection record selected</div>;
		}
		const navStyles = { color: 'black', fontWeight: 'bold', cursor: 'pointer' };
		return (
			<React.Fragment>
				<Navbar style={{ backgroundColor: 'orange' }} variant="light" collapseOnSelect expand="sm">
					{!!this.state.showScanner ? <ScanQr history={this.props.history} /> : ''}
					<Nav className="mr-auto">
						<Nav.Link onClick={() => this.componentSelector('ANIMAL')} style={navStyles}>
							Animal
						</Nav.Link>

						<NavDropdown title="Records" variant="light" id="collasible-nav-dropdown">
							<NavDropdown.Item onClick={() => this.componentSelector('FEEDINGS')}>Feeding</NavDropdown.Item>
							<NavDropdown.Item onClick={() => this.componentSelector('PAIRINGS')}>Pairing</NavDropdown.Item>
							<NavDropdown.Item onClick={() => this.componentSelector('SHEDDING')}>Sheds</NavDropdown.Item>
							<NavDropdown.Item onClick={() => this.componentSelector('WEIGHT')}>Weights</NavDropdown.Item>
						</NavDropdown>

						<NavDropdown title="Printing" id="collasible-nav-dropdown">
							<NavDropdown.Item onClick={() => this.componentSelector('IDCARD')}>Collection Card</NavDropdown.Item>
							<NavDropdown.Item onClick={() => this.componentSelector('PRINTRECORDS')}>Print Records</NavDropdown.Item>
						</NavDropdown>

						<NavDropdown title="Activity" id="collasible-nav-dropdown">
							<NavDropdown.Item onClick={() => this.componentSelector('CLASSIFIEDLIST')}>Classified Listing</NavDropdown.Item>
							<NavDropdown.Item onClick={() => this.componentSelector('SETTINGS')}>Collection Settings</NavDropdown.Item>
						</NavDropdown>
						<Nav.Link onClick={() => this.componentSelector('GALLERY')} style={navStyles}>
							Gallery
						</Nav.Link>
					</Nav>
					<Navbar.Brand onClick={() => this.showHideScanner()}>
						<img src="/images/scan_100.png" alt="scan" onClick={this.showHideScanner} style={{ width: '40px' }} />
					</Navbar.Brand>
				</Navbar>
				{this.componentView()}
			</React.Fragment>
		);
		//this.tabs();
	}
}

const mapStateToProps = (state) => ({
	API: state.config.server.serverAPI,
	USERSURL: state.config.server.usersURL,
	URL: state.config.server.serverURL,
	userInfo: state.user,
	React: state.config.analytics,
	currentAnimal: state.viewAnimal,
	selectedAnimalId: state.selectedAnimal.id,
	collectionsIds: state.myCollections,
});

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
