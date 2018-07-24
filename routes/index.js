var express = require('express');
var router = express.Router();
var username=[]

var DATA=new Array();
var users = {}
/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.num=req.session.num || 0;
  const num= ++req.session.num;
  res.locals.user = req.session.user;
  res.render('index', {num:num });
});
router.get("/logout",function(req,res){
  req.session.user=undefined;
  username=undefined;
  res.redirect("back")
})

router.post("/reg",function(req,res){
  const {loginname,password,confirm}=req.body
  if(loginname && password && password===confirm){
    users[loginname]={loginname,password};
  }
  res.redirect("back");
})

router.post("/login",function(req,res){
   const {loginname,password}=req.body;
  if(users[loginname] && users[loginname].password === password){
    req.session.user = {loginname}
    username=loginname;

  }
  res.redirect("back")
})



router.post('/updata_pwd',function(req,res){
  const {loginname,new_password}=req.body;
  if(users[loginname]){
    users[loginname].password=new_password;
  }
  res.redirect("back")
})

router.post('/submitmessage',function(req,res){

// if(req.session.user){
    // req.body.logname=req.session.user[loginname];
   var message=[]
   const fpath=path.join(__dirname,'message.js');

   // console.log(username)
   for(var p in req.body){
     message="Message:"+p+"   "+"Username"+":"+username+"\n";
     console.log(message)
   }

    //
    fs.appendFileSync(__dirname+"/message.js",message)
    res.send(message);

   })
module.exports = router;
