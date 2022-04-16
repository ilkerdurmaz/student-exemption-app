let mongoose=require('mongoose');

let adminSchema=new mongoose.Schema({ //öğretmen-yönetici kaydı için şema
    sifre:String
});

module.exports=mongoose.model('Admin',adminSchema);