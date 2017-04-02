var jumlahPita = 4;
var cincin3 = [0, 1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 0.1, 0.01];
var cincin4 = {0:0, 2:1, 3:2, 6:0.5, 7:0.25, 8:0.1, 9:0.05, 11:5, 12:10, 13:20};

function getKeyByValue(arr, val) {
	var hasil;
	$.each(arr, function( index, value ) {
		if(value == val) {
			hasil = index;
			return false;
		}
	});
	return hasil;
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

function balik() {
	var angka, notasi, pengali, belakangKoma, tahanan, toleransi, koefisien;
	kembali();
	//ambil data input START
	tahanan = $("#tahanan").val();
	toleransi = $("#toleransi").val();
	koefisien = $("#koefisien").val();
	if(!tahanan) {return false} //menghalangi kalau input kosong
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
		$("#4").prop("checked", true).change();
		$("#warna1").val(1);
		$("#warna2").val(Number(angkaneTok[0]) + 1);
	} else if (angkaneTok.length == 2) { //jika angkanya 2 digit
		$("#4").prop("checked", true).change();
		$("#warna1").val(Number(angkaneTok[0]) + 1);
		$("#warna2").val(Number(angkaneTok[1]) + 1);
	} else if (angkaneTok.length == 3 && koefisien == 0) { //jika angkanya 3 digit
		$("#5").prop("checked", true).change();
		$("#warna1").val(Number(angkaneTok[0]) + 1);
		$("#warna2").val(Number(angkaneTok[1]) + 1);
		$("#warna5").val(Number(angkaneTok[2]) + 1);
	} else if(angkaneTok.length == 3 && koefisien != 0) { //jika angkanya 3 digit dan koefisien ada nilainya
		$("#6").prop("checked", true).change();
		$("#warna1").val(Number(angkaneTok[0]) + 1);
		$("#warna2").val(Number(angkaneTok[1]) + 1);
		$("#warna5").val(Number(angkaneTok[2]) + 1);
		var enam = ["0", "250", "100", "50", "15", "25", "20", "10", "5", "1"];
		$("#warna6").val(getKeyByValue(enam, koefisien));
	}
	//Agar warna pita 1,2,3,6 berubah
	$("#warna1, #warna2, #warna5, #warna6").change();
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
	$("#warna3").val(getKeyByValue(cincin3, multiplier)).change();
	//Proses pita pengali END
	//Proses pita toleransi START
	$("#warna4").val(getKeyByValue(cincin4, toleransi)).change();
	//Proses pita toleransi END
}

function hitung() {
	var koef = "";
	var itung, hasil;
	var ring1 = $("#warna1").val();
	var ring2 = $("#warna2").val();
	var ring3 = $("#warna3").val();
	var ring4 = $("#warna4").val();
	var ring5 = $("#warna5").val();
	var ring6 = $("#warna6").val();
	var cincin1 = ["0", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
	var cincin6 = {0:"0", 1:"250", 2:"100", 3:"50", 4:"15", 5:"25", 6:"20", 7:"10", 8:"5", 10:"1"};
	if (jumlahPita == 5 || jumlahPita == 6) {
		itung = ((cincin1[ring1]+cincin1[ring2]+cincin1[ring5])*cincin3[ring3]).toFixed(2);
	} else if (jumlahPita == 4) {
		itung = ((cincin1[ring1]+cincin1[ring2])*cincin3[ring3]).toFixed(2);
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
		koef = ",<br> Temperature Coefficient "+cincin6[ring6]+" ppm/&#176;C"; 
	}
	$("#hasil").html("<b>Resistance Value " +hasil+", <br>Tolerance &plusmn; "+cincin4[ring4]+" &#37"+koef+"</b>");
}

function kembali() {
	$("#a select").each(function(){
		$(this).val("0").css("background-color", "white").css("color", "black").change();
	});
  	$("#pita1, #pita2, #pita3, #pita4, #pita5, #pita6").css("background", "transparent");
}

$(document).ready(function(){
	$("input[name='jumlahPita']:radio").change(function(){
   		jumlahPita = $(this).val();
   		kembali();
		if (jumlahPita == 5) {
	    	$("#lima").collapse("show");
    		$("#enam").collapse("hide");
    		$("#pitaWarna3").html("4<sup>th</sup> Band Color");
    		$("#pitaWarna4").html("5<sup>th</sup> Band Color");
    		$("#box").css("width", "120px");
    		$("#resistor").css("width", "270px");
    		$("#pita5, #kosong3").css("width", "10px");
    		$("#pita6, #kosong4").css("width", "0px");
		}
		else if (jumlahPita == 4) {
		   	$("#lima, #enam").collapse("hide");
			$("#pitaWarna3").html("3<sup>rd</sup> Band Color");
    		$("#pitaWarna4").html("4<sup>th</sup> Band Color");
    		$("#box").css("width", "100px");
    		$("#resistor").css("width", "250px");
    		$("#pita5, #kosong3, #pita6, #kosong4").css("width", "0px");
    	}
    	else if (jumlahPita == 6) {
		   	$("#enam, #lima").collapse("show");
			$("#pitaWarna3").html("4<sup>th</sup> Band Color");
    		$("#pitaWarna4").html("5<sup>th</sup> Band Color");
    		$("#box").css("width", "140px");
    		$("#resistor").css("width", "290px");
    		$("#pita5, #kosong3, #pita6, #kosong4").css("width", "10px");
    	}
    	hitung();
	});

	$("#a select").change(function(){
		var pita, tulisan, ring;
		var isi = $(this).val();
		var name = $(this).attr("name");
		var id = $(this).attr("id");
		var warnane = ["white", "black", "brown", "red", "orange", "yellow", "green", "blue", "purple", "grey", "white", "gold", "silver", "nocolor"];
		ring = warnane[isi];
		pita = (ring == "nocolor" || ring == "nol") ? "white" : ring;
		tulisan = (pita == "orange" || pita == "yellow" || pita == "white" || pita == "nocolor" || pita == "gold" || pita == "silver") ? "black" : "white";
		$("#"+name).css("background", pita);
		$("#"+id).css("background-color", pita).css("color", tulisan);
		hitung();
	});

	$("#tahanan").keyup(function(){
		balik();
	});
	$("#b select").change(function(){
		balik();
	});
});