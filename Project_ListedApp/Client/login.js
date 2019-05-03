function login() {
    var user = {"user":"bsbs93@gmail.com","pass":"password"};

    $.ajax({
        type: "POST",
        contentType:'application/json',
        url: "http://listed.ddns.net:8080/login",
        data: JSON.stringify(user),
        cache: false,
        success: function(data){
           alert("login good!");
        },
        error: function(data){
           document.getElementById('loginerror').style.visibility = 'visible';
        }
      });
}

