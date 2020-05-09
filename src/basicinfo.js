import React from 'react';
import DatePicker from 'react-date-picker';
import TimePicker from 'react-time-picker';
import { callApi, showAlert, cookies } from './index.js';
import { api } from './config.js';

export class Save extends React.Component {
	handleClick = (event) => {
		const payload = {
			id: cookies.get('app-login').email,
			basic_lastname: document.querySelector('#basic_lastname').value,
			basic_firstname: document.querySelector('#basic_firstname').value,
			basic_middlename: document.querySelector('#basic_middlename').value,
			basic_dob: document.querySelector('#basic_dob').innerHTML,
			basic_gender: document.querySelector('#basic_gender').value,
			basic_addr: document.querySelector('#basic_addr').value,
			basic_landlineno: document.querySelector('#basic_landlineno').value,
			basic_mobileno: document.querySelector('#basic_mobileno').value,
			basic_email: document.querySelector('#basic_email').value,
			basic_supportperson: document.querySelector('#basic_supportperson').value,
			basic_relationship: document.querySelector('#basic_relationship').value,
			basic_supportcontactno: document.querySelector('#basic_supportcontactno').value
		};
		const config = {
			"url": api.users_api_base_url + "/v1/basicInfo",
			"method": "POST",
			"timeout": 60000,
			"headers": {
				"Content-Type": "application/json"
			},
			"data": payload
		};
		callApi(config, (data) => {
			showAlert("Successfully saved data");
		}, 'basic');
	}
	render() {
		return (
			<ons-button modifier="quiet" onClick={this.handleClick}>Save</ons-button>
		);
	}
}

export class BasicInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {}
		const config = {
			"url": api.users_api_base_url + "/v1/basicInfo",
			"method": "GET",
			"timeout": 60000,
			"params": {
				"id": cookies.get('app-login').email
			}
		};
		callApi(config, (data) => {
			this.setState(data);
		}, 'basic');
	}
	render() {
		return (
			<React.Fragment>
				<ons-list-item>
					<label className="form">Last Name</label><br />
					<ons-input id="basic_lastname" modifier="material" value={this.state.basic_lastname || ""}></ons-input>
				</ons-list-item>
				<ons-list-item>
					<label className="form">First Name</label><br />
					<ons-input id="basic_firstname" modifier="material" value={this.state.basic_firstname || ""}></ons-input>
				</ons-list-item>
				<ons-list-item>
					<label className="form">Middle Name</label><br />
					<ons-input id="basic_middlename" modifier="material" value={this.state.basic_middlename || ""}></ons-input>
				</ons-list-item>
				<ons-list-item>
					<label className="form">Date of Birth</label><br />
					<div id="basic_dob" style={{display: 'none'}}>{this.state.basic_dob}</div>
					<DatePickerComponent value={() => this.state.basic_dob}/>
				</ons-list-item>
				<ons-list-item>
					<label className="form">Gender</label>
					<select className="select-input" id="basic_gender" modifier="material">
						<option value="Male" selected={this.state.basic_gender === "Male" ? true : false}>Male</option>
						<option value="Female" selected={this.state.basic_gender === "Female" ? true : false}>Female</option>
					</select>
				</ons-list-item>
				<ons-list-item>
					<label className="form">Address</label><br />
					<textarea id="basic_addr" className="textarea" rows="3" cols="35" defaultValue={this.state.basic_addr || ""}></textarea>
				</ons-list-item>
				<ons-list-item>
					<label className="form">Landline No.</label><br />
					<ons-input type="number" id="basic_landlineno" modifier="material" value={this.state.basic_landlineno || ""}></ons-input>
				</ons-list-item>
				<ons-list-item>
					<label className="form">Mobile No.</label><br />
					<ons-input type="number" id="basic_mobileno" modifier="material" value={this.state.basic_mobileno || ""}></ons-input>
				</ons-list-item>
				<ons-list-item>
					<label className="form">Email Address</label><br />
					<ons-input type="email" id="basic_email" modifier="material" value={this.state.basic_email || ""}></ons-input>
				</ons-list-item>
				<ons-list-item>
					<label className="form">Support Person</label><br />
					<ons-input id="basic_supportperson" modifier="material" value={this.state.basic_supportperson || ""}></ons-input>
				</ons-list-item>
				<ons-list-item>
					<label className="form">Relationship</label><br />
					<ons-input id="basic_relationship" modifier="material" value={this.state.basic_relationship || ""}></ons-input>
				</ons-list-item>
				<ons-list-item>
					<label className="form">Support Contact No.</label> <br />
					<ons-input type="number" id="basic_supportcontactno" modifier="material" value={this.state.basic_supportcontactno || ""}></ons-input><br />
				</ons-list-item>
			</React.Fragment>
		);
	}
}

export class DatePickerComponent extends React.Component {
	constructor(props) {
		super(props);
		console.log(this.props.value)
		this.state = {
			date: new Date()
		}
	}
	componentDidMount() {
		this.setDate(this.state.date);
	}
	setDate(date) {
		const basic_dob = document.querySelector('#basic_dob');
		if (date != null && basic_dob != null) {
			basic_dob.innerHTML = date.toLocaleDateString();
		}
	}
	onChange = date => {
		this.setState({ date });
		this.setDate(date);
	}
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
		time: new Date().getHours() + ':' + new Date().getMinutes(),
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