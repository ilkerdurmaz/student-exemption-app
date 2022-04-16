let mongoose=require('mongoose');

let isteDersSchema=new mongoose.Schema({ //iste'ye ait derslerin kaydı için şema
    
    isteDers:String,
    isteDersKod:String,
    isteDersKredi:Number,
    isteDersSaat:Number,

});

module.exports=mongoose.model('isteDersSchema',isteDersSchema);