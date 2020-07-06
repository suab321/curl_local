import React from 'react';
import Board from './Board';
import Axios from 'axios';
import { backURL } from '../../back_url';
import cookie from 'react-cookies';
class Game extends React.Component{
    constructor(props){
        super(props);
        this.updateScore = this.updateScore.bind(this);
    }

    async updateScore(){
        await Axios.get(`${backURL}/api/update_score`,{headers:{Authorization: `Bearer ${cookie.load('token')}`}});
    }

    render(){
        console.log("yes");
        return(
            <div style={{paddingTop:"10px",textAlign:'center'}}>
                <Board updateScore={this.updateScore}/>
            </div>
        )
    }
}

export default Game;