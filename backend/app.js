let express = require('express');
let path = require('path');
let route = require('./route');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let User = require('./models/user');
let Admin = require('./models/admin');
let Register = require('./models/register');

let yetkiAdmin;

let app = express();

app.use('/public', express.static(path.join(__dirname, '../frontend/public'))); //cssyi yollamak için

app.use(bodyParser.json());

app.use(function (req, res, next) {
    console.log("url: " + req.url);
    console.log("time: " + Date.now());
    next();
});

app.use('/', route);

app.post('/', (req, res) => { //userlogin'den gelen post için
    yetkiAdmin = 'user';
    let tc = req.body.tc;
    console.log("client'tan gelen tc: " + tc);

    User.findOne({ tc: tc }, function (err, bulunan) {
        if (err) {
            console.log("hata oluştu " + err);
        }

        if (bulunan !== null) {
            console.log(bulunan);
            //yönlendirme ve diğer işlemler burada
        }
        else {//eğer girilen tc'ye ait kayıt yoksa, yeni kayıt açar
            let userData = req.body;
            let user = new User(userData);
            user.save((error, result) => {
                if (error) {
                    console.log(error);
                    return res.sendStatus(500).send({ message: error });
                }
                return res.sendStatus(201);
                //yönlendirme ve diğer işlemler burada
            });
        }
    });
});

app.post('/loginAdmin', (req, res) => { //adminLogin'den gelen post için

    let sifre = req.body.sifre; //belki var YAPMAK GEREKEBİLİR
    console.log("client'tan gelen admin şifresi: " + sifre);

    Admin.findOne({ sifre: sifre }, function (err, bulunan) {
        if (err) {
            console.log("hata oluştu " + err);
        }

        if (bulunan !== null) {
            console.log("admin şifresi doğru girildi: " + bulunan);
            //yönlendirme ve diğer işlemler burada
            yetkiAdmin = 'admin';
            return res.sendStatus(200);
        }
        else {
            console.log("admin şifresi yanlış girildi");
            //eğer girilen şifreye ait kayıt yoksa işlemler
            return res.sendStatus(401);
        }
    });
});

app.post('/user', (req, res) => { //user'dan gelen post için ders listesi kaydı
    let tc = req.body.tc;
    console.log("client'tan gelen ders listesine ait tc: " + tc);

    let regData = req.body;
    let register = new Register(regData);

    Register.findOne({ tc: tc }, function (err, bulunan) {
        if (err) {
            console.log("hata oluştu " + err);
        }

        if (bulunan !== null) { //eğer girilen tc'ye ait ders kaydı varsa, gelen yeni veriyi onunla değiştirir
            console.log(bulunan);
            console.log("önceki kayıt bulundu");

            Register.replaceOne({ tc: tc }, regData, (error, result) => {
                if (error) {
                    console.log(error);
                    return res.sendStatus(500).send({ message: error });
                }
                return res.sendStatus(201);
                //yönlendirme ve diğer işlemler burada
            });
        }
        else {//eğer girilen tc'ye ait ders kaydı yoksa gelen ders listesini kaydeder
            register.save((error, result) => {
                if (error) {
                    console.log(error);
                    return res.sendStatus(500).send({ message: error });
                }
                return res.sendStatus(201);
                //yönlendirme ve diğer işlemler burada
            });
        }
    });
});

app.post('/admin', (req, res) => { //admin gelen post için ders listesi kaydı

    if (yetkiAdmin === 'admin') {
        console.log("admin girişi yapıldı")
        Register.find({}, function (err, bulunan) {
            if (err) {
                console.log("hata oluştu " + err);
            }

            if (bulunan !== null) {
                res.send(bulunan);
            }
            else {
                console.log("hata oluştu");
                //eğer girilen şifreye ait kayıt yoksa işlemler
                return res.sendStatus(401);
            }
        });
    }
    else {
        console.log("yetkilendirmesiz admin sayfası erişimi denendi");
        return res.sendStatus(500);
    }
});


app.post('/admin/kayit', (req, res) => { //admin'den gelen ders kayıtları güncelleme

    let kayitlar = req.body.kayitlar;
    let register = {}; //yeni model yaratılırsa kendi object id'si ile birlikte geldiği için update/replace etmek imkansız oluyor

    kayitlar.forEach(element => {
        register.ad = element.ad;
        register.soyad = element.soyad;
        register.tc = element.tc;
        register.dersler = element.dersler;

        try {
            Register.updateOne({ tc: element.tc }, register, function (err, donen) {
                if (err) {
                    console.log(err + " hata oluştu");
                }
                else {
                    console.log("tc'si " + element.tc + " olan kayıt güncelendi");
                }
            });
        }
        catch (error) {
            console.log("hata oluştu");
        }
    });
});

app.post('/user/dersler', (req, res) => { //admin'den gelen ders kayıtları güncelleme
    Register.findOne({ tc: req.body.tc }, function (err, donen) {
        if (err) {
            console.log("hata oluştu " + err);
        }

        if (donen !== null) {
            res.send(donen);
        }
        else {
            console.log("ders kaydı bulunamadı!");
        }
    });

});

mongoose.connect('mongodb+srv://durandal:ch0z3n0n3@deneme-4ol5s.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true }, (err) => {
    if (!err) {
        console.log('veritabanı bağlantısı başarılı!');
    }
});


app.listen(8000);