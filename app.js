var routerApp = angular.module('app', ['ui.router','ngCookies', 'ngAnimate', 'ui.bootstrap','angularMoment', 'chart.js']);
routerApp.config(function($stateProvider, $urlRouterProvider,ChartJsProvider) {
    $urlRouterProvider.otherwise('/home');
	ChartJsProvider.setOptions({ colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('login', {
            url: '/login',
            templateUrl: 'login/login.view.html',
            controller: 'LoginController'
        })

        .state('home', {
            url: '/home',
            templateUrl: 'home/home.view.html',
            controller: 'HomeController'
        })
        
        .state('userreport', {
            url: '/userreport',
            templateUrl: 'user-report/user-report.view.html',
            controller: 'UserReportController'
        })

        .state('lastactivity', {
            url: '/lastactivity',
            templateUrl: 'last-activity/last-activity.view.html',
            controller: 'LastActivityController'
        });
});


routerApp.$inject = ['$rootScope', '$location', '$cookieStore', '$http', 'amMoment', 'angularMomentConfig'];
function run($rootScope, $location, $cookieStore, $http, amMoment, angularMomentConfig) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
        var loggedIn = $rootScope.globals.currentUser;
       
    });

    angularMomentConfig.preprocess = function(value) {
        return moment(value).locale(moment.locale());
      }

    amMoment.changeLocale(navigator.language || navigator.userLanguage);
console.log(3474);
    if(!window.localStorage['username'])
    {
        $state.go('login');
    }
}


routerApp.filter('slice', function() {
  return function(arr, start, end) {
    return (arr || []).slice(start, end);
  };
});

