var ex=require("express")
var fs=require('fs')
var path=require('path')
var util = require("util");
var promise=require("bluebird")
var options = {
    // Initialization Options
    promiseLib: promise
};
var pgp = require('pg-promise')(options);
var bp = require('body-parser');
var app=new ex();

var connectionString = 'postgres://postgres:iluVirat100@localhost:5432/OTM';
var db = pgp(connectionString);

var query="";

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
    var fn="EQuries.sql";
    var contents="";
    if (fs.existsSync("EQuries.sql")) {
        console.log('File Exists');
    }
    fs.readFile("../Quries.sql", 'utf8',function (err,data) {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        query = util.format(data);
        //query.replace('\n',' ');
        //console.log(query);
    });
    fs.readFile(fn, 'utf8', function(err, data) {
        contents=data;        
    if(contents!=query){
    db.any(query)
    .then(function (data) {
        console.log('Tables Created');
        fs.writeFile(fn,query,'utf8',(err) => {
            if(err)
                console.log(err)
        });
        //fs.close();
        console.log('Initialization Successfull');
        res.send(data);
    });   
    }else{
        console.log('Re-Initialization Successfull');
    }
    });
});

app.get('/courses',function(req,res,next){
    db.any('select * from courses')
    .then(function (data) {
        console.log(data);
        res.send(data);
    })
})

app.get('/courses/:id',function(req,res,next){
    var i=parseInt(req.params.id)
    db.any('select * from courses where id=$1',i)
    .then(function (data) {
        console.log(data);
        res.send(data);
    })
})

app.post('/courses/',function(req,res,next){
    var n=req.body.name;
    var d=req.body.duration;
    var c=req.body.cou_content;
    var m=req.body.cou_img;
    var s=true;
    var dt = new Date();
    var fn = dt.getFullYear().toString()+'-' + dt.getMonth().toString()+'-' + dt.getDate().toString() +'-'+ dt.getMilliseconds().toString() + '.png';
        fs.writeFile('./public/'+fn,m,'base64', (err) => {
        if(err)
        console.log(err)
        else{
            console.log('Image Svaed Success...');
        }
    });

    imgPath = 'http://localhost:3400/' + fn;
    db.none('insert into courses(name,duration,cou_content,cou_img,status) values($1,$2,$3,$4,$5)',[n,d,c,m,s])
    .then(function () {
        res.send({"msg":"Course added Successfully"});
    })
})


app.put('/courses',function(req,res,next){
    var i=req.body.id;
    var n=req.body.name;
    var d=req.body.duration;
    var c=req.body.cou_content;
    var m=req.body.cou_img;
    var s=req.body.satus;
    db.none("update courses set duration=$1,cou_content=$2,status=$3 where id=$4",[d,c,s,i])
    .then(function(){
        res.send("Course Updated Successfully");
    })
})


app.delete('/courses/:id',function(req,res,next){
    var i=req.params.id;
    db.none("delete from courses where id=$1",i)
    .then(function(){
        res.send("Course deleted Successfully");
    })
})

app.listen(3400,function(err){
    if(err){
        console.log("Error in connecting server");
    }else{
        console.log("Server Started http://localhost:3400/");
    }
});