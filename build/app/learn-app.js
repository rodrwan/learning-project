  (function () {
  'use strict';

  var app = angular.module('learnApp', [
    'ui.router',
    'learnApp.home',
    'learnApp.login',
    'learnApp.categories',
    'learnApp.documentaries',
    'learnApp.signup',
    'learnApp.news',
    'angular-storage'
  ]);

  app.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function MLConfig ($stateProvider, $urlRouterProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/home');
    // $httpProvider.defaults.useXDomain = true;
    // delete $httpProvider.defaults.headers.common['X-Requested-With'];
    // $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
    $stateProvider.state('main', {
      url: '/',
      controller: 'Apptrl',
      templateUrl: ''
    });
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

  app.controller('AppCtrl', ["$rootScope", "$scope", "store", function AppController ($rootScope, $scope, store) {
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

  app.factory('YouTubeLoader', ["$q", "$window", function ($q, $window) {
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
  }]);

  app.directive('youtube', ["YouTubeLoader", "$compile", function (YouTubeLoader, $compile) {
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
  }])

  .factory('Login', ["API_URL", "$q", "$http", function (API_URL, $q, $http) {
    var login;

    login = function (userData) {
      var url = API_URL + '/user/session';
      console.log('-- REQUEST --');
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: url,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function (obj) {
          var str = [];
          for (var p in obj)
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

  angular.module('learnApp.categories', [
    'ui.router',
    'angular-storage'
  ])

  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
    .state('categories', {
      url: '/categories',
      controller: 'CatsCtrl',
      templateUrl: 'build/html/categories/categories.html'
    })
    .state('categories.cat', {
      url: '/:cat',
      controller: 'CatCtrl',
      templateUrl: 'build/html/categories/category_list.html'
    })
    .state('categories.resource', {
      url: '/:cat/:id',
      controller: 'ResCtrl',
      templateUrl: 'build/html/categories/resource.html'
    });
  }])

  .controller('CatsCtrl', ["$scope", "catsData", "store", function CatsController ($scope, catsData, store) {
    var categories = store.get('categories');

    if (!categories) {
      console.log('loading data from server');
      $scope.loadingIsDone = false;
      catsData.getCategories().then(function (categories) {
        $scope.categories = categories;
        $scope.loadingIsDone = true;
      });
    } else {
      console.log('loading data from local storage');
      $scope.categories = categories;
      $scope.loadingIsDone = true;
    }

  }])

  .controller('CatCtrl', ["$scope", "$stateParams", "store", "catsData", function CatController ($scope, $stateParams, store, catsData) {
    var categories = store.get('categories');
    var categoryMeta = {};
    $scope.loadingIsDone = false;
    categories.forEach(function (elem) {
      categoryMeta[elem.id] = {};
      categoryMeta[elem.id].sectionTitle = elem.title;
      categoryMeta[elem.id].description = elem.description;
    });

    $scope.category = $stateParams.cat;
    catsData.getTopicsByCategory($scope.category).then(function (topics) {
      var data = topics;
      $scope.category = $stateParams.cat;
      $scope.categories = data;
      $scope.meta = categoryMeta[$scope.category];
      $scope.loadingIsDone = true;
    });
  }])

  .controller('ResCtrl', ["$rootScope", "$scope", "$stateParams", "catsData", "$sce", function ResController ($rootScope, $scope, $stateParams, catsData, $sce) {
    var _id = $stateParams.id;
    var cat = $stateParams.cat;

    catsData.getTopicPost(cat, _id).then(function (res) {
      console.log(res);
      $scope.topics = res.topics;
      var times = [];
      $scope.topics.forEach(function (topic, idx) {
        $scope.topics[idx].content = $sce.trustAsHtml(topic.content);
        times.push(topic.time);
      });

      $scope.times = times;
      $scope.meta = res.meta;
      $rootScope.$broadcast('event:data-received', {
        type: res.type,
        video: res.media
      });
    });
  }])

  .factory('catsData', ["API_URL", "$q", "$http", "store", function (API_URL, $q, $http, store) {
    var getCategories, getTopicsByCategory, getTopicPost;

    getCategories = function () {
      return $http.get(API_URL + '/categories')
        .then(function (response) {
          var categories = [];

          if (typeof response.data === 'object') {
            store.set('categories', response.data.categories);
            response.data.categories.forEach(function (elem) {
              var cat = {
                id: elem.id,
                title: elem.title,
                description: elem.description,
                image: elem.image
              };
              categories.push(cat);
            });
            return categories;
          }
          // invalid response
          return $q.reject(response.data);
        }, function (response) {
          // something went wrong
          return $q.reject(response.data);
        });
    };

    getTopicsByCategory = function (category) {
      return $http.get(API_URL + '/categories/' + category)
        .then(function (response) {
          if (typeof response.data === 'object') {
            store.set(category + 'topics', response.data.topics);
            return response.data.topics;
          }
          // invalid response
          return $q.reject(response.data);
        }, function (response) {
          // something went wrong
          return $q.reject(response.data);
        });
    };

    getTopicPost = function (category, topicId) {

      return $http.get(API_URL + '/categories/' + category + '/topic/' + topicId)
        .then(function (response) {
          if (typeof response.data === 'object') {
            return response.data;
          }
          // invalid response
          return $q.reject(response.data);
        }, function (response) {
          // something went wrong
          return $q.reject(response.data);
        });
    };

    return {
      getCategories: getCategories,
      getTopicsByCategory: getTopicsByCategory,
      getTopicPost: getTopicPost
    };
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

  .controller('DocsCtrl', ["$scope", "store", "docsData", function DocsController ($scope, store, docsData) {
    var documentaries = store.get('documentaries');
    $scope.documentaries = [];

    if (documentaries) {
      console.log('loading data from local storage');
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
    } else {
      docsData.getDocumentaries().then(function (docs) {
        console.log('loading data from server');
        $scope.documentaries = docs;
        $scope.loadingIsDone = true;
      });
    }
  }])

  .controller('DocCtrl', ["$rootScope", "$scope", "$stateParams", "docsData", function DocController ($rootScope, $scope, $stateParams, docsData) {
    docsData.getDocumentary($stateParams.id - 1).then(function (doc) {
      $scope.doc = doc;
      $rootScope.$broadcast('event:data-received', {
        type: doc.type,
        video: doc.videoId
      });

      $scope.loadingIsDone = true;
    });
  }])

  .factory('docsData', ["API_URL", "$q", "$http", "store", "$state", function (API_URL, $q, $http, store, $state) {
    var getDocumentaries, getDocumentary;

    getDocumentaries = function () {
      return $http.get(API_URL + '/documentaries')
        .then(function (response) {
          var documentaries = [];

          if (typeof response.data === 'object') {
            store.set('documentaries', response.data.documentaries);
            response.data.documentaries.forEach(function (elem) {
              var doc = {
                id: elem.id,
                thumbnail: elem.thumbnail,
                title: elem.title,
                subTitle: elem.sub_title,
                brief: elem.brief,
                time: elem.time
              };
              documentaries.push(doc);
            });
            return documentaries;
          }
          // invalid response
          return $q.reject(response.data);
        }, function (response) {
          // something went wrong
          return $q.reject(response.data);
        });
    };

    getDocumentary = function (id) {
      var documentaries, deferred, documents;

      documentaries = store.get('documentaries');
      deferred = $q.defer();
      documents = [];

      if (documentaries) {
        documentaries.forEach(function (elem) {
          var doc = {
            id: elem.id,
            title: elem.title,
            data: elem.content,
            videoId: elem.media,
            type: elem.type,
            time: elem.time
          };
          documents.push(doc);
        });
        deferred.resolve(documents[id]);
        return deferred.promise;
      }

      $state.go('docs');
    };

    return {
      getDocumentaries: getDocumentaries,
      getDocumentary: getDocumentary
    };
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
      templateUrl: 'build/html/signup/signup.html'
    });
  }])

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
  }])

  .factory('SignUp', ["API_URL", "$q", "$http", function (API_URL, $q, $http) {
    var register;

    register = function (userData) {
      var url = API_URL + '/user/create';
      console.log('-- REQUEST --');
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: url,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function (obj) {
          var str = [];
          for (var p in obj)
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
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

  angular.module('learnApp.news', [
    'ui.router',
    'angular-storage'
  ])

  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state('news', {
      url: '/news',
      controller: 'NewsCtrl',
      templateUrl: 'build/html/news/news.html'
    });
  }])

  .controller('NewsCtrl', ["$scope", "$http", "store", "$state", function NewsController ($scope, $http, store, $state) {
    $scope.arrNews = [{
        'url': 'documentaries',
        'title': 'Documentales',
        'image': 'documentaries/doc_port',
        'id': 'documentaries'
    }];
  }]);
})();
