import React from 'react';
import { diets } from './config.js';

export class Diet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dietList: diets.map((value) => {
                return {
                    displayText: value
                }
            })
        }
    }
    render() {
        return (
            <div>
            <ons-list>
            <ons-list-header>Expand the item to specify the quantity</ons-list-header>
            {
                this.state.dietList.map((value) =>
                    <ons-list-item key={value.displayText} expandable>  
                        {value.displayText}
                        <div class="expandable-content">
                            <ons-input type="number" modifier="material" placeholder="Quantity" style={{width: '100px'}}></ons-input>
                            <br/>
                            <ons-select modifier="material">
                                <option value="serve">serve</option>
                                <option value="cup">cup</option>
                                <option value="cup raw">cup raw</option>
                                <option value="cup cooked">cup cooked</option>
                                <option value="tbsp">tbsp</option>
                                <option value="handful">handful</option>
                                <option value="glass">glass</option>
                                <option value="piece">piece</option>
                                <option value="pack">pack</option>
                            </ons-select>
                        </div>
                    </ons-list-item>              
                )
            }
            </ons-list>
            </div>
        );
    }
}