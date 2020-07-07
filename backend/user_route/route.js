const router = require('express').Router();

const {User,Sudoku,uploadEngine} = require('../DataBase/db');
const {decodeToken, createToken} = require('../JWT/jwt');



async function verify_token(req,res,next){
    try{
        const bearer = req.headers['authorization'];
        if(typeof bearer === undefined)
            res.status(401).json("not user");
        else{
            const token = bearer.split(' ')[1];
            const data = await decodeToken(token);
            req.user_info = data;
            next();
        }
    }catch(err){
        console.log(err);
        res.status(401).json(err);
    }
}

router.get('/get', async(req,res)=>{
    console.log(req.session.user);
    if(req.session.user === undefined || req.session.user === null)
        res.status(400).json({});
    else{
        try{
            const token = await createToken(req.session.user);
            res.status(200).json(token);
        }catch(err){
            console.log(err);
            res.status(400).json(err);
        }
    }
        
});
router.get("/logout",(req,res)=>{
    console.log(req.session.user);
    if(req.session.user !== undefined || req.session.user !== null)
        req.session.user = null;
    res.status(200).json("ok");
})


router.post("/post_sudoku", async(req,res)=>{
    try{
        const data = new Sudoku;
        data.data = req.body.data;
        data.size = req.body.size;
        await data.save();
        res.status(200).json("ok");
    }catch(err){
        console.log(err);
        res.status(400).json(err);
    }
})
router.get("/get_sudoku", async(req,res)=>{
    try{
        const data = await Sudoku.find({});
        res.status(200).json(data);
    }catch(err){
        console.log(err);
        res.status(400).json(err);
    }
})

router.get('/update_score',[verify_token] ,async(req,res)=>{
    try{
        const user = await User.findById({_id:req.user_info.data._id});
        if(user.lastPlayed === 0){
            await User.findByIdAndUpdate({_id:req.user_info.data._id},{lastPlayed:Date.now(), dailyStreak:1, maxDailyStreak:1, score:user.score+1, playedSudoku:0});
            res.status(200).json("ok");
        }
        else{
            const date1 = new Date(user.lastPlayed);
            const date2 = new Date(Date.now());
            const diff = Math.ceil(Math.abs(date2-date1)/(1000*60*60*24));
            let dailyStreak=user.dailyStreak;
            let maxDailyStreak=user.maxDailyStreak;
            if(diff<=1){
                dailyStreak++;
                if(dailyStreak>maxDailyStreak)
                    maxDailyStreak=dailyStreak;
            }
            else
                dailyStreak=0;
            await User.findByIdAndUpdate({_id:req.user_info.data._id}, {lastPlayed:Date.now(), dailyStreak:dailyStreak, maxDailyStreak:maxDailyStreak , score:user.score+1,playedSudoku:user.playedSudoku+1});
            res.status(200).json("ok");
        }
    }catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});

router.get("/update_zone", [verify_token], async(req,res)=>{
    try{
        console.log(req.query);
        await findByIdAndUpdate({_id:req.user_info._id},{zone:req.query.zone});
    }catch(err){
        res.status(400).json(err);
    }
});

router.get("/all_user", [verify_token], async(req,res)=>{
    try{
        const data = await User.find({},{social_Id:false});
        res.status(200).json(data);
    }catch(err){
        res.status(400).json(err);
    }
});

router.get("/get_user", [verify_token], async(req,res)=>{
    try{
        const data = await User.findById({_id:req.user_info.data._id},{social_Id:false});
        res.status(200).json(data);
    }catch(err){
        res.status(400).json(err);
    }
});



router.post("/upload", [verify_token], (req,res)=>{
    uploadEngine(req,res,async(err)=>{
        if(err)
            res.status(400).json("error");
        else{
            try{
                let userPhoto = `${process.env.back_url}/stream/${req.file.filename}`
                await User.findByIdAndUpdate({_id:req.user_info.data._id},{photo:userPhoto});
                res.status(200).json("ok");
            }catch(err){
                res.status(400).json(err);
            }
        }
    });
})

module.exports={
    api:router
}