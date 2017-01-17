var pilih, ring, ring1, ring2, ring3, ring4, ring5, ring6, itung, jumlahPita = 4;
var cincin1 = ["0", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
var cincin2 = cincin1;
var cincin3 = [0, 1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 0.1, 0.01];
var cincin4 = {0:0, 2:1, 3:2, 6:0.5, 7:0.25, 8:0.1, 9:0.05, 11:5, 12:10, 13:20};
var cincin5 = cincin1;
var cincin6 = {0:"0", 1:"250", 2:"100", 3:"50", 4:"15", 5:"25", 6:"20", 7:"10", 8:"5", 10:"1"};
var tahanan, toleransi, koefisien;

Object.prototype.getKeyByValue = function( value ) {
    for( var prop in this ) {
        if( this.hasOwnProperty( prop ) ) {
             if( this[ prop ] === value )
                 return prop;
        }
    }
}

function getDigits(num) {
    var digits = [];
    while (num >= 10) {
        digits.unshift(num % 10);
        num = Math.floor(num / 10);
    }
    digits.unshift(num);
    return digits;
}

function reverse() {
	reset();
	var angka, notasi, pengali, belakangKoma;
	//ambil data input START
	tahanan = document.getElementById("tahanan").value;
	toleransi = document.getElementById("toleransi").value;
	koefisien = document.getElementById("koefisien").value;
	//ambil data input END
	var AngkaTokNonArray = tahanan.match(/[^k;m;r;\,; ]+|[0-9]+/gi); //ambil angka saja tapi tidak dalam array
	if (tahanan.match(/[\,;\.]+/gi)) { //ada koma
		var pisahDesimal = tahanan.match(/[0-9]+/g); //memisahkan angka didepan koma dan dibelakang koma menjadi array
		var dibelakangKoma = getDigits(pisahDesimal[1]); //angka dibelakang koma dalam array
		if (dibelakangKoma.length == 1) { //jika dibelakang koma isinya cuma 1, dicurigai depannya nol
			belakangKoma = dibelakangKoma[0].match(/[0-9]/g); //dipecah lagi biar nol didepan dianggap
		} else {
			belakangKoma = dibelakangKoma;
		}
		notasi = 1/Math.pow(10,belakangKoma.length); //notasi, misal dibelakang koma 2 angka maka notasinya 0,01
		if (pisahDesimal[0] == 0) { //jika angka didepan nol adalah 0 maka yang dihitung hanya angka dibelakang koma
			angka = pisahDesimal[1];
		} else {
			angka = pisahDesimal.join(""); //menggabungkan lagi angka depan dan belakang koma menjadi satu angka tanpa koma
		}
	} else if(AngkaTokNonArray[0].match(/0$/m)) { //tidak ada koma tapi berakhir dengan nol
		var depanNol = tahanan.match(/[1-9]+/g); //ambil angka didepan nol yang bukan nol
		angka = depanNol[0];
		var sepuluhKali = tahanan.match(/[0]/g);
		notasi = Math.pow(10,sepuluhKali.length); //notasi, misal berakhir dengan 00 maka notasinya 100
	} else if (tahanan.match(/k|m|r/gi)) { //tidak ada koma tapi ada K atau M atau R
		if (tahanan.match(/^k|^m|^r/gim)) { //ada K atau M atau R di awal, abaikan
		} else if (tahanan.match(/k$|m$|r$/gim)) { //ada K atau M atau R di akhir, teruskan
			angka = tahanan;
			notasi = 1;
		} else { //ada K atau M atau R ditengah, proses
			angka = tahanan;
			notasi = 0.1;
		}
	} else {
		angka = tahanan;
		notasi = 1;
	}
	var angkaneTok = angka.match(/[^k;m;r;\,; ]|[1-9]+/gi); //ambil angkanya saja, tanpa huruf dalam array
	//Proses pita 1, 2, dan 3 ,6(dalam resistor 5 pita) START
	if (angkaneTok.length == 1) { //jika angkanya cuma 1 digit
		document.getElementById("4").checked = true;
		jumlahPita = 4;
		radioKlik();
		document.getElementById("warna1").selectedIndex = 1;
		document.getElementById("warna2").selectedIndex = Number(angkaneTok[0]) + 1;
	} else if (angkaneTok.length == 2) { //jika angkanya 2 digit
		document.getElementById("4").checked = true;
		jumlahPita = 4;
		radioKlik();
		document.getElementById("warna1").selectedIndex = Number(angkaneTok[0]) + 1;
		document.getElementById("warna2").selectedIndex = Number(angkaneTok[1]) + 1;
	} else if (angkaneTok.length == 3 && koefisien == 0) { //jika angkanya 3 digit
		document.getElementById("5").checked = true;
		jumlahPita = 5;
		radioKlik();
		document.getElementById("warna1").selectedIndex = Number(angkaneTok[0]) + 1;
		document.getElementById("warna2").selectedIndex = Number(angkaneTok[1]) + 1;
		document.getElementById("warna5").selectedIndex = Number(angkaneTok[2]) + 1;
	} else if(angkaneTok.length == 3 && koefisien != 0) { //jika angkanya 3 digit dan koefisien ada nilainya
		document.getElementById("6").checked = true;
		jumlahPita = 6;
		radioKlik();
		document.getElementById("warna1").selectedIndex = Number(angkaneTok[0]) + 1;
		document.getElementById("warna2").selectedIndex = Number(angkaneTok[1]) + 1;
		document.getElementById("warna5").selectedIndex = Number(angkaneTok[2]) + 1;
		var enam = ["0", "250", "100", "50", "15", "25", "20", "10", "5", "1"];
		document.getElementById("warna6").selectedIndex = enam.getKeyByValue(koefisien);
	}
	//Agar warna pita 1,2,3,6 berubah
	this["warna1"].onchange();
	this["warna2"].onchange();
	this["warna5"].onchange();
	this["warna6"].onchange();
	//Proses pita 1, 2, dan 3, 6(dalam resistor 5 pita) END
	//Proses pita pengali START
	var hurufPengali = tahanan.match(/[k;m]+/i); //ambil huruf pengali K atau M
	if (hurufPengali && (hurufPengali == "k" || hurufPengali == "K" )) {
		pengali = 1000;
	} else if (hurufPengali && (hurufPengali == "m" || hurufPengali == "M")) {
		pengali = 1000000;
	} else {
		pengali = 1;
	}
	var multiplier = notasi * pengali;
	document.getElementById("warna3").selectedIndex = cincin3.getKeyByValue(multiplier);
	this["warna3"].onchange();
	//Proses pita pengali END
	//Proses pita toleransi START
	var empat = ["0", "1", "2", "0.5", "0.25", "0.1", "0.05", "5", "10", "20"];
	document.getElementById("warna4").selectedIndex = empat.getKeyByValue(toleransi);
	this["warna4"].onchange();
	//Proses pita toleransi END
}

function hitung() {
	var koef = "";
	ring1 = document.getElementById("warna1").value;
	ring2 = document.getElementById("warna2").value;
	ring3 = document.getElementById("warna3").value;
	ring4 = document.getElementById("warna4").value;
	ring5 = document.getElementById("warna5").value;
	ring6 = document.getElementById("warna6").value;
	if (jumlahPita == 5 || jumlahPita == 6) {
		itung = ((cincin1[ring1]+cincin2[ring2]+cincin5[ring5])*cincin3[ring3]).toFixed(2);
	} else if (jumlahPita == 4) {
		itung = ((cincin1[ring1]+cincin2[ring2])*cincin3[ring3]).toFixed(2);
	}
	if (itung>=1000 && itung<1000000) {
		hasil = itung/1000 +" K &#8486";
	}
	else if (itung>=1000000) {
		hasil = itung/1000000 +" M &#8486";
	}
	else {
		hasil = itung +" &#8486";
	}
	if (jumlahPita == 6) {
		koef = ", Koefisien suhu "+cincin6[ring6]+" ppm/&#176;C"; }
	document.getElementById("hasil").innerHTML = "<b>Nilai Hambatan = " +hasil+", Toleransi &plusmn; "+cincin4[ring4]+" &#37"+koef+"</b>";
}

function gantiWarna(pilih) {
	var pita, tulisan;
	var warnane = ["white", "black", "brown", "red", "orange", "yellow", "green", "blue", "purple", "grey", "white", "gold", "silver", "nocolor"];
	ring = warnane[pilih.value];
	if (ring == "nocolor" || ring == "nol") {
		pita = "white";
	}
	else {
		pita = ring;
	}
	if (pita == "orange" || pita == "yellow" || pita == "white" || pita == "nocolor" || pita == "gold" || pita == "silver") {
		tulisan = "black"; }
	else { 
		tulisan = "white"; }
	document.getElementById(pilih.name).style.background = pita;
	document.getElementById(pilih.id).style.backgroundColor = pita;
	document.getElementById(pilih.id).style.color = tulisan;
}

function radioKlik(radio) {
	if (radio != undefined) {
   	jumlahPita = radio.value;
   	}
   	reset();
	if (jumlahPita == 5) {
    	document.getElementById("lima").className = "fadein";
    	document.getElementById("enam").className = "fadeout";
    	document.getElementById("pitaWarna3").innerHTML = "Cincin 4";
    	document.getElementById("pitaWarna4").innerHTML = "Cincin 5";
    	document.getElementById("box").style.width = "120px";
    	document.getElementById("resistor").style.width = "270px";
    	document.getElementById("pita5").style.width = "10px";
    	document.getElementById("kosong3").style.width = "10px";
    	document.getElementById("pita6").style.width = "0px";
    	document.getElementById("kosong4").style.width = "0px";
	}
	else if (jumlahPita == 4) {
	   	document.getElementById("lima").className = "fadeout";
	   	document.getElementById("enam").className = "fadeout";
		document.getElementById("pitaWarna3").innerHTML = "Cincin 3";
    	document.getElementById("pitaWarna4").innerHTML = "Cincin 4";
    	document.getElementById("box").style.width = "100px";
    	document.getElementById("resistor").style.width = "250px";
    	document.getElementById("pita5").style.width = "0px";
    	document.getElementById("kosong3").style.width = "0px";
    	document.getElementById("pita6").style.width = "0px";
    	document.getElementById("kosong4").style.width = "0px";
    }
    else if (jumlahPita == 6) {
	   	document.getElementById("enam").className = "fadein";
	   	document.getElementById("lima").className = "fadein";
		document.getElementById("pitaWarna3").innerHTML = "Cincin 4";
    	document.getElementById("pitaWarna4").innerHTML = "Cincin 5";
    	document.getElementById("box").style.width = "140px";
    	document.getElementById("resistor").style.width = "290px";
    	document.getElementById("pita5").style.width = "10px";
    	document.getElementById("kosong3").style.width = "10px";
    	document.getElementById("pita6").style.width = "10px";
    	document.getElementById("kosong4").style.width = "10px";
    }
    hitung();
}

function reset() {
  	for (var i = 1; i < 7; i++) 
	{
   		document.getElementById("warna"+i).selectedIndex = 0;
   		document.getElementById("pita"+i).style.background = "white";
		document.getElementById("warna"+i).style.backgroundColor = "white";
		document.getElementById("warna"+i).style.color = "black";
		this["warna"+i].onchange();
	}
}

function gambarMetu() {
	var y = document.getElementById("gambar").className;
	if (y == "imgout") {
		document.getElementById("gambar").className = "imgin";
	}
	else {
		document.getElementById("gambar").className = "imgout";
	}
}