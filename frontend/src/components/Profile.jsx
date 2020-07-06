import React, { useReducer } from 'react';
import Axios from 'axios';
import {backURL} from '../back_url.js';
import cookie from 'react-cookies';

class Profile extends React.Component{
    constructor(){
        super();
        this.state = {
            details:false,
            user:{},
            uploadPhoto:false,
            file:null
        }
        this.upload = this.upload.bind(this);
        this.selected = this.selected.bind(this);
    }

    async upload(){
        let formdata=new FormData();
        formdata.append('file',this.state.file);
        await Axios.post(`${backURL}/api/upload`,formdata,{headers:{Authorization: `Bearer ${cookie.load('token')}`}});
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

    componentDidMount(){
        Axios.get(`${backURL}/api/get_user`,{headers:{Authorization: `Bearer ${cookie.load("token")}`}}).then(res=>{
            this.setState({user:res.data});
        });
    }

    render(){
        console.log(this.state.user);
       return(
           <div style={{textAlign:'center', marginTop:'10px'}}>
               <img style={{background:'transparent'}} src={`${this.state.user.photo}`} height="200px" width="200px"/><br/>
               <h3>{this.state.user.name}</h3><br/>
                <h3>Score : {this.state.user.score}</h3>
                <h3>CurrentDailyStreak : {this.state.user.dailyStreak}</h3>
                <h3>MaxWinningStream : {this.state.user.maxDailyStreak}</h3>
                <button onClick={()=>{this.setState({uploadPhoto:true})}}>Upload New Photo</button>
                <div hidden={!this.state.uploadPhoto}>
                    <div>
                        <input onChange={this.selected} type="file"/>
                        <button onClick={this.upload}>Upload</button>
                    </div>
                </div>
           </div>
       )
    }
}

export default Profile;