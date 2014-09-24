'use strict';

angular.module('pushNotify')
  .factory('phonegapReady', function ($rootScope, $q) {
      var loadingDeferred = $q.defer();

      document.addEventListener('deviceready', function () {
        $rootScope.$apply(loadingDeferred.resolve);
      });

      return function phonegapReady() {
        return loadingDeferred.promise;
      };
    })
  .factory('pushNotification', function (phonegapReady) {
    return {
      registerPush: function (fn) {
        phonegapReady().then(function () {
          var pushNotification = window.plugins.pushNotification,
              successHandler = function (result) {
                  console.log('result = ' + result);
              },
              errorHandler = function (error) {
                  console.log('error = ' + error);
              },
              tokenHandler = function (result) {
                  return fn({
                    'type': 'registration',
                    'id': result,
                    'device': 'ios'
                  });
                };
          if ( device.platform == 'android' || device.platform == 'Android') {
              pushNotification.register(successHandler, errorHandler, {
                            'senderID': 'replace_with_sender_id',
                            'ecb': 'onNotificationGCM'
                          });
          } else {
              pushNotification.register(
                  tokenHandler,
                  errorHandler,
                  {
                      "badge":"true",
                      "sound":"true",
                      "alert":"true",
                      "ecb":"onNotificationAPN"
                  });
          }
        }
      }
    };
  });
