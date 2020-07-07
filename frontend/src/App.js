import React from 'react';
import Axios from 'axios';
import {BrowserRouter as Router, Switch, Link} from 'react-router-dom';
import {Route} from 'react-router';
import {NavItem,Navbar} from 'react-materialize'
import cookie from 'react-cookies';

import Game from './components/GameComp/Game.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import Profile from './components/Profile.jsx';

const {backURL}=require('./back_url');


class App extends React.Component{
  constructor(){
    super();
    this.state={
      isLogin : false,
      token:null
    }
    this.logout = this.logout.bind(this);
  }

  componentDidMount(){
    Axios.get(`${backURL}/api/get`,{withCredentials:true}).then(res=>{
      cookie.save("token",res.data,{path:"/"});
      this.setState({isLogin:true});
    });
  }

  logout(){
    cookie.save('token','');
    Axios.get(`${backURL}/api/logout`,{withCredentials:true});
    this.setState({isLogin:false});
  }

  render(){
    if(this.state.isLogin){
      return(
        <Router>
          <switch>
          <Navbar centerLogo alignLinks="left">
              <Link to='/game'><NavItem>Games</NavItem></Link>
              <Link to="/dashboard"><NavItem>Dashboard</NavItem></Link>
              <Link to="/profile"><NavItem>Profile</NavItem></Link>
              <NavItem onClick={this.logout}>Logout</NavItem>
            </Navbar>
            <Route exact strict path="/game" component={Game}/>
            <Route exact strict path="/dashboard" component={Dashboard}/>
            <Route exact strict path="/profile" component={Profile}/>
            <Route exact strict path="/app" component={App}/>
          </switch>
        </Router>
      )
    }
    else{
      return(
        <Router>
          <Switch>
            <Route exact strict path='*' component={Login}/>
          </Switch>
        </Router>
      )
    }
  }
}

export default App;
