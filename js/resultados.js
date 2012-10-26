$(document).bind('pageinit', '.ui-page', function(e) {
	var pid = e.target.id;
	//if (pid == "resultats") {cargar_resultados();}
});



function cargar_resultados(){

	var dorsal_form= $("#dorsal").attr("value");
	var nom_form = $("#nom").attr("value");
	var cognom_form = $("#cognom").attr("value");
	var any_form = $("#any").attr("value");

	//var pagina= "http://www.lamitja.cat/app_mitja/index.php";
	//var pagina= "http://www.lamitja.cat/app_mitja/index.php?dorsal_form=" + dorsal_form +"&any_form=" + any_form;
	
	var pagina= "http://www.lamitja.cat/app_mitja/index.php?dorsal_form=" + dorsal_form +"&any_form=" + any_form + "&nom_form=" + nom_form + "&cognom_form=" + cognom_form;
	
	$("#cargando_cronos").css("display", "inline");
	var x=$("#resultados_corredor");
	x.load(pagina, function(){
		$("#cargando_cronos").css("display", "none");
		$("#resultados_corredor").listview("refresh");
		//alert("test ajax mysql");
	});
	return false;
}