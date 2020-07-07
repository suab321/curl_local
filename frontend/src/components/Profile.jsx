import React from 'react';
import Axios from 'axios';
import {backURL} from '../back_url.js';
import cookie from 'react-cookies';

class Profile extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            details:false,
            user:{},
            uploadPhoto:false,
            file:null,
            zone:false,
            wait:true
        }
        this.upload = this.upload.bind(this);
        this.selected = this.selected.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.updateZone = this.updateZone.bind(this);
    }

    async upload(){
        console.log(this.state.file)
        if(this.state.file === null){
            alert("Select a image file");
            return;
        }
        let formdata=new FormData();
        formdata.append('file',this.state.file);
        Axios.post(`${backURL}/api/upload`,formdata,{headers:{Authorization: `Bearer ${cookie.load('token')}`}}).then(res=>{
            alert("Your photo was uploaded successfully");
            this.fetchData();
        })
    }

    async updateZone(){
        console.log(document.getElementById("zone").value);
        await Axios.get(`${backURL}/api/update_zone?zone=${document.getElementById("zone").value}`,{headers:{Authorization: `Bearer ${cookie.load('token')}`}});
        alert("zone is updated");
        this.setState({zone:false});
    }
    
    selected(event){
        let file = event.target.files[0];
        let name = file.name.split('.');
        name = name[name.length-1];
        if(name === 'jpeg' || name === 'png' || name === 'gif' || name === "jpg"){
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
            this.setState({user:res.data,uploadPhoto:false,zone:zone,wait:false});
        });
    }

    componentDidMount(){
        this.fetchData();
    }

    render(){
        // console.log(this.state.zone);
        if(this.state.wait){
            return(
                <div style={{textAlign:'center'}}>
                    <h1>Please Wait</h1>
                </div>
            )
        }
        else{
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
                        <h3>Select Your Zone</h3>
                        <select style={{display:'block',width:'10%',marginLeft:'40%'}} name="zone" id="zone">
                        <option value="North">North</option>
                        <option value="South">South</option>
                        <option value="West">West</option>
                        <option value="East">East</option>
                        </select>
                        <button onClick={this.updateZone}>Update</button>
                    </div>
            </div>
        )
      }
    }
}

export default Profile;