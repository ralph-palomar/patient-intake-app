import React from 'react';
import ReactDOM from 'react-dom';
import { defaultImg } from './config.js';
import { Profile, getAllUsers } from './home.js';

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
        getAllUsers((data) => {
            this.setState({
                userList: data,
                originalUserList: data
            });
        }, 'users');

        this.pullhook.addEventListener('changestate', this.handlePullHookChangeState);
    }
    handlePullHookChangeState = (event) => {
        if (event.type === 'changestate' || event.state === "action") {
            getAllUsers((data) => {
                this.setState({
                    userList: data,
                    originalUserList: data
                });
            }, 'users');
        }
    }
    handleUserViewClick = (user) => {
        if (user.email != null) {
            const nav = document.querySelector('#navigator');
            nav.pushPage('user_profile.html').then(() => {
                const user_profile_component = document.querySelector('#user_profile_component');
                ReactDOM.render(<Profile picture={user.picture} email={user.email} openedBy="admin" type={user.type} enabled={user.enabled} />, user_profile_component);
            });
        }
    }
    render() {
        return (
            <React.Fragment>
                <ons-pull-hook id="pull-hook" ref={ref => { this.pullhook = ref }}>
                </ons-pull-hook>
                <ons-search-input style={{ width: '100%'}} placeholder="Search" onKeyUp={this.searchUser}></ons-search-input>
                <ons-list>
                <ons-list-header style={{ backgroundColor: '#e6f2ff'}}><b>List of Patients</b></ons-list-header>
                    <ons-lazy-repeat>
                    {
                        
                        this.state.userList.map((value, index) =>
                            <ons-list-item index={index} key={value.email} modifier="chevron" tappable onClick={(event) => {this.handleUserViewClick(value)}} >
                                <div className="left" align="center">
                                    <img className="list-item--material__thumbnail" src={value.picture != null ? value.picture : defaultImg} alt="Profile Pic" style={{width: '60px', height: '60px'}} ></img>
                                </div>
                                <div className="center" style={{ marginLeft: '8px'}}>
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
