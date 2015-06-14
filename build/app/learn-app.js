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
    'angular-storage',
    'ngSanitize'
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
        id: 1,
        thumbnail: 'doc1/thumbnail.png',
        title: 'Como steve jobs cambio el mundo',
        subTitle: 'Documentales, 1 video',
        brief: 'Historias y filosofía y logos del creador de la marca Apple.',
        time: '43,08'
      },
      {
        id: 2,
        thumbnail: 'doc2/thumbnail.png',
        title: 'Helvética',
        subTitle: 'Documentales, 1 video',
        brief: 'Documental sobre el diseño gráfico, la tipografía y en general sobre la cultura visual, centrado en la tipografía Helvética.',
        time: '90,42'
      },
      {
        id: 3,
        thumbnail: 'doc3/thumbnail.png',
        title: 'Objectified',
        subTitle: 'Documentales, 1 video',
        brief: 'Documental acerca del diseño industrial y la compleja relación entre los objetos manufacturados y las personas que los diseñan.',
        time: '75,41'
      },
      {
        id: 4,
        thumbnail: 'doc4/thumbnail.png',
        title: 'Estos tíos exóticos de barcelona',
        subTitle: 'Documentales, 1 video',
        brief: 'Documental trata sobre la situación actual del diseño en Barcelona, en el que participan varios diseñadores dando su opinión y lo que esperan del futuro.',
        time: '47,25'
      },
      {
        id: 5,
        thumbnail: 'doc5/thumbnail.png',
        title: '¿Qué es el diseño gráfico?',
        subTitle: 'Documentales, 1 video',
        brief: 'Documental argentino en el cual profesionales del diseño gráfico tratan de explicar qué es el diseño gráfico, de el salen varias preguntas para reflexionar.',
        time: '55,50'
      },
      {
        id: 6,
        thumbnail: 'doc6/thumbnail.png',
        title: 'No logo',
        subTitle: 'Documentales, 1 video',
        brief: 'Basado en el best-seller de Naomi Klein, trata del impacto que tienen las marcas en la sociedad.',
        time: '40,38'
      }];

  }])

  .controller('DocCtrl', ["$scope", "$stateParams", function DocController ($scope, $stateParams) {
    var documents = [{
      id: 1,
      title: 'Como Steve Jobs cambio el mundo.',
      data: 'En este documental se repasa la vida, la filosofía y los logros de Steve Jobs creando una de las compañias más rentables, Apple.',
      videoId: '1Bhmz0g9CsQ',
      type: 'youtube'
    }, {
      id: 2,
      title: 'Helvética',
      data: 'Documental sobre el diseño gráfico, la tipografía y en general sobre la cultura visual. La película se centra en la popular fuente tipográfica Helvética, que en el año 2007 hizo su 50 aniversario, e incluye entrevistas con los mejores nombres del mundo del diseño como Erik Spiekermann, Matthew Carter, Massino Vignelli, Wim Crouwel,, Hernmann Zapf, Neville Brody, Stefan Sagmeister. Con motivo del 50 aniversario de esta tipografía, Gary Hustwit ha dirigido y producido una película documental que explora el uso de la tipografía en los espacios urbanos y aporta la reflexiones de renombramientos diseñadores acerca de su trabajo, el proceso creativo y las elecciones estéticas detrás de su uso.',
      videoId: 'doc2',
      type: 'local'
    }, {
      id: 3,
      title: 'Objectified',
      data: 'Documental sobre el diseño industrial. En él se examinan los objetos y el proceso creativo de quien los diseña: desde los cepillos de dientes hasta los gadgets más sofisticados.',
      videoId: 'oqPGscXtTg8',
      type: 'youtube'
    }, {
      id: 4,
      title: 'Estos tíos exóticos de barcelona',
      data: 'Creado hace algunos años como proyecto de titulo, este documental trata sobre la situación actual del diseño en Barcelona. En él, varios profesionales del diseño dan sus opiniones sobre la evolución del sector en esta ciudad y lo que esperan que ocurra en el futuro.',
      videoId: 'doc4',
      type: 'local'
    }, {
      id: 5,
      title: '¿Qué es el diseño gráfico?',
      data: 'Documental argentino en el que catedráticos, profesionales y expertos intentan definir “diseño gráfico”. Surgen preguntas interesantes y es un documental que nos hará reflexionar.',
      videoId: 'doc5',
      type: 'local'
    }, {
      id: 6,
      title: 'No logo',
      data: 'Documenta basado en el best-seller de Naomi Klein del mismo nombre. Trata del impacto de las marcas en la sociedad',
      videoId: 'doc6',
      type: 'local'
    }];

    $scope.doc = documents[$stateParams.id - 1];
  }])

  .directive('tsVideoPlayer', ["$compile", "$window", function VideoPlayer ($compile, $window) {
    // autoplay video
    function onPlayerReady (event) {
      console.log('autoplay');
      // event.target.playVideo();
    }

    // when video ends
    function onPlayerStateChange (event) {
      if (event.data === 0) {
        console.log('finsihed');
        alert('done');
      }
    }

    return {
      restrict: 'A',
      scope: {
        video: '@video',
        type: '@type'
      },
      replace: true,
      link: function (scope, element) {
        var playerId, videoId, type, player, el, tmp;

        console.log('set up player');
        playerId = element.attr('id');
        videoId = scope.video;
        type = scope.type;

        if (type === 'youtube') {
          console.log(YT.loaded);
          if (!YT) {
            console.log('playerNotLoaded');
            $window.onYouTubePlayerAPIReady = onPlayerRady;
          } else if (YT.loaded) {
            onPlayerRady();
          } else {
            YT.ready(onPlayerRady);
          }

          function onPlayerRady () {
            console.log('Creating player');
            player = new YT.Player(playerId, {
              height: '390',
              width: '640',
              videoId: videoId,
              events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange
              }
            });
          }

          console.log(YT.loaded);
        } else {
          console.log('Creating player');
          el = angular.element('<span/>');
          tmp = '<video width="640" height="390" controls>' +
            '<source src="build/assets/video/' + videoId +
            '/' + videoId + '.mp4" type="video/mp4">' +
            'Your browser does not support the video tag.' +
            '</video>';
          el.append(tmp);
          $compile(el)(scope);
          element.append(el);
        }
      }
    };
  }]);
})();
