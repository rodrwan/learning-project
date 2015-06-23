(function () {
  'use strict';

  var app = angular.module('learnApp', [
    'learnApp.home',
    'learnApp.login',
    'learnApp.categories',
    'learnApp.documentaries',
    'learnApp.signup',
    'learnApp.news',
    'angular-storage'
  ]);

  app.config(function MLConfig ($urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
  });

  app.run(function ($rootScope, $state, store) {
    $rootScope.$on('$stateChangeStart', function (e, to) {
      if (to.data && to.data.requiresLogin) {
        if (!store.get('session')) {
          e.preventDefault();
          $state.go('login');
        }
      }
    });
  });

  app.filter('sanitize', function ($sce) {
    return function (htmlCode) {
      return $sce.trustAsHtml(htmlCode);
    };
  });

  app.constant('API_URL', 'http://learn-app.herokuapp.com/api');
  // app.constant('API_URL', 'http://localhost:8080/api');

  app.factory('YouTubeLoader', function ($q, $window) {
    var tag = document.createElement('script');
    tag.src = 'http://www.youtube.com/player_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    var loaded = false;
    var delay = $q.defer();

    $window.onYouTubeIframeAPIReady = function () {
      if (!loaded) {
        loaded = true;
        delay.resolve();
      }
    };

    return {
      whenLoaded: function () {
        return delay.promise;
      }
    };
  });

  app.directive('youtube', function (YouTubeLoader, $compile) {
    return {
      restrict: 'E',

      scope: {
        height: '@',
        width: '@',
        videoid: '@',
        type: '@'
      },

      template: '<div></div>',

      link: function (scope, element) {
        var el, tmp;
        var tag = document.createElement('script');
        tag.src = 'http://www.youtube.com/player_api';
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        var player;
        scope.$watch('videoid', function (newValue, oldValue) {
          console.log(newValue);
          console.log(scope.type);

          if (scope.type === 'youtube') {
            YouTubeLoader.whenLoaded().then(function () {

              player = new YT.Player(element.children()[0], {
                playerVars: {
                  autoplay: 0,
                  html5: 1,
                  theme: 'light',
                  modesbranding: 0,
                  color: 'white',
                  iv_load_policy: 3,
                  showinfo: 1,
                  controls: 1
                },

                height: scope.height,
                width: scope.width,
                videoId: newValue
              });
            });
          } else {
            console.log('Creating player');
            el = angular.element('<span/>');
            tmp = '<video class="resp-vid" width="640" height="390" controls>' +
              '<source src="build/assets/video/' + newValue +
              '/' + newValue + '.mp4" type="video/mp4">' +
              'Your browser does not support the video tag.' +
              '</video>';
            el.append(tmp);
            $compile(el)(scope);
            element.append(el);
          }
        });
      }
    };
  });
})();
