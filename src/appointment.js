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
                <div className="container">
                    <ons-list style={{ marginTop: '40px' }}>
                        <ons-list-item>
                            <div>
                                <br/>
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
                </div>
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
                <div className="container">
                <ons-segment id="segment" style={{ width: '100%'}}>
                    <button onClick={this.handleAll}>All</button>
                    <button onClick={this.handlePending}>Pending</button>
                    <button onClick={this.handleAccepted}>Accepted</button>
                    <button onClick={this.handleCancelled}>Cancelled</button>
                </ons-segment>
                </div>
                <div className="container">
            {
                this.state.appointmentList.map((item) => {
                    const display = item.resource.status === "Cancelled" ? 'none' : 'inline-block';
                    const ons_card_style = item.resource.status === "Cancelled" ? { borderLeft: '5px solid red', borderRadius: '10px' } :
                        ( item.resource.status === "Accepted" ? { borderLeft: '5px solid green', borderRadius: '10px' } : { borderLeft: '5px solid blue', borderRadius: '10px' })

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
                            <p>
                                {item.resource.note != null ? `Note: ${item.resource.note}` : ""} 
                            </p>
                            <p align="right">
                                <ons-button modifier="quiet" date={item.resource.date} onClick={this.handleCancel} style={{ display: display }}>
                                    <i className="fas fa-times fa-fw fa-lg"></i>&nbsp;Cancel
                                </ons-button>
                            </p>
                        </ons-card>
                    )
                })
            }
                </div>
            </React.Fragment>
        )
    }
}

export class AppointmentManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myEventsList: [],
            date: new Date()
        }

        this.retrieveEventsList(new Date())
        .then((data) => {
            const events = data.map((item) => {
                return {
                    title: item.resource.status,
                    start: moment(item.start).toDate(),
                    end: moment(item.end).toDate(),
                    resource: item.resource
                }
            });
            this.setState({
                myEventsList: events
            });
        })
        .catch((error) => {
            showAlert('Oops there was an error');
        });

        this.notes = [];
    }
    componentDidMount() {
        this.calendarView.style.display = 'none';
        this.listView.style.display = 'block';

        if (this.state.myEventsList.length === 0) {
            this.list.style.height = '800px';
        }
    }
    retrieveEventsList = async (date) => {
        return await getAppointmentsByDate(moment(date).format('LL'), true)
        .then((response) => {
            return response.data
        });
    }
    handleDateChange = (date) => {
        this.retrieveEventsList(date)
        .then((data) => {
            const events = data.map((item) => {
                return {
                    start: moment(item.start).toDate(),
                    end: moment(item.end).toDate(),
                    resource: item.resource
                }
            });
            this.setState({
                date: date,
                myEventsList: events
            });
        })
        .catch((error) => {
            showAlert('Oops there was an error');
        });
    }
    handleSelectEvent = (event) => {
        const dialogHTML =
            `
            <ons-dialog cancelable>
                <p align="center">
                    <img class="list-item--material__thumbnail" style="width: 80px; height: 80px" src=${event.resource.user.picture} alt="User" ></img><br/>
                    <span>${event.resource.user.firstname} ${event.resource.user.lastname}</span><br/>
                    <span>${moment(event.start).format('LT')} to ${moment(event.end).format('LT')}</span>
                </p>
            </ons-dialog>
            `
        const dialog = ons.createElement(dialogHTML, { append: true });
        dialog.show();
        
    }
    handleCalendar = (event) => {
        this.calendarView.style.display = 'block';
        this.listView.style.display = 'none';
        this.list.style.height = 'auto';
        this.filterListSegment.style.display = 'none';
    }
    handleList = (event) => {
        this.calendarView.style.display = 'none';
        this.listView.style.display = 'block';
        this.filterListSegment.style.display = 'flex';

        if (this.state.myEventsList.length < 3) {
            this.list.style.height = '800px';
        } else {
            this.list.style.height = 'auto';
        }
    }
    handleStatusChange = (index, newStatus, email, date) => {
        const note = this.notes[index].value;
        const payload = {
            "resource.status": newStatus,
            "resource.note": note
        }
        updateUserAppointment((data) => {
            this.setState(state => {
                state.myEventsList[index].resource.status = newStatus
                state.myEventsList[index].resource.note = note
                return state
            });
        }, email, date, payload);
    }
    handleBlur = (event, email, date) => {
        if (event.target.matches('textarea')) {
            const note = event.target.value;
            const payload = {
                "resource.note": event.target.value
            }
            if (note != null && note !== "") {
                updateUserAppointment((data) => {
                }, email, date, payload);
            }
        }
    }
    handleNextSevenDays = (event) => {
        console.log('7')
    }
    handleNextThirtyDays = (event) => {
        console.log('30')
    }
    render() {
        return (
            <React.Fragment>
                <div className="container">
                <ons-segment id="segment" style={{ width: '100%' }}>
                    <button onClick={this.handleList}>List</button>
                    <button onClick={this.handleCalendar}>Calendar</button>
                </ons-segment>
                <ons-list ref={ref=>{this.list=ref}}>
                    <ons-list-item>
                        <div>
                            <label className="form">Select Date</label>
                            <DatePicker 
                                value={this.state.date} 
                                clearIcon={null} 
                                onChange={this.handleDateChange}
                            />
                        </div>
                        <div className="right" style={{ width: '250px'}}>
                            <ons-segment style={{ width: '100%' }} ref={ref=>{this.filterListSegment=ref}}>
                                <button onClick={this.handleNextSevenDays}>Next 7 days</button>
                                <button onClick={this.handleNextThirtyDays}>Next 30 days</button>
                            </ons-segment>
                        </div>
                        <br/>
                    </ons-list-item>
                    <ons-list-item ref={ref=>{this.calendarView=ref}}>
                        <div style={{ height: '100%', width: '97%', zIndex: '0', display: 'block'}}>
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
                    <div ref={ref=>{this.listView=ref}} style={{ display: 'block' }}>
                    <React.Fragment>
                        {
                            this.state.myEventsList.map((item, index) => {
                                const icon = item.resource.status === "Pending" || item.resource.status === "Cancelled" ? "fas fa-check fa-lg fa-fw" : "fas fa-times fa-lg fa-fw"; 
                                const label = item.resource.status === "Pending" || item.resource.status === "Cancelled" ? "Accept" : "Decline"; 
                                const newStatus = item.resource.status === "Pending" || item.resource.status === "Cancelled" ? "Accepted" : "Cancelled";
                                const borderLeftStyle = item.resource.status === "Pending" ? "5px solid blue" : (item.resource.status === "Cancelled" ? "5px solid red" : "5px solid green");
                                return (
                                    <ons-card style={{ borderLeft: borderLeftStyle, borderRadius: '10px' }}>                                        
                                        <div style={{ display: 'inline-block'}}>
                                            <img className="list-item--material__thumbnail" style={{ width: '80px', height: '80px'}} alt="User" src={item.resource.user.picture}></img>
                                        </div>
                                        <div style={{ marginLeft: '20px', display: 'inline-block', verticalAlign: 'top', fontWeight: 'bold'}}>
                                            <span>{item.resource.user.firstname} {item.resource.user.lastname}</span><br/>
                                            <span>{moment(item.start).format('LT') + " - " + moment(item.end).format('LT')}</span><br/>
                                            <span>Status: {item.resource.status}</span><br/>         
                                            <div style={{ display: 'flex', marginLeft: '10px' }}><ons-button modifier="quiet" index={index} onClick={(event)=>this.handleStatusChange(index, newStatus, item.resource.email, item.resource.date)}><i class={icon}></i>{label}</ons-button></div>                              
                                            <textarea className="textarea" rows="3" cols="35" placeholder="Add a short note" defaultValue={item.resource.note} ref={ref=>{this.notes[index]=ref}} onChange={(event)=>this.handleBlur(event, item.resource.email, item.resource.date)}></textarea>                                            
                                        </div>                                    
                                    </ons-card>
                                )
                            })
                        }
                    </React.Fragment>
                    {
                        this.state.myEventsList.length === 0 ? 
                            <React.Fragment>
                                <ons-list-item>
                                    There are no appointments on this date.
                                </ons-list-item>
                            </React.Fragment>
                            :
                            ""
                    }
                    </div>
                </ons-list>
                </div>
            </React.Fragment>
        )
    }
}