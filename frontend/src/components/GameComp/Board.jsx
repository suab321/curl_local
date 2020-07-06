import React from 'react';
import './board.css';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import cookie from 'react-cookies';

const {backURL} = require('../../back_url');
const {abhi} = require('./solution');

class Board extends React.Component{
    constructor(props){
        super(props);
        this.state={
            matrix_data:[],
            board_size : 5,            
            solved:false
        }
        this.clicked = this.clicked.bind(this);
        this.submit = this.submit.bind(this);
        this.my_matrix_data = [];
        console.log(cookie.load('token'));
    }

    componentDidMount(){
        axios.get(`${backURL}/api/get_sudoku`).then(res=>{
            const random_index = Math.floor(Math.random() * (res.data.length-1 + 1));
            this.my_matrix_data = res.data[random_index].data;
            this.setState({matrix_data:res.data[random_index].data,board_size:res.data[random_index].size});
        });
    }

    async submit(){
        if(abhi(this.my_matrix_data, this.state.board_size)){
            this.props.updateScore();
        }
        
    }

    clicked(event){
        console.log(event.target.id);

        this.my_matrix_data[Number(event.target.id)] = Number(document.getElementById(event.target.id).value);
    }

    render(){
        console.log(this.state.matrix_data);
        let row=[];
        let col=[];
        for(let i=0;i<this.state.board_size;i++){
            row[i]=1;
            col[i]=1;
        }
        const UI = row.map((value,x)=>{
            const subUI = col.map((value,y)=>{
                const cod = this.state.board_size*x+y;
                return(
                    <td><input id={`${cod}`} style={{border:'hidden'}} type="Number"onChange={this.clicked}></input></td>
                )
            });
            return(
                <tr>
                    {subUI}
                </tr>
            )
        });
        if(this.state.matrix_data.length > 0){
            this.state.matrix_data.forEach((value,index)=>{
                console.log(index,value);
                if(value!==null){
                    document.getElementById(String(index)).value = value;
                    document.getElementById(String(index)).readOnly = true;
                }
            });
        }
        if(this.state.solved){
            return(
                <Redirect to="/profile" />
            )
        }
        else{
            return(
                <div style={{textAlign:'center'},{paddingTop:'50px'}}>
                    <table id="board">
                        {UI}
                    </table><br/>
                    <button onClick={this.submit}>Submit</button>
                    </div>
            )
        }
    }
}
export default Board;