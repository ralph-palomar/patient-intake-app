import React from 'react';
import { DatePickerComponent, TimePickerComponent } from './basicinfo';

export class VitalSigns extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            vitalSignList: []
        }
    }
    addVitalSign = (event) => {
        this.setState(state => {
            const currentVitalSignList = state.vitalSignList;
            const vitalsign = {
                id: "vs_"+currentVitalSignList.length,
                field1: "vs_date_",
                field2: "vs_time_",
                field3: "vs_blood_pressure_",
                field4: "vs_heart_rate_",
                field5: "vs_respiratory_rate_",
                field6: "vs_temp_",
                field7: "vs_weight_",
                field8: "vs_height_",
                field9: "vs_bmi_",
                field10: "vs_waist_circ_",
                field11: "vs_hip_circ_",
                field12: "vs_wh_ratio_"
            }
            currentVitalSignList.push(vitalsign);
            return {
                vitalSignList: currentVitalSignList
            }
        });
    }
    removeVitalSign = (event) => {
        const id = event.target.id;
        this.setState(state => {
            const currentVitalSignList = state.vitalSignList;
            const filteredVitalSignList = currentVitalSignList.filter((item) => {
                return item.id !== id;
            });
            return {
                vitalSignList: filteredVitalSignList
            }
        });
    }
    render() {
        return (
            <div className="content">
                <ons-list>
                {                
                    this.state.vitalSignList.map((value) => 
                        <div>
                        <ons-list-header>
                            Initial Lifestyle Medicine Vital Signs
                            <ons-fab position="top right" modifier="mini" onClick={this.removeVitalSign}>
                                <ons-icon id={value.id} icon="md-delete"></ons-icon>
                            </ons-fab>
                        </ons-list-header>  
                        <ons-list-item>
                            <label className="form">Date</label>
                            <div id={value.field1+value.id}><DatePickerComponent/></div>
                        </ons-list-item>
                        <ons-list-item>
                            <label className="form">Time</label>
                            <div id={value.field2+value.id}><TimePickerComponent/></div>
                        </ons-list-item>
                        <ons-list-item>
                            <label className="form">Blood Pressure</label>
                            <ons-input id={value.field3+value.id} modifier="material"></ons-input>
                        </ons-list-item>
                        <ons-list-item>
                            <label className="form">Heart Rate</label>
                            <ons-input id={value.field4+value.id} type="number" modifier="material"></ons-input>&nbsp;bpm
                        </ons-list-item>
                        <ons-list-item>
                            <label className="form">Respiratory Rate</label>
                            <ons-input id={value.field5+value.id} type="number" modifier="material"></ons-input>&nbsp;cpm
                        </ons-list-item>
                        <ons-list-item>
                            <label className="form">Temperature</label>
                            <ons-input id={value.field6+value.id} type="number" modifier="material"></ons-input>&nbsp;Celsius
                        </ons-list-item>
                        <ons-list-item>
                            <label className="form">Weight</label>
                            <ons-input id={value.field7+value.id} type="number" modifier="material"></ons-input>&nbsp;
                            <ons-radio name="weight_unit" input-id="weight_kg">kg</ons-radio>&nbsp;
                            <ons-radio name="weight_unit" input-id="weight_lbs">lbs</ons-radio>
                        </ons-list-item>
                        <ons-list-item>
                            <label className="form">Height</label>
                            <ons-input id={value.field8+value.id} type="number" modifier="material"></ons-input>&nbsp;cm
                        </ons-list-item>
                        <ons-list-item>
                            <label className="form">Body Mass Index</label>
                            <ons-input id={value.field9+value.id} type="number" modifier="material"></ons-input>
                        </ons-list-item>
                        <ons-list-item>
                            <label className="form">Waist Circumference</label>
                            <ons-input id={value.field10+value.id} type="number" modifier="material"></ons-input>&nbsp;cm
                        </ons-list-item>
                        <ons-list-item>
                            <label className="form">Hip Circumference</label>
                            <ons-input id={value.field11+value.id} type="number" modifier="material"></ons-input>&nbsp;cm
                        </ons-list-item>
                        <ons-list-item>
                            <label className="form">Waist/Hip Ratio</label>
                            <ons-input id={value.field12+value.id} modifier="material"></ons-input>
                        </ons-list-item>
                        </div> 
                    )
                }
                </ons-list>
                <ons-fab id="fab_add" position="bottom right" modifier="mini" onClick={this.addVitalSign}>
                    <ons-icon icon="md-plus"></ons-icon>
                </ons-fab>
            </div>
        );
    }
}