(function () {
  'use strict';

  angular.module('learnApp.svc.randomArticles')

  .factory('RandomArticles', function (Restangular) {
    return Restangular.service('latest');
  });
})();
