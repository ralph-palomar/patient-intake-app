import React from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'react-date-picker';
import { cookies, callApi, showAlert, ConfirmDialog, formatDate, back, formatToDateString, _default } from './index.js';
import { api } from './config.js';

function MedicationForm(props) {
    const id = props.medicationList[props.index].id;
    const bgcolor = props.index % 2 === 0 ? '#ffffff' : '#f0f0f5';
    return (
        <React.Fragment>
            <div style={{ backgroundColor: bgcolor }}>
                <ons-list-item>
                    <label className="form">Name of Drug</label>
                    <ons-input id={"drug_name" + id} modifier="material" value={props.medicationList[props.index].drug_name}></ons-input>
                </ons-list-item>
                <ons-list-item>
                    <label className="form">Dosage</label>
                    <ons-input id={"dosage" + id} modifier="material" value={props.medicationList[props.index].dosage}></ons-input>
                </ons-list-item>
                <ons-list-item>
                    <label className="form">Purpose</label>
                    <ons-input id={"purpose" + id} modifier="material" value={props.medicationList[props.index].purpose}></ons-input>
                </ons-list-item>
                <ons-list-item>
                    <label className="form">Date Started</label>
                    <ons-input id={"date_started" + id} style={{ display: 'none' }} value={props.medicationList[props.index].date_started == null || props.medicationList[props.index].date_started.length === 0 ? formatDate(new Date()) : props.medicationList[props.index].date_started} ></ons-input>
                    <DatePicker onChange={date => { props.onChangeCallback(props.index, date) }} value={props.medicationList[props.index].date_started == null || props.medicationList[props.index].date_started.length === 0 ? new Date() : new Date(props.medicationList[props.index].date_started)} clearIcon={null} />
                </ons-list-item>
            </div>
        </React.Fragment>
    );
}

export class SaveMedications extends React.Component {
    handleClick = (event) => {
        saveMedications(() => {
            back();
            document.querySelector('#pull-hook').dispatchEvent(new Event('changestate'));
        });
    }
    render() {
        return (
            <ons-button modifier="quiet" onClick={this.handleClick}>Save</ons-button>
        );
    }
}

export class NewMedicationItem extends React.Component {
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
    componentDidMount() {
        const save_new_medication = document.querySelector('div#save_new_medication');
        if (save_new_medication != null) ReactDOM.render(<SaveMedications />, save_new_medication);
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
    render() {
        return (
            <React.Fragment>
                <div className="content">
                    <ons-list>
                        <div className="medication_list">
                            <MedicationForm value={this.state.medicationList[0]} index={0} medicationList={this.state.medicationList} onChangeCallback={this.handleChange} />
                        </div>
                        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                    </ons-list>
                </div>
            </React.Fragment>
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
        const nav = document.querySelector('#navigator');
        const medications_list_length = document.querySelectorAll('div.medication_list') ? document.querySelectorAll('div.medication_list').length : 0;
        nav.pushPage('new_medication.html').then(() => {
            const new_component = document.querySelector('#new_medication_component');
            const initial_state = {
                medicationList: [{
                    id: "_" + medications_list_length,
                    drug_name: "",
                    dosage: "",
                    purpose: "",
                    date_started: ""
                }]
            };
            ReactDOM.render(<NewMedicationItem data={initial_state} />, new_component);
        });
    }
    removeMedication = (event) => {
        document.querySelector('#confirm-dialog').hide();
        const id = this.index;
        this.setState(state => {
            const currentMedicationList = state.medicationList;
            const filteredMedicationList = currentMedicationList.filter((item) => item.id !== "_" + id);
            return {
                medicationList: filteredMedicationList.map((item, index) => {
                    item.id = "_" + index;
                    return item;
                })
            }
        }, () => { saveMedications(()=>{}, this.state) });
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
        if (medications_saveBtn != null) ReactDOM.render(<SaveMedications />, medications_saveBtn);
        this.pullhook.addEventListener('changestate', this.handleChangeState);
    }
    handleChangeState = (event) => {
        if (event.type === 'changestate' || event.state === "action") {
            refreshMedications(this.refreshMedicationList);
        }
    }
    refreshMedicationList = (data) => {
        this.setState(data);
    }
    render() {
        return (
            <React.Fragment>
                <ons-pull-hook id="pull-hook" ref={ref => { this.pullhook = ref }}>
                </ons-pull-hook>
                <div className="content">
                    <ons-list>
                        {
                            this.state.medicationList.map((value, index) =>
                                <div className="medication_list">
                                    <ons-list-header style={{ backgroundColor: '#e6f2ff' }}>
                                        <b>Medication/Supplement</b>
                                        <div style={{ display: 'inline-block' }}>
                                            <ons-button index={index} modifier="quiet" onClick={this.confirm}>
                                                <ons-icon index={index} icon="md-delete"></ons-icon>
                                            </ons-button>
                                        </div>
                                    </ons-list-header>
                                    <MedicationForm value={value} index={index} medicationList={this.state.medicationList} onChangeCallback={this.handleChange} />
                                </div>
                            )
                        }
                    </ons-list>
                </div>
                <ons-fab ripple position="bottom right" id="fab_add" modifier="mini" onClick={this.addMedication}>
                    <ons-icon icon="md-plus"></ons-icon>
                </ons-fab>
                <ConfirmDialog message="Are you sure you want to delete?" onOk={this.removeMedication} />
            </React.Fragment>
        );
    }
}

function refreshMedications(successCallBack) {
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
    callApi(config, successCallBack, 'medications');
}

function saveMedications(callBack=()=>{}, data=null) {
    let medicationList = null;
    if (data == null) {
        const medicationCount = document.querySelectorAll('div.medication_list').length;
        medicationList = [];
        for (let i = 0; i < medicationCount; i++) {
            const medication = {
                id: "_" + i,
                drug_name: document.querySelector('#drug_name_' + i).value,
                dosage: document.querySelector('#dosage_' + i).value,
                purpose: document.querySelector('#purpose_' + i).value,
                date_started: document.querySelector('#date_started_' + i).value
            }
            medicationList.push(medication);
        }
    } else {
        medicationList = data.medicationList;
    }

    if (medicationList != null) {
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
            callBack();
        }, 'medications');
    }
}

export class MedicationsProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = props.data;
	}
	render() {
		return (
			<ons-list>
				<ons-list-header>Medications and Supplements</ons-list-header>
                {
                    this.state.medicationList.map((item, index) => {
                        const bgcolor = index % 2 === 0 ? '#ffffff' : '#f2f2f2';
                        return (
                            <div style={{ backgroundColor: bgcolor }}>
                                <ons-list-item>
                                    <label className="profile">Date Started</label>
					                <div>{_default(formatToDateString(item.date_started), "--")}</div>
                                </ons-list-item>
                                <ons-list-item>
                                    <label className="profile">Drug Name</label>
					                <div>{_default(item.drug_name, "--")}</div>
                                </ons-list-item>
                                <ons-list-item>
                                    <label className="profile">Dosage</label>
					                <div>{_default(item.dosage, "--")}</div>
                                </ons-list-item>
                                <ons-list-item>
                                    <label className="profile">Purpose</label>
					                <div>{_default(item.purpose, "--")}</div>
                                </ons-list-item>
                            </div>
                        )
                    })
                }
			</ons-list>
		);
	}
}