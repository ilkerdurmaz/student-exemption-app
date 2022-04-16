

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
            else if (this.xhr.status === 200) {
                //başarılı dönüş
                callback(null, this.xhr.responseText);
                console.log("200 döndü");
            }
            else {
                callback("hata oluştu", null);
                console.log("hata döndü");
            }
        }
        this.xhr.send(JSON.stringify(data));
    }
}

const req = new Request();

const ad = document.getElementById("ad");
const soyad = document.getElementById("soyad");
const tc = document.getElementById("tc");

ad.innerHTML = sessionStorage.getItem("ad");
soyad.innerHTML = sessionStorage.getItem("soyad");
tc.innerHTML = sessionStorage.getItem("tc");

const isteDersler = document.getElementById("isteDersler");
let secilenDers = '';
let secilenKredi = 99;
let secilenSaat = 99;
isteDersler.addEventListener("change", dersDegistir);

let eslesmeler = [];

function dersDegistir() {
    secilenDers = isteDersler.options[isteDersler.selectedIndex].text;
    console.log(secilenDers);
}

let ders = document.getElementById("ders");
let kredi = document.getElementById("dersKredi");
let saat = document.getElementById("dersSaat");
let not = document.getElementById("dersNot");

const dersList = document.getElementById("eslestirmeler");
let sayac = 1;
const dersEkle = document.getElementById("dersEkle");
dersEkle.addEventListener("click", listeyeEkle);
const temizle = document.getElementById("temizle");
temizle.addEventListener("click", listeyiTemizle);
const cardBody = document.getElementById("cardBody");
cardBody.addEventListener("click", dersSil);
const yazdir = document.getElementById("yazdir");
yazdir.addEventListener("click", pdfYazdir);

function dersleriCek() { //tc'ye ait olan kaydedilmiş dersleri çek ve lsiteye yaz

    let renk;
    req.post("http://localhost:8000/user/dersler", { login: "user", tc: sessionStorage.getItem("tc") }, function (err, response) {
        if (err === null) {
            let gelen = JSON.parse(response);
            gelen.dersler.forEach(function (eleman, index) {
                if (eleman.onay === "olumlu") { renk = "bg-success text-white"; }
                else { renk = ""; }

                dersList.innerHTML += `
       
    <tr class="${renk}">
    <th scope="row">${sayac}</th>
    <td>${eleman.ders}</td>
    <td>${eleman.dersKredi}/${eleman.dersSaat}</td>
    <td>${eleman.dersNot}</td>
    <td>${eleman.isteDers}</td>
    <td>${eleman.isteDersKredi}/${eleman.isteDersSaat}</td>
    <td><button type="button" class="btn btn-danger btn-sm" id="dersSil">X</button></td>
    </tr>
           `;
                sayac++;
            })
            eslesmeler = gelen.dersler;
            sessionStorage.setItem("dersler", JSON.stringify(eslesmeler));
        }
        else {
            console.log(err);
        }
    });
}

dersleriCek();


function listeyeEkle() {
    if (ders.value === '' || kredi.value === '' || saat.value === '' || not.value === '' || secilenDers === '' || secilenDers === "Seçin...") {
        alert("LÜTFEN TÜM ALANLARI DOĞRU GİRİNİZ!");
    }
    else {
        dersList.innerHTML += `
       
    <tr>
    <th scope="row">${sayac}</th>
    <td>${ders.value}</td>
    <td>${kredi.value}/${saat.value}</td>
    <td>${not.value}</td>
    <td>${secilenDers}</td>
    <td>${secilenKredi}/${secilenSaat}</td>
    <td><button type="button" class="btn btn-danger btn-sm" id="dersSil">X</button></td>
    </tr>
           `;
        sayac++;
        storageDersEkle();
    }
}

function listeyiTemizle() {
    dersList.innerHTML = "";
    sessionStorage.setItem("dersler", null); //removeitem sıkıntı çıkarıyor
    sayac = 1;
    eslesmeler = [];
}

function dersSil(e) {
    if (e.target.id === "dersSil") {
        let silinecek = e.target.parentElement.previousElementSibling.previousElementSibling.textContent;
        eslesmeler = JSON.parse(sessionStorage.getItem("dersler"));

        eslesmeler.forEach(function (eleman, index) {
            if (eleman.isteDers === silinecek) {
                eslesmeler.splice(index, 1);
            }
        });

        sessionStorage.setItem("dersler", JSON.stringify(eslesmeler));
        e.target.parentElement.parentElement.remove();
    }
}


function storageDersEkle() {
    eslesmeler.push({
        isteDers: secilenDers,
        isteDersKredi: secilenKredi,
        isteDersSaat: secilenSaat,

        ders: ders.value,
        dersKredi: kredi.value,
        dersSaat: saat.value,
        dersNot: not.value,

        onay: "olumsuz"
    });
    sessionStorage.setItem("dersler", JSON.stringify(eslesmeler));
}

const kaydet = document.getElementById("kaydet");
kaydet.addEventListener("click", listeyiKaydet);

function listeyiKaydet() {
    let liste = JSON.parse(sessionStorage.getItem("dersler"));

    if (liste !== null) {
        req.post("http://localhost:8000/user", { ad: sessionStorage.getItem("ad"), soyad: sessionStorage.getItem("soyad"), tc: sessionStorage.getItem("tc"), dersler: liste }, function (err, response) {
            if (err === null) {
                console.log(response);
                alert("LİSTE KAYDEDİLDİ!")
            }
            else {
                console.log(err);
            }
        });
    }
    else {
        alert("KAYDEDİLECEK LİSTE BULUNAMADI!");
    }
}

function pdfYazdir() {
    let data = [];


    eslesmeler.forEach(element => {
        if (element.onay === 'olumlu') {
            data.push({
                'Ders': element.ders,
                'Kredi': element.dersKredi,
                'Saat': element.dersSaat,
                'Not': element.dersNot,

                'İste Karşılığı': element.isteDers,
                'İste Kredi': element.isteDersKredi,
                'İste Saat': element.isteDersSaat,
            })
        }
    });

    function tarih() {
        var bugun = new Date();
        var gun = String(bugun.getDate()).padStart(2, '0');
        var ay = String(bugun.getMonth() + 1).padStart(2, '0'); //Ocak  0!
        var yil = bugun.getFullYear();
        bugun = gun + '/' + ay + '/' + yil;
        return bugun;
    }

    function tableBody() {

        let body = [];
        let columns = ['Ders', 'Kredi', 'Saat', 'Not', 'İste Karşılığı', 'İste Kredi', 'İste Saat']
        body.push(columns);

        data.forEach(function (row) {
            var dataRow = [];

            columns.forEach(function (column) {
                dataRow.push(row[column].toString());
            })

            body.push(dataRow);
        })

        return body;
    }

    let docDefinition = {
        content: [
            { text: 'DERS MUAFİYET LİSTESİ', fontSize: 25, alignment: 'center', bold: true },

            { text: '               ', lineHeight: 5 },
            {
                table: {
                    headerRows: 1,
                    body: tableBody()
                }
            },

            { text: '               ', lineHeight: 5 },
            { text: 'Öğrenci Adı Soyadı: ' + sessionStorage.getItem('ad') + ' ' + sessionStorage.getItem('soyad'), alignment: 'right' },
            { text: '               ', lineHeight: 2 },
            { text: 'İmza', alignment: 'right' },
            { text: '               ', lineHeight: 2 },
            { text: 'Tarih: '+tarih(), alignment: 'right' },
        ]
    };


    pdfMake.createPdf(docDefinition).download();
}

