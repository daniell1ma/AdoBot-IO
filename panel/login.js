angular.module('AdoBot')
  .controller('LoginCtrl', [
    '$scope',
    '$http',
    '$state',
    function($scope, $http, $state) {

      $scope.submitting = false;
      $scope.doLogin = function(username, password) {
        $scope.submitting = true;
        $http.post('/login', {
            username: username,
            password: password
          })
          .then(function() {
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
            $state.go('dashboard.home', {}, { reload: true });
          })
          .catch(function() {
            $scope.submitting = false;
            alert('Invalid username or password.');
          });
      };

    }
  ]);
