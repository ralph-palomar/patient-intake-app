import React from 'react';
import ReactDOM from 'react-dom';
import { logout, back, createAccount, login, register, cookies, callApi } from './index.js'
import { Users } from './users.js'
import { SaveBasicInfo, BasicInfo } from './basicinfo.js';
import { SaveIllnesses, Illnesses } from './illnesses.js';
import { Medications } from './medications.js';
import { VitalSigns } from './vitalsigns.js';
import { Diet } from './diet.js';
import { Others } from './others.js';
import { api } from './config.js';

window.fn = {};

window.fn.open = function() {
  const menu = document.getElementById('menu');
  menu.open();
};

window.fn.load = function(page) {
  const content = document.getElementById('content');

  content.load(page)
    .then(() => {    
        const menu = document.getElementById('menu');  
        menu.close();

        if (page === "profile.html") {
          const main = document.querySelector('div#main_display');
          ReactDOM.render(<Profile/>, main);
        }

        if (page === "users.html") {
          const user_list = document.querySelector('div#user_list');
          ReactDOM.render(<Users/>, user_list);
        }

        if (page === "basicinfo.html") {
          const basicinfo_form = document.querySelector('div#basicinfo_form');
          const config = {
            "url": api.users_api_base_url + "/v1/basicInfo",
            "method": "GET",
            "timeout": 60000,
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
          
          const saveBasicInfoBtn = document.querySelector('div#saveBasicInfoBtn');
          if (saveBasicInfoBtn != null) ReactDOM.render(<SaveBasicInfo/>, saveBasicInfoBtn);
        }

        if (page === "illnesses.html") {
          const illnesses_list = document.querySelector('div#illnesses_list');
          const config = {
            "url": api.users_api_base_url + "/v1/illnesses",
            "method": "GET",
            "timeout": 60000,
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

          const saveIllnessesBtn = document.querySelector('div#saveIllnessesBtn');
          if (saveIllnessesBtn != null) ReactDOM.render(<SaveIllnesses/>, saveIllnessesBtn);
        }

        if (page === "medications.html") {
          const medications_list = document.querySelector('div#medications_list');
          ReactDOM.render(<Medications/>, medications_list);
        }

        if (page === "vitalsigns.html") {
          const vitalsigns_list = document.querySelector('div#vitalsigns_list');
          ReactDOM.render(<VitalSigns/>, vitalsigns_list);
        }

        if (page === "diet.html") {
          const diet_list = document.querySelector('div#diet_list');
          ReactDOM.render(<Diet/>, diet_list);
        }

        if (page === "others.html") {
          const others_list = document.querySelector('div#others_list');
          ReactDOM.render(<Others/>, others_list);
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
	  return (
    <div id="main_page">
      <ons-card>
        <div className="title">
        Hello {this.state.accountInfo.firstname}!
        </div>
        <div className="content">
          Explore the options. Swipe the menu to start.
        </div>
      </ons-card>
    </div>
	  );
	}
}