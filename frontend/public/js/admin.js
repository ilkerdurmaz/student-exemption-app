document.addEventListener('DOMContentLoaded', function() {
    sessionStorage.clear();
}, false);

class Request {
    constructor() {
        this.xhr = new XMLHttpRequest();
    }

    post(url, data, callback) {
        this.xhr.open("POST", url);
        this.xhr.setRequestHeader("Content-type", "application/json"); //json verisi gönderdiğimizi belirtiyoruz
        this.xhr.onload = () => {
            console.log(this.xhr.status);
            if (this.xhr.status === 200) {
                //başarılı dönüş
                callback(null, this.xhr.responseText);
                console.log("200 döndü");
            }
            else if (this.xhr.status === 201) {
                //başarılı dönüş
                callback(null, this.xhr.responseText);
                console.log("201 döndü");
            }
            else {
                callback("hata oluştu", null);
                console.log("200 dönmedi");
            }
        }
        this.xhr.send(JSON.stringify(data));
    }
}

const req = new Request();

let kayitlar;

req.post("http://localhost:8000/admin", { login: "admin" }, function (err, response) {
    if (err === null) {
        //console.log(response);
        kayitlar = JSON.parse(response);
        console.log(typeof (kayitlar));
        kayitListele();
    }
    else {
        console.log(err);
    }
});

const kayitListesi = document.getElementById("FilterList");
kayitListesi.addEventListener("click", eslesmeListele);
const dersListesi = document.getElementById("dersler");
dersListesi.addEventListener("click",dersSec);

const ad=document.getElementById("ad");
const soyad=document.getElementById("soyad");
const tc=document.getElementById("tc");

const onayla=document.getElementById("onayla");
onayla.addEventListener("click",dersOnay);

function kayitListele() { //ders kaydı olan kişileri kayıtlar bölümüne listeler

    kayitlar.forEach(element => {
        kayitListesi.innerHTML += `
       
    <li class="list-group-item list-group-item-action">${element.ad} ${element.soyad}</li>
           `;
    });
}

function eslesmeListele(e) { //tıklanan kisinin ders kayıtlarını listeler
    let renk;
    dersListesi.innerHTML='';
    kayitlar.forEach(element => {
        if (element.ad + " " + element.soyad == e.target.textContent) { //dikkkat
            element.dersler.forEach(d => {
                ad.value=element.ad;
                soyad.value=element.soyad;
                tc.value=element.tc;
                if(d.onay==="olumlu")
                {
                    renk="bg-primary text-white";
                }
                else
                {
                    renk="";
                }
                dersListesi.innerHTML += `
            <tr class="${renk}">
            <td>${d.ders}</td>
            <td>${d.dersKredi}/${d.dersSaat}</td>
            <td>${d.dersNot}</td>
            <td>${d.isteDers}</td>
            <td>${d.isteDersKredi}/${d.isteDersSaat}</td>
            <td>${d.onay}</td>
            </tr>
                   `;
            });
        }
    });
}

function dersSec(e){
    
    let secilen=e.target.parentElement.firstElementChild.textContent; //secilen satırdaki ilk hücrenin texti
    if(e.target.parentElement.className==="")
    {
        kayitlar.forEach(element =>{
            if(element.tc===tc.value)
            {
                element.dersler.forEach(d=>{
                    if(d.ders===secilen)
                    {
                        console.log(d.onay);
                        d.onay="olumlu";
                    }
                });
            }
        });
        e.target.parentElement.className="bg-success text-white";
    }
    else
    {
        kayitlar.forEach(element =>{
            if(element.tc===tc.value)
            {
                element.dersler.forEach(d=>{
                    if(d.ders===secilen)
                    {
                        console.log(d.onay);
                        d.onay="olumsuz";
                    }
                });
            }
        });
        e.target.parentElement.className="";
    }
}

function dersOnay(){
    
    req.post("http://localhost:8000/admin/kayit", {kayitlar:kayitlar}, function (err, response) {
        if (err === null) {
            console.log(tc.value);
            console.log(kayitlar);
            alert("KAYDEDİLDİ!");
        }
        else {
            console.log(err);
        }
    });
}

