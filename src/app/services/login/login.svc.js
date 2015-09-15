(function () {
  'use strict';

  angular.module('learnApp.svc.login')

  .factory('Login', function (API_URL, $q, $http) {
    var login;

    login = function (userData) {
      var url, deferred, p;

      url = API_URL + '/user/session';
      console.log('-- REQUEST --');
      deferred = $q.defer();
      $http({
        method: 'POST',
        url: url,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function (obj) {
          var str = [];
          for (p in obj)
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
          return str.join('&');
        },
        data: userData
      }).success(function (data) {
        deferred.resolve(data);
      }).error(function (msg, code) {
        deferred.reject(code);
        console.log(msg, code);
      });

      return deferred.promise;
    };

    return {
      login: login
    };
  });
})();
