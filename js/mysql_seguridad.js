document.addEventListener("deviceready", onDeviceReady, false);

var activar_mysql = "1";
var contenido = "";

function populateDB(tx) {
	tx.executeSql('DROP TABLE IF EXISTS DEMO');
	tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (fecha,distancia,tiempo)');
	
	$("#flip-min").val("on").slider("refresh");
}

function populateDB_datos(tx) {
	tx.executeSql('INSERT INTO DEMO (fecha,distancia,tiempo) VALUES ("' + fecha_mysql + '","' + distancia_mysql + '","' + tiempo_mysql + '")');
}

function queryDB(tx) {
	tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB_listado02);
	console.log("---------test1------------");
}

function querySuccess(tx, results) {
	var len = results.rows.length;
	//console.log("DEMO table: " + len + " rows found.");
	
	
	
	for (var i=0; i<len; i++){
		//console.log("Row = " + i + " ID = " + results.rows.item(i).fecha + " Data =  " + results.rows.item(i).distancia);
		contenido += "<li data-icon='star'><h3>" + results.rows.item(i).fecha + "</h3><p>Has recorregut " + results.rows.item(i).distancia + "Km en " + results.rows.item(i).tiempo + "</p></li>";
	}
	
	document.getElementById("listado_mis_carreras").innerHTML = contenido;
	$("#listado_mis_carreras").listview("refresh");
	
	
	
	//$("#flip-min").val("on").slider("refresh");
	
	console.log("---------test2------------");
	/*if (activar_mysql == "on") {
		alert("activado");
	} else {
		alert("desactivado");
	}*/
	
}

function errorCB(err) {
	console.log("Error processing SQL: "+err.code);
}

function successCB() {
	var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
	db.transaction(queryDB, errorCB);
}

function onDeviceReady() {
	console.log("---------paco------------");
}

function activar_datos_mysql() {
	var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
	db.transaction(populateDB, errorCB, successCB);
	
	alert("Has activat la gestio de carreres");
	console.log("---------activar mysql------------");
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


function errorCB_listado01() {
	console.log("Hay un error 01");
}

function errorCB_listado02() {
	console.log("Hay un error 02");
	//activar_datos_mysql();
}


function borrar_datos_mysql() {
	var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
	db.transaction(borrar_registros, errorCB);
	
	console.log("---------borrar mysql------------");
}

function borrar_registros(tx) {
	tx.executeSql('DROP TABLE IF EXISTS DEMO');
	activar_mysql = "eliminada";
	contenido = "";
	document.getElementById("listado_mis_carreras").innerHTML = contenido;
	
	$("#flip-min").val("off").slider("refresh");
	console.log("---------se han borrado los registros mysql------------");
}


function activar_borrar () {
	activar_mysql = $("#flip-min").attr("value");
	//$("#miSelectBox option[value="+miValue+"]").attr("selected",true);
	
	if (activar_mysql == "on") {
		activar_datos_mysql();
	} else {
		borrar_datos_mysql();
	}
	
}


/*

$(document).bind('pageinit', '.ui-page', function(e) {
	var pid = e.target.id;
	if (pid == "mis_carreras") {listar_datos_mysql();}
});
*/
