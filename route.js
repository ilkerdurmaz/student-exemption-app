let express=require('express');
let router=express.Router();
let controller=require('./controller')

router.use(function(req,res,next){ //ilk çağırılan middleware
    req.deneme='merhaba';
    next();
});

router.get('/user',controller.user);

router.get('/admin',controller.admin);

router.get('/',controller.login);

router.get('/loginAdmin',controller.loginAdmin);

module.exports=router;