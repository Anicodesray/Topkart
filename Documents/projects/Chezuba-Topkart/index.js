import express from 'express';
import routes from './src/routes/Topkartroutes';
import mongoose from 'mongoose'
import bodyParser from 'body-parser';
import { runAtMidnight } from './src/controllers/Topkartcontrollers'; 
const app=express();
const PORT=5000

//mongoose connection
mongoose.Promise=global.Promise 
mongoose.connect('mongodb://localhost/TopKart',{
    useNewUrlParser:true
});

//bodyparser setup

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
routes(app);

// call runAtMidnight function
runAtMidnight();

app.get('/',(req,res)=>
    res.send(`Node and express server are running on PORT ${PORT}`)
);

app.listen(PORT, ()=>{
    console.log(`your server is running on port ${PORT}`)
});