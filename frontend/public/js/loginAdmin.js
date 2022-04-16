//Ajax,callback
class Request {
    constructor() {
        this.xhr = new XMLHttpRequest();
    }
    post(url, data, callback) {
        this.xhr.open("POST", url);
        this.xhr.setRequestHeader("Content-type", "application/json"); //json verisi gönderdiğimizi belirtiyoruz
        this.xhr.onload = () => {
            if (this.xhr.status === 200) {
                //başarılı dönüş
                callback(null, this.xhr.responseText);
                console.log("200 döndü");
                window.location.replace("/admin");
            }
            if (this.xhr.status === 401) {
                callback(null, this.xhr.responseText);
                console.log("500 döndü");
                alert("ŞİFRENİZİ YANLIŞ GİRDİNİZ!")
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
const adminGiris = document.getElementById("giris");
const sifre = document.getElementById("sifre");
adminGiris.addEventListener("click", adminLogin);

//http:// yazmak önemli yoksa çalışmıyor
function adminLogin(e) {
    if (sifre.value !== '') {
        req.post("http://localhost:8000/loginAdmin", { sifre: sifre.value }, function (err, response) {
            if (err === null) {
                console.log(response);
            }
            else {
                console.log(err);
            }
        });
    }
    else {
        alert("GİRİŞ YAPMAK İÇİN ŞİFRENİZİ GİRİNİZ!")
    }
}

console.log("dosya çalıştı");



