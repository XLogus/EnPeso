'use strict';
var $url = 'http://enpeso.com/panel/json/';
//var $url = 'http://localhost/sersomedia/enpesoapp/json/';

// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', [
  'ngRoute',
  'LocalStorageModule',
  'angularCharts',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]);

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', { templateUrl: 'partials/login.html', title:'login', controller: 'ctrl_login' });
  ////$routeProvider.when('/login', {templateUrl: 'partials/login.html', title:'login', controller: 'ctrl_login'});
  $routeProvider.when('/home', {templateUrl: 'partials/home.html', title:'home', controller: 'ctrl_home'});
  $routeProvider.when('/dietas', {templateUrl: 'partials/dietas.html', title:'dietas', controller: 'ctrl_dietas'});
  $routeProvider.when('/dieta/:id_dieta', {templateUrl: 'partials/dieta.html', title:'dieta', controller: 'ctrl_dieta'});
  $routeProvider.when('/citas', {templateUrl: 'partials/citas.html', title:'citas', controller: 'ctrl_citas'});
  $routeProvider.when('/chat', {templateUrl: 'partials/chat.html', title:'chat', controller: 'ctrl_chat'});  
  $routeProvider.when('/registro', {templateUrl: 'partials/registro.html', title:'registro', controller: 'ctrl_registro'});
  $routeProvider.when('/registrovoto/:fecha/:momento', {templateUrl: 'partials/registrovoto.html', title:'registro', controller: 'ctrl_registrovoto'});
  $routeProvider.when('/peso', {templateUrl: 'partials/peso.html', title:'peso', controller: 'ctrl_peso'});
  $routeProvider.when('/configuracion', {templateUrl: 'partials/configuracion.html', title:'configuracion', controller: 'ctrl_configuracion'});
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
myApp.factory("auth", function(localStorageService,$location,$http,$rootScope)
{
    return{
        login : function(username, password)
        {
            var url = $url+'login.php?callback=JSON_CALLBACK';
            var items;
            var rpta="dddd";
            localStorageService.clearAll();
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
                        //$cookies.id_user = items.id_usuario;
                        //$cookies.username = items.nombre+" "+items.apellido;
                        localStorageService.set('id_user', items.id_usuario);
                        localStorageService.set('nombre', items.nombre+" "+items.apellido);
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
            //$cookieStore.remove("username"),
            //$cookieStore.remove("id_user");
            localStorageService.clearAll();
            //mandamos al login            
            $location.path("/");
        },
        checkStatus : function(activo)
        {
            var url = $url+'sesion.php?callback=JSON_CALLBACK';                        
            /// sesion
            $http({
                method: "JSONP", 
                url: url
                }).               
                success(function(data, status) {
                    var item = data.items;
                    if(item.user_id==0) {
                        localStorageService.clearAll();
                        var id_user = localStorageService.get('id_user');            
                        console.log("son id_user: "+id_user);
                        control(id_user);
                    }                    
                });
           
            
            //creamos un array con las rutas que queremos controlar
            function control(id_user) {
                var rutasPrivadas = ["/home","/dietas","/citas","/chat","/login"];
                if(in_array($location.path(),rutasPrivadas) && !id_user ) {
                    $location.path("/");
                }
                //en el caso de que intente acceder al login y ya haya iniciado sesión lo mandamos a la home
                if(activo=="/" && id_user ) {
                    $location.path("/home");
                }
            }
            function in_array(needle, haystack) {
                var key = '';
                for(key in haystack) {
                    if(haystack[key] == needle) {
                        return true;
                    }
                }
                return false;
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