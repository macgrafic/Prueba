		var navegacion;
		var navegacion_principal;
		
		var map;
		var marker;
		var posicion_inicial;
		
		var lat = null;
		var lng = null;
		
		var altitud;
		var velocidad_km_h;
		var velocidad_m_s;
		
		var nueva_posicion_actualizada;
		var polyline;
		
		var miArray = new google.maps.MVCArray();
		var intervalo;
		var flightPath;
		
		var distancia_mysql;
		var tiempo_mysql;
		var fecha_mysql;
		var f = new Date();
		
		var distance;
		var distance_int;
		
		function init(){
			$(".boton_stop").css("display", "none");
			$(".boton_play").css("display", "block");
			$(".boton_borrar").css("display", "none");
			$(".boton_mostrar").css("display", "none");
			$(".boton_seguir_carrera").css("display", "none");
			
			
			$("#mi_formulario").css("display", "none");
			
			navegacion_principal = navigator.geolocation.getCurrentPosition(mapa_principal,errorMapa);
		}
		
		function iniciar_carrera() {
			$(".boton_stop").css("display", "block");
			$(".boton_play").css("display", "none");
			$(".boton_borrar").css("display", "none");
			$(".boton_mostrar").css("display", "none");
			$(".boton_seguir_carrera").css("display", "none");
			navegacion = navigator.geolocation.watchPosition (actualizar_datos, errorMapa, { maximumAge: 20000, timeout: 20000});
			//intervalo_grabar_posiciones_array();
			
			intervalo = setInterval("grabar_posiciones_array()",5000);
			intervalo_km_tiempo_real = setInterval("mostra_km_tiempo_real()",5000);	
		}
		
		function errorMapa(error) {
			//alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
		}
		
		function mapa_principal(datos_2){
			lat = datos_2.coords.latitude;
			lng = datos_2.coords.longitude;
			
			posicion_inicial = new google.maps.LatLng(lat, lng);
			
			var myOptions_2 = {
				zoom: 17,
				center: posicion_inicial,
				streetViewControl: false,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			
			map = new google.maps.Map(document.getElementById('map_canvas'), myOptions_2);
			
			marker = new google.maps.Marker({
				position: posicion_inicial, 
				map: map
			});
		}	
		
		function actualizar_datos(datos_1){
			lat = datos_1.coords.latitude;
			lng = datos_1.coords.longitude;
			altitud = datos_1.coords.altitude;
			velocidad_km_h = datos_1.coords.speed / 0.28;
			velocidad_m_s = datos_1.coords.speed;
			
			nueva_posicion_actualizada = new google.maps.LatLng(lat, lng);
			
			marker.setPosition(nueva_posicion_actualizada);
			marker.setMap(map);
			map.setCenter(nueva_posicion_actualizada);
			map.setZoom(17);
			
			
			var velocidad_km_h_2 = velocidad_km_h.toFixed(0);
			var velocidad_m_s_2 = velocidad_m_s.toFixed(2);
			$("#velocidad_m_ok").html("<b>" + velocidad_m_s_2 + "</b>");
			$("#velocidad_km_ok").html("<b>" + velocidad_km_h_2 + "</b>");
			
			// ---------------------- Codigo para testear los datos del mapa
			var element = document.getElementById('geolocation');
			element.innerHTML = 'Lat: '+lat+' - Lng: '+lng+'<br />Altitud: '+altitud+' - Velocidad: '+velocidad_km_h_2+'';
			// ---------------------- Codigo para testear los datos del mapa
		
		}
		
		function grabar_posiciones_array(){
			miArray.push(new google.maps.LatLng(lat, lng));
			
			var total00 = miArray.getLength();
			var element2 = document.getElementById('array');
			element2.innerHTML = "<b>" + total00 + "</b>-" + lat + "-" + lng + "<br>";
		}
		
		function parar_intervalo_grabar_posiciones_array(){
			clearInterval(intervalo);
			clearInterval(intervalo_km_tiempo_real);
			navigator.geolocation.clearWatch(navegacion);
			//alert("Parar intervalo");
			
			$(".boton_stop").css("display", "none");
			$(".boton_play").css("display", "none");
			$(".boton_borrar").css("display", "none");
			$(".boton_mostrar").css("display", "block");
			$(".boton_seguir_carrera").css("display", "block");
		}
		
		/*function mostrar_array() {
			miArray.forEach(function(latLng, index){
				document.getElementById("test").innerHTML = "<b>["+ index +"]</b>=>"+latLng+"<br />"+document.getElementById("test").innerHTML;
			});
		}*/
		
		function imprimir_track_y_mostrar_distancia(){
			var limitesZonePolyline = new google.maps.LatLngBounds();
			
			miArray.forEach(function(latLng){
				limitesZonePolyline.extend(latLng);
			});
			
			map.fitBounds(limitesZonePolyline);
			
			var optionsPolyline = {
				map: map,
				path: miArray
			}
			
			var maPolyline = new google.maps.Polyline(optionsPolyline);
			
			distance = Math.round(google.maps.geometry.spherical.computeLength(maPolyline.getPath()))/1000;
			
			
			pos_km = Math.floor(distance);
			pos = distance.toString().indexOf(".");
			res = String(distance).substring((pos+1), distance.length);
			
			
			document.getElementById("informacion_corredor").innerHTML  = "Has recorregut<br/><span>" + pos_km + "," + res + " Km</span><br/>En un temps de <br/><span>" + tiempo_total + "<span>";
			
			$(".boton_stop").css("display", "none");
			$(".boton_play").css("display", "none");
			$(".boton_borrar").css("display", "block");
			$(".boton_mostrar").css("display", "block");
			$(".boton_seguir_carrera").css("display", "none");
			
			
			document.getElementById("map_canvas").style.height="350px";
			
			distancia_mysql = pos_km + "," + res;
			tiempo_mysql = tiempo_total;
			fecha_mysql = f.getDate() + "/" + f.getMonth() + "/" + f.getFullYear();
		}
		
		function mostra_km_tiempo_real(){
			var limitesZonePolyline2 = new google.maps.LatLngBounds();
			
			miArray.forEach(function(latLng){
				limitesZonePolyline2.extend(latLng);
			});
			
			var optionsPolyline2 = {path: miArray}
			
			var maPolyline2 = new google.maps.Polyline(optionsPolyline2);
			
			var distance2 = Math.round(google.maps.geometry.spherical.computeLength(maPolyline2.getPath()))/1000;
			
			console.log("Distancia ---" + distance2);
			
			distance_int = parseInt(distance2);
			
			pos_km2 = Math.floor(distance2);
			pos2 = distance2.toString().indexOf(".");
			res2 = String(distance2).substring((pos2+1), distance2.length);
			
			var km_tiempo_real  = pos_km2+","+res2;
			
			
			console.log ("Distancia int"+distance_int );
			
			var minutos_x_1_kilometro;
			
			//minutos_x_1_kilometro = 120/11.4;
			minutos_x_1_kilometro = total_minutos/distance_int;
			
			var poner_cero;
			if (minutos_x_1_kilometro < 10){
				poner_cero = "0"; 
			} else {
				poner_cero = ""; 
			}
			
			var minutos_x_1_kilometro_dos_decimales = minutos_x_1_kilometro.toFixed(2);
			var minutos_x_1_kilometro_dos_decimales_texto = minutos_x_1_kilometro_dos_decimales.toString();
			var minutos_x_1_kilometro_dos_decimales_texto_replace = minutos_x_1_kilometro_dos_decimales_texto.replace(".",":");
			var minutos_x_1_kilometro_ok = poner_cero + minutos_x_1_kilometro_dos_decimales_texto_replace;
			
			/*
			if(isNaN(total_minutos_1/total_distancia_1_n_int)) {
				minutos_x_1_kilometro = 0;
			} else {
				minutos_x_1_kilometro = total_minutos/distance_int;
			}
			*/
			
			console.log("* total minutos = " + total_minutos);
		
			// ----------------------- Formatear minutos y el decimal pasarlo a minutos reales ----------------------------------
			//var solo_minutos2 = Math.floor(minutos_x_1_kilometro);
			
			console.log("* minutos_x_1_kilometro = " + minutos_x_1_kilometro_ok);
			
			/*
			if (solo_minutos2 < 10){
				cero_para_solo_minutos2 = "0" + solo_minutos2; 
			} else {
				cero_para_solo_minutos2 = solo_minutos2; 
			}
			
			var posicion_decimal2 = minutos_x_1_kilometro.toString().indexOf(".");
			var resultado2 = String(minutos_x_1_kilometro).substring((posicion_decimal2+1), minutos_x_1_kilometro.length);
			var valor_decimal_pasada_a_segundos2 = ((resultado2/100)*60)*10;
			
			var calculo_definitivo2 = cero_para_solo_minutos2 + ":" + valor_decimal_pasada_a_segundos2;
			// ----------------------- FIN - Formatear minutos y el decimal pasarlo a minutos reales ----------------------------------
			*/
			
			$("#kilometros_ok").html("<b>" + km_tiempo_real + "</b>");
			$("#velocidad_min_x_km").html("<b>" + minutos_x_1_kilometro_ok + "</b>");
		}
		
		function borrar_carrera(){
		
			insertar_datos_mysql();
			
			var len = miArray.getLength();
			
			for(var i=0; i<len; ++i) {
				var value = miArray.pop();
				if (typeof value.clear == 'function') { value.clear(); }
			};
			miArray.clear();
			
			inicializar_cronometro();
			$("#kilometros_ok").html("0");
			$("#velocidad_m_ok").html("0");
			$("#velocidad_km_ok").html("0");
			$("#velocidad_min_x_km").html("0");
			init();
			
			$(".boton_stop").css("display", "none");
			$(".boton_play").css("display", "block");
			$(".boton_borrar").css("display", "none");
			$(".boton_mostrar").css("display", "none");
			$(".boton_seguir_carrera").css("display", "none");
			
			document.getElementById("map_canvas").style.height="100px";
		}
		
		
		
		
		
		/*
		$(document).bind('pageinit', '.ui-page', function(e) {
			var pid = e.target.id;
			if (pid == "resultats") {mapa_principal_2();}
		});*/
		
		
