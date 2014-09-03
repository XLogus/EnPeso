'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('ctrl_login', ['$scope', 'auth', function($scope,auth,$location) {
        $scope.rpta = '';
        $scope.login = function() {
            auth.login($scope.username, $scope.password);
        }
  }])
  .controller('ctrl_home', ['$scope', 'charting', '$http', 'localStorageService', function($scope,charting,$http,localStorageService) {
        $scope.usuario_nombre = localStorageService.get('id_user');        
        $scope.someData = [[
        ['Heavy Industry', 12],['Retail', 9], ['Light Industry', 14],
        ['Out of home', 16],['Commuting', 7], ['Orientation', 9]
        ]];
      $scope.myChartOpts = charting.pieChartOptions;  
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
                    items = data.items;
                    $scope.peso_perdido = items.peso_perdido;
                    $scope.cita_fecha = items.cita_fecha;
                    $scope.cita_hora = items.cita_hora;                    
                }).
                error(function(data, status) {
                    console.log(status+"Request Failed");
                    $scope.error = 1;
                });
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
  .controller('ctrl_chat', ['$scope', function($scope) {

  }]);
  
