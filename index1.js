const express = require('express')
const cors = require("cors");
const mongoose = require('mongoose')
const app = express();
const port = 8080 || process.env.PORT
const { Post } = require("./models/scheams");
const fileUpload = require('express-fileupload');
const path = require("path")

// mongoose connection
const url = 'mongodb+srv://Dhiraj:Dhiraj123@cluster0.qwfe1ul.mongodb.net/?retryWrites=true&w=majority'
mongoose.set('strictQuery', true)
mongoose.connect(url, (err)=>{
    if(err){
    console.lo(`connection with mogoDB failed ${err}`)
    }
    else{
        console.log("Connected to mogoDb successfully")
    }
})


app.use(cors())
app.use(express.json())
app.use(fileUpload())


app.get("/",(req, resp)=>{
    console.log("Hello world")
    resp.send("Hii")
});


app.post("/api",(req, resp)=>{

    const {author, location, description } = req.body
    const {imageFile} = req.files

    imageFile.mv("./uploads/"+imageFile.name, async(err)=>{
        if(err){
            resp.json({message: err})
        }
        else{
            const post = new Post({
                ...{author ,location ,description},
                imageFile: imageFile.name,
                // contentType: "image/png"
            })
            try{
                const response = await post.save()
                resp.json({message: "You are good to go", response})
            }catch(e){
                resp.json({message: "Something went wrong", response: e})
            }
        }
    })

})

// to get all the inserted data we 
app.get("/all",async (req, resp)=>{
    resp.json({result: await Post.find()})
})

// to get images fromt the data
app.get("/images/:fileName", async (req, resp)=>{
    console.log(`./uploads/${req.params.fileName}`)
    resp.sendFile(path.join(__dirname, `./uploads/${req.params.fileName}`))
});







app.listen(port,()=>{
    console.log(`App is listening at port ${port}`)
})
