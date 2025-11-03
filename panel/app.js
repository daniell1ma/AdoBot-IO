window.App = angular.module('AdoBot', [
  'ui.router',
  'ngRoute',
  'btford.socket-io',
  'ui.bootstrap',
  'ngAnimate',
  'toastr',
  'angular-duration-format',
  'angularMoment',
  'http-auth-interceptor',
  'uiGmapgoogle-maps',
  'angular-loading-bar',
  'templates'
])
  .config(['uiGmapGoogleMapApiProvider', function(uiGmapGoogleMapApiProvider) {
    var config = {
      // key: 'AIzaSyCU86vupyU0nMI7QvDnfJXteNxLyfrMSDg',
      v: '3.26', //defaults to latest 3.X anyhow
      libraries: 'weather,geometry,visualization'
    };
    if ((/herokuapp/).test(window.location.host))
      config.key = 'AIzaSyCU86vupyU0nMI7QvDnfJXteNxLyfrMSDg';
    uiGmapGoogleMapApiProvider.configure(config);
  }])
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  }])
  .run([
    '$http',
    '$rootScope',
    '$state',
    function($http, $rootScope, $state) {
      var username = localStorage.getItem('username');
      var password = localStorage.getItem('password');

      if (username && password) {
        $http.defaults.headers.common.username = username;
        $http.defaults.headers.common.password = password;
      } else {
        // Se não houver credenciais, vá para o login sem recarregar a página.
        // O timeout garante que a transição ocorra após a inicialização.
        setTimeout(function() { $state.go('login'); }, 0);
      }

      $rootScope.$on('event:auth-loginRequired', function(event, data) {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        delete $http.defaults.headers.common.username;
        delete $http.defaults.headers.common.password;
        $state.go('login');
      });
    }
  ]);
