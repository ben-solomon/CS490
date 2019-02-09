$(document).ready(function() {

    $('#srchbtn').click(function() {



    })

});

function searchUser(){
    var txt = $('#username').val();
    $.ajax({
        type:"GET",
        url: "https://api.github.com/users/"+txt,
        cache:false,
        data: "text/html",
        success: function(data) {
            var user = data["login"];
           document.getElementById("user").innerText = user;
           document.getElementById("avatar").innerHTML= "<img src='"+ data["avatar_url"]+ "' width='100' height='100'/>";
           document.getElementById("information").innerHTML = "<p> Num Repos: " + data["public_repos"] + "</p><p> Member Since: " + data["created_at"] + "</p>";
        },
        fail: function() {
            alert("try again! not found");
        }
    });

}