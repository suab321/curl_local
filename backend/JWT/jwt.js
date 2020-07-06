require('dotenv').config;

const jwt=require('jsonwebtoken');


function createToken(data){
    return new Promise((resolve,reject)=>{
        jwt.sign({data:data}, process.env.jwt_key, {expiresIn:'2h'},function(err,token){
            (err) ? reject(err) : resolve(token);
        });
    });
}

function decodeToken(token){
    // console.log(token);
    return new Promise((resolve,reject)=>{
        jwt.verify(token,process.env.jwt_key,function(err,data){
            (err) ? reject(err) : resolve(data);
        });
    });
}


module.exports={
    createToken,
    decodeToken
}