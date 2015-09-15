(function () {
  'use strict';

  angular.module('learnApp.svc.categories')

  .factory('Categories', function ($state, Restangular, CacheFactory) {
    var catsCache, catsService, options;

    options = {
      maxAge: 15 * 60 * 1000,
      cacheFlushInterval: 60 * 60 * 1000,
      deleteOnExpire: 'aggressive',
      storageMode: 'localStorage'
    };

    if (!CacheFactory.get('catsCache')) {
      catsCache = CacheFactory.createCache('catsCache', options);
    }

    if (!catsService) {
      catsService = Restangular.service('categories');

      Restangular.addFullRequestInterceptor(function (element, operation, what,
        url, headers, params, httpConfig) {
        var topics;

        function range (start, end) {
          var i, foo = [];
          for (i = start; i <= end; i++) {
            foo.push(i);
          }
          return foo;
        }
        topics = range(1, 20);

        if (what === 'categories' || topics.indexOf(parseInt(what, 10)) >= 0) {
          switch (operation) {
            case 'getList':
              httpConfig.cache = catsCache;
              break;
            default:
              break;
          }
        }
        return {
          element: element,
          headers: headers,
          params: params,
          httpConfig: httpConfig
        };
      });
    }

    return catsService;
  });
})();
