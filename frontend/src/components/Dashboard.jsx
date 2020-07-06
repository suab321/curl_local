import React from 'react';
import Axios from 'axios';
import cookie from 'react-cookies';

const {backURL} = require('../back_url');

class Dashboard extends React.Component{
    constructor(){
        super();
        this.state={
            users:[]
        }
    }

    componentDidMount(){
        Axios.get(`${backURL}/api/all_user`, {headers:{Authorization: `Bearer ${cookie.load('token')}`}}).then(res=>{
            this.setState({users:res.data});
        })
    }
    render(){
        console.log(this.state.users);
        // const UI = this.state.users.map(user=>{
        //     return(
        //         <div style={{textAlign:'center'}}>
        //             <h6>{user.name}</h6>
        //         </div>
        //     )
        // });
        return(
            <div style={{textAlign:"center"}}>
                <h3>No user</h3>
            </div>
        )
    }
}

export default Dashboard;