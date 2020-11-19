import React, { Component } from 'react';
import './FormElements.css';

class FormElements extends Component {
	state = {};

	// returnType = (form) => {
	//     switch(form.type) {
	//         case 'button':
	//             return (
	//             <button name={form.name}>{form.name}</button>
	//             )
	//     }
	// }

	render() {
		const { type, name, readOnly } = this.props;
		console.log('form props', this.props);
		return (
			<div className={`form-element-input-field-${type}`}>
				<button name={name}>{name}</button>
				{/* {this.returnType()} */}
			</div>
		);
	}
}

export default FormElements;
