import React from 'react';

const {backURL}=require('../back_url');
class Login extends React.Component{
    constructor(){
        super();
    }

    render(){
        return(
            <div>
                <a href={`${backURL}/authentication/google_login`}><button>Google Login</button></a>
            </div>
        )
    }
}

export default Login;