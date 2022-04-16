let mongoose=require('mongoose');

let userSchema=new mongoose.Schema({ //öğrenci-kullanıcı kaydı için şema
    ad:String,
    soyad:String,
    tc:String
});

module.exports=mongoose.model('User',userSchema);