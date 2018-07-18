var ex=require("express")
var path=require('path')
var promise=require("bluebird")
var options = {
    // Initialization Options
    promiseLib: promise
};
var pgp = require('pg-promise')(options);
var bp = require('body-parser');
var mail= require('./mailer');
var session = require('express-session')



var user=new ex();

var connectionString = 'postgres://postgres:iluVirat100@localhost:5432/OTM';
var db = pgp(connectionString);

user.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

user.use(ex.static(path.join(__dirname, 'public'))); 
user.use(bp.urlencoded({ extended: true }));
user.use(bp.json());

user.get('/admin/users',function(req,res,next){
    db.any('select * from users')
    .then(function (data) {
        console.log(data);
        res.send(data);
    })
})

user.get('/users/:id',function(req,res,next){
    var i=parseInt(req.params.id)
    db.any('select * from users where UserId=$1',i)
    .then(function (data) {
        console.log(data);
        res.send(data);
    })
})

user.put('/users/VerifyUser',function(req,res,next){
    var i=req.body.email;
    var s=false;
    db.any("select * users where email=$1",[i])
    .then(function(data){
        if(data[0].status){
            res.send(data);
        }
    })
})

user.post('/users/',function(req,res,next){
    var firstName=req.body.firstName;
    var LastName=req.body.LastName;
    var email=req.body.email;
    var phoneNumber=req.body.phoneNumber;
    var DOB=req.body.DOB;
    var s=false;
    var ur='TestTaker';
    db.any('insert into users(name,duration,cou_content,cou_img,status) values($1,$2,$3,$4,$5) RETURNING UserId',[firstName,LastName,email,phoneNumber,DOB,s])
    .then(function (data) {
        db.none("insert into DomainLogs(LogHeader,LogCode,LogType,Message,referenceId,LoggedFor,Status) values ('Table-Insertion:Users','ITR','INFO','Insertion of $1 Test Taker successfull',$2,'Users',true)",[n,parseInt(data)])
        .then(function () {
            db.none('insert into UserRoles(RoleName,UserId,status) values ($1,$2,true)',[ur,data])
            .then(function () {
                mail(email,'Online Test Maker : Verify your email ','Reg');
                res.send({"msg":"User Registratrion Successfully"});
            })
        })
    })
})

user.post('/admin/users',function(req,res,next){
    var firstName=req.body.firstName;
    var LastName=req.body.LastName;
    var email=req.body.email;
    var phoneNumber=req.body.phoneNumber;
    var phoneNumber=req.body.phoneNumber;
    var DOB=req.body.DOB;
    var s=false;
    var ur=req.body.roleName;
    db.any('insert into users(FirstName,LastName,PhoneNumber,Email,DOB,Password,OTP,status) values($1,$2,$3,$4,$5,$6,$7,$8) RETURNING UserId',[firstName,LastName,email,phoneNumber,DOB,s])
    .then(function (data) {
        db.none("insert into DomainLogs(LogHeader,LogCode,LogType,Message,referenceId,LoggedFor,Status) values ('Table-Insertion:Users','ITR','INFO','Insertion of $1 $2 successfull',$3,'Users',true)",[n,ur,parseInt(data)])
        .then(function () {
            db.none('insert into UserRoles(RoleName,UserId,status) values ($1,$2,true)',[ur,data])
            .then(function () {
                mail(email,'Online Test Maker : Verify your email ','Reg');
                res.send({"msg":"User Registratrion Successfully"});
            })
        })
    })
})

user.put('/users/activate',function(req,res,next){
    var i=req.body.id;
    var s=req.body.status;
    db.none("update users set status=$1 where UserId=$2",[s,i])
    .then(function(){
        db.none("insert into DomainLogs(LogHeader,LogCode,LogType,Message,referenceId,LoggedFor,Status) values ('Table-Updation:Users','UTR','INFO','Updation of $1 $2 successfull',$3,'Users',true)",[n,s,i])
        .then(function () {
            res.send("User Activated Successfully");
        });
    })
})

user.put('/users/forgotPassword',function(req,res,next){
    var i=req.body.email;
    var s=false;
    db.none("update users set status=$1 where email=$2",[s,i])
    .then(function(){
        mail(email);
        db.none("insert into DomainLogs(LogHeader,LogCode,LogType,Message,referenceId,LoggedFor,Status) values ('Table-Updation:Users','UTR','INFO','Updation of $1 successfull',$2,'Users',true)",[n,i])
        .then(function () {
            res.send("User User InActivated Successfully");
        });
    })
})

user.put('/users/changePassword',function(req,res,next){
    var i=req.body.id;
    var s=req.body.status;
    db.none("update users set status=$1 where UserId=$2",[s,i])
    .then(function(){
        db.none("insert into DomainLogs(LogHeader,LogCode,LogType,Message,referenceId,LoggedFor,Status) values ('Table-Updation:Users','UTR','INFO','Updation of $1 successfull',$2,'Users',true)",[n,i])
        .then(function () {
            res.send("User Password Activated Successfully");
        });
    })
})

user.delete('/users/:id',function(req,res,next){
    var i=req.params.id;
    db.none("update users set status=false where UserId=$1",i)
    .then(function(){
        db.none("insert into DomainLogs(LogHeader,LogCode,LogType,Message,referenceId,LoggedFor,Status) values ('Table-Updation:Users','UTR','INFO','Updation of $1 successfull',$2,'Users',true)",[n,i])
        .then(function () {
            res.send("User DeActivated Successfully");
        });
    })
})