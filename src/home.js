import React from 'react';
import ReactDOM from 'react-dom';
import { logout, back, createAccount, login, register, cookies, callApi, _default, showAlert } from './index.js'
import { Users } from './users.js'
import { BasicInfo, BasicInfoProfile } from './basicinfo.js';
import { Illnesses, IllnessesProfile } from './illnesses.js';
import { Medications, MedicationsProfile } from './medications.js';
import { VitalSigns, VitalSignsProfile } from './vitalsigns.js';
import { Diet, DietProfile } from './diet.js';
import { Others, OthersProfile } from './others.js';
import { api, defaultImg, login_cookie } from './config.js';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

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
          getUserPhoto((data) => {
            ReactDOM.render(<Profile picture={data.picture} email={cookies.get(login_cookie).email} />, main);
          }, null, cookies.get(login_cookie).email)
      }

      if (page === "users.html") {
        const user_list = document.querySelector('div#user_list');
        ReactDOM.render(<Users />, user_list);
      }

      if (page === "basicinfo.html") {
        const basicinfo_form = document.querySelector('div#basicinfo_form');
        getBasicInfo((data) => {
          ReactDOM.render(<BasicInfo data={data} />, basicinfo_form);
        }, 'basic', cookies.get(login_cookie).email);
      }

      if (page === "illnesses.html") {
        const illnesses_list = document.querySelector('div#illnesses_list');
        getIllnesses((data) => {
          ReactDOM.render(<Illnesses data={data} />, illnesses_list);
        }, 'illnesses', cookies.get(login_cookie).email);

      }

      if (page === "medications.html") {
        const medications_list = document.querySelector('div#medications_list');
        getMedications((data) => {
          ReactDOM.render(<Medications data={data} />, medications_list);
        }, 'medications', cookies.get(login_cookie).email);
      }

      if (page === "vitalsigns.html") {
        const vitalsigns_list = document.querySelector('div#vitalsigns_list');
        getVitalSigns((data) => {
          ReactDOM.render(<VitalSigns data={data} />, vitalsigns_list);
        }, 'vitalsigns', cookies.get(login_cookie).email);
      }

      if (page === "diet.html") {
        const diet_list = document.querySelector('div#diet_list');
        getDiet((data) => {
          ReactDOM.render(<Diet data={data} />, diet_list);
        }, 'diet', cookies.get(login_cookie).email);
      }

      if (page === "others.html") {
        const others_list = document.querySelector('div#others_list');
        getOthers((data) => {
          ReactDOM.render(<Others data={data} />, others_list);
        }, 'others', cookies.get(login_cookie).email);
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
      accountInfo: {
        picture: props.picture
      },
      email: props.email,
      type: props.type,
      enabled: props.enabled,
      openedBy: props.openedBy,
      crop: {
        unit: 'px',
        width: 65,
        aspect: 1,
      }
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

    this.isAdminSwitch.checked = this.state.type === "admin" ? true : false;
    this.isEnabledSwitch.checked = this.state.enabled;

    this.isEnabledSwitch.addEventListener('change', (event) => {
      const payload = {
        email: this.state.email,
        enabled: event.target.checked
      }
      putUser(payload, (data) => {
        showAlert('Successfully updated settings');
        this.setState({
          enabled: event.target.checked
        });
      });
    });

    this.isAdminSwitch.addEventListener('change', (event) => {
      const payload = {
        email: this.state.email,
        type: event.target.checked ? 'admin': 'user'
      }
      putUser(payload, (data) => {
        showAlert('Successfully updated settings');
        this.setState({
          type: event.target.checked ? 'admin': 'user'
        });
      });
    });
  }
  handlePictureClick = (event) => {
    const profile_pic = document.querySelector('#profile_pic');
    profile_pic.click();
  }
  handlePictureChange = (event, nav) => {
    if (nav != null) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onloadend = (event) => {
        this.setState({ src: event.target.result });
        nav.pushPage('new_profile_pic.html').then(()=>{
          //initial load//
          const new_pp_component = document.querySelector('#new_pp_component');
          if (new_pp_component != null) {
            ReactDOM.render(<ReactCrop src={this.state.src} crop={this.state.crop} ruleOfThirds={true} onChange={this.cropChange} onImageLoaded={this.imageLoaded} onComplete={this.cropComplete} />, new_pp_component);
          }

          const save_new_pp = document.querySelector('#save_new_pp');
          if (save_new_pp != null) {
            save_new_pp.addEventListener('click', (event) => {
              const payload = {
                email: this.state.email,
                picture: this.state.croppedImageData
              }
              putUser(payload, (data) => {
                  showAlert('Successfully updated profile picture');
                  this.setState({
                    accountInfo: {
                      picture: this.state.croppedImageData
                    }
                  });
                  const badge_pic = document.querySelector('#badge_pic');
                  badge_pic.src = this.state.croppedImageData;
              });
            });
          }
        });
      };
    }
  }
  imageLoaded = (image) => {
    this.imageRef = image
  }
  cropChange = (newCrop) => {
    this.setState({ crop: newCrop });
  }
  cropComplete = (newCrop) => {
    const image = this.imageRef;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = newCrop.width;
    canvas.height = newCrop.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      newCrop.x * scaleX,
      newCrop.y * scaleY,
      newCrop.width * scaleX,
      newCrop.height * scaleY,
      0,
      0,
      newCrop.width,
      newCrop.height
    );
    const croppedImage = ctx.canvas.toDataURL('image/jpeg', 1.0);
    this.setState({ croppedImageData: croppedImage });
  }
  handleEditAccess = (event) => {
    this.popover.show(event.target);
  }
  render() {
    const imgSrc = this.state.accountInfo.picture != null ? this.state.accountInfo.picture : defaultImg;
    const displayCamIcon = this.state.openedBy === 'admin' ? 'none' : 'block';
    const displayEditIcon = this.state.openedBy === 'admin' ? 'block' : 'none';
    const nav = document.querySelector('#navigator');

    const new_pp_component = document.querySelector('#new_pp_component');
    if (new_pp_component != null) {
      ReactDOM.render(<ReactCrop src={this.state.src} crop={this.state.crop} ruleOfThirds={true} onChange={this.cropChange} onImageLoaded={this.imageLoaded} onComplete={this.cropComplete} />, new_pp_component);
    }

    return (
      <React.Fragment>
        <ons-card>
            <div className="center" align="center">
              <img className="list-item--material__thumbnail" src={imgSrc} alt="Profile Pic" style={{width: '100px', height: '100px'}} ></img>
            </div>
            <div id="profile_cam_icon" align="center" style={{ display: displayCamIcon }}>
              <ons-icon icon="md-camera" onClick={this.handlePictureClick}></ons-icon>
              <input type="file" id="profile_pic" style={{ display: 'none'}} onChange={(event)=>{this.handlePictureChange(event, nav)}} ></input>
            </div>
            <div className="title" align="center" ref={ref=>{this.title=ref}}></div>
            <div align="center" style={{ display: displayEditIcon }}>
              <ons-button modifier="quiet" onClick={this.handleEditAccess}>
                <ons-icon icon="md-edit"></ons-icon>&nbsp;Edit Access
              </ons-button>
            </div>
        </ons-card>
        <ons-popover direction="down" id="popover" ref={ref=>{this.popover=ref}}>
            <ons-list>
                <div align="right">
                  <ons-button modifier="quiet" onClick={(event)=>{this.popover.hide()}}>
                    <ons-icon icon="md-close"></ons-icon>
                  </ons-button>
                </div>
              <ons-list-header>
                <div className="left">Settings</div>
              </ons-list-header>
              <ons-list-item>
                <div className="left">Set As Admin</div>
                <div className="right">
                  <ons-switch ref={ref=>{this.isAdminSwitch=ref}} ></ons-switch>
                </div>
              </ons-list-item>
              <ons-list-item>
                <div className="left">Enable User</div>
                <div className="right">
                  <ons-switch ref={ref=>{this.isEnabledSwitch=ref}}></ons-switch>
                </div>
              </ons-list-item>
            </ons-list>
        </ons-popover>
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

export function getUserPhoto(successCallback=(data)=>{}, caller="", identifier) {
  const config = {
    "url": api.users_api_base_url + "/v1/users/photo",
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

export function getAllUsers(successCallback=(data)=>{}, caller="") {
  const config = {
      "url": api.users_api_base_url + "/v1/users/all",
      "method": "GET",
      "timeout": 60000,
      "headers": {
          "Authorization": api.users_api_authorization
      }
  };
  callApi(config, successCallback, caller, false);
}

export function putUser(payload, successCallback=(data)=>{}, caller="") {
  const config = {
    "url": api.users_api_base_url + "/v1/users",
    "method": "PUT",
    "timeout": api.users_api_timeout,
    "headers": {
      "Authorization": api.users_api_authorization,
      "Content-Type": 'application/json'
    },
    "data": payload
  };
  callApi(config, successCallback, caller, true);
}