document.addEventListener("deviceready", onDeviceReady, false);

var activar_mysql = "1";
var contenido = "";


function onDeviceReady() {
	console.log("---------paco------------");
	$("#btn_activar_seguiment").css("display", "block");
	$("#btn_borrar_seguiment").css("display", "none");
	
	listar_testeo_abrir();
}

 
function populateDB_datos(tx) {
	tx.executeSql('INSERT INTO DEMO (fecha,distancia,tiempo,total_minutos) VALUES ("' + fecha_mysql + '","' + distancia_mysql + '","' + tiempo_mysql + '","' + total_minutos + '")');
	//alert(total_minutos);
}


function insertar_datos_mysql() {
	var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
	//db.transaction(populateDB_datos, errorCB, successCB);
	db.transaction(populateDB_datos, errorCB);
	
	console.log("---------insertar datos mysql------------");
}




function listar_datos_mysql() {
	var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
	db.transaction(queryDB, errorCB_listado01);
	console.log("---------listar datos mysql------------");
}

function queryDB(tx) {
	tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB_listado02);
	console.log("---------test1------------");
}

function errorCB_listado01() {
	console.log("Hay un error 01");
}







function errorCB_listado02() {
	navigator.notification.confirm(
            'Vols activar la recollida de dades de les teves carreres?',  // message
            errorCB_listado02_activar,              // callback to invoke with index of button pressed
            'ACTIVAR HISTÒRIC',            // title
            'SI,NO'          // buttonLabels
        );




	/*var confirmar_01 = confirm("Vols activar la recollida de dades de les teves carreres?");
	
	if (confirmar_01){
		$( "#eliminar_dades_on_off" ).popup( "open");
		$("#btn_activar_seguiment").css("display", "block");
		$("#btn_borrar_seguiment").css("display", "none");
		
		console.log("---Vols activar DB - OK------------");
	} else {
		
		console.log("---Vols activar DB - CANCEL------------");
	}*/
}

function errorCB_listado02_activar(buttonIndex2) {
	if (buttonIndex2 == 1){
		$( "#eliminar_dades_on_off" ).popup( "open");
		$("#btn_activar_seguiment").css("display", "block");
		$("#btn_borrar_seguiment").css("display", "none");
		console.log("---Vols activar DB - OK------------");
	} else {
		console.log("---Vols activar DB - CANCEL------------");
		$.mobile.changePage ("#mapa");
	}
}








function querySuccess(tx, results) {
	
	
	$("#btn_activar_seguiment").css("display", "none");
	$("#btn_borrar_seguiment").css("display", "block");
	
	var len = results.rows.length;
	
	contenido = "";
	
	
	for (var i=0; i<len; i++){
	
		//Recojo el total de minutos de la DB
		var total_minutos_1 = results.rows.item(i).total_minutos;
		
		//Recojo el total de kilometros de la DB
		var total_distancia_1 = results.rows.item(i).distancia;
		var total_distancia_1_n = total_distancia_1.replace(",",".");
		var total_distancia_1_n_int = parseInt(total_distancia_1_n);
		
		var total_minutos_calculo;
		
		//total_minutos_calculo = total_minutos_1/total_distancia_1_n_int;
		
		//Calculo los kilometros en un minuto
		/*if(isNaN(total_minutos_1/total_distancia_1_n_int)) {
			total_minutos_calculo = 0;
		} else {
			total_minutos_calculo = total_minutos_1/total_distancia_1_n_int;
		}*/
		
		if(!isFinite(total_minutos_1/total_distancia_1_n_int)) {
			total_minutos_calculo = 0;
		} else {
			total_minutos_calculo = total_minutos_1/total_distancia_1_n_int;
		}
		
		
		// ----------------------- Formatear minutos y el decimal pasarlo a minutos reales ----------------------------------
		var solo_minutos = Math.floor(total_minutos_calculo);
		
		if (solo_minutos < 10){
			cero_para_solo_minutos = "0" + solo_minutos; 
		} else {
			cero_para_solo_minutos = solo_minutos; 
		}
		
		posicion_decimal = total_minutos_calculo.toString().indexOf(".");
		resultado = String(total_minutos_calculo).substring((posicion_decimal+1), total_minutos_calculo.length);
		valor_decimal_pasada_a_segundos = ((resultado/100)*60)*10;
		
		var n1 = valor_decimal_pasada_a_segundos.toString();
		var n2 = n1.charAt(0);
		var x1 = valor_decimal_pasada_a_segundos.toString();
		var x2 = n1.charAt(1);
		var nx = n2 + x2;
		
		//calculo_definitivo = cero_para_solo_minutos + ":" + valor_decimal_pasada_a_segundos;
		calculo_definitivo = cero_para_solo_minutos + ":" + nx;
		// ----------------------- FIN - Formatear minutos y el decimal pasarlo a minutos reales ----------------------------------
		
		
		//console.log("Row = " + i + " ID = " + results.rows.item(i).fecha + " Data =  " + results.rows.item(i).distancia);
		contenido += "<li><h3>" + results.rows.item(i).fecha + " <span style='color:red !important'>|</span> " + results.rows.item(i).distancia + " Km <span style='color:red !important'>|</span> " + results.rows.item(i).tiempo + "</h3><p>Amb un ritme de " + calculo_definitivo + " minuts per KM</p></li>";
		
		
		
		console.log("1 = " + valor_decimal_pasada_a_segundos + " --- 2 = " + valor_decimal_pasada_a_segundos + " -- 3: " + total_minutos_calculo);
	}
	
	document.getElementById("listado_mis_carreras").innerHTML = contenido;
	$("#listado_mis_carreras").listview("refresh");
	
	
	//$("#flip-min").val("on").slider("refresh");
	
	console.log("---------test2------------");
}



function activar_datos_mysql() {
	var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
	//db.transaction(populateDB, errorCB, successCB);
	db.transaction(populateDB, errorCB);
	
	navigator.notification.alert(
		'Has activat la gestio de carreres',  // message
		piloto01,         // callback
		'Històric',            // title
		'OK'                  // buttonName
	);
	
	$.mobile.changePage ("#mapa");
	console.log("---------activar mysql------------");
}

function piloto01(){ console.log("---------activar mysql------------"); }

function populateDB(tx) {
	tx.executeSql('DROP TABLE IF EXISTS DEMO');
	tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (fecha,distancia,tiempo,total_minutos)');
	
	$( "#eliminar_dades_on_off" ).popup( "close");
	
	$("#btn_activar_seguiment").css("display", "none");
	$("#btn_borrar_seguiment").css("display", "block");
}

function errorCB(err) {
	console.log("Error processing SQL: "+err.code);
}

function successCB() {
	var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
	db.transaction(queryDB, errorCB);
}






function borrar_datos_mysql_confirm() {
	navigator.notification.confirm(
            'Segur que vols eliminar les dades?',  // message
            borrar_datos_mysql,              // callback to invoke with index of button pressed
            'ELIMINAR DADES',            // title
            'ELIMINAR,CANCEL·LAR'          // buttonLabels
        );
}


function borrar_datos_mysql(buttonIndex) {
	if (buttonIndex == 1){
		var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
		db.transaction(borrar_registros, errorCB);
		console.log("---------borrar mysql PETICION EFECTUADA------------");
	} else {
		$( "#eliminar_dades_on_off" ).popup( "close");
		console.log("---------borrar mysql CANCELADA------------");
	}
}

function borrar_registros(tx) {
	tx.executeSql('DROP TABLE IF EXISTS DEMO');
	
	contenido = "";
	document.getElementById("listado_mis_carreras").innerHTML = contenido;
	$("#eliminar_dades_on_off" ).popup( "close");
	$("#btn_activar_seguiment").css("display", "block");
	$("#btn_borrar_seguiment").css("display", "none");
	
	$.mobile.changePage ("#mapa");
	
	console.log("---------borrar mysql EFECTUADA------------");
}




/*

$(document).bind('pageinit', '.ui-page', function(e) {
	var pid = e.target.id;
	if (pid == "mis_carreras") {listar_datos_mysql();}
});
*/






function listar_testeo_abrir() {
	var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
	db.transaction(listar_testeo_select, listar_testeo_error, listar_testeo_ok);
}

function listar_testeo_select(tx) {
	tx.executeSql('SELECT * FROM DEMO');
}

function listar_testeo_error(tx) {
	console.log("--- listar_testeo_error NO HAY DB ------------");
	$( "#info_aplicacion" ).popup( "open");
}

function listar_testeo_ok() {
	console.log("--- listar_testeo_error EXISTE ------------");
}










