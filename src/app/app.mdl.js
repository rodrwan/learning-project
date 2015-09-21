(function () {
  'use strict';

  var app = angular.module('learnApp', [
    'ui.router',
    'angular-storage',
    'restangular',
    'angular-cache',
    'ngAnimate',
    'learnApp.home',
    'learnApp.login',
    'learnApp.rte.categories',
    'learnApp.rte.documentaries',
    'learnApp.signup',
    'learnApp.news'
  ]);

  app.config(function MLConfig (API_URL, $stateProvider, $urlRouterProvider, $httpProvider, RestangularProvider, CacheFactoryProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider.state('main', {
      url: '/',
      controller: 'AppCtrl',
      templateUrl: 'build/html/routes/home/home.html'
    });
    angular.extend(CacheFactoryProvider.defaults, {maxAge: 15 * 60 * 1000});
    RestangularProvider.setBaseUrl(API_URL);
    RestangularProvider.setDefaultHttpFields({cache: true});
  });

  app.run(function ($rootScope, $state, store) {
    $rootScope.$on('$stateChangeStart', function (e, to) {
      if (to.data && to.data.requiresLogin) {
        if (!store.get('session')) {
          $rootScope.login = false;
        }
      }
    });
    $rootScope.$watch('username', function (newVal, oldVal) {
      console.log('new value:' + newVal);
      console.log('old value:' + oldVal);
      if (!oldVal) {
        $rootScope.username = store.get('username');
      }
    });
  });

  app.filter('sanitize', function ($sce) {
    return function (htmlCode) {
      return $sce.trustAsHtml(htmlCode);
    };
  });

  // app.constant('API_URL', 'http://learn-app.herokuapp.com/api');
  // app.constant('API_URL', 'http://api.picnicgrafico.com/api');
  app.constant('API_URL', 'http://localhost:8080/api');
})();
