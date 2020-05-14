import React from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'react-date-picker';
import { cookies, callApi, showAlert, ConfirmDialog, formatDate } from './index.js';
import { api } from './config.js';
//import { animateScroll } from 'react-scroll';

export class SaveMedications extends React.Component {
	handleClick = (event) => {
        const medicationCount= document.querySelectorAll('div.medication_list').length;
        let medicationList = [];
        for (let i = 0; i < medicationCount; i++) {
            const medication = {
                id: "_"+i,
                drug_name: document.querySelector('#drug_name_'+i).value,
                dosage: document.querySelector('#dosage_'+i).value,
                purpose: document.querySelector('#purpose_'+i).value,
                date_started: document.querySelector('#date_started_'+i).value
            }
            medicationList.push(medication);
        }
		const payload = {
            id: cookies.get('app-login').email,
            medicationList: medicationList
        }
		const config = {
			"url": api.users_api_base_url + "/v1/medications",
			"method": "POST",
			"timeout": 60000,
			"headers": {
                "Content-Type": "application/json",
                "Authorization": api.users_api_authorization
			},
			"data": payload
		};
		callApi(config, (data) => {
			showAlert("Successfully saved data");
		}, 'medications');
	}
	render() {
		return (
			<ons-button modifier="quiet" onClick={this.handleClick}>Save</ons-button>
		);
	}
}

export class Medications extends React.Component {    
    constructor(props) {
        super(props);

        if (Object.keys(props.data).length !== 0) {
            this.state = props.data;
        } else {
            this.state = {
                medicationList: []
            }
        }

        this.index = null;
    }
    addMedication = (event) => {
        this.setState(state => {
            const currentMedicationList = state.medicationList;
            const medication = {
                id: "_"+currentMedicationList.length,
                drug_name: "",
                dosage: "",
                purpose: "",
                date_started: ""
            }
            currentMedicationList.unshift(medication);
            return {
                medicationList: currentMedicationList
            }
        });
    }
    removeMedication = (event) => {
        document.querySelector('#confirm-dialog').hide();
        const id = this.index;
        this.setState(state => {
            const currentMedicationList = state.medicationList;
            const filteredMedicationList = currentMedicationList.filter((item) => item.id !== "_"+id);
            return {
                medicationList: filteredMedicationList.map((item, index) => {
                    return {
                        id: "_"+index,
                        drug_name: item.drug_name,
                        dosage: item.dosage,
                        purpose: item.purpose,
                        date_started: item.date_started
                    }
                })
            }
        });
    }
    confirm = (event) => {
        document.querySelector('#confirm-dialog').show();
        this.index = event.target.getAttribute('index');
    }
    handleChange = (index, date) => {
        if (date != null) {
            const formattedDate = formatDate(date);
            this.setState(state => {
                state.medicationList[index].date_started = formattedDate
                return {
                    medicationList: state.medicationList
                }
            });
        }
    }
    componentDidMount() {
        const medications_saveBtn = document.querySelector('div#medications_saveBtn');
        if (medications_saveBtn != null) ReactDOM.render(<SaveMedications/>, medications_saveBtn);
    }
    render() {
        return (
            <React.Fragment>
                <div className="content">
                    <ons-list>
                    {                
                        this.state.medicationList.map((value, index) => 
                            <div className="medication_list">
                            <ons-list-header>
                                <b>Medication/Supplement</b><br/>
                                <ons-fab index={index} modifier="mini" position="top right" onClick={this.confirm}>
                                    <ons-icon index={index} icon="md-delete"></ons-icon>
                                </ons-fab>
                            </ons-list-header>
                            <ons-list-item>
                                <label className="form">Name of Drug</label>
                                <ons-input id={"drug_name"+value.id} modifier="material" value={this.state.medicationList[index].drug_name}></ons-input>
                            </ons-list-item>
                            <ons-list-item>
                                <label className="form">Dosage</label>
                                <ons-input id={"dosage"+value.id} modifier="material" value={this.state.medicationList[index].dosage}></ons-input>
                            </ons-list-item>
                            <ons-list-item>
                                <label className="form">Purpose</label>
                                <ons-input id={"purpose"+value.id} modifier="material" value={this.state.medicationList[index].purpose}></ons-input>
                            </ons-list-item>
                            <ons-list-item>
                                <label className="form">Date Started</label>
                                <ons-input id={"date_started"+value.id} style={{display: 'none'}} value={this.state.medicationList[index].date_started == null || this.state.medicationList[index].date_started.length === 0 ? formatDate(new Date()) : this.state.medicationList[index].date_started} ></ons-input>
                                <DatePicker onChange={date => { this.handleChange(index, date) }} value={this.state.medicationList[index].date_started == null || this.state.medicationList[index].date_started.length === 0 ? new Date() : new Date(this.state.medicationList[index].date_started)} />
                            </ons-list-item>  
                            </div> 
                        )
                    }
                    </ons-list>
                </div>
                <ons-fab ripple position="bottom right" id="fab_add" modifier="mini" onClick={this.addMedication}>
                    <ons-icon icon="md-plus"></ons-icon>
                </ons-fab>
                <ConfirmDialog message="Are you sure?" onOk={this.removeMedication}/>
            </React.Fragment>
        );
    }
}