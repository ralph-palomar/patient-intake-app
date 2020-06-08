import React from 'react';
import { openMenu, createAppointment, verifyAppointmentByDate, getAppointmentsByDate, verifyAppointmentByStartDate } from './home.js';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import DatePicker from 'react-date-picker';
import { availableHours, login_cookie, appointmentBufferInHours } from './config.js';
import ons from 'onsenui';
import { cookies, showAlert } from '.';

export class Appointment extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            myEventsList: [],
            date: new Date()
        }

        this.initializeSlots(new Date())
        .then((value) => {
            this.setState({
                myEventsList: value
            });
        })
        .catch((error) => {
            showAlert('Oops there was an error');
        });

    }
    initializeSlots = async (date) => {
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

        return await getAppointmentsByDate(moment(date).format('LL'))
            .then((response) => {
                let filteredSlots = availableSlots;
                response.data.forEach((appointment) => {
                    filteredSlots = filteredSlots.filter((slot) => {
                        return moment(slot.start).format('LLL') !== appointment.start 
                            && moment(slot.end).format('LLL') !== appointment.end
                    });
                });
                filteredSlots = filteredSlots.filter((slot) => {
                    return moment(slot.start) > moment().add(appointmentBufferInHours, "hours").toDate()
                });
                return filteredSlots;
            });

    }
    handleSelectEvent = (event) => {
        const message = 
        `<div align="center"><h4>Do you want to set this appointment?</h4></div>
        <div align="center">Start: ${moment(event.start).format('LLL')}</div>
        <div align="center">End: ${moment(event.end).format('LLL')}</div>`

        ons.notification.confirm({ messageHTML: message }).then((value) => {
            if (value === 1) {
                const email = cookies.get(login_cookie).email;
                const date = moment(event.start).format('LL');
                const startDate = moment(event.start).format('LLL');
                const endDate = moment(event.end).format('LLL');
                const payload = {
                    title: "Reserved",
                    start: startDate,
                    end: endDate,
                    resource: {
                        date: date,
                        email: email,
                        status: "Pending"
                    }
                }
                verifyAppointmentByDate((data) => {
                    if (data.exists) {
                        ons.notification.alert('You have already set an appointment on this date. Please cancel it before setting a new one again.');
                    } else {
                        verifyAppointmentByStartDate((data) => {
                            if (data.exists) {
                                ons.notification.alert('Sorry upon rechecking this slot has already been taken. Please select another slot.');
                                this.handleRefresh(null);
                            } else {
                                createAppointment((data) => {
                                    showAlert('Successfully set appointment');
                                    this.initializeSlots(date)
                                    .then((value) => {
                                        this.setState({
                                            myEventsList: value
                                        });
                                    })
                                    .catch((error) => {
                                        showAlert('Oops there was an error');
                                    });
                                }, payload);
                            }
                        }, startDate);
                    }
                }, email, date);
            }
        });
    }
    handleDateChange = (date) => {
        this.initializeSlots(date)
        .then((value) => {
            this.setState({
                date: date,
                myEventsList: value
            });
        })
        .catch((error) => {
            showAlert('Oops there was an error');
        });
    }
    handleConfirmAppointment = (event) => {
        console.log(event)
    }
    handleRefresh = (event) => {
        this.initializeSlots(this.state.date)
        .then((value) => {
            this.setState({
                myEventsList: value
            });
            showAlert('Successfully refreshed slots')
        })
        .catch((error) => {
            showAlert('Oops there was an error');
        });
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
                    <div className="right">
                        <ons-button modifier="quiet" onClick={this.handleRefresh}>
                            <i class="fas fa-sync-alt fa-lg"></i>
                        </ons-button>
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
                            <label className="form">Select Available Slot (try to sync first)</label>
                        </div>
                        <div style={{ height: '100%', width: '97%', zIndex: '0'}}>
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
                <ons-fab position="bottom right" style={{ position: 'fixed' }}>
                    <i class="far fa-calendar-alt"></i>    
                </ons-fab> 
            </React.Fragment>
        )
    }
}