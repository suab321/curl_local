import React, { useReducer } from 'react';
import Axios from 'axios';
import {backURL} from '../back_url.js';
import cookie from 'react-cookies';
import { Dropdown,Button,ButtonGroup } from 'react-materialize';

class Profile extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            details:false,
            user:{},
            uploadPhoto:false,
            file:null,
            zone:false
        }
        this.upload = this.upload.bind(this);
        this.selected = this.selected.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }

    async upload(){
        let formdata=new FormData();
        formdata.append('file',this.state.file);
        Axios.post(`${backURL}/api/upload`,formdata,{headers:{Authorization: `Bearer ${cookie.load('token')}`}}).then(res=>{
            alert("Your photo was uploaded successfully");
            this.fetchData();
        })
    }
    
    selected(event){
        let file = event.target.files[0];
        let name = file.name.split('.');
        name = name[name.length-1];
        if(name === 'jpeg' || name === 'png' || name === 'gif' || name === "jpg"){
            console.log(name);
            this.setState({file:event.target.files[0]});
        }
        else
            alert("please upload a image format");
    }

    fetchData(){
        Axios.get(`${backURL}/api/get_user`,{headers:{Authorization: `Bearer ${cookie.load("token")}`}}).then(res=>{
            let zone=false;
            if(res.data.zone === "")
                zone=true;
            this.setState({user:res.data,uploadPhoto:false,zone:zone});
        });
    }

    componentDidMount(){
        this.fetchData();
    }

    render(){
        console.log(this.state.zone);
       return(
           <div style={{textAlign:'center', marginTop:'10px'}}>
               <div>
                <img style={{background:'transparent'}} src={`${this.state.user.photo}`} height="200px" width="200px"/><br/>
               <h3>{this.state.user.name}</h3><br/>
                <h3>Score : {this.state.user.score}</h3>
                <h3>CurrentDailyStreak : {this.state.user.dailyStreak}</h3>
                <h3>MaxWinningStream : {this.state.user.maxDailyStreak}</h3>
                <button onClick={()=>{this.setState({uploadPhoto:!this.state.uploadPhoto})}}>Upload New Photo</button>
                </div>
                <div hidden={!this.state.uploadPhoto}>
                    <div>
                        <input onChange={this.selected} type="file"/>
                        <button onClick={this.upload}>Upload</button>
                    </div>
                </div><br/><br/>
                <div hidden={!this.state.zone}>
                    <h1>wkdh</h1>
                <select id="cars">
                <option value="volvo">Volvo</option>
                <option value="saab">Saab</option>
                <option value="fiat">Fiat</option>
                <option value="audi">Audi</option>
                </select>
                </div>
           </div>
       )
    }
}

export default Profile;