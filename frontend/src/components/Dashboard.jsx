import React from 'react';
import Axios from 'axios';
import cookie from 'react-cookies';

const {backURL} = require('../back_url');

class Dashboard extends React.Component{
    constructor(){
        super();
        this.state={
            users:[],
            filtered_user:[],
            lead_obj:{},
            me:{},
            zone:null,
            wait:true
        }
        this.getLeader = this.getLeader.bind(this);
        this.sortData = this.sortData.bind(this);
        this.zone_selected = this.zone_selected.bind(this);
        this.lead_obj = {};
    }

    getLeader(){
        console.log(this.state.filtered_user)
        // if(this.state.filtered_user.length === 0)
        //     return {};
        let lead_obj = null;
        this.state.filtered_user.forEach(user=>{
            if(lead_obj === null){
                lead_obj = user;
            }
            else if(lead_obj.score < user.score)
                lead_obj = user;
        })
        return lead_obj;
    }

    zone_selected(){
        const zone = document.getElementById("zone").value;
        if(zone === "All"){
            this.setState({zone:zone,filtered_user:this.state.users});
        }
        else{
            let filtered_user = this.state.users.filter(i=>{
                if(i.zone === zone)
                    return i;
            });
            this.setState({zone:zone,filtered_user:filtered_user});
        } 
    }

    sortData(){
        let sortedData = this.state.filtered_user;
        for(let i=0;i<this.state.filtered_user.length;i++){
            for(let j=i+1;j<this.state.filtered_user.length;j++){
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
            this.setState({users:res.data,filtered_user:res.data,wait:false});
        }).catch(err=>{
            this.setState({redirect:true});
        })
    }
    render(){
        // console.log(this.state);
        let sorted_users = this.sortData();
        let lead_obj = this.getLeader();
        console.log(lead_obj);
        let dont_show=false;
        if(lead_obj === null){
            dont_show=true;
            lead_obj = {};
        }
        
        let you_topper = false;
        if(lead_obj._id === this.state.me._id)
            you_topper = true;
        const UI = sorted_users.map(user=>{
                if(user._id === lead_obj._id)
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
                    <div style={{textAlign:"center"}}>
                    <h3>Select Your Zone</h3>
                    <select style={{display:'block',width:'10%',marginLeft:'40%'}} name="zone" id="zone" onChange={this.zone_selected}>
                        <option value="North">North</option>
                        <option value="South">South</option>
                        <option value="West">West</option>
                        <option value="East">East</option>
                        <option value="All">All</option>
                    </select>
                    </div>
                    <div hidden={dont_show}>
                        <h1 style={{color:'red'}}>Leader Board</h1>
                        <h2 style={{color:'green'}} hidden={!you_topper}>Congrats you are a leader in your zone</h2>
                        <img src={`${lead_obj.photo}`} height='100px' width='100px'/>
                        <h3>{`${lead_obj.name}`}</h3>
                        <h3>{`${lead_obj.score}`}</h3>
                        <h1 style={{color:'red'}}>Others</h1>
                    </div>
                    <div style={{textAlign:'center'}} hidden={!dont_show}>
                        <h1>No One till now from this zone</h1>
                    </div>
                    {UI}
                </div>
            )
        }
    }
}

export default Dashboard;