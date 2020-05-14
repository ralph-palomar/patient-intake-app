import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import './index.css';

import { api } from './config.js';
import React from 'react';
import ReactDOM from 'react-dom';
// eslint-disable-next-line no-unused-vars
import { Profile } from './home.js';
import axios from 'axios';
import ons from 'onsenui';
import Cookies from 'universal-cookie';

export const cookies = new Cookies();

export function login() {
  const email = document.querySelector('#index_email').value;
  const password = document.querySelector('#index_password').value;

  if (!email || !password) {
	showAlert("Please enter username/password");
  } else {
	  const config = {
		"url": api.users_api_base_url + "/v1/users",
		"method": "GET",
		"timeout": api.users_api_timeout,
		"headers": {
		  "email": email,
		  "password": password,
		  "Authorization": api.users_api_authorization
		}
	  };
	  callApi(config, (data) => {
		if (Object.keys(data).length !== 0) {
		  setLoginCookie(data);
		  home();
		}
	  }, 'login');
  }
}

export function register() {
  const navigator = document.querySelector('#navigator');
  navigator.pushPage('register.html')
}

export function createAccount() {
  const email = document.querySelector('#register_email').value;
  const firstname = document.querySelector('#register_firstname').value;
  const lastname = document.querySelector('#register_lastname').value;
  const passwd = document.querySelector('#register_password').value;
  const cpasswd = document.querySelector('#register_cpassword').value;
  
  if (validateRegistrationForm(email, firstname, lastname, passwd, cpasswd)) {
    const payload = {
		"email": email,
		"password": passwd,
		"firstname": firstname,
		"lastname": lastname,
		"type": "user",
		"enabled": true
	};
	const config = {
		"url": api.users_api_base_url + "/v1/users",
		"method": "POST",
		"timeout": api.users_api_timeout,
		"headers": {
			"Content-Type": "application/json",
			"Authorization": api.users_api_authorization
		},
		"data": payload
	};
	callApi(config, (data) => {
		if (Object.keys(data).length !== 0) {
			showAlert("Account successfully created")
			back();
		}
	}, 'register');
  }
}

export function back() {
  const navigator = document.querySelector('#navigator');
  navigator.popPage();
}

function home() {
  const navigator = document.querySelector('#navigator');
  navigator.pushPage('home.html');
}

export function logout() {
  const navigator = document.querySelector('#navigator');
  navigator.resetToPage('login.html', { pop: true });
  cookies.remove('app-login');
}

/////// HELPER FUNCTIONS ///////

function validateRegistrationForm(email, firstname, lastname, passwd, cpasswd) {
  if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
	  showAlert('Invalid Email Address');
  } else if (firstname.length === 0) {
	  showAlert('First Name is blank');
  } else if (lastname.length === 0) {
	  showAlert('Last Name is blank');
  } else if (passwd.length === 0) {
	  showAlert('Password is blank');
  } else if (cpasswd.length === 0) {
	  showAlert('Confirm Password is blank');
  } else if (passwd.length < 8) {
	  showAlert('Password must be at least 8 characters');
  } else if (passwd !== cpasswd) {
	  showAlert('Passwords don\'t match');
  } else {
	  return true;
  }
  return false;
}

export async function callApi(config, successCallback, caller) {
	const progress_bar = document.querySelector('#'+caller+'_pb');
	if (progress_bar != null) progress_bar.style.display = 'block';
	await axios(config)
		.then((response) => {
			if (!response.data.error) {
				successCallback(response.data);
			} else {
				showAlert(response.data.error);
				successCallback({})
			}
			if (progress_bar != null) progress_bar.style.display = 'none';
		})
		.catch((error) => {
			console.log(error);
			showAlert('Connection failed');
			if (progress_bar != null) progress_bar.style.display = 'none';
		});
}

export function showAlert(msg) {
	ons.notification.alert(msg);
}

export function formatDate(date) {
	return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
}

function setLoginCookie(data) {
	let d = new Date();
	d.setDate(d.getDate() + 7); //+7days
	cookies.set('app-login', data, {
		path: '/',
		expires: d
	});
}

////////////////////////////////////////////////////////////////////////////////////////////////

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeLogin: cookies.get('app-login') != null
		}
	}
	render() {
		const landingPage = this.state.activeLogin ? "home.html" : "login.html";

		return (
		<React.Fragment>
			<ons-navigator swipeable id="navigator" page={landingPage}>
			</ons-navigator>
		</React.Fragment>
		);

	}
}

export class ConfirmDialog extends React.Component {
	handleCancel = (event) => {
		this.dialog.hide();
	}
	render() {
		return (
			<ons-alert-dialog id="confirm-dialog" style={{position: 'fixed'}} modifier="rowfooter" ref={ref => {this.dialog = ref}}>
				<div className="alert-dialog-title">Confirm</div>
				<div className="alert-dialog-content">
					{this.props.message}
				</div>
				<div className="alert-dialog-footer">
					<ons-alert-dialog-button onClick={this.handleCancel}>Cancel</ons-alert-dialog-button>
					<ons-alert-dialog-button onClick={this.props.onOk}>OK</ons-alert-dialog-button>
				</div>
			</ons-alert-dialog>
		);
	}
}

window.onload = () => ReactDOM.render(<App/>, document.querySelector('div#root'));