import React from 'react';

export class Others extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }
    render() {
        return (
            <div>
            <ons-list>
            <ons-list-header>Expand the item to answer the question</ons-list-header>
                <ons-list-item><ons-list-header>Physical Activity</ons-list-header></ons-list-item>
                <ons-list-item expandable>  
                    How many days a week do you engage in moderate to strenuous exercise, such as brisk walking?
                    <div className="expandable-content">
                        <ons-input type="number" modifier="material" placeholder="Days" style={{width: '100px'}}></ons-input>
                    </div>
                </ons-list-item>  
                <ons-list-item expandable>  
                    On average, how many minutes per day do you exercise at this level? 
                    <div className="expandable-content">
                        <ons-input type="number" modifier="material" placeholder="Minutes" style={{width: '100px'}}></ons-input>
                    </div>
                </ons-list-item>  
                <ons-list-item expandable>  
                    Total minutes of moderate to strenuous physical activity per week: 
                    <div className="expandable-content">
                        <ons-input type="number" modifier="material" placeholder="Minutes" style={{width: '100px'}}></ons-input>
                    </div>
                </ons-list-item>      
                <ons-list-item><ons-list-header>Sleep</ons-list-header></ons-list-item>
                <ons-list-item expandable>  
                    Typical weekday hours of sleep  
                    <div className="expandable-content">
                        <ons-input type="number" modifier="material" placeholder="Hours" style={{width: '100px'}}></ons-input>
                    </div>
                </ons-list-item>  
                <ons-list-item expandable>  
                    Typical weekend hours of sleep   
                    <div className="expandable-content">
                        <ons-input type="number" modifier="material" placeholder="Hours" style={{width: '100px'}}></ons-input>
                    </div>
                </ons-list-item>  
                <ons-list-item expandable>  
                    Quality of sleep    
                    <div className="expandable-content">
                        <ons-input modifier="material" placeholder="Quality" style={{width: '100px'}}></ons-input>
                    </div>
                </ons-list-item>  
                <ons-list-item><ons-list-header>Tobbaco Use</ons-list-header></ons-list-item>
                <ons-list-item expandable>
                    <div>
                    <ons-select id="tobacco_use" modifier="material" style={{float: 'left'}}>
                        <option value="Non smoker">Non smoker</option>
                        <option value="Current smoker">Current smoker</option>
                        <option value="Past smoker">Past smoker</option>
                    </ons-select>
                    </div>
                    <div className="expandable-content">
                        <ons-input type="number" modifier="material" placeholder="# of sticks/day" style={{width: '120px'}}></ons-input><br/>
                        <ons-input type="number" modifier="material" placeholder="# of years" style={{width: '120px'}}></ons-input><br/>
                        <ons-input type="number" modifier="material" placeholder="pack/year" style={{width: '120px'}}></ons-input>
                    </div>
                </ons-list-item>
                <ons-list-item><ons-list-header>Alcohol Use</ons-list-header></ons-list-item>
                <ons-list-item expandable>  
                    How many drinks do you consume in any day?    
                    <div className="expandable-content">
                        <ons-input type="number" modifier="material" placeholder="Quantity" style={{width: '100px'}}></ons-input>
                    </div>
                </ons-list-item>
                <ons-list-item expandable>  
                    How many drinks do you consume in a week?    
                    <div className="expandable-content">
                        <ons-input type="number" modifier="material" placeholder="Quantity" style={{width: '100px'}}></ons-input>
                    </div>
                </ons-list-item>
                <ons-list-item><ons-list-header>Emotional Being</ons-list-header></ons-list-item>
                <ons-list-item expandable>  
                    In most ways, my life is close to my ideal.   
                    <div className="expandable-content">
                        <div>
                        <ons-select id="ideal_life_rating" modifier="material" style={{float: 'left'}}>
                            <option value="5">5</option>
                            <option value="4">4</option>
                            <option value="3">3</option>
                            <option value="2">2</option>
                            <option value="1">1</option>
                        </ons-select>
                        </div>
                    </div>
                </ons-list-item>
                <ons-list-item expandable>  
                    I am satisfied with my life.  
                    <div className="expandable-content">
                        <div>
                            <ons-select id="satisfied_life_rating" modifier="material" style={{float: 'left'}}>
                                <option value="5">5</option>
                                <option value="4">4</option>
                                <option value="3">3</option>
                                <option value="2">2</option>
                                <option value="1">1</option>
                            </ons-select>
                        </div>
                    </div>
                </ons-list-item>
            </ons-list>
            </div>
        );
    }
}