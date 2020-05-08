import React from 'react';
import DatePicker from 'react-date-picker';
import TimePicker from 'react-time-picker';

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

export class TimePickerComponent extends React.Component {
	state = {
		time: new Date().getHours()+':'+new Date().getMinutes(),
	  }
	 
	  onChange = time => this.setState({ time })
	 
	  render() {
		return (
		  <div>
			<TimePicker
			  onChange={this.onChange}
			  value={this.state.time}
			/>
		  </div>
		);
	  }
}