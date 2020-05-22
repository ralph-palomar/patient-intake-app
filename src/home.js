import React from 'react';
import ReactDOM from 'react-dom';
import { logout, back, createAccount, login, register, cookies, callApi, _default } from './index.js'
import { Users } from './users.js'
import { BasicInfo, BasicInfoProfile } from './basicinfo.js';
import { Illnesses, IllnessesProfile } from './illnesses.js';
import { Medications, MedicationsProfile } from './medications.js';
import { VitalSigns, VitalSignsProfile } from './vitalsigns.js';
import { Diet, DietProfile } from './diet.js';
import { Others, OthersProfile } from './others.js';
import { api, defaultImg } from './config.js';

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
        ReactDOM.render(<Profile email={cookies.get('app-login').email} />, main);
      }

      if (page === "users.html") {
        const user_list = document.querySelector('div#user_list');
        ReactDOM.render(<Users />, user_list);
      }

      if (page === "basicinfo.html") {
        const basicinfo_form = document.querySelector('div#basicinfo_form');
        getBasicInfo((data) => {
          ReactDOM.render(<BasicInfo data={data} />, basicinfo_form);
        }, 'basic', cookies.get('app-login').email);
      }

      if (page === "illnesses.html") {
        const illnesses_list = document.querySelector('div#illnesses_list');
        getIllnesses((data) => {
          ReactDOM.render(<Illnesses data={data} />, illnesses_list);
        }, 'illnesses', cookies.get('app-login').email);

      }

      if (page === "medications.html") {
        const medications_list = document.querySelector('div#medications_list');
        getMedications((data) => {
          ReactDOM.render(<Medications data={data} />, medications_list);
        }, 'medications', cookies.get('app-login').email);
      }

      if (page === "vitalsigns.html") {
        const vitalsigns_list = document.querySelector('div#vitalsigns_list');
        getVitalSigns((data) => {
          ReactDOM.render(<VitalSigns data={data} />, vitalsigns_list);
        }, 'vitalsigns', cookies.get('app-login').email);
      }

      if (page === "diet.html") {
        const diet_list = document.querySelector('div#diet_list');
        getDiet((data) => {
          ReactDOM.render(<Diet data={data} />, diet_list);
        }, 'diet', cookies.get('app-login').email);
      }

      if (page === "others.html") {
        const others_list = document.querySelector('div#others_list');
        getOthers((data) => {
          ReactDOM.render(<Others data={data} />, others_list);
        }, 'others', cookies.get('app-login').email);
      }

    });
};

window.fn.logout = logout;
window.fn.back = back;
window.fn.createAccount = createAccount;
window.fn.login = login;
window.fn.register = register;

export const loadPage = window.fn.load;

export class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountInfo: cookies.get('app-login'), 
      email: props.email
    }
  }
  componentDidMount() {
    const profile_basic_info = document.querySelector('div#profile_basic_info');
    getBasicInfo((data) => {
      ReactDOM.render(<BasicInfoProfile data={data} />, profile_basic_info);
      this.title.innerHTML = '<b>'+ _default(data.basic_firstname, "Firstname") + " " + _default(data.basic_lastname, "Lastname") + " " + _default(data.basic_middlename, "") + '</b>'
    }, 'profile', this.state.email);

    const profile_illnesses = document.querySelector('div#profile_illnesses');
    getIllnesses((data) => {
      ReactDOM.render(<IllnessesProfile data={data} />, profile_illnesses);
    }, 'profile', this.state.email);

    const profile_medications = document.querySelector('div#profile_medications');
    getMedications((data) => {
      ReactDOM.render(<MedicationsProfile data={data} />, profile_medications);
    }, 'profile', this.state.email);

    const profile_vital_signs = document.querySelector('div#profile_vital_signs');
    getVitalSigns((data) => {
      ReactDOM.render(<VitalSignsProfile data={data} />, profile_vital_signs);
    }, 'profile', this.state.email);

    const profile_diet = document.querySelector('div#profile_diet');
    getDiet((data) => {
      ReactDOM.render(<DietProfile data={data} />, profile_diet);
    }, 'profile', this.state.email);

    const profile_others = document.querySelector('div#profile_others');
    getOthers((data) => {
      ReactDOM.render(<OthersProfile data={data} />, profile_others);
    }, 'profile', this.state.email);
  }
  handlePicChange = (event) => {
    const profile_pic = document.querySelector('#profile_pic');
    profile_pic.click();
  }
  render() {
    const imgSrc = this.state.accountInfo.picture != null ? this.state.accountInfo.picture : defaultImg;
    return (
      <React.Fragment>
        <ons-card>
            <div className="center" align="center">
              <img className="list-item--material__thumbnail" src={imgSrc} alt="Profile Pic" style={{width: '60px', height: '60px'}} onClick={this.handlePicChange} ></img>
            </div>
            <input type="file" id="profile_pic" style={{ display: 'none'}}></input>
            <div className="title" align="center" ref={ref=>{this.title=ref}}>
            </div>
        </ons-card>
      </React.Fragment>
    );
  }
}

export function getBasicInfo(successCallback=(data)=>{}, caller="", identifier) {
  const config = {
    "url": api.users_api_base_url + "/v1/basicInfo",
    "method": "GET",
    "timeout": api.users_api_timeout,
    "headers": {
      "Authorization": api.users_api_authorization
    },
    "params": {
      "id": identifier
    }
  };
  callApi(config, successCallback, caller, false);
}

export function getIllnesses(successCallback=(data)=>{}, caller="", identifier) {
  const config = {
    "url": api.users_api_base_url + "/v1/illnesses",
    "method": "GET",
    "timeout": api.users_api_timeout,
    "headers": {
      "Authorization": api.users_api_authorization
    },
    "params": {
      "id": identifier
    }
  };
  callApi(config, successCallback, caller, false);
}

export function getMedications(successCallback=(data)=>{}, caller="", identifier) {
  const config = {
    "url": api.users_api_base_url + "/v1/medications",
    "method": "GET",
    "timeout": api.users_api_timeout,
    "headers": {
      "Authorization": api.users_api_authorization
    },
    "params": {
      "id": identifier
    }
  };
  callApi(config, successCallback, caller, false);
}

export function getVitalSigns(successCallback=(data)=>{}, caller="", identifier) {
  const config = {
    "url": api.users_api_base_url + "/v1/vitalSigns",
    "method": "GET",
    "timeout": api.users_api_timeout,
    "headers": {
      "Authorization": api.users_api_authorization
    },
    "params": {
      "id": identifier
    }
  };
  callApi(config, successCallback, caller, false);
}

export function getDiet(successCallback=(data)=>{}, caller="", identifier) {
  const config = {
    "url": api.users_api_base_url + "/v1/diet",
    "method": "GET",
    "timeout": api.users_api_timeout,
    "headers": {
      "Authorization": api.users_api_authorization
    },
    "params": {
      "id": identifier
    }
  };
  callApi(config, successCallback, caller, false);
}

export function getOthers(successCallback=(data)=>{}, caller="", identifier) {
  const config = {
    "url": api.users_api_base_url + "/v1/others",
    "method": "GET",
    "timeout": api.users_api_timeout,
    "headers": {
      "Authorization": api.users_api_authorization
    },
    "params": {
      "id": identifier
    }
  };
  callApi(config, successCallback, caller, false);
}