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

  app.config(["API_URL", "$stateProvider", "$urlRouterProvider", "$httpProvider", "RestangularProvider", "CacheFactoryProvider", function MLConfig (API_URL, $stateProvider, $urlRouterProvider, $httpProvider, RestangularProvider, CacheFactoryProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider.state('main', {
      url: '/',
      controller: 'AppCtrl',
      templateUrl: 'build/html/routes/home/home.html'
    });
    angular.extend(CacheFactoryProvider.defaults, {maxAge: 15 * 60 * 1000});
    RestangularProvider.setBaseUrl(API_URL);
    RestangularProvider.setDefaultHttpFields({cache: true});
  }]);

  app.run(["$rootScope", "$state", "store", function ($rootScope, $state, store) {
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
  }]);

  app.filter('sanitize', ["$sce", function ($sce) {
    return function (htmlCode) {
      return $sce.trustAsHtml(htmlCode);
    };
  }]);

  // app.constant('API_URL', 'http://learn-app.herokuapp.com/api');
  app.constant('API_URL', 'http://api.picnicgrafico.com/api');
  // app.constant('API_URL', 'http://localhost:8080/api');
})();

(function () {
  'use strict';

  angular.module('learnApp')

  .controller('AppCtrl', ["$rootScope", "$scope", "store", function AppController ($rootScope, $scope, store) {
    var session = store.get('session');
    if (session) {
      console.log('sess: ' + session);
      $rootScope.login = true;
      $rootScope.username = store.get('username');
    }

    $scope.logout = function () {
      $rootScope.login = false;
      $rootScope.username = undefined;

      store.remove('username');
      store.remove('session_token');
      store.remove('session');
    };
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.rte.categories', [
    'ui.router',
    'angular-storage',
    'learnApp.rte.categoryList',
    'learnApp.rte.resourse',
    'learnApp.svc.categories'
  ])

  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
    .state('categories', {
      url: '/categories',
      controller: 'CatsCtrl',
      templateUrl: 'build/html/routes/categories/categories.html'
    })
    .state('categories.cat', {
      url: '/:cat',
      controller: 'CatListCtrl',
      templateUrl: 'build/html/routes/categories/category-list/category-list.html'
    })
    .state('categories.resource', {
      url: '/:cat/:id',
      controller: 'ResCtrl',
      templateUrl: 'build/html/routes/categories/resourse/resourse.html'
    });
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.rte.categoryList', []);

})();

(function () {
  'use strict';

  angular.module('learnApp.rte.resourse', []);

})();

(function () {
  'use strict';

  angular.module('learnApp.rte.documental', []);

})();

(function () {
  'use strict';

  angular.module('learnApp.rte.documentaries', [
    'ui.router',
    'angular-storage',
    'learnApp.rte.documental',
    'learnApp.svc.documentaries'
  ])

  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
    .state('docs', {
      url: '/documentaries',
      controller: 'DocsCtrl',
      templateUrl: 'build/html/routes/documentaries/documentaries.html'
    })
    .state('docs.id', {
      url: '/:id',
      controller: 'DocCtrl',
      templateUrl: 'build/html/routes/documentaries/documental.html'
    });
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.events', [
    'ui.router',
    'angular-storage'
  ])

  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state('evenst', {
      url: '/events',
      controller: 'EventsCtrl',
      templateUrl: 'build/html/routes/events/events.html'
    });
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.home', [
    'ui.router',
    'angular-storage',
    'learnApp.svc.randomArticles'
  ])

  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state('home', {
      url: '/home',
      controller: 'HomeCtrl',
      templateUrl: 'build/html/routes/home/home.html'
    });
  }]);
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
      templateUrl: 'build/html/routes/login/login.html'
    });
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.news', [
    'ui.router',
    'angular-storage'
  ])

  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state('news', {
      url: '/news',
      controller: 'NewsCtrl',
      templateUrl: 'build/html/routes/news/news.html'
    });
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.signup', [
    'ui.router',
    'angular-storage'
  ])

  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state('signup', {
      url: '/signup',
      controller: 'SignUpCtrl',
      templateUrl: 'build/html/routes/signup/signup.html'
    });
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.rte.categories')

  .controller('CatsCtrl', ["$scope", "Categories", function CatsController ($scope, Categories) {
    Categories.getList().then(function (categories) {
      $scope.categories = categories;
      $scope.loadingIsDone = true;
    });
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.rte.categoryList')

  .controller('CatListCtrl', ["$scope", "$stateParams", "Categories", function ($scope, $stateParams, Categories) {
    var categoryMeta = {};

    Categories.getList().then(function (categories) {
      $scope.loadingIsDone = false;
      categories.forEach(function (elem) {
        categoryMeta[elem.id] = {};
        categoryMeta[elem.id].sectionTitle = elem.title;
        categoryMeta[elem.id].description = elem.description;
      });
      $scope.loadingIsDone = true;
    });

    $scope.category = $stateParams.cat;
    Categories.one($scope.category).getList().then(function (topics) {
      $scope.category = $stateParams.cat;
      $scope.categories = topics;
      $scope.meta = categoryMeta[$scope.category];
      $scope.loadingIsDone = true;
    });
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.rte.resourse')

  .controller('ResCtrl', ["$rootScope", "$scope", "$stateParams", "Categories", "$sce", function ($rootScope, $scope, $stateParams, Categories, $sce) {
    var _id = $stateParams.id;
    var cat = $stateParams.cat;

    Categories.one(cat).one('topic').one(_id).getList().then(function (res) {
      var times = [];
      // console.log(res);
      $scope.topics = res;

      $scope.topics.forEach(function (topic, idx) {
        $scope.topics[idx].content = $sce.trustAsHtml(topic.content);
        times.push(topic.time);
      });
      $scope.times = times;
      $scope.meta = res[0].meta;
      $rootScope.$broadcast('event:data-received', {
        type: res.type,
        video: res.media
      });
    });
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.rte.resourse')

  .controller('ResCtrl', ["$rootScope", "$scope", "$stateParams", "Categories", "$sce", function ($rootScope, $scope, $stateParams, Categories, $sce) {
    var _id = $stateParams.id;
    var cat = $stateParams.cat;

    Categories.one(cat).one('topic').one(_id).getList().then(function (res) {
      var times = [];
      // console.log(res);
      $scope.topics = res;

      $scope.topics.forEach(function (topic, idx) {
        $scope.topics[idx].content = $sce.trustAsHtml(topic.content);
        times.push(topic.time);
      });
      $scope.times = times;
      $scope.meta = res[0].meta;
      $rootScope.$broadcast('event:data-received', {
        type: res.type,
        video: res.media
      });
    });
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.rte.documental')

  .controller('DocCtrl', ["$rootScope", "$scope", "$stateParams", "Documentaries", function ($rootScope, $scope, $stateParams, Documentaries) {
    Documentaries.getList().then(function (documentaries) {
      var doc = documentaries[$stateParams.id - 1];
      $scope.doc = {
        id: doc.id,
        title: doc.title,
        data: doc.content,
        videoId: doc.media,
        type: doc.type,
        time: doc.time,
        credits: doc.credits
      };

      $rootScope.$broadcast('event:data-received', {
        type: doc.type,
        video: doc.videoId
      });
    });
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.rte.documentaries')

  .controller('DocsCtrl', ["$scope", "store", "Documentaries", function ($scope, store, Documentaries) {
    $scope.documentaries = [];

    Documentaries.getList().then(function (documentaries) {
      documentaries.forEach(function (elem) {
        var doc = {
          id: elem.id,
          thumbnail: elem.thumbnail,
          title: elem.title,
          subTitle: elem.sub_title,
          brief: elem.brief,
          time: elem.time
        };
        $scope.documentaries.push(doc);
        $scope.loadingIsDone = true;
      });
    });
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.events')

  .controller('EventsCtrl', ["$scope", "$http", "store", "$state", function NewsController ($scope, $http, store, $state) {
    $scope.arrNews = [{
        url: 'documentaries',
        title: 'Documentales',
        image: 'documentaries/doc_port',
        id: 'documentaries',
        date: ''
    }];
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.home')

  .controller('HomeCtrl', ["$scope", "RandomArticles", function ($scope, RandomArticles) {
    RandomArticles.getList().then(function (articles) {
      $scope.articles = articles;
    });
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.login')

  .controller('LoginCtrl', ["$scope", "$http", "store", "$state", "Login", function LoginController ($scope, $http, store, $state, Login) {
    $scope.user = {};

    $scope.login = function () {
      Login.login($scope.user).then(function (res) {
        store.set('session', 'loginCredential');
        store.set('session_token', res.data.session_token);
        store.set('username', res.data.username);
        $state.go('home');

      }, function (code) {
        if (code === 401) {
          alert('Error en sección. Debes ingresar tu email y password correspondientes.');
        }
      });
    };
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.news')

  .controller('NewsCtrl', ["$scope", "$http", "store", "$state", function NewsController ($scope, $http, store, $state) {
    $scope.arrNews = [{
        'url': 'documentaries',
        'title': 'Documentales',
        'image': 'documentaries/doc_port',
        'id': 'documentaries'
    }];
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.signup')

  .controller('SignUpCtrl', ["$scope", "$http", "store", "$state", "SignUp", function SignUpController ($scope, $http, store, $state, SignUp) {
    $scope.user = {};

    $scope.signup = function () {
      console.log($scope.user);
      SignUp.register($scope.user).then(function (res) {
        console.log('-- RESPONSE --');
        console.log(res);
        console.log('user registered.');
        $state.go('login');
      }, function (data) {
        console.log('-- FAIL --');
        console.log(data);
        alert('Error en signup');
        $state.go('.');
      });
    };
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.svc.categories', []);

})();

(function () {
  'use strict';

  angular.module('learnApp.svc.documentaries', []);

})();

(function () {
  'use strict';

  angular.module('learnApp.svc.login', []);

})();

(function () {
  'use strict';

  angular.module('learnApp.svc.randomArticles', []);

})();

(function () {
  'use strict';

  angular.module('learnApp.svc.signup', []);

})();

(function () {
  'use strict';

  angular.module('learnApp.svc.youtube', []);

})();

(function () {
  'use strict';

  angular.module('learnApp.svc.categories')

  .factory('Categories', ["$state", "Restangular", "CacheFactory", function ($state, Restangular, CacheFactory) {
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
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.svc.documentaries')

  .factory('Documentaries', ["$state", "Restangular", "CacheFactory", function ($state, Restangular, CacheFactory) {
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
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.svc.login')

  .factory('Login', ["API_URL", "$q", "$http", function (API_URL, $q, $http) {
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
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.svc.randomArticles')

  .factory('RandomArticles', ["Restangular", function (Restangular) {
    return Restangular.service('latest');
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.svc.signup')

  .factory('SignUp', ["API_URL", "$q", "$http", function (API_URL, $q, $http) {
    var register;

    register = function (userData) {
      var url, deferred;

      url = API_URL + '/user/create';
      console.log('-- REQUEST --');
      deferred = $q.defer();

      $http({
        method: 'POST',
        url: url,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function (obj) {
          var p,
              str = [];
          for (p in obj) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
          }
          return str.join('&');
        },
        data: userData
      }).success(function (data) {
        deferred.resolve(data);
      }).error(function (msg, code) {
        deferred.reject(msg);
        console.log(msg, code);
      });

      return deferred.promise;
    };

    return {
      register: register
    };
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.svc.youtube')

  .factory('YouTubeLoader', ["$q", "$window", function ($q, $window) {
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
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp')
  .directive('categoriesMeta', function () {
    return {
      restrict: 'E',

      scope: {
        meta: '=',
        category: '='
      },
      templateUrl: 'build/html/directives/categories-meta/categories-meta.html',
      link: function ($scope, element) {
        console.log($scope.doc);
      }
    };
  });
})();

(function () {
  'use strict';

  angular.module('learnApp')
  .directive('categoryItem', function () {
    return {
      restrict: 'E',

      scope: {
        data: '=',
        category: '=?',
        sectype: '@'
      },
      templateUrl: 'build/html/directives/category-item/category-item.html',
      link: function ($scope, element) {
        if ($scope.sectype === 'cats') {
          $scope.section = 'categories';
        } else {
          $scope.section = 'documentaries';
        }
      }
    };
  });
})();

(function () {
  'use strict';

  angular.module('learnApp')
  .directive('documental', ["store", function (store) {
    return {
      restrict: 'E',

      scope: {
        doc: '='
      },
      templateUrl: 'build/html/directives/documental/documental.html',
      link: function ($scope, element) {
        console.log($scope.doc);
      }
    };
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp')
  .directive('documentariesItem', function () {
    return {
      restrict: 'E',

      scope: {
        doc: '='
      },
      templateUrl: 'build/html/directives/documentaries-item/documentaries-item.html',
      link: function ($scope, element) {
        console.log($scope.doc);
      }
    };
  });
})();

(function () {
  'use strict';

  angular.module('learnApp')
  .directive('youtube', ["YouTubeLoader", "$compile", function (YouTubeLoader, $compile) {
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
  }]);
})();
