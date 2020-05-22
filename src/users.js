import React from 'react';
import ReactDOM from 'react-dom';
import { api } from './config.js';
import { callApi } from './index.js';
import { Profile } from './home.js';

export class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: []
        }
    }
    searchUser = (event) => {
        const keyword = event.target.value;
        this.setState(state => {
            const currentUserList = state.originalUserList;
            const filteredUserList = currentUserList.filter((value) => {
                return value.firstname.match(new RegExp(keyword,"i")) ||
                    value.lastname.match(new RegExp(keyword,"i")) ||
                    value.email.match(new RegExp(keyword,"i"))
            });
            return {
                userList: filteredUserList
            }
        })
    }
    componentDidMount() {
        const config = {
            "url": api.users_api_base_url + "/v1/users/all",
            "method": "GET",
            "timeout": 60000,
            "headers": {
                "Authorization": api.users_api_authorization
            }
        };
        callApi(config, (data) => {
            this.setState({
                userList: data,
                originalUserList: data
            });
        }, 'users');   
    }
    handleUserClick = (email) => {
        if (email != null) {
            const nav = document.querySelector('#navigator');
            nav.pushPage('user_profile.html').then(() => {
                const user_profile_component = document.querySelector('#user_profile_component');
                ReactDOM.render(<Profile email={email} />, user_profile_component);
            });
        }
    }
    render() {
        return (
            <React.Fragment>
                <ons-search-input style={{ width: '100%'}} placeholder="Search" onKeyUp={this.searchUser}></ons-search-input>
                <ons-list>
                <ons-list-header style={{ backgroundColor: '#e6f2ff'}}><b>User accounts</b></ons-list-header>
                    <ons-lazy-repeat>
                    {
                        
                        this.state.userList.map((value, index) =>
                            <ons-list-item index={index} key={value.email} onClick={(event) => {this.handleUserClick(value.email)}} modifier="chevron" tappable>
                                <div className="center">
                                    <span className="list-item__title">{value.firstname + " " + value.lastname}</span>
                                    <span className="list-item__subtitle">{value.email}</span>
                                </div>                                
                            </ons-list-item>
                        )
                    }
                    </ons-lazy-repeat>
                </ons-list>
            </React.Fragment>
        );
    }
}
