var ex=require("express")
var promise=require("bluebird")
var options = {
  // Initialization Options
  promiseLib: promise
};
var pgp = require('pg-promise')(options);
var bp = require('body-parser');
var nodemailer = require('nodemailer');
var user=new ex();

module.exports = function (tomail,sub,mtype) {
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mail.svtechies@gmail.com',
      pass: 'P@ssw0rd321'
    }
  });

  var msg='<p>Please verify by entering the following code to verify !</p><b>';
  var code='';
  for(i=0;i<3;i++){
    code+=Math.floor((Math.random() * 100) + 1);
  }
  
  console.log(code);

  if(mtype=='Reg'){
    db.none("update users set OTP=$1 where UserId=$2",[code,tomail])
    .then(function(){
      msg=code+"<b>";
    });
  }
  
  var mailOptions = {
    from: 'mail.svtechies@gmail.com',
    to: tomail,
    subject: sub,
    html: '<h1>Welcome to Online Test Maker</h1>'+msg
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}