import React from 'react';
import { api } from './config.js';
import { callApi } from './index.js';

export class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: []
        }
    }
    componentDidMount() {
        const config = {
            "url": api.users_api_base_url + "/v1/users/all",
            "method": "GET",
            "timeout": 60000,
        };
        callApi(config, (data) => {
            this.setState({
                userList: data
            });
        }, 'users');   
    }
    render() {
        return (
            this.state.userList.map((value) =>
                <ons-list-item key={value.email} modifier="chevron" tappable>
                    <div className="center">
                        <span className="list-item__title">{value.firstname + " " + value.lastname}</span>
                        <span className="list-item__subtitle">{value.email}</span>
                    </div>
                </ons-list-item>
            )
        );
    }
}
