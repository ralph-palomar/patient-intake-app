import React from 'react';
import { openMenu } from './home';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import DatePicker from 'react-date-picker';
import { availableHours, login_cookie } from './config.js';
import ons from 'onsenui';
import { cookies } from '.';

export class Appointment extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            myEventsList: this.initializeSlots(new Date()),
            date: new Date()
        }
    }
    initializeSlots = (date) => {
        const availableSlotsFirstHalf = availableHours.map((value) => {
            return {
                title: "Available",
                start: moment(date).set("hour", value).set("minutes", 0).toDate(),
                end: moment(date).set("hour", value).set("minutes", 0).add(30, "minutes").toDate()
            }            
        });
        const availableSlotsSecondHalf = availableHours.map((value) => {
            return {
                title: "Available",
                start: moment(date).set("hour", value).set("minutes", 30).toDate(),
                end: moment(date).set("hour", value).set("minutes", 30).add(30, "minutes").toDate()
            }            
        });
        const availableSlots = availableSlotsFirstHalf.concat(availableSlotsSecondHalf);
        return availableSlots;
    }
    handleSelectEvent = (event) => {
        const message = 
        `<div align="center"><h4>Do you want to set this appointment?</h4></div>
        <div align="center">Start: ${moment(event.start).format('LLL')}</div>
        <div align="center">End: ${moment(event.end).format('LLL')}</div>`

        ons.notification.confirm({ messageHTML: message }).then((value) => {
            if (value === 1) {
                const payload = {
                    title: "Reserved",
                    start: moment(event.start).format('LLL'),
                    end: moment(event.end).format('LLL'),
                    resource: {
                        email: cookies.get(login_cookie).email
                    }
                }
                console.log(payload);
                // call api here
            }
        });
    }
    handleDateChange = (date) => {
        this.setState({ date: date, myEventsList: this.initializeSlots(date) });
    }
    handleConfirmAppointment = (event) => {
        console.log(event)
    }
    render() {
        return (
            <React.Fragment>
                <ons-toolbar>
                    <div className="left">
                        <ons-toolbar-button onClick={openMenu}>
                            <ons-icon icon="md-menu"></ons-icon>
                        </ons-toolbar-button>
                    </div>
                    <div className="center">
                        My Appointments
                    </div>
                </ons-toolbar>
                <ons-list style={{ marginTop: '60px'}}>
                    <ons-list-item>
                        <div>
                            <label className="form">Select Date</label>
                            <DatePicker 
                                value={this.state.date} 
                                minDate={new Date()} 
                                maxDate={moment().add("months", 3).toDate()}
                                clearIcon={null} 
                                onChange={this.handleDateChange}
                            />
                        </div>
                        <br/>
                    </ons-list-item>
                    <ons-list-item>
                        <div>
                            <label className="form">Select Available Slot</label>
                        </div>
                        <div style={{ height: '100%', width: '97%' }}>
                            <Calendar
                                localizer={momentLocalizer(moment)}
                                date={this.state.date}
                                events={this.state.myEventsList}
                                startAccessor="start"
                                endAccessor="end"
                                defaultView="day"
                                views={["day"]}
                                scrollToTime={new Date()}
                                selectable={false}
                                resizable={false}
                                step={30}
                                timeslots={1}
                                toolbar={false}
                                min={moment().set("hour", 9).set("minutes", 0).toDate()}
                                max={moment().set("hour", 17).set("minutes", 0).toDate()}
                                onSelectEvent={this.handleSelectEvent}
                            />
                        </div>
                    </ons-list-item>
                </ons-list> 
            </React.Fragment>
        )
    }
}