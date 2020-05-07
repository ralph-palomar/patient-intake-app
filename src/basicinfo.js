import React from 'react';
import DatePicker from 'react-date-picker';

export class DatePickerComponent extends React.Component {
    state = {
		date: new Date(),
	  }
	
	  onChange = date => this.setState({ date })
	
	  render() {
		return (
			<DatePicker
			  onChange={this.onChange}
			  value={this.state.date}
			/>
		);
	  }
}