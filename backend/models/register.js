let mongoose = require('mongoose');

let registerSchema = new mongoose.Schema({//eşleştirilen derslerin kaydı için şema
    ad:String,
    soyad:String,
    tc: String,
    
    dersler: [{ //object array (json array) tutması için nested schema
        isteDers: String,
        isteDersKredi: String,
        isteDersSaat: String,

        ders: String,
        dersKredi: String,
        dersSaat: String,
        dersNot: String,
        
        onay:String
    }]
})
module.exports = mongoose.model('Register', registerSchema);