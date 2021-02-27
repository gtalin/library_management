const logoutLink = document.getElementById('logout');
logoutLink.addEventListener('click', handleLogoutClick);

function handleLogoutClick() {
  const protectedUrl = 'http://localhost:5000/admin/dashboard';
  const login = 'fakeUser';
  const pass = 'randomPassword';
  const http = new XMLHttpRequest();
  http.open('get', protectedUrl, false, login, pass);
  http.send('');
  if (http.status === 401) {
    alert("You're logged out now");
    window.location.href = '/catalog';
  } else {
    alert('Logout failed');
  }
}
