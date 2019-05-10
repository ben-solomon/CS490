

function login() {
   var username = $("#email").val();
   var password = $('#password').val();
    var user = {"user":username,"pass":password};

    $.ajax({
        type: "POST",
        contentType:'application/json',
        url: "http://listed.ddns.net:8080/login",
        data: JSON.stringify(user),
        cache: false,
        success: function(data){
           setAuth(data["token"],username);
           window.location.href = '/template.html'
         }
            ,
        error: function(data){
           document.getElementById('loginerror').style.visibility = 'visible';
        }
      });
}

function setAuth(txt,usr)
{
   localStorage.setItem("token",txt);
   localStorage.setItem("username",usr);
}
