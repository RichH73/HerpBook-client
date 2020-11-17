import React, { Component } from 'react';
import SmallCard from './SmallCard';

class ToPrint extends Component {
	render() {
		return <SmallCard ref={(el) => (this.componentRef = el)} />;
	}
}
export default ToPrint;
