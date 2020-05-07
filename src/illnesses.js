import React from 'react';
import { illnesses } from './config.js';

export class Illnesses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            illnessesList: illnesses.map((value) => {
                return {
                    selected: false,
                    displayText: value
                }
            })
        }
    }
    render() {
        return (
            this.state.illnessesList.map((value) =>
                <ons-list-item key={value.displayText} tappable>  
                    <label className="left">
                        <ons-checkbox input-id={value.displayText}></ons-checkbox>
                    </label>
                    <label htmlFor={value.displayText} className="center">
                        {value.displayText}
                    </label>
                </ons-list-item>              
            )
        );
    }
}