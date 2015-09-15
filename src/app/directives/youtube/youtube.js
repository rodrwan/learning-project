(function () {
  'use strict';

  angular.module('learnApp')
  .directive('youtube', function (YouTubeLoader, $compile) {
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
        var el, tmp, tag, firstScriptTag, player;

        tag = document.createElement('script');
        tag.src = 'http://www.youtube.com/player_api';
        firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        scope.$watch('videoid', function (newValue) {
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
