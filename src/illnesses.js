import React from 'react';
import { cookies, callApi, showAlert } from './index.js'
import { illnesses, api } from './config.js';

export class SaveIllnesses extends React.Component {
	handleClick = (event) => {
		const payload = {
            id: cookies.get('app-login').email,
            illnessesList: illnesses.map((value, index) => {
                return {
                    selected: document.querySelector('#illness_'+index).checked,
                    displayText: value
                }
            })
        }
		const config = {
			"url": api.users_api_base_url + "/v1/illnesses",
			"method": "POST",
			"timeout": 60000,
			"headers": {
				"Content-Type": "application/json"
			},
			"data": payload
		};
		callApi(config, (data) => {
			showAlert("Successfully saved data");
		}, 'illnesses');
	}
	render() {
		return (
			<ons-button modifier="quiet" onClick={this.handleClick}>Save</ons-button>
		);
	}
}

export class Illnesses extends React.Component {
    constructor(props) {
        super(props);
        let currentState;
        if (Object.keys(props.data).length === 0) {
            currentState = {
                illnessesList: illnesses.map((value) => {
                    return {
                        selected: false,
                        displayText: value
                    }
                })
            }
        } else {
            currentState = props.data;
        }
        this.state = currentState;
    }
    render() {
        return (
        <React.Fragment> 
            {
                this.state.illnessesList.map((value, index) =>
                    <ons-list-item key={value.displayText} tappable>  
                        <label className="left">
                        {value.selected ? <ons-checkbox id={"illness_"+index} input-id={value.displayText} checked></ons-checkbox> : <ons-checkbox id={"illness_"+index} input-id={value.displayText}></ons-checkbox> }
                        </label>
                        <label htmlFor={value.displayText} className="center">
                            {value.displayText}
                        </label>
                    </ons-list-item>              
                )
            }
            <ons-list-item>
                <label className="form">Specify Others</label>
                <textarea id="illnesses_others" className="textarea" rows="3" cols="35"></textarea>
            </ons-list-item>   
        </React.Fragment>
        );
    }
}