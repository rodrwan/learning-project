(function () {
  'use strict';

  angular.module('learnApp.svc.documentaries')

  .factory('Documentaries', function ($state, Restangular, CacheFactory) {
    var docsCache, docsService, options;

    options = {
      maxAge: 15 * 60 * 1000, // Items added to this cache expire after 15 minutes.
      cacheFlushInterval: 15 * 60 * 1000, // This cache will clear itself every hour.
      deleteOnExpire: 'aggressive', // Items will be deleted from this cache right when they expire.
      storageMode: 'localStorage' // This cache will use `localStorage`.
    };

    if (!CacheFactory.get('docsCache')) {
      docsCache = CacheFactory.createCache('docsCache', options);
    }

    if (!docsService) {
      docsService = Restangular.service('documentaries');

      Restangular.addFullRequestInterceptor(function (element, operation, what,
        url, headers, params, httpConfig) {
        console.log('operation: ' + operation);
        console.log('what: ' + what);

        if (what === 'documentaries') {
          switch (operation) {
            case 'getList':
              httpConfig.cache = docsCache;
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

    return docsService;
  });
})();
