import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import './index.css';

import { api, defaultImg, login_cookie, cookieSettings } from './config.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { loadPage, getUserPhoto } from './home.js';
import axios from 'axios';
import ons from 'onsenui';
import Cookies from 'universal-cookie';
import FacebookLogin from 'react-facebook-login';

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
	document.querySelector('#confirm-dialog').show();
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

export async function callApi(config = {}, successCallback = (data)=>{}, caller = '', displayAlert=true) {
	const progress_bar = document.querySelector('#' + caller + '_pb');
	if (progress_bar != null) progress_bar.style.display = 'block';
	await axios(config)
		.then((response) => {
			if (!response.data.error) {
				successCallback(response.data);
			} else {
				if (displayAlert) showAlert(response.data.error);
				successCallback({})
			}
			if (progress_bar != null) progress_bar.style.display = 'none';
		})
		.catch((error) => {
			showAlert("" + error);
			if (progress_bar != null) progress_bar.style.display = 'none';
		});
}

export function showAlert(msg) {
	ons.notification.toast(msg, { timeout: 2000 });
}

export function formatDate(date) {
	if (date != null && date !== "") {
		return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
	}
	return null;
}

export function formatTime(date) {
	if (date != null && date !== "") {
		return (date.getHours() + "").padStart(2, '0') + ':' + (date.getMinutes() + "").padStart(2, '0');
	}
	return null;
}

export function formatToDateString(date) {
	if (date != null && date !== "") {
		const d = new Date(date);
		return d.toDateString();
	}
	return null;
}

export function formatToTimeString(date) {
	if (date != null && date !== "") {
		const d = new Date();
		const HH = date.split(':')[0];
		const mm = date.split(':')[1];
		d.setHours(HH);
		d.setMinutes(mm);
		d.setSeconds(0);
		return d.toLocaleTimeString();
	}
	return null;
}

export function setLoginCookie(data) {
	const cookieData = {
		email: data.email,
		firstname: data.firstname,
		lastname: data.lastname, 
		access_token: data.access_token,
		type: data.type,
		enabled: data.enabled,
		picture: data.thirdPartyLogin ? data.picture : null,
		thirdPartyLogin: data.thirdPartyLogin
	}
	console.log(cookieData)
	let d = new Date();
	d.setDate(d.getDate() + 7); //+7days
	cookies.set(login_cookie, cookieData, {
		path: cookieSettings.path,
		expires: d, 
		secure: cookieSettings.secure,
		sameSite: cookieSettings.sameSite
	});
}

export function _default(input, defaultValue) {
	if (input && input !== undefined && input != null && (input+"").trim() !== "") {
		return input;
	} else {
		return defaultValue;
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeLogin: cookies.get(login_cookie) != null
		}
	}
	responseFacebook = (userInfo) => {
		if (userInfo.accessToken != null) {
			const data = {
				email: userInfo.email,
				firstname: userInfo.name,
				type: "user",
				enabled: true,
				picture: userInfo.picture.data.url,
				thirdPartyLogin: true,
				access_token: userInfo.accessToken
			}
			setLoginCookie(data);
			this.nav.pushPage('home.html');
		}
	}
	handleLogout = () => {
		document.querySelector('#confirm-dialog').show();
		this.nav.resetToPage('login.html', { pop: true }).then(() => {
			this.renderFacebookLogin();
		});
		cookies.remove(login_cookie);
	}
	renderFacebookLogin = () => {
		const facebook_loginBtn = document.querySelector('div#facebook_loginBtn');
		if (facebook_loginBtn != null) {
			ReactDOM.render(
				<FacebookLogin
					appId="607869309830124"
					fields="name,email,picture"
					size="small"
					callback={this.responseFacebook}
					icon="fa-facebook"/>,
				facebook_loginBtn
			);
		}
	}
	componentDidMount() {		
		if (this.nav != null) {
			this.nav.addEventListener('postpush', () => {
				this.renderFacebookLogin();
				const confirm_logout = document.querySelector('div#confirm_logout');
				if (confirm_logout != null) {
					ReactDOM.render(<ConfirmDialog message="Are you sure you want to log out?" onOk={this.handleLogout} />, confirm_logout);
				}

				const badge = document.querySelector('#badge');
				if (badge != null) {
					getUserPhoto((data) => {
						ReactDOM.render(<Badge accountInfo={cookies.get(login_cookie)} picture={data.picture} />, badge);
					}, null, cookies.get(login_cookie).email)
				}
			});
		}
	}
	render() {
		const landingPage = this.state.activeLogin ? "home.html" : "login.html";

		return (
			<React.Fragment>
				<ons-navigator swipeable id="navigator" page={landingPage} ref={ref => { this.nav = ref }}>
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
			<ons-alert-dialog id="confirm-dialog" style={{ position: 'fixed' }} modifier="rowfooter" ref={ref => { this.dialog = ref }}>
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

class Badge extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			accountInfo: props.accountInfo,
			picture: props.picture
		}
	}
	render() {
    	const imgSrc = this.state.picture != null ? this.state.picture : defaultImg;
		return (
			<React.Fragment>
				<div className="left">
              		<img className="list-item--material__thumbnail" src={imgSrc} alt="Profile Pic" style={{width: '60px', height: '60px'}} onClick={()=>{loadPage('profile.html')}}></img>
            	</div>
				<div className="left">
					<b>{_default(this.state.accountInfo.firstname, "Firstname") + " " + _default(this.state.accountInfo.lastname, "")}</b>
				</div>
			</React.Fragment>
		)
	}
}

window.onload = () => {
	ReactDOM.render(<App />, document.querySelector('div#root'));
}