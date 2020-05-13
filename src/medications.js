import React from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'react-date-picker';
import { cookies, callApi, showAlert } from './index.js';
import { api } from './config.js';

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
            props.data.medicationList.forEach(item => {
                this[`date_started${item.id}`] = React.createRef();
            });
        } else {
            this.state = {
                medicationList: []
            }
        }

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
            currentMedicationList.push(medication);
            return {
                medicationList: currentMedicationList
            }
        });
    }
    removeMedication = (event) => {
        const id = event.target.id;
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
    onChange = (date) => {
        const formattedDate = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        console.log(this.state.medicationList.length);
    }
    componentDidMount() {
        const medications_saveBtn = document.querySelector('div#medications_saveBtn');
        if (medications_saveBtn != null) ReactDOM.render(<SaveMedications/>, medications_saveBtn);
    }
    render() {
        return (
            <div className="content">
                <ons-list>
                {                
                    this.state.medicationList.map((value, index) => 
                        <div className="medication_list">
                        <ons-list-header>
                            Medication/Supplement
                            <ons-fab position="top right" modifier="mini" onClick={this.removeMedication}>
                                <ons-icon id={index} icon="md-delete"></ons-icon>
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
                            <ons-input id={"date_started"+value.id} style={{display: 'block'}} value={this.state.medicationList[index].date_started}></ons-input>
                            <DatePicker onChange={this.onChange} value={new Date(this.state.medicationList[index].date_started)} ref={this[`date_started_${index}`]}/>
                        </ons-list-item>    
                        </div> 
                    )
                }
                </ons-list>
                <ons-fab id="fab_add" position="bottom right" modifier="mini" onClick={this.addMedication}>
                    <ons-icon icon="md-plus"></ons-icon>
                </ons-fab>
            </div>
        );
    }
}