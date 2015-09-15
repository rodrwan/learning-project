(function () {
  'use strict';

  angular.module('learnApp.svc.signup')

  .factory('SignUp', function (API_URL, $q, $http) {
    var register;

    register = function (userData) {
      var url, deferred;

      url = API_URL + '/user/create';
      console.log('-- REQUEST --');
      deferred = $q.defer();

      $http({
        method: 'POST',
        url: url,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function (obj) {
          var p,
              str = [];
          for (p in obj) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
          }
          return str.join('&');
        },
        data: userData
      }).success(function (data) {
        deferred.resolve(data);
      }).error(function (msg, code) {
        deferred.reject(msg);
        console.log(msg, code);
      });

      return deferred.promise;
    };

    return {
      register: register
    };
  });
})();
