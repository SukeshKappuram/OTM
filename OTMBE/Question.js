var ex=require("express")
var promise=require("bluebird")
var path=require('path')
var session = require('express-session')
var options = {
    // Initialization Options
    promiseLib: promise
};

var pgp = require('pg-promise')(options);
var bp = require('body-parser');
var question=new ex();

var connectionString = 'postgres://postgres:iluVirat100@localhost:5432/OTM';
var db = pgp(connectionString);

question.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

question.use(ex.static(path.join(__dirname, 'public'))); 
question.use(bp.urlencoded({ extended: true }));
question.use(bp.json());
question.use(function (req, res, next) {

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

question.get('/questions',function(req,res,next){
    db.any('select * from questions')
    .then(function (data) {
        console.log(data);
        res.send(data);
    })
})

question.get('/questions/generate',function(req,res,next){
    db.any("SELECT * FROM Questions WHERE Difficult = 'Easy' AND CourseId = 1 ORDER BY random() LIMIT 10")
    .then(function (data) {
        console.log(data);
        res.send(data);
    })
})

question.get('/questions/:id',function(req,res,next){
    var i=parseInt(req.params.id)
    db.any('select * from questions where QuestionId=$1',i)
    .then(function (data) {
        console.log(data);
        res.send(data);
    })
})

question.post('/questions/',function(req,res,next){
    var courseId=req.body.courseId;
    var title=req.body.title;
    var question=req.body.question;
    var option1=req.body.option1;
    var option2=req.body.option2;
    var option3=req.body.option3;
    var option4=req.body.option4;
    var answer=req.body.answer;
    var difficulty=req.body.difficulty;
    var user=req.session.User;
    var s=true;
    db.any('insert into questions(CourseId ,Title,Question,Option1,Option2 ,Option3,Option4,Answer,Difficulty,CreatedBy,ModifiedBy,Status) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING QuestionId',[courseId,title,question,option1,option2,option3,option4,answer,difficulty,User,User,s])
    .then(function (data) {
        db.none("insert into DomainLogs(LogHeader,LogCode,LogType,Message,referenceId,LoggedFor,Status) values ('Table-Insertion:Questions','ITR','INFO','Insertion of $1 Question successfull',$2,'Questions',true)",[title,parseInt(data)])
        .then(function(){
        res.send({"msg":"Question added Successfully"});
        });
    })
})


question.put('/questions',function(req,res,next){
    var i=req.body.questionId;
    var courseId=req.body.courseId;
    var title=req.body.title;
    var question=req.body.question;
    var option1=req.body.option1;
    var option2=req.body.option2;
    var option3=req.body.option3;
    var option4=req.body.option4;
    var answer=req.body.answer;
    var difficulty=req.body.difficulty;
    var user=req.session.User;
    var s=req.session.status;
    db.none("update questions set courseId=$1,title=$2,question=$3,option1=$4,option2=$5,option3=$6,option4=$7,answer=$8,difficulty=$9,ModifiedBy=$10,status=$11,ModifiedTime=current_timestamp where QuestionId=$12",[courseId,title,question,option1,option2,option3,option4,answer,difficulty,User,s,i])
    .then(function () {
        db.none("insert into DomainLogs(LogHeader,LogCode,LogType,Message,referenceId,LoggedFor,Status) values ('Table-Updation:Questions','UTR','INFO','Updation of $1 Question successfull',$2,'Questions',true)",[title,i])
        .then(function(){
        res.send({"msg":"Question Updated Successfully"});
        });
    })
})


question.delete('/questions/:id',function(req,res,next){
    var i=req.params.id;
    db.none("update questions set status=false where QuestionId=$1",i)
    .then(function () {
        db.none("insert into DomainLogs(LogHeader,LogCode,LogType,Message,referenceId,LoggedFor,Status) values ('Table-Updation:Questions','UTR','INFO','Updation of $1 Question successfull',$2,'Questions',true)",[n,i])
        .then(function(){
        res.send({"msg":"Question Deleted Successfully"});
        });
    })
})
