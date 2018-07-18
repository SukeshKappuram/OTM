var ex=require("express")
var promise=require("bluebird")
var path=require('path')
var options = {
    // Initialization Options
    promiseLib: promise
};
var pgp = require('pg-promise')(options);
var bp = require('body-parser');
var course=new ex();

var connectionString = 'postgres://postgres:iluVirat100@localhost:5432/OTM';
var db = pgp(connectionString);

course.use(ex.static(path.join(__dirname, 'public'))); 
course.use(bp.urlencoded({ extended: true }));
course.use(bp.json());
course.use(function (req, res, next) {

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

course.get('/courses',function(req,res,next){
    db.any('select * from courses')
    .then(function (data) {
        console.log(data);
        res.send(data);
    })
})

course.get('/courses/:id',function(req,res,next){
    var i=parseInt(req.params.id)
    db.any('select * from courses where CourseId=$1',i)
    .then(function (data) {
        console.log(data);
        res.send(data);
    })
})

course.post('/courses/',function(req,res,next){
    var n=req.body.name;
    var d=req.body.description;
    var s=true;
    db.any('insert into courses(name,description,status) values($1,$2,$3) RETURNING CourseId',[n,d,s])
    .then(function (data) {
        db.none("insert into DomainLogs(LogHeader,LogCode,LogType,Message,referenceId,LoggedFor,Status) values ('Table-Insertion:Courses','ITR','INFO','Insertion of $1 Course successfull',$2,'Courses',true)",[n,parseInt(data)])
        .then(function(){
        res.send({"msg":"Course added Successfully"});
        });
    })
})


course.put('/courses',function(req,res,next){
    var i=req.body.id;
    var n=req.body.name;
    var d=req.body.description;
    var s=req.body.status;
    db.none("update courses set description=$1,status=$2 where CourseId=$3",[d,s,i])
    .then(function () {
        db.none("insert into DomainLogs(LogHeader,LogCode,LogType,Message,referenceId,LoggedFor,Status) values ('Table-Updation:Courses','UTR','INFO','Updation of $1 Course successfull',$2,'Courses',true)",[n,i])
        .then(function(){
        res.send({"msg":"Course Updated Successfully"});
        });
    })
})


course.delete('/courses/:id',function(req,res,next){
    var i=req.params.id;
    db.none("update courses set status=false where CourseId=$1",i)
    .then(function () {
        db.none("insert into DomainLogs(LogHeader,LogCode,LogType,Message,referenceId,LoggedFor,Status) values ('Table-Updation:Courses','UTR','INFO','Updation of $1 Course successfull',$2,'Courses',true)",[n,i])
        .then(function(){
        res.send({"msg":"Course Deleted Successfully"});
        });
    })
})
