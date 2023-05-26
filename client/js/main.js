$(() => {
    $('#loginBtn').on('click', (e) => {
        const uname = $('#username').val().trim();
        const pass = $('#password').val();

        if (uname == '' || pass == '') {
            alert('Username and password is required!');
        } else {
            $.ajax({
                method: 'POST',
                url: 'http://localhost:3001/api/users/login',
                data: JSON.stringify({
                    username: uname,
                    password: pass
                }),
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                success: (response) => {
                    console.log(response);
                    onLoginSuccess(response.accessToken);
                },
                error: (error) => {
                    console.log(error);
                    alert(error.responseJSON.message ?? error.message);
                }
            })
        }
    });
});

const onLoginSuccess = function(loginData){
    sessionStorage.setItem('app-session', loginData);
    location.assign('products.html');
}