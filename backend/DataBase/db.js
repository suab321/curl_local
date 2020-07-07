require('dotenv').config();
const multer = require('multer');
const GridStorage=require('multer-gridfs-storage');
const Grid=require('gridfs-stream');


const mongoose = require('mongoose');
const router = require('express').Router();

mongoose.connect(process.env.database_url,(err)=>{
    if(err)
        console.error(err);
});

let gfs;
let connection = mongoose.connection;
connection.once('open',()=>{
    gfs=Grid(connection.db,mongoose.mongo);
})
const storage=new GridStorage({
    url:process.env.database_url,
    file:(req,file)=>{
        const fileInfo=file.filename
    }
});

const upload=multer({storage}).single('file');

const UserSchema = new mongoose.Schema({
    name:String,
    score:{type:Number,default:0},
    dailyStreak:{type:Number,default:0},
    maxDailyStreak:{type:Number,default:0},
    lastPlayed:{type:Number,default:0},
    social_Id:String,
    zone:{type:String, default:""},
    playedSudoku:{type:Number,default:-1},
    photo:{type:String,default:'https://img.favpng.com/23/0/3/computer-icons-user-profile-clip-art-portable-network-graphics-png-favpng-YEj6NsJygkt6nFTNgiXg9fg9w.jpg'}
});

const SudokuSchema = new mongoose.Schema({
    data:[],
    size:Number
});

const User = mongoose.model("User", UserSchema);
const Sudoku = mongoose.model("Sudoku", SudokuSchema);

router.get('/:image_id',(req,res)=>{
    gfs.createReadStream(req.params.image_id).pipe(res);
})

module.exports={
    User,
    Sudoku,
    uploadEngine:upload,
    streamRoute:router
}