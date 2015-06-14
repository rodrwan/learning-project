(function () {
  'use strict';

  var app = angular.module('learnApp', [
    'learnApp.home',
    'learnApp.login',
    'learnApp.categories',
    'learnApp.documentaries',
    'angular-storage'
  ]);

  app.config(["$urlRouterProvider", function MLConfig ($urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
  }]);

  app.run(["$rootScope", "$state", "store", function ($rootScope, $state, store) {
    $rootScope.$on('$stateChangeStart', function (e, to) {
      if (to.data && to.data.requiresLogin) {
        if (!store.get('session')) {
          e.preventDefault();
          $state.go('login');
        }
      }
    });
  }]);

  app.controller('AppCtrl', ["$scope", function ($scope) {
    $scope.$on('$routeChangeSuccess', function (e, nextRoute) {
      if (nextRoute.$$route && angular.isDefined(nextRoute.$$route.pageTitle)) {
        $scope.pageTitle = nextRoute.$$route.pageTitle;
      }
    });
  }]);

  app.filter('sanitize', ["$sce", function ($sce) {
    return function (htmlCode) {
      return $sce.trustAsHtml(htmlCode);
    };
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.home', [
    'ui.router',
    'angular-storage'
  ])

  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state('home', {
      url: '/home',
      controller: 'HomeCtrl',
      templateUrl: 'build/html/home/home.html'
    });
  }])

  .controller('HomeCtrl', function HomeController () {

  });
})();

(function () {
  'use strict';

  angular.module('learnApp.login', [
    'ui.router',
    'angular-storage'
  ])

  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state('login', {
      url: '/login',
      controller: 'LoginCtrl',
      templateUrl: 'build/html/login/login.html'
    });
  }])

  .controller('LoginCtrl', ["$scope", "$http", "store", "$state", function LoginController ($scope, $http, store, $state) {
    $scope.user = {};

    $scope.login = function () {
      console.log($scope.user);
      store.set('session', 'loginCredential');
      store.set('userData', JSON.stringify($scope.user));
      $state.go('profile');
    };
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.categories', [
    'ui.router',
    'angular-storage'
  ])

  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state('categories', {
      url: '/categories',
      controller: 'CatsCtrl',
      templateUrl: 'build/html/categories/categories.html'
    });
  }])

  .controller('CatsCtrl', ["$scope", function CatsController ($scope) {
    $scope.categories = [
      {
        'name': 'Historia y Teoría',
        'link': '/history',
        'image': 'history.jpg'
      }
    ]
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.documentaries', [
    'ui.router',
    'angular-storage'
  ])

  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
    .state('docs', {
      url: '/documentaries',
      controller: 'DocsCtrl',
      templateUrl: 'build/html/documentaries/documentaries.html'
    })
    .state('docs.id', {
      url: '/:id',
      controller: 'DocCtrl',
      templateUrl: 'build/html/documentaries/documental.html'
    });
  }])

  .controller('DocsCtrl', ["$scope", function DocsController ($scope) {
    $scope.documentaries = [
      {
        'id': 1,
        'thumbnail': 'doc1/thumbnail.png',
        'title': 'Como steve jobs cambio el mundo',
        'sub_title': 'Documentales, 1 video',
        'brief': 'Historias y filosofía y logos del creador de la marca Apple.',
        'time': '43,08'
      },
      {
        'id': 2,
        'thumbnail': 'doc2/thumbnail.png',
        'title': 'Helvética',
        'sub_title': 'Documentales, 1 video',
        'brief': 'Documental sobre el diseño gráfico, la tipografía y en general sobre la cultura visual, centrado en la tipografía Helvética.',
        'time': '90,42'
      }
    ]
  }])
  .controller('DocCtrl', ["$scope", "$stateParams", function DocController ($scope, $stateParams) {
    var documents = [{
      id: 1,
      title: 'Como Steve Jobs cambio el mundo.',
      data: 'En este documental se repasa la vida, la filosofía y los logros de Steve Jobs creando una de las compañias más rentables, Apple.',
      video: '',
      source: 'youtube'
    }, {
      id: 2,
      title: 'Helvética',
      data: 'Documental sobre el diseño gráfico, la tipografía y en general sobre la cultura visual. La película se centra en la popular fuente tipográfica Helvética, que en el año 2007 hizo su 50 aniversario, e incluye entrevistas con los mejores nombres del mundo del diseño como Erik Spiekermann, Matthew Carter, Massino Vignelli, Wim Crouwel,, Hernmann Zapf, Neville Brody, Stefan Sagmeister. Con motivo del 50 aniversario de esta tipografía, Gary Hustwit ha dirigido y producido una película documental que explora el uso de la tipografía en los espacios urbanos y aporta la reflexiones de renombramientos diseñadores acerca de su trabajo, el proceso creativo y las elecciones estéticas detrás de su uso.',
      video: 'build/assets/video/doc2/doc2.mp4',
      source: 'local'
    }];

    $scope.doc = documents[$stateParams.id-1];
  }]);
})();
