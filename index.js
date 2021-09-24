var express = require('express');
var cors = require('cors');
var {loginUser, getData, createUser, changeDetails, deleteUser,upload, deleteFile} = require('./firebase');
var passport = require("passport");
var path = require('path');
var multer = require("multer");
const genToken = require('./jwt');
require('./passport');
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build'),));
global.XMLHttpRequest = require("xhr2");
const uploader = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 20 * 1024 * 1024, // limiting files size to 20 MB
    },
  });
  

app.get('/currState', passport.authenticate('jwt', {session: false}), 
    (req,res) => {
       res.status(200).json(req.user);
    })

app.post('/signUp', async (req,res) => {
    email = req.body.email
    password = req.body.pwd
    username = req.body.username
    address = req.body.address
    try {
        const user = await createUser({email,password,username,address})
        if(user) {
            const token = genToken({email:user})
            res.status(200).json(token)
        }
    }
    catch (err) {
        res.status(402).end(err.message)
    }

})

app.get('/data', passport.authenticate('jwt',{session: false}),async (req,res) => {
    try {
        const data = await getData(req.user)
        res.status(200).json(data)
    }
    catch (err) {
        res.status(501).end(err.message)
    }

})

app.get('/delete', passport.authenticate('jwt',{session: false}),async (req,res) => {
    try {
        const data = await deleteUser(req.user)
        res.status(200).json(data)
    }
    catch (err) {
        res.status(501).end(err.message)
    }

})

app.post('/changeDetails', passport.authenticate('jwt',{session: false}),async (req,res) => {
    try {
        const data = await changeDetails(req.user,req.body.userUsername,req.body.userPassword,req.body.userAddress)
        res.status(200).json(data)
    }
    catch (err) {
        res.status(501).end(err.message)
    }

})
app.post('/upload', passport.authenticate('jwt',{session: false}),uploader.single('file'),async (req,res) => {
    try {
        if (!req.file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|MP3|wav|mp4|mp3|MP4|mpeg)$/))
            throw new Error('Only image files (jpg, jpeg, png) are allowed!','Only files (jpg, jpeg, png) are allowed!')
        const data = await upload(req.file,req.user)
        res.status(200).json(data)
    }
    catch (err) {
        res.status(501).end(err.message)
    }

})

app.post('/deletefile',passport.authenticate('jwt',{session: false}),uploader.single('file'),async (req,res) => {
    try {
       const data = await deleteFile(req.body.filename,req.body.url,req.user)
       res.status(200).json(data)
    }
    catch (err) {
        res.status(501).end(err.message)
    }
})


app.post('/login', async (req,res) => {
    try {
        const user =  await loginUser({email:req.body.email,pass:req.body.pwd})
        if(user) {
            const token = genToken({email: req.body.email})
            res.status(200).json(token)
        }  
    }
    catch (err) {
        res.status(403).end(err.message)
    }
})

app.get('*',(req,res) => {
    res.redirect('/')
})


//server starting
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});