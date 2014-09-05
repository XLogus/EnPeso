'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('ctrl_login', ['$scope', 'auth', function($scope,auth,$location) {
        $scope.rpta = '';
        $scope.login = function() {
            auth.login($scope.username, $scope.password);
        }
  }])
  .controller('ctrl_home', ['$scope', '$http', 'localStorageService', function($scope,$http,localStorageService) {
        $scope.usuario_nombre = localStorageService.get('nombre');  
        // Funciones de barras
    $scope.cambia_vista = function(vista) {
        //$scope.chartType = 'area';
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
    };
        /*
        $scope.data = {
		series: ['Peso Real', 'Peso Ideal'],
		data : [{
			x : "cita 1",
			y: [0,0]			
		},
		{
			x : "cita 3",
			y: [660, 0]
		},
        {
			x : "cita 5",
			y: [80, 0]
		},
        {
			x : "cita 7",
			y: [85,72]	
		},
        ]     
	};
    */
    
    
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

	$scope.chartType = 'line';
      
        
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
        $scope.ver_plan = function() {
            $scope.algo = "aaa";
            $http({
                method: "JSONP",
                url: $url + "planes-dias.php?callback=JSON_CALLBACK&plan_id="+$scope.plan_id
                }).
                success(function(data, status) {
                    $scope.dias = data.items;                                  
                    $scope.momentos = data.momentos;
                });
            };        
  }])  
  .controller('ctrl_citas', ['$scope', '$http', function($scope, $http) {
    var items;
    $http({
                method: "JSONP", 
                url: $url + "consulta.php?callback=JSON_CALLBACK"
                }).
                success(function(data, status) {
                    items = data.items;                    
                    $scope.cita_fecha = items.cita_fecha;
                    $scope.cita_hora = items.cita_hora;                    
                }).
                error(function(data, status) {
                    console.log(status+"Request Failed");
                    $scope.error = 1;
                });

  }])
  .controller('ctrl_registro', ['$scope', function($scope) {

  }])
  .controller('ctrl_chat', ['$scope', '$http', function($scope, $http) {
        $http({
                method: "JSONP", 
                url: $url + "chat.php?callback=JSON_CALLBACK"
                }).
                success(function(data, status) {
                    $scope.items = data.items;
                });
  }]);
  
