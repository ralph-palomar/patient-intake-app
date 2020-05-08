import React from 'react';
import { DatePickerComponent } from './basicinfo';

export class Medications extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            medicationList: []
        }
    }
    addMedication = (event) => {
        this.setState(state => {
            const currentMedicationList = state.medicationList;
            const medication = {
                id: "med_"+currentMedicationList.length,
                field1: "medications_drugname_",
                field2: "medications_dosage_",
                field3: "medications_purpose_",
                field4: "medications_datestarted_"
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
            const filteredMedicationList = currentMedicationList.filter((item) => {
                return item.id !== id;
            });
            return {
                medicationList: filteredMedicationList
            }
        });
    }
    render() {
        return (
            <div className="content">
                <ons-list>
                {                
                    this.state.medicationList.map((value) => 
                        <div>
                        <ons-list-header>
                            Medication/Supplement
                            <ons-fab position="top right" modifier="mini" onClick={this.removeMedication}>
                                <ons-icon id={value.id} icon="md-delete"></ons-icon>
                            </ons-fab>
                        </ons-list-header>
                        <ons-list-item>
                            <label className="form">Name of Drug</label>
                            <ons-input id={value.field1+value.id} modifier="material"></ons-input>
                        </ons-list-item>
                        <ons-list-item>
                            <label className="form">Dosage</label>
                            <ons-input id={value.field2+value.id} modifier="material"></ons-input>
                        </ons-list-item>
                        <ons-list-item>
                            <label className="form">Purpose</label>
                            <ons-input id={value.field3+value.id} modifier="material"></ons-input>
                        </ons-list-item>
                        <ons-list-item>
                            <label className="form">Date Started</label>
                            <div id={value.field4+value.id}><DatePickerComponent/></div>
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