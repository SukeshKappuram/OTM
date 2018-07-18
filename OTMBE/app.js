var ex=require("express")
var fs=require('fs')
var path=require('path')
var util = require("util")
var promise=require("bluebird")
var options = {
    // Initialization Options
    promiseLib: promise
};
var pgp = require('pg-promise')(options);
var bp = require('body-parser');
var mail= require('./mailer');
var app=new ex();

var connectionString = 'postgres://postgres:iluVirat100@localhost:5432/OTM';
var db = pgp(connectionString);

app.use(ex.static(path.join(__dirname, 'public'))); 
app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', '*');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/',function(req,res,next){
    var EQuires="";
    //Check if its Initialized once or not
    if (fs.existsSync("EQuries.sql")) {
        EQuires=fs.readFileSync('EQuries.sql').toString();
        console.log('Re-Initialization Initiated');
    }else{
        console.log('Initialization Initiated');
        var initQuery=fs.readFileSync('../init_proj.sql').toString();
        db.any(initQuery)
        .then(function (data) {
        console.log(data);
        });
        console.log('Initialization Processed');
    }
     
    //Creation Of Tables
    var Quires=fs.readFileSync('../Quries.sql').toString();   
    Quires.replace('\n',' ');
    if(Quires!=EQuires){
        var drop=fs.readFileSync('../Drop.sql').toString();  
        drop.replace('\n',' ');
        db.any(drop)
        .then(function (data) {
            console.log(data);
            db.any(Quires)
            .then(function (data) {
            console.log('Tables Created');
            fs.writeFile('EQuries.sql',Quires,'utf8',(err) => {
            if(err)
                console.log(err)
            });
            console.log('Successfully Initialized');
        });
        res.send(data);
    });   
    }else{
        console.log('No Re-Initialization Required');
    }
    mail('iamsukeshk@gmail.com','OTM Initialized');
});

app.listen(3400,function(err){
    if(err){
        console.log("Error in connecting server");
    }else{
        console.log("Server Started http://localhost:3400/");
    }
});