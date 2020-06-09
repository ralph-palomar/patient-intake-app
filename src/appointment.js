import React from 'react';
import ReactDOM from 'react-dom';
import { openMenu, createAppointment, verifyAppointmentByDate, getAppointmentsByDate, verifyAppointmentByStartDate, getUserAppointments, updateUserAppointment } from './home.js';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import DatePicker from 'react-date-picker';
import { availableHours, login_cookie, appointmentBufferInHours } from './config.js';
import ons from 'onsenui';
import { cookies, showAlert } from './index.js';


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
                    if (appointment.resource.status !== "Cancelled") {
                        filteredSlots = filteredSlots.filter((slot) => {
                            return moment(slot.start).format('LLL') !== appointment.start 
                                && moment(slot.end).format('LLL') !== appointment.end
                        });
                    }
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
                const date = moment(event.start).format('LL');
                const email = cookies.get(login_cookie).email;
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
                                ons.notification.alert('Sorry upon re-checking this slot has already been taken. Please select another slot.');
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
    handleClickCalendar = (event) => {
        const nav = document.querySelector('#navigator');
        if (nav != null) {
            nav.pushPage('list_appointment.html')
            .then((value) => {
                const email = cookies.get(login_cookie).email;
                getUserAppointments((data) => {
                    const list_appointment_main = document.querySelector('#list_appointment_main');
                    if (list_appointment_main != null) {
                        ReactDOM.render(<AppointmentList appointmentList={data} />, list_appointment_main);
                    }
                }, email);
            });
        }
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
                        Set Appointment
                    </div>
                    <div className="right">
                        <ons-button modifier="quiet" onClick={this.handleRefresh}>
                            <i className="fas fa-sync-alt fa-lg"></i>
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
                                maxDate={moment().add(3, "months").toDate()}
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
                <ons-fab position="bottom right" style={{ position: 'fixed' }} onClick={this.handleClickCalendar}>
                    <i className="far fa-calendar-alt"></i>    
                </ons-fab>
            </React.Fragment>
        )
    }
}

export class AppointmentList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointmentList: props.appointmentList,
            originalList: props.appointmentList
        }
    }
    refreshData = (event) => {
        const email = cookies.get(login_cookie).email;
        getUserAppointments((data) => {
            this.setState({
                appointmentList: data
            });
        }, email);
    }
    handleCancel = (event) => {
        const target = event.target;
        ons.notification.confirm('Are you sure you want to cancel this appointment?')
        .then((value) => {
            if (value === 1) {
                const date = target.getAttribute('date');
                const email = cookies.get(login_cookie).email;
                const payload = {
                    "resource.status": "Cancelled"
                }
                updateUserAppointment((data) => {
                    showAlert('Successfully cancelled appointment')
                    this.refreshData(null);
                }, email, date, payload);
            }
        });
    }
    handleAll = (event) => {
        this.setState({
            appointmentList: this.state.originalList
        });
    }
    handlePending = (event) => {
        const filteredList = this.state.originalList.filter((item) => {
            return item.resource.status === "Pending"
        });
        this.setState({
            appointmentList: filteredList
        });
    }
    handleAccepted = (event) => {
        const filteredList = this.state.originalList.filter((item) => {
            return item.resource.status === "Accepted"
        });
        this.setState({
            appointmentList: filteredList
        });
    }
    handleCancelled = (event) => {
        const filteredList = this.state.originalList.filter((item) => {
            return item.resource.status === "Cancelled"
        });
        this.setState({
            appointmentList: filteredList
        });
    }
    render() {
        return (
            <React.Fragment>
                <ons-segment id="segment" style={{ width: '100%'}}>
                    <button onClick={this.handleAll}>All</button>
                    <button onClick={this.handlePending}>Pending</button>
                    <button onClick={this.handleAccepted}>Accepted</button>
                    <button onClick={this.handleCancelled}>Cancelled</button>
                </ons-segment>
            {
                this.state.appointmentList.map((item) => {
                    const display = item.resource.status === "Cancelled" ? 'none' : 'inline-block';
                    const ons_card_style = item.resource.status === "Cancelled" ? 
                        { borderLeft: '5px solid red', borderRadius: '10px' } :
                        { borderLeft: '5px solid blue', borderRadius: '10px' }

                    return (
                        <ons-card style={ons_card_style}>
                            <p>
                                Start: {item.start}
                            </p>
                            <p>
                                End: {item.end}
                            </p>
                            <p>
                                Status: <b>{item.resource.status}</b>
                            </p>
                            <p align="right">
                                <ons-button modifier="quiet" date={item.resource.date} onClick={this.handleCancel} style={{ display: display }}>
                                    <i class="fas fa-times fa-fw fa-lg"></i>&nbsp;Cancel
                                </ons-button>
                            </p>
                        </ons-card>
                    )
                })
            }
            </React.Fragment>
        )
    }
}