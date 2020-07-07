import React from 'react';
import Board from './Board';
import Axios from 'axios';
import { backURL } from '../../back_url';
import cookie from 'react-cookies';
class Game extends React.Component{
    constructor(props){
        super(props);
        this.updateScore = this.updateScore.bind(this);
        this.state={
            user:{},
            willPlay:false,
            matrix_data:[],
        }
    }

    async updateScore(){
        await Axios.get(`${backURL}/api/update_score`,{headers:{Authorization: `Bearer ${cookie.load('token')}`}});
        this.setState({willPlay:false});
    }
    componentDidMount(){
        Axios.get(`${backURL}/api/get_user`,{headers:{Authorization: `Bearer ${cookie.load('token')}`}}).then(res=>{
            const date1 = new Date(res.data.lastPlayed);
            const date2 = new Date(Date.now());
            let willPlay = false;
            if(date2.getDay()>date1.getDay() || date2.getMonth()>date1.getMonth || date2.getFullYear()>date1.getFullYear())
                willPlay = true;
            this.setState({user:res.data,willPlay:willPlay});
        });
    }
    render(){
        if(this.state.willPlay){
            return(
                <div style={{paddingTop:"10px",textAlign:'center'}}>
                    <Board user={this.state.user} updateScore={this.updateScore}/>
                </div>
            )
        }
        else{
            return(
                <div style={{textAlign:'center'}}>
                    <h1 style={{color:'green'}}>Congrats You Solved Todays Come Back Tomorrow!!</h1>
                    <img src="https://i.gifer.com/VGQ8.gif" height="400px" width="600px"/><br/><br/>
                </div>
            )
        }
    }
}

export default Game;