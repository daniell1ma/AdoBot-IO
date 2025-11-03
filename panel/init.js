$(document).ready(function() {
  var username = localStorage.getItem('username'),
    password = localStorage.getItem('password');

  if (!username || !password) {
    window.history.pushState(null, 'login', '/');
    window.location.href = '/login'; // Redireciona para a rota de login
  } else {

    $.post('/login', {
      username: username,
      password: password
    })
      .done(function() {
        window.location.href = '/'; // Redireciona para a rota principal
      })
      .fail(function() {
        window.location.href = '/login'; // Redireciona para a rota de login em caso de falha
      });
  }
});
