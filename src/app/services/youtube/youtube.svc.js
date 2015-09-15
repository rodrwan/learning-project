(function () {
  'use strict';

  angular.module('learnApp.svc.youtube')

  .factory('YouTubeLoader', function ($q, $window) {
    var tag, firstScriptTag, loaded, delay;

    tag = document.createElement('script');
    tag.src = 'http://www.youtube.com/player_api';
    firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    loaded = false;
    delay = $q.defer();

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
})();
