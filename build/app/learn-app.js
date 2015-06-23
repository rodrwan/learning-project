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

  app.filter('sanitize', ["$sce", function ($sce) {
    return function (htmlCode) {
      return $sce.trustAsHtml(htmlCode);
    };
  }]);

  app.constant('API_URL', 'http://learn-app.herokuapp.com/api');
  // app.constant('API_URL', 'http://localhost:8080/api');

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

    // var data = {
    //   history: [
    //     {
    //       subTitle: 'Diseño Contemporaneo',
    //       topics: [
    //         {
    //           id: 1,
    //           thumbnail: 'history/hist1/hist1.jpg',
    //           title: 'Art & craft',
    //           subTitle: 'Historia del diseño, 1 video',
    //           brief: 'Breve descripción del tema.',
    //           time: '5,05'
    //         },
    //         {
    //           id: 2,
    //           thumbnail: 'history/hist2/hist2.jpg',
    //           title: 'Vanguardias',
    //           subTitle: 'Historia del diseño, 6 video',
    //           brief: 'Breve descripción del tema.',
    //           time: '5,30'
    //         },
    //         {
    //           id: 3,
    //           thumbnail: 'history/hist3/hist3.jpg',
    //           title: 'Posguerra',
    //           subTitle: 'Historia del diseño, 4 video',
    //           brief: 'Breve descripción del tema.',
    //           time: '26,03'
    //         },
    //         {
    //           id: 4,
    //           thumbnail: 'history/hist4/hist4.jpg',
    //           title: 'Posmodernismo',
    //           subTitle: 'Historia del diseño, 2 video',
    //           brief: 'Breve descripción del tema.',
    //           time: '15,06'
    //         }
    //       ]
    //     },
    //     {
    //       subTitle: 'Historia del Diseño en Chile',
    //       topics: [
    //         {
    //           id: 5,
    //           thumbnail: 'history/hist5/hist5.png',
    //           title: 'Orígenes, tradiciones y prácticas',
    //           subTitle: 'Historia del Diseño en Chile, 1 video',
    //           brief: 'En el siglo XVIII, las Bellas Artes se separan de las prácticas artísticas con fines utilitarios, y la industrialización da paso al nacimiento de las llamadas Artes Aplicadas.',
    //           time: '51,01'
    //         },
    //         {
    //           id: 6,
    //           thumbnail: 'history/hist6/hist6.jpg',
    //           title: 'Vicente larrea años 60',
    //           subTitle: 'Historia del Diseño en Chile, 1 video',
    //           brief: 'En 1963 inicia su trabajo gráfico en el Departamento de Extensión Cultural de la universidad, donde se dedica a la producción de material informativo para las escuelas de temporada.',
    //           time: '21,09'
    //         },
    //         {
    //           id: 7,
    //           thumbnail: 'history/hist7/hist7.png',
    //           title: 'Cartelismo años 70',
    //           subTitle: 'Historia del Diseño en Chile, 2 video',
    //           brief: 'Carteles políticos del periodo de gobierno de Salvador Allende y la Unidad Popular en Chile (1971-1973). Cartel Social, legado histórico de los afiches de la Polla Chilena de Beneficencia',
    //           time: '3,28'
    //         },
    //         {
    //           id: 8,
    //           thumbnail: 'history/hist8/hist8.png',
    //           title: 'da diseñadores asociados 1981',
    //           subTitle: 'Historia del Diseño en Chile, 1 video',
    //           brief: 'Se funda la primera empresa de Diseño "Diseñadores asociados"',
    //           time: '2,28'
    //         },
    //         {
    //           id: 9,
    //           thumbnail: 'history/hist9/hist9.png',
    //           title: 'Colegio de diseñadores 1985',
    //           subTitle: 'Historia del Diseño en Chile, 1 video',
    //           brief: 'Creación del Colegio de Diseñadores Profesionales de Chile.',
    //           time: '00,34'
    //         },
    //         {
    //           id: 10,
    //           thumbnail: 'history/hist10/hist10.png',
    //           title: 'Vicente Larrea diseño social v/s diseño comercial',
    //           subTitle: 'Historia del Diseño en Chile, 2 video',
    //           brief: 'El destacado diseñador habla sobre el diseño, la impresiono y la evolución de estos.',
    //           time: '03,14'
    //         },
    //         {
    //           id: 11,
    //           thumbnail: 'history/hist11/hist11.png',
    //           title: 'Diseño editorial, prisma tv',
    //           subTitle: 'Historia del Diseño en Chile, 1 video',
    //           brief: 'Entrevista a Revista paula, The Clinic, Joia magazine. Portafolio del estudio gráfico Lamano.',
    //           time: '24,43'
    //         },
    //         {
    //           id: 12,
    //           thumbnail: 'history/hist12/hist12.png',
    //           title: 'Nuevos medios, prisma tv',
    //           subTitle: 'Historia del Diseño en Chile, 3 video',
    //           brief: 'Entrevista a DelightLab, Sebastián Skoknic y Oktopus. Portafolio de Ayerviernes.',
    //           time: '25,35'
    //         },
    //         {
    //           id: 13,
    //           thumbnail: 'history/hist13/hist13.png',
    //           title: 'Tipografía, prisma tv',
    //           subTitle: 'Historia del Diseño en Chile, 1 video',
    //           brief: 'Entrevista a Latinotype, Francisco Gálvez, Roberto Osses y Zelén Vargas. Portafolio de Leyenda.',
    //           time: '25,47'
    //         },
    //         {
    //           id: 14,
    //           thumbnail: 'history/hist14/hist14.png',
    //           title: 'Street art, prisma tv',
    //           subTitle: 'Historia del Diseño en Chile, 3 video',
    //           brief: 'Entrevistados Raverlab, Galería Bomb y Mono González. Portafolio: Carburadores.',
    //           time: '29,20'
    //         }
    //       ]
    //     }
    //   ],
    //   economy: [
    //     {
    //       subTitle: 'Gestión de proyectos',
    //       topics: [
    //         {
    //           id: 1,
    //           thumbnail: 'economy/econ1/econ1.jpg',
    //           title: 'Funciones de administración de la empresa',
    //           subTitle: 'Gestión de proyectos, Lectura',
    //           brief: 'Según Henry Fayol, toda empresa cumple seis funciones básicas. Funciones técnicas, comerciales, financieras, de seguridad, contables y administrativas.',
    //           time: '0'
    //         },
    //         {
    //           id: 2,
    //           thumbnail: 'economy/econ2/econ2.png',
    //           title: 'Reconocer e identificar las gerencias de área',
    //           subTitle: 'Gestión de proyectos, 1 Video',
    //           brief: 'organigrama, tipos de organigramas.',
    //           time: '04,02'
    //         }
    //       ]
    //     },
    //     {
    //       subTitle: 'Tipos de empresas',
    //       topics: [
    //         {
    //           id: 3,
    //           thumbnail: 'economy/econ3/econ3.png',
    //           title: 'Constitución de una empresa ministerio de economía, gobierno de chile',
    //           subTitle: 'Gestión de proyectos, 1 Video',
    //           brief: 'Funciones administrativas, finanzas, producción y rol de la organización.',
    //           time: '06,53'
    //         },
    //         {
    //           id: 4,
    //           thumbnail: 'economy/econ4/econ4.jpg',
    //           title: 'Conocer e identificar las empresas',
    //           subTitle: 'Tipos de empresa, 1 Video',
    //           brief: 'Clasificación de las empresas según su actividad.',
    //           time: '13,47'
    //         },
    //         {
    //           id: 5,
    //           thumbnail: 'economy/econ5/econ5.png',
    //           title: 'Macro y micro entorno',
    //           subTitle: 'Gestión de proyectos, 1 Video',
    //           brief: 'Entorno, micro-entorno: la empresa, proveedores, intermediarios, clientes, competencia. macro-entorno: demográfico, económico, natural, tecnológico, político y cultural.',
    //           time: '04,33'
    //         },
    //         {
    //           id: 6,
    //           thumbnail: 'economy/econ6/econ6.jpg',
    //           title: 'Importancia de los canales de distribución',
    //           subTitle: 'Gestión de proyectos, 1 Video',
    //           brief: 'Aspectos generales importantes, tamaño, valores de mercado, costos del canal.',
    //           time: '06,14'
    //         },
    //         {
    //           id: 7,
    //           thumbnail: 'economy/econ7/econ7.jpg',
    //           title: 'Aplicando el concepto de design thinking en tu empresa',
    //           subTitle: 'Gestión de proyectos, 1 Video',
    //           brief: 'La aplicación de este concepto sirve para todo... Sitios web, indumentaria, muebles y, ¿por qué no?, para la forma en que interactúas con tu cliente.',
    //           time: '58,18'
    //         }
    //       ]
    //     },
    //     {
    //       subTitle: 'Desarrollo de Emprendedores',
    //       topics: [
    //         {
    //           id: 8,
    //           thumbnail: 'economy/econ8/econ8.png',
    //           title: 'Ideas de negocios',
    //           subTitle: 'Desarrollo de Emprendedores, 9 Video',
    //           brief: 'Presentación de cortos para emprendedores.',
    //           time: '24,85'
    //         },
    //         {
    //           id: 9,
    //           thumbnail: 'economy/econ9/econ9.jpg',
    //           title: 'Descripción del negocio',
    //           subTitle: 'Desarrollo de Emprendedores, 2 Videos, 1 Artículo',
    //           brief: 'Serie de videos de ayuda para tu negocio... ¿Cómo describir a tu empresa?,¿ Cuál es la misión y visión? ¿Cómo es su estructura legal?',
    //           time: '29,91'
    //         },
    //         {
    //           id: 10,
    //           thumbnail: 'economy/econ10/econ10.jpg',
    //           title: 'Productos y servicios',
    //           subTitle: 'Desarrollo de Emprendedores, 4 Videos, 1 Artículo',
    //           brief: 'Posicionamiento de una marca, ciclo de vida, ¿cómo es el cliente y cuáles son sus necesidades?,¿ cómo patentar una idea?, procesos y procedimientos.',
    //           time: '31,46'
    //         },
    //         {
    //           id: 11,
    //           thumbnail: 'economy/econ11/econ11.jpg',
    //           title: 'Operaciones y administración',
    //           subTitle: 'Desarrollo de Emprendedores, 3 Videos',
    //           brief: 'Aseguramiento de Calidad, Recursos Humanos, Administración y estructura organizacional.',
    //           time: '24,73'
    //         }
    //       ]
    //     },
    //     {
    //       subTitle: 'Brnading',
    //       topics: [
    //         {
    //           id: 12,
    //           thumbnail: 'economy/econ12/econ12.jpg',
    //           title: 'Conceptos de arquitectura y construción de marca',
    //           subTitle: 'Desarrollo de Emprendedores, 3 Videos',
    //           brief: 'El significado de Términos en la Imagen corporativa, Fases para la construcción de una marca Branding y Comunicación persuasiva para las empresas.',
    //           time: '25,73'
    //         },
    //         {
    //           id: 13,
    //           thumbnail: 'economy/econ13/econ13.png',
    //           title: 'Conceptos de arquitectura y construción de marca',
    //           subTitle: 'Desarrollo de Emprendedores, 2 Videos',
    //           brief: 'Segmentación de mercado y Neuromarketing.',
    //           time: '29,45'
    //         },
    //         {
    //           id: 14,
    //           thumbnail: 'economy/econ14/econ14.jpg',
    //           title: 'Conceptos de arquitectura y construción de marca',
    //           subTitle: 'Desarrollo de Emprendedores, 1 Videos',
    //           brief: 'Diseño de estrategias',
    //           time: '04,58'
    //         },
    //         {
    //           id: 15,
    //           thumbnail: 'economy/econ15/econ15.png',
    //           title: 'Conceptos de arquitectura y construción de marca',
    //           subTitle: 'Desarrollo de Emprendedores, 4 Videos, 1 artículo',
    //           brief: 'Ciclo de vida de una marca, tipologias de consumidor, estrategias de mantención de marcas líderes, estrategias para marcas, estrategias para marcas con potencial desgastado.',
    //           time: '23,19'
    //         }
    //       ]
    //     }
    //   ]
    // };

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
          var categories = [];

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

  .controller('SignUpCtrl', ["$scope", "$http", "store", "$state", function SignUpController ($scope, $http, store, $state) {
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

  }]);
})();
