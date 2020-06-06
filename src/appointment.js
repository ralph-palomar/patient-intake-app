import React from 'react';
import ReactDOM from 'react-dom';
import { openMenu } from './home';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

export class Appointment extends React.Component {
    state = {
        myEventsList: [
            {
                title: "Select",
                start: moment().toDate(),
                end: moment().add(30, "minute").toDate()
            }
        ]
    }
    handleEventDrop = (data) => {
        
    }
    handleEventResize = (data) => {
        this.setState(state => {
            const lastEvent = state.myEventsList[state.myEventsList.length-1];
            lastEvent.start = data.start;
            lastEvent.end = data.end;
        });
    }
    componentDidMount() {
        const DnDCalendar = withDragAndDrop(Calendar);
        const localizer = momentLocalizer(moment);
        
        setTimeout(() => {
            const appointment_calendar = document.querySelector('#appointment_calendar');
            ReactDOM.render(<DnDCalendar
                localizer={localizer}
                events={this.state.myEventsList}
                startAccessor="start"
                endAccessor="end"
                defaultView="day"
                views={["day"]}
                scrollToTime={new Date()}
                selectable={false}
                resizable={true}
                step={30}
                timeslots={1}
                onEventDrop={this.handleEventDrop}
                onEventResize={this.handleEventResize}
            />, appointment_calendar);
        }, 500);

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
                        <ons-button modifier="quiet">Save</ons-button>
                    </div>
                </ons-toolbar>
                <ons-tabbar position="bottom">
                    <ons-tab label="Schedule" icon="fa-tasks" page="set_appointment.html"></ons-tab>
                    <ons-tab label="History" icon="fa-history" page="set_appointment.html"></ons-tab>
                </ons-tabbar>
            </React.Fragment>
        )
    }
}