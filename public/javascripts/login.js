function userForm() {
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', handleFormSubmit);
  function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(document.querySelector('form'));
    const formObject = {};
    for (const pair of formData.entries()) {
      formObject[pair[0]] = pair[1];
    }
    console.log('The form object is', formObject);
    const { username, password } = formObject;
    console.log('The username and password are:', username, password);
    const protectedUrl = 'http://localhost:5000/admin/dashboard';

    const http = new XMLHttpRequest();
    http.open('get', protectedUrl, false, username, password);
    http.send('');
    if (http.status == 200) {
      alert("OK. You're now logged in");
      window.location.href = protectedUrl;
    } else {
      alert('⚠️ Authentication failed.');
    }
  }
}
userForm();
