import React from 'react';
import Axios from 'axios';
import cookie from 'react-cookies';

const {backURL} = require('../back_url');

class Dashboard extends React.Component{
    constructor(){
        super();
        this.state={
            users:[],
            lead_obj:{},
            me:{},
            wait:true
        }
        this.getLeader = this.getLeader.bind(this);
        this.sortData = this.sortData.bind(this);
    }

    getLeader(){
        let lead_obj=null;
        this.state.users.forEach(user=>{
            if(lead_obj === null){
                lead_obj = user;
            }
            else if(lead_obj.score<user.score)
                lead_obj = user;
        })
        this.setState({lead_obj:lead_obj});
    }

    sortData(){
        let sortedData = this.state.users;
        for(let i=0;i<this.state.users.length;i++){
            for(let j=i+1;j<this.state.users.length;j++){
                if(sortedData[i].score<sortedData[j].score){
                    let temp = sortedData[i];
                    sortedData[i] = sortedData[j];
                    sortedData[j] = temp;
                }
            }
        }
        return sortedData;
    }

    componentDidMount(){
        Axios.get(`${backURL}/api/get_user`, {headers:{Authorization: `Bearer ${cookie.load('token')}`}}).then(res=>{
            this.setState({me:res.data});
        }).catch(err=>{
            this.setState({redirect:true})
        })
        Axios.get(`${backURL}/api/all_user`, {headers:{Authorization: `Bearer ${cookie.load('token')}`}}).then(res=>{
            this.setState({users:res.data,wait:false});
            this.getLeader();
        }).catch(err=>{
            this.setState({redirect:true});
        })
    }
    render(){
        const sorted_users = this.sortData();
        console.log(sorted_users);
        let you_topper = false;
        if(this.state.lead_obj._id === this.state.me._id)
            you_topper = true;
        const UI = sorted_users.map(user=>{
                if(user._id === this.state.lead_obj._id)
                    return ("");
                if(user._id === this.state.me._id){
                    return(
                        <div style={{border:'1px solid black',margin:'10px 30%',background:'red'}}>
                            <img style={{padding:'3px'}} src={`${user.photo}`} height='50px' width='50px'/>
                            <h4>{`${user.name}`}</h4>
                            <h4>{`${user.score}`}</h4>
                        </div>
                    )
                }
                return(
                    <div style={{border:'1px solid black',margin:'10px 30%',background:'yellow'}}>
                        <img style={{padding:'3px'}} src={`${user.photo}`} height='50px' width='50px'/>
                        <h4>{`${user.name}`}</h4>
                        <h4>{`${user.score}`}</h4>
                    </div>
                )
            });
            if(this.state.wait){
                return(
                    <div style={{textAlign:'center'}}>
                        <h1>Please Wait</h1>
                    </div>
                )
            }
            else{
                return(
                    <div style={{textAlign:"center"}}>
                        <div>
                            <h1 style={{color:'red'}}>Leader Board</h1>
                            <h2 style={{color:'green'}} hidden={!you_topper}>Congrats you are a leader in your zone</h2>
                            <img src={`${this.state.lead_obj.photo}`} height='100px' width='100px'/>
                            <h3>{`${this.state.lead_obj.name}`}</h3>
                            <h3>{`${this.state.lead_obj.score}`}</h3>
                        </div>
                        <h1 style={{color:'red'}}>Others</h1>
                        {UI}
                    </div>
                )
            }
    }
}

export default Dashboard;