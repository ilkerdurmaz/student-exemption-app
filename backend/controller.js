let path=require('path');


module.exports.user=function(req,res){
  console.log("user controller çalıştı");
  res.sendFile(path.join(__dirname,'../frontend/user.html'));
  }

  module.exports.admin=function(req,res){
    console.log("admin controller çalıştı");
    res.sendFile(path.join(__dirname,'../frontend/admin.html'));
    }

  module.exports.login = function(req,res){
    console.log("login controller çalıştı");
    res.sendFile(path.join(__dirname,'../frontend/login.html'));
}

module.exports.loginAdmin = function(req,res){
  console.log("loginAdmin controller çalıştı");
  res.sendFile(path.join(__dirname,'../frontend/loginAdmin.html'));
}



