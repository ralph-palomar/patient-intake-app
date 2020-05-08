import React from 'react';
import ReactDOM from 'react-dom';
import { logout, back, createAccount, login, register } from './index.js'
import { Users } from './users.js'
import { DatePickerComponent } from './basicinfo.js';
import { Illnesses } from './illnesses.js';
import { Medications } from './medications.js';
import { VitalSigns } from './vitalsigns.js';
import { Diet } from './diet.js';
import { Others } from './others.js';

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

        if (page === "users.html") {
          const user_list = document.querySelector('div#user_list');
          ReactDOM.render(<Users/>, user_list);
        }

        if (page === "basicinfo.html") {
          const basic_dob = document.querySelector('div#basic_dob');
          ReactDOM.render(<DatePickerComponent/>, basic_dob);
        }

        if (page === "illnesses.html") {
          const illnesses_list = document.querySelector('div#illnesses_list');
          ReactDOM.render(<Illnesses/>, illnesses_list);
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

export class Greeting extends React.Component {
  constructor(props) {
    super(props);
    this.props = {
      firstname: null,
    }
  }
	render() {
	  return (
		<ons-list-item>
		  Hello {this.props.firstname}!
		</ons-list-item>
	  );
	}
}