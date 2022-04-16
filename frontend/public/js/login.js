

//Ajax,callback
class Request {
    constructor() {
        this.xhr = new XMLHttpRequest();
    }

    post(url, data, callback) {
        this.xhr.open("POST", url);
        this.xhr.setRequestHeader("Content-type", "application/json"); //json verisi gönderdiğimizi belirtiyoruz
        this.xhr.onload = () => {
            console.log(this.xhr.status);
            if (this.xhr.status === 201) {
                //başarılı dönüş
                callback(null, this.xhr.responseText);
                console.log("201 döndü");

            }
            else {

                callback("hata oluştu", null);
                console.log("201 dönmedi");
            }
        }
        this.xhr.send(JSON.stringify(data));
    }
}

const req = new Request();

const userGiris = document.getElementById("giris");

const ad = document.getElementById("ad");
const soyad = document.getElementById("soyad");
const tc = document.getElementById("tc");

userGiris.addEventListener("click", userLogin);

//http:// yazmak önemli yoksa çalışmıyor
function userLogin(e) {
    if (ad.value == '' || soyad.value == '' || tc.value == '') {
        alert("GEREKLİ TÜM ALANLARI DOLDURUNUZ!");
    }
    else {
        req.post("http://localhost:8000/", { ad: ad.value, soyad: soyad.value, tc: tc.value }, function (err, response) {
            if (err === null) {
                console.log(response);
            }
            else {
                console.log(err);
            }
        });
        window.location.replace("/user");
        sessionStorage.setItem("ad", ad.value);
        sessionStorage.setItem("soyad", soyad.value);
        sessionStorage.setItem("tc", tc.value);
    }
}


console.log("dosya çalıştı");



