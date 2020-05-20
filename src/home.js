import React from 'react';
import ReactDOM from 'react-dom';
import { logout, back, createAccount, login, register, cookies, callApi } from './index.js'
import { Users } from './users.js'
import { BasicInfo } from './basicinfo.js';
import { Illnesses } from './illnesses.js';
import { Medications } from './medications.js';
import { VitalSigns } from './vitalsigns.js';
import { Diet } from './diet.js';
import { Others } from './others.js';
import { api } from './config.js';

window.fn = {};

window.fn.open = function () {
  const menu = document.getElementById('menu');
  menu.open();
};

window.fn.load = function (page) {
  const content = document.getElementById('content');

  content.load(page)
    .then(() => {
      const menu = document.getElementById('menu');
      menu.close();

      if (page === "profile.html") {
        const main = document.querySelector('div#main_display');
        ReactDOM.render(<Profile />, main);
      }

      if (page === "users.html") {
        const user_list = document.querySelector('div#user_list');
        ReactDOM.render(<Users />, user_list);
      }

      if (page === "basicinfo.html") {
        const basicinfo_form = document.querySelector('div#basicinfo_form');
        const config = {
          "url": api.users_api_base_url + "/v1/basicInfo",
          "method": "GET",
          "timeout": api.users_api_timeout,
          "headers": {
            "Authorization": api.users_api_authorization
          },
          "params": {
            "id": cookies.get('app-login').email
          }
        };
        callApi(config, (data) => {
          ReactDOM.render(<BasicInfo data={data} />, basicinfo_form);
        }, 'basic');

      }

      if (page === "illnesses.html") {
        const illnesses_list = document.querySelector('div#illnesses_list');
        const config = {
          "url": api.users_api_base_url + "/v1/illnesses",
          "method": "GET",
          "timeout": api.users_api_timeout,
          "headers": {
            "Authorization": api.users_api_authorization
          },
          "params": {
            "id": cookies.get('app-login').email
          }
        };
        callApi(config, (data) => {
          ReactDOM.render(<Illnesses data={data} />, illnesses_list);
        }, 'illnesses');

      }

      if (page === "medications.html") {
        const medications_list = document.querySelector('div#medications_list');
        const config = {
          "url": api.users_api_base_url + "/v1/medications",
          "method": "GET",
          "timeout": api.users_api_timeout,
          "headers": {
            "Authorization": api.users_api_authorization
          },
          "params": {
            "id": cookies.get('app-login').email
          }
        };
        callApi(config, (data) => {
          ReactDOM.render(<Medications data={data} />, medications_list);
        }, 'medications');
      }

      if (page === "vitalsigns.html") {
        const vitalsigns_list = document.querySelector('div#vitalsigns_list');
        const config = {
          "url": api.users_api_base_url + "/v1/vitalSigns",
          "method": "GET",
          "timeout": api.users_api_timeout,
          "headers": {
            "Authorization": api.users_api_authorization
          },
          "params": {
            "id": cookies.get('app-login').email
          }
        };
        callApi(config, (data) => {
          ReactDOM.render(<VitalSigns data={data} />, vitalsigns_list);
        }, 'vitalsigns');
      }

      if (page === "diet.html") {
        const diet_list = document.querySelector('div#diet_list');
        const config = {
          "url": api.users_api_base_url + "/v1/diet",
          "method": "GET",
          "timeout": api.users_api_timeout,
          "headers": {
            "Authorization": api.users_api_authorization
          },
          "params": {
            "id": cookies.get('app-login').email
          }
        };
        callApi(config, (data) => {
          ReactDOM.render(<Diet data={data} />, diet_list);
        }, 'diet');
      }

      if (page === "others.html") {
        const others_list = document.querySelector('div#others_list');
        const config = {
          "url": api.users_api_base_url + "/v1/others",
          "method": "GET",
          "timeout": api.users_api_timeout,
          "headers": {
            "Authorization": api.users_api_authorization
          },
          "params": {
            "id": cookies.get('app-login').email
          }
        };
        callApi(config, (data) => {
          ReactDOM.render(<Others data={data} />, others_list);
        }, 'diet');
      }

    });
};

window.fn.logout = logout;
window.fn.back = back;
window.fn.createAccount = createAccount;
window.fn.login = login;
window.fn.register = register;

export class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountInfo: cookies.get('app-login')
    }
  }
  render() {
    const defaultImg = "http://placekitten.com/g/40/40";
    const imgSrc = this.state.accountInfo.picture != null ? this.state.accountInfo.picture : defaultImg;
    return (
      <div id="main_page">
        <ons-card>
            <div className="center" align="center">
              <img className="list-item__thumbnail" src={imgSrc} alt=""></img>
            </div>
            <div className="title" align="center">
                <b>{this.state.accountInfo.firstname} {this.state.accountInfo.lastname}</b>
            </div>
        </ons-card>
      </div>
    );
  }
}