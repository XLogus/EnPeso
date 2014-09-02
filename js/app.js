'use strict';
var $url = 'http://enpeso.com/panel/json/';

// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', [
  'ngRoute',
  'ngCookies',
  'ui.chart',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]);
var app = myApp.value('charting', {
      pieChartOptions: {
        seriesDefaults: {
          // Make this a pie chart.
          renderer: jQuery.jqplot.PieRenderer,
          rendererOptions: {
            // Put data labels on the pie slices.
            // By default, labels show the percentage of the slice.
            showDataLabels: true
          }
        },
        legend: { show:true, location: 'e' }
      }
    });
myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', { templateUrl: 'partials/login.html', title:'login', controller: 'ctrl_login' });
  ////$routeProvider.when('/login', {templateUrl: 'partials/login.html', title:'login', controller: 'ctrl_login'});
  $routeProvider.when('/home', {templateUrl: 'partials/home.html', title:'home', controller: 'ctrl_home'});
  $routeProvider.when('/dietas', {templateUrl: 'partials/dietas.html', title:'dietas', controller: 'ctrl_dietas'});
  $routeProvider.when('/citas', {templateUrl: 'partials/citas.html', title:'citas', controller: 'ctrl_citas'});
  $routeProvider.when('/chat', {templateUrl: 'partials/chat.html', title:'chat', controller: 'ctrl_chat'});  
  $routeProvider.when('/registro', {templateUrl: 'partials/registro.html', title:'registro', controller: 'ctrl_registro'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);
myApp.run(function($rootScope, auth) {
    $rootScope.salir = function() {
        auth.logout();
    };
    $rootScope.showmenu = function() {
        auth.showmenu();
    };
});

myApp.run(['$location', '$rootScope', 'auth', function($location, $rootScope, auth) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
        if($rootScope.title=="home") {
            $rootScope.title="perfil"
        }
        $rootScope.activePath = $location.path();
    });    
    //al cambiar de rutas
    $rootScope.$on('$routeChangeStart', function(event,current) {   
        var activo = $location.path()
        auth.checkStatus(activo);
    })
}]);

//// logins
app.factory("auth", function($cookies,$cookieStore,$location,$http,$rootScope)
{
    return{
        login : function(username, password)
        {
            var url = $url+'login.php?callback=JSON_CALLBACK';
            var items;
            var rpta="dddd";
            $cookieStore.remove("username"),
            $cookieStore.remove("id_user");
            $http({
                method: "JSONP", 
                url: url,
                params: { 'username': username, 'password':password }
                }).
                success(function(data, status) {
                    console.log(status);
                    //$scope.data = data;
                    items = data.items;
                    if(items.success=="1") {
                        $cookies.id_user = items.id_usuario;
                        $cookies.username = items.nombre+" "+items.apellido;
                        $location.path("/home");                     
                    } else {
                        $rootScope.error = 1;                                                
                    }                   
                }).
                error(function(data, status) {
                    console.log(status+"Request Failed");
                    $rootScope.error = 1;
                });
                
            
            //creamos la cookie con el nombre que nos han pasado
            
                       
            //mandamos a la home
            //$location.path("/home");
        },        
        logout : function()
        {
            //al hacer logout eliminamos la cookie con $cookieStore.remove
            $cookieStore.remove("username"),
            $cookieStore.remove("id_user");
            //mandamos al login            
            $location.path("/");
        },
        checkStatus : function(activo)
        {
            //creamos un array con las rutas que queremos controlar
            var rutasPrivadas = ["/home","/dietas","/citas","/chat","/login"];
            if(this.in_array($location.path(),rutasPrivadas) && typeof($cookies.id_user) == "undefined")
            {
                $location.path("/");
            }
            //en el caso de que intente acceder al login y ya haya iniciado sesión lo mandamos a la home
            if(activo=="/" && typeof($cookies.id_user) != "undefined")
            {
                $location.path("/home");
            }
        },
        showmenu: function() {
            if($rootScope.activo==undefined) {
                $rootScope.activo = 0;                
            }            
            if($rootScope.activo == 1) {
                $rootScope.activo = 0;
            } else {
                $rootScope.activo = 1;
            }
        },
        in_array : function(needle, haystack)
        {
            var key = '';
            for(key in haystack)
            {
                if(haystack[key] == needle)
                {
                    return true;
                }
            }
            return false;
        }
    }
});