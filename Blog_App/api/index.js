const express=require("express")
const app=express();
const cors=require("cors");
const user=require("./models/user")
const mongoose=require("mongoose");
const bcrypt=require('bcrypt');
let port=8080;
const cookieParser=require('cookie-parser');
const salt=bcrypt.genSaltSync(10);
const secret="kfsdkjfbmnbjsjsjbfjsdnfmsduo8o898kfkjdfj";
const jwt=require("jsonwebtoken");
const multer=require('multer');
const uploadMiddleWare=multer({dest:'uploads/'});//specifying the folder in which  the file should be saved
const fs=require('fs');
const Post=require('./models/post')

//post to send some information
app.use(cors({credentials:true,origin:"http://localhost:5174"}));//react app
app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname +'/uploads'));//to pass photo from backend to front end
mongoose.connect('mongodb://127.0.0.1:27017/blogApp')
app.post('/register',async (req,res)=>
{
    const {username,password}=req.body;
    try{
    const userDoc=await user.create({
        username,
        password:bcrypt.hashSync(password,salt),
    });
    res.json(userDoc);
    }
    catch(e)
    {
        res.status(400).json(e);
    }

});
   
app.get('/profile',(req,res)=>
{
    // console.log(req.cookies.token);
    const {token}=req.cookies;
    if(!token)
    {
        res.status(404).json("No token provided");
    }
    else{
    jwt.verify(token,secret,{},(err,info)=>
    {
        if(err)
        {
            throw err;
        }
        else
        {
            res.json(info);
        }
    });
    // res.json(req.cookies);
}

})
app.post('/login',async(req,res)=>
{
    const {username,password}=req.body;
    const userDoc=await user.findOne({username});
    if(!userDoc)
    {
        res.status(404).json("User not found");
    }
    else{
    const passOk=bcrypt.compareSync(password,userDoc.password)
    
    //res.json(passOk);
    if(passOk)
    {
        //res.status(200).json("logged in");
        jwt.sign({username,id:userDoc._id},secret,{},(err,token)=>{
            if(err) throw err;
           res.cookie('token',token).json({
            id:userDoc._id,
            username,
           });//setting token value to the real token.
        });
        //alert("logged in")
    }
    else
    {
        res.status(500).json("wrong credentials");
        //alert("wrong credentials");
    }
}});

app.post('/logout',(req,res)=>{
     res.cookie('token','').json('ok')//setting the token value to empty string to invalidate the cookie
});

app.post('/post',uploadMiddleWare.single('file'),async (req,res)=>
{
    //to extract the extension from the file name
    const {originalname,path}=req.file
    const parts=originalname.split('.');
    const extension=parts[parts.length-1];
    const newPath=path+'.'+extension;
    fs.renameSync(path,newPath);

    const {token}=req.cookies;
    jwt.verify(token,secret,{},async (err,info)=>
    {
        if(err) throw err;
        const {title,summary,content,cover}=req.body;
        const postDoc=await Post.create(
        {
            title,
            summary,
            content,
            cover:newPath,
            author:info.id,
        });
        res.json({postDoc});
        
    });
    
    
});
app.put('/post/',uploadMiddleWare.single('file'),async(req,res)=>
{
    //response will be shown only after updating the image
    let newPath=null;
    if(req.file)
    {
        const {originalname,path}=req.file
        const parts=originalname.split('.');
        const extension=parts[parts.length-1];
        newPath=path+'.'+extension;
        fs.renameSync(path,newPath);
    }
    const {token}=req.cookies;
    jwt.verify(token,secret,{},async (err,info)=>
    {
        if(err) throw err;
        const {id,title,summary,content}=req.body;
        const postDoc=await Post.findById(id);
        const isAuthor=JSON.stringify(postDoc.author)===JSON.stringify(info.id);
        // res.json({isAuthor,postDoc,info});
        if(!isAuthor)
        {
            res.status(400).json("you are not the author");
            
        }
        await postDoc.updateOne({
            title,
            summary,
            content,
            cover:newPath ? newPath : postDoc.cover,
        });
        res.json(postDoc);
    })
    //res.json(req.file);

})
app.get('/post',async(req,res)=>
{
    res.json(await Post.find().populate('author',['username'])
    .sort({createdAt:-1}).
    limit(20)
    );
    // res.json({post:'id'})
});
app.get('/post/:id',async (req,res)=>
{
    const {id}=req.params;
    const postDoc=await Post.findById(id).populate('author',['username']);
    res.json(postDoc);
});

app.listen(port,()=>
{
    console.log(`server is listening on port number ${port}`)
})
//mongodb://localhost:27017

