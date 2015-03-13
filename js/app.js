'use strict';
var $url = 'http://enpeso.com/panel/json/';
var $myurl = 'http://enpeso.com/pacientes/';
//var $url = 'http://localhost/sersomedia/enpesoapp/json/';

// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', [
  'ngRoute',
  'LocalStorageModule',
  'angularCharts',
  'datePicker', 
  'angularFileUpload',
  'ui.bootstrap',
  'psResponsive',  
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

myApp.run(function($rootScope, auth, psResponsive, localStorageService) {
    $rootScope.salir = function() {
        auth.logout();
    };
    $rootScope.showmenu = function() {
        auth.showmenu();
    };
    $rootScope.responsive = psResponsive;
    $rootScope.originalw = psResponsive('width'); 
    $rootScope.originalh = psResponsive('height');
	$rootScope.idusuario = localStorageService.get('id_user');
    $rootScope.diferencia = 0;
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
		reseter : function() {
			$rootScope.error = 0;
		},	
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
						localStorageService.set('id_paciente', items.id_paciente);
						localStorageService.set('id_nutricionista', items.id_nutricionista);
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
			var id_user = localStorageService.get('id_user');   
			var id_paciente = localStorageService.get('id_paciente');   
			var id_nutricionista = localStorageService.get('id_nutricionista');   
			var url = $url+'sesion.php?callback=JSON_CALLBACK';         

			$http({
                method: "JSONP", 
				params: {'id_user':id_user, 'id_paciente':id_paciente, 'id_nutricionista':id_nutricionista},
                url: url 
                }).               
                success(function(data, status) {
                    var item = data.items;   
					if(item.user_id==0) {
                        localStorageService.clearAll();
                        var id_user = localStorageService.get('id_user');                     
                        control(id_user);
                    }  					
                });
			
			/*
            var url = $url+'sesion.php?callback=JSON_CALLBACK';                                    
            $http({
                method: "JSONP", 
                url: url
                }).               
                success(function(data, status) {
                    var item = data.items;
                    if(item.user_id==0) {
                        localStorageService.clearAll();
                        var id_user = localStorageService.get('id_user');                     
                        control(id_user);
                    }                    
                });
           */
            
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
/*
myApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
*/

function encode64(input) {
     input = escape(input);
     var output = "";
     var chr1, chr2, chr3 = "";
     var enc1, enc2, enc3, enc4 = "";
     var i = 0;

     do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
           enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
           enc4 = 64;
        }

        output = output +
           keyStr.charAt(enc1) +
           keyStr.charAt(enc2) +
           keyStr.charAt(enc3) +
           keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
     } while (i < input.length);

     return output;
  }
