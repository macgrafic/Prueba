var horas=0; var minutos=0; var segundos=0;
var puntos=true;
var tiempo_total;
var total_minutos = 0;

function Cronometro() {
	if(puntos) ++segundos;
	if(segundos==60) { segundos=0; ++minutos; ++total_minutos }
	if(minutos==60) { minutos=0; ++horas }
	if(horas==24) horas=0;
	cad="";
	
	if(horas<10) cad+="0";
	cad+=horas;
	
	if(puntos) cad+=":"; else cad+=":";
	
	if(minutos<10) cad+="0";
	
	cad=cad+minutos;
	
	if(puntos) cad+=":"; else cad+=":";
	
	if(segundos<10) cad+="0";
	
	cad=cad+segundos;
	
	puntos=!puntos;
	
	//document.crono.boton.value=cad;
	$("#cronometro_ok").html(cad);
	tiempo_total = cad;
	
}

var id;

function activar_cronometro() {
	id=setInterval("Cronometro()",500);
	$(".boton_play").css("display", "none");
	$(".boton_stop").css("display", "block");
}

function parar_cronometro() {
	clearInterval(id);
	$(".boton_play").css("display", "block");
	$(".boton_stop").css("display", "none");
	
}

function inicializar_cronometro() {
	horas=0; minutos=0; segundos=0;
	$("#cronometro_ok").html("00:00:00");
	
}