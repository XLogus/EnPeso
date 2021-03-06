'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('ctrl_login', ['$scope', 'auth', function($scope,auth,$location) {
        $scope.rpta = '';
        $scope.login = function() {
            auth.login($scope.username, $scope.password);
        }
		$scope.reseter = function() {
			auth.reseter();
		}
  }])
  .controller('ctrl_home', ['$scope', '$http', 'localStorageService', function($scope,$http,localStorageService) {
	  $scope.imagen = 'img/avatar-default.png';
        $scope.usuario_nombre = localStorageService.get('nombre');  		
    // Consultamos los datos
    var items;
    $http({
                method: "JSONP", 
                url: $url + "home.php?callback=JSON_CALLBACK"
                }).
                success(function(data, status) {
                    items = data.items;
                    $scope.peso_perdido = items.peso_perdido;
                    $scope.cita_fecha = items.cita_fecha;
                    $scope.cita_hora = items.cita_hora;   
                    $scope.peso = items.peso;                 
                    $scope.imc = items.imc;
                    $scope.masa = items.masa_grasa;
                    //$scope.cambia_vista("peso");
					if(data.imagen!="") {
						$scope.imagen = $myurl + 'uploads/thumb_' + data.imagen;
					}
                }).
                error(function(data, status) {
                    console.log(status+"Request Failed");
                    $scope.error = 1;
                });
  }])
  .controller('ctrl_dietas', ['$scope', '$http', function($scope, $http) {
    var items;
    $http({
                method: "JSONP", 
                url: $url + "planes.php?callback=JSON_CALLBACK"
                }).
                success(function(data, status) {
                    $scope.items = data.items;                                  
                }).
                error(function(data, status) {
                    console.log(status+"Request Failed");
                    $scope.error = 1;
                });
          
  }]) 
  .controller('ctrl_dieta', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
        $scope.id_dieta = $routeParams.id_dieta;        
        
        
            $scope.algo = "aaa";
            $http({
                method: "JSONP",
                url: $url + "planes-dias.php?callback=JSON_CALLBACK&plan_id="+$scope.id_dieta
                }).
                success(function(data, status) {
                    $scope.dias = data.items;                                  
                    $scope.momentos = data.momentos;
                });
              
  }]) 
  .controller('ctrl_citas', ['$scope', '$http', function($scope, $http) {
    var items;
    $http({
                method: "JSONP", 
                url: $url + "consulta.php?callback=JSON_CALLBACK"
                }).
                success(function(data, status) {
                    items = data.primero;                    
                    $scope.cita_fecha = items.cita_fecha;
                    $scope.cita_hora = items.cita_hora; 					
                    $scope.items = data.items;                 
                }).
                error(function(data, status) {
                    console.log(status+"Request Failed");
                    $scope.error = 1;
                });

  }])  
  .controller('ctrl_registro', ['$scope', '$http', function($scope, $http) {		
        var days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
        var months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];    
        var $hoy = Date.today();
        var $hoy_dia = $hoy.getDay()-1;
        var $hoy_mes = $hoy.toString("M")-1;
        $scope.hoy = $hoy;        
		$scope.sinmensaje = false;
        //$scope.fecha_actual = $hoy.toString("dd ")+months[$hoy_mes]+$hoy.toString(" yyyy");
        //$scope.dia_actual = days[$hoy_dia];
        //$scope.past = $scope.fecha_actual.add(-1).days();
        //$scope.future = $scope.fecha_actual.add(1).days();
        
        $scope.dia_anterior = function() {
            $hoy = $scope.hoy;
            $scope.hoy = $hoy.add(-1).days(); 
            fecha_actual();
            voto_ver($scope.hoy_plano);
        }
        $scope.dia_siguiente = function() {
            $hoy = $scope.hoy;
            $scope.hoy = $hoy.add(1).days();
            fecha_actual(); 
            voto_ver($scope.hoy_plano);
        }
        var voto_ver = function($fecha) {
			$scope.sinmensaje = true;					
            $scope.fecha_voto = 0;
            $scope.observacion = "";
            $http({
                method: "JSONP", 
                params: {'fecha':$fecha},
                url: $url + "registro.php?callback=JSON_CALLBACK"
                }).
                success(function(data, status) {                    
                    var items = data.items;
                    $scope.observacion =  items[0].observacion;
                    $scope.fecha_voto = items[0].voto;                                            
                });
        }
        function fecha_actual() {
            $hoy = $scope.hoy;
            $hoy_dia = $hoy.getDay();
            var $hoy_mes = $hoy.toString("M")-1;
            $scope.fecha_actual = $hoy.toString("dd ")+months[$hoy_mes]+$hoy.toString(" yyyy");
            $scope.dia_actual = days[$hoy_dia];
            $scope.hoy_plano = $hoy.toString("yyyy-MM-d");
        }
        fecha_actual();
        voto_ver($scope.hoy_plano);
        
        /// Guardar registro
        $scope.voto_guardar = function() {
			$scope.sinmensaje = false;
            $http({
                method: "JSONP", 
                params: {'accion':'guardar', 'fecha':$scope.hoy_plano, 'mensaje':$scope.observacion, 'puntaje':$scope.fecha_voto},
                url: $url + "registro.php?callback=JSON_CALLBACK"
                }).
                success(function(data, status) {
                    $location.path("/registro");    										
                });
        }
  }])
  .controller('ctrl_registrovoto', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location) {
        var $momento = $routeParams.momento;
        var $fecha = $routeParams.fecha;
        
        if ($momento=='1') { $scope.momento = "Desayuno"; }
        if ($momento=='2') { $scope.momento = "Media Mañana"; }
        if ($momento=='3') { $scope.momento = "Almuerzo"; }
        if ($momento=='4') { $scope.momento = "Merienda"; }
        if ($momento=='5') { $scope.momento = "Media Tarde"; }
        if ($momento=='6') { $scope.momento = "Cena"; }
        
        $scope.voto_guardar = function() {
            $http({
                method: "JSONP", 
                params: {'accion':'guardar', 'fecha':$fecha, 'fecha_observacion':$scope.fecha_observacion, 'fecha_voto':$scope.fecha_voto, 'mensaje':$scope.elmensaje, 'momento':$momento},
                url: $url + "registro.php?callback=JSON_CALLBACK"
                }).
                success(function(data, status) {
                    $location.path("/registro");                 
                });
        }
        
  }])
  .controller('ctrl_peso', ['$scope', '$http', function($scope, $http) {
        $scope.chartType = 'line';
        $scope.cambia_vista = function(vista) {        
        if(vista=="peso") {
            //$scope.info = $scope.peso;
            //var info = JSON.stringify($scope.peso);     
                 
            $scope.data = {
		      series: ['Peso Real', 'Peso Ideal'],
              data : $scope.peso
            };
            
            
        } else if(vista=="imc") {
            $scope.data = {
		      series: ['imc'],
		      data : $scope.imc
            }
        } else if(vista=="masa") {
            $scope.data = {
		      series: ['masa'],
		      data : $scope.masa
            }
        }
        $scope.tgrafico = vista;
        
        $scope.messages = [];
    $scope.config = {
		labels: false,
		title : "",
		legend : {
			display: false,
			position:'right'
		},		
		innerRadius: 0,
		lineLegend: 'traditional',
	}

	
    };
        // Consultamos los datos
    var items;
    $http({
                method: "JSONP", 
                url: $url + "home.php?callback=JSON_CALLBACK"
                }).
                success(function(data, status) {
                    items = data.items;
                    $scope.peso_perdido = items.peso_perdido;
                    $scope.cita_fecha = items.cita_fecha;
                    $scope.cita_hora = items.cita_hora;   
                    $scope.peso = items.peso;                 
                    $scope.imc = items.imc;
                    $scope.masa = items.masa_grasa;
                    $scope.cambia_vista("peso");
                }).
                error(function(data, status) {
                    console.log(status+"Request Failed");
                    $scope.error = 1;
                });
  }])
  .controller('ctrl_configuracion', ['$scope', '$http', '$upload', function($scope, $http, $upload) {
	  $scope.imagen = 'img/avatar-default.png';
	  $scope.sinmensaje = true;
        // Opciones del combo
        $scope.generos = [{
            "id":"f",
            "name":"femenino"   
        },{
            "id":"m",
            "name":"masculino"
        }];
        
        // Resultados
        $http({
                method: "JSONP", 
                url: $url + "configuracion.php?callback=JSON_CALLBACK"
                }).
                success(function(data, status) {
                    $scope.items = data.items;
					if(data.imagen!="") {
						$scope.imagen = $myurl+'uploads/thumb_'+data.imagen;
					}
        });
        
        /// Guardar datos
        $scope.guardar = function(items) {			
            $http({
                method: "JSONP", 
                params: {'nombres':items.nombres, 'apellidos':items.apellidos, 'nacimiento':items.nacimiento, 'genero':items.genero, 'telefono':items.telefono, 'celular':items.celular, 'email':items.email, 'direccion':items.direccion, 'action':"guardar"},                        
                url: $url + "configuracion.php?callback=JSON_CALLBACK",
                isArray: true            
                }).
                success(function(data, status) {
                    //alert("Datos guardados");
					$scope.sinmensaje = false;
                    $scope.rpta = data;
                }).
                error(function(data, status) {
                    alert("fallo");
                    $scope.status = status;
                });
        };
        
        // Cambiar clave
        $scope.cambiar_clave = function(nclave, nclave2) {
            $http({
                method: "JSONP", 
                params: {'clave':nclave, 'clave2':nclave2, 'action':'cambiar_clave'},                        
                url: $url + "configuracion.php?callback=JSON_CALLBACK",
                isArray: true            
                }).
                success(function(data, status) {
                    $scope.sinmensaje = false;
                    $scope.rpta = data;
                });
        }
		
		
		/// Subir imagen
		$scope.$watch('files', function () {
        $scope.upload($scope.files);
    });

    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $upload.upload({
                    url: $url+'upload.php',
                    fields: {'username': $scope.username},
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    //console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
					$scope.imagen = $myurl +'uploads/'+ config.file.name;
                });
            }
        }
    };
  }])
  .controller('ctrl_chat', ['$scope', '$http', '$rootScope', '$location', '$anchorScroll', function($scope, $http, $rootScope, $location, $anchorScroll) {    
		$scope.imagen = 'img/avatar-default.png';  
		$scope.imagen2 = 'img/avatar-default.png';  
        var actualizar_mensajes = function() {
            $http({
                method: "JSONP", 
                url: $url + "chat.php?callback=JSON_CALLBACK"
                }).
                success(function(data, status) {
                    $scope.items = data.items;                    
                    $scope.cvn_id = data.cvn_id;
                    //$scope.cvn_id = "122"; 		
					$scope.imagen = $myurl +'uploads/thumb_'+ data.imagen;		
					$scope.imagen2 = '/panel3/imgSelect/files/'+ data.imagen2;		
					$scope.gotoBottom();
                });
        }
		$scope.gotoBottom = function() {
			//$location.hash('bottom');
			//$anchorScroll();
			var redText = document.getElementById ("bottom");
			redText.scrollIntoView ();
		}		
        actualizar_mensajes();		
		
        $scope.enviar_mensaje = function() {
            //alert("enviado");
            $http({
                method: "JSONP", 
                params: {'accion':'enviar', 'Cvn_ID':$scope.cvn_id, 'mensaje':$scope.elmensaje},
                url: $url + "chat.php?callback=JSON_CALLBACK"
                }).
                success(function(data, status) {
                    $scope.elmensaje = "";
                    actualizar_mensajes();
					$scope.gotoBottom();					
                    $scope.envio = data.items;                     
                });
        }   
        setInterval(actualizar_mensajes(),12000);     
  }]);
  
