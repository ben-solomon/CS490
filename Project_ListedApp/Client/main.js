$(document).ready(function(){
    $.ajax({
        type: "POST",
        contentType:'application/json',
        url: "http://listed.ddns.net:8080/verify",
        data: JSON.stringify({"token": getJWT()}),
        cache: false,
        success: function(data){
           //alert("Welcome " + getUsername() + "!");
        },
        error: function(data){
            window.location.href = '/index.html'
        }
      });

      //////////
      loadPinboardsList();
      $('#mainarea').innerHTML = "";
      loadPinboard();
      document.getElementById('mainarea').style.display = 'none';
      document.getElementById('mainarea').style.display = 'flex';
})
function bestCopyEver(src) {
    return Object.assign({}, src);
  }
function togglePinboardMenu() {
    if (document.getElementById('pinboardselectmenu').style.height == "60px"){
        document.getElementById('pinboardselectmenu').style.transition = "0.1s";
        document.getElementById('pinboardselectmenu').style.height = "0";
        document.getElementById('pinboardtab').innerHTML = "▼";
        document.getElementById('pinboardtab').style.marginTop = "0px";
        document.getElementById('pinboardselect').style.display = "none";
        document.getElementById('pinboardlabel').style.display = "none";
        document.getElementById('pinboardadd').style.display = 'none';

        

        
    }
    else{
        document.getElementById('pinboardselectmenu').style.transition = "0.1s";
        document.getElementById('pinboardselectmenu').style.height = "60px";
        document.getElementById('pinboardtab').innerHTML = "▲";
        document.getElementById('pinboardtab').style.marginTop = "60px";
        document.getElementById('pinboardselect').style.display = "block";
        document.getElementById('pinboardlabel').style.display = "block";
        document.getElementById('pinboardadd').style.display = 'block';

    }

}

function hidePinboardMenu() {
    document.getElementById('pinboardselectmenu').style.transition = "0.1s";
    document.getElementById('pinboardselectmenu').style.height = "0";
    document.getElementById('pinboardtab').innerHTML = "▼";
    document.getElementById('pinboardtab').style.marginTop = "0px";
    document.getElementById('pinboardselect').style.display = "none";
    document.getElementById('pinboardlabel').style.display = "none";
}

function getJWT(){
    return localStorage.token;
}
function getUsername(){
    return localStorage.username;
}


// used to initially load the pinboard dropdown list options
function loadPinboardsList(){
  document.getElementById("pinboardselect").innerHTML = "";
  var str = "";
  var obj = {"userID": getUsername()};
        $.ajax({
            type: "POST",
            contentType:'application/json',
            beforeSend: function(request) {
                request.setRequestHeader("x-access-token", getJWT());
              },
            url: "http://listed.ddns.net:8080/loadpinboardlist",
            data: JSON.stringify(obj),
            cache: false,
            success: function(data){
                var objArray = data["recordset"];
                for (var i=0;i<objArray.length;i++)
                {
                    if(i==0){
                        str +=  "<option value='"+ objArray[i]["ID"] +"' selected>"+ objArray[i]["pinboardName"] +"</option>";
                    }else{
                        str +=  "<option value='"+ objArray[i]["ID"] +"'>"+ objArray[i]["pinboardName"] +"</option>";
                    }
                    
                } 
                document.getElementById("pinboardselect").innerHTML = str; 
             },
            error: function(data){
              alert("failed");
            }
          });
        
}

// load all lists in currently selected pinboard
function loadPinboard(){
    var SelectedPinboard = $('#pinboardselect').find(":selected").val(); // must load the ID as the value, the NAME as the dropdown items text.

    var obj = {"pinboardID": SelectedPinboard};
    $.ajax({
        type: "POST",
        contentType:'application/json',
        beforeSend: function(request) {
            request.setRequestHeader("x-access-token", getJWT());
          },
        url: "http://listed.ddns.net:8080/loadpinboard",
        data: JSON.stringify(obj),
        cache: false,
        success: function(data){
            ///////////////////////////////////
          var htmlstring = `<p id="addListBtn" data-PinID="0" onclick='toggleAddList()' class="button" style="width:60px;background-color:#13524B;color:white;padding:5px;border-radius:5%;">Add List</p>`;
          var lastlistID = 0;
          var isNumbered = false;
          for(var i=0;i<data["recordset"].length;i++)
          {
            var listrow = data["recordset"][i];
            if(listrow["ListID"] == 0){
               
                    htmlstring +=`<div class="list" id="`+ (listrow["ListID"] + i.toString() )+ `">
                    <p class="listTitle">`+ listrow["listTitle"]+`</p>
                    <label data-listID="`+listrow["ListID"]+`" onclick="toggleOptionsMenu('listoptionmenu`+listrow["ListID"]+`')" class="listoptionsbtn">≡</label> 
                    <label data-listID="`+listrow["ListID"]+`" onclick="deleteList(this.getAttribute('data-listID'))" class="Deletebtn">X</label>
                    <div id="listoptionmenu`+listrow["ListID"]+`" class="listoptionmenu">
                    <span class="listoption">`;
                    if(listrow["isCheckable"]){
                        htmlstring += `Checklist: <input onchange="makeCheckable(this.getAttribute('data-listID'))" style="opacity:100;z-index:100" type="checkbox" data-listID="`+listrow["ListID"]+`" checked></label></span>
                        &nbsp;&nbsp;`;
                    }
                    else{
                        htmlstring+= `Checklist: <input onchange="makeCheckable(this.getAttribute('data-listID'))" style="opacity:100;z-index:100" type="checkbox" data-listID="`+listrow["ListID"]+`"></label></span>
                     &nbsp;&nbsp;`;
 
                    }
                    
                    if(listrow["isNumbered"]){
                        isNumbered = true;
                        htmlstring += `<span  class="listoption">
                        Numbered: <input onchange="makeEnumerable(this.getAttribute('data-listID'))" id="listitemID"style="opacity:100;z-index:100" type="checkbox" data-listID="`+listrow["ListID"]+`"checked></label></span></div><ol style="margin-top:50px;">`;

                    }
                    else{
                        isNumbered = false;
                        htmlstring += `<span  class="listoption">
                        Numbered: <input onchange="makeEnumerable(this.getAttribute('data-listID'))" id="listitemID"style="opacity:100;z-index:100" type="checkbox" data-listID="`+listrow["ListID"]+`"></label></span></div><ul style="margin-top:50px;">`;
                    }
            }
            else if(listrow["ListID"] != lastlistID){
                
                htmlstring +=`</div><div class="list" id="`+ (listrow["ListID"] + i.toString() )+ `">
                <p class="listTitle">`+ listrow["listTitle"]+`</p>
                <label data-listID="`+listrow["ListID"]+`" onclick="toggleOptionsMenu('listoptionmenu`+listrow["ListID"]+`')" class="listoptionsbtn">≡</label> 
                <label data-listID="`+listrow["ListID"]+`" onclick="deleteList(this.getAttribute('data-listID'))" class="Deletebtn">X</label>
                <div id="listoptionmenu`+listrow["ListID"]+`" class="listoptionmenu">
                <span class="listoption">`;

                 if(listrow["isCheckable"]){
                    htmlstring += `Checklist: <input onchange="makeCheckable(this.getAttribute('data-listID'))" style="opacity:100;z-index:100" type="checkbox" data-listID="`+listrow["ListID"]+`" checked></label></span>
                    &nbsp;&nbsp;`;
                }
                else{
                    htmlstring+= `Checklist: <input onchange="makeCheckable(this.getAttribute('data-listID'))" style="opacity:100;z-index:100" type="checkbox" data-listID="`+listrow["ListID"]+`"></label></span>
                 &nbsp;&nbsp;`;

                }
                
                if(listrow["isNumbered"]){
                    isNumbered = true;
                    htmlstring += `<span  class="listoption">
                    Numbered: <input onchange="makeEnumerable(this.getAttribute('data-listID'))" id="listitemID"style="opacity:100;z-index:100" type="checkbox" data-listID="`+listrow["ListID"]+`"checked></label></span></div><ol style="margin-top:50px;">`;

                }
                else{
                    isNumbered = false;
                    htmlstring += `<span  class="listoption">
                    Numbered: <input onchange="makeEnumerable(this.getAttribute('data-listID'))" id="listitemID"style="opacity:100;z-index:100" type="checkbox" data-listID="`+listrow["ListID"]+`"></label></span></div><ul style="margin-top:50px;">`;
                }
            }
            lastlistID = listrow["ListID"];
            if(listrow["isCheckable"]){
                if(listrow["isComplete"]){
                    htmlstring += `<li>
                    <div style="display:flex;flex-direction: row;flex-wrap:nowrap; justify-content:space-between;">
                      <label style="width:190px;color:black;font-size:13px;word-wrap:break-word;">`+ listrow["itemText"]+`</label>
                      <label style="margin-right:20px;" class="chkbox"><input onchange="completeItem(this.getAttribute('data-listItemID'))" style="opacity:100;z-index:100" type="checkbox" name="listitem" data-listItemID="`+ listrow["listItemID"]+`" checked></label>
                    </div>
                  </li>`;
                }else{
                    htmlstring += `<li>
                    <div style="display:flex;flex-direction: row;flex-wrap:nowrap; justify-content:space-between;">
                      <label style="width:190px;color:black;font-size:13px;word-wrap:break-word;">`+ listrow["itemText"]+`</label>
                      <label style="margin-right:20px;" class="chkbox"><input onchange="completeItem(this.getAttribute('data-listItemID'))" style="opacity:100;z-index:100" type="checkbox" name="listitem" data-listItemID="`+ listrow["listItemID"]+`"></label>
                    </div>
                  </li>`;
                }
            }
            else{
                
                    htmlstring += `<li>
                    <div style="display:flex;flex-direction: row;flex-wrap:nowrap; justify-content:space-between;">
                      <label style="width:190px;color:black;font-size:13px;word-wrap:break-word;">`+ listrow["itemText"]+`</label>
                   </div>
                  </li>`;
               
            }
            
          }
          if(isNumbered){
            htmlstring += "</ol>";
        }
        else{
            htmlstring += "</ul>";
        }
        document.getElementById('mainarea').innerHTML = htmlstring;
          ////////////////////////////////////////////
        },
        error: function(data){
          alert("failed");
        }
      });
}


function logout(){
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    window.location.href = '/index.html'
}

function onPinChange(){
    loadPinboard();
    hidePinboardMenu();
    document.getElementById('pinboardadd').style.display = 'none';
}

function toggleOptionsMenu(listID){
    if(document.getElementById(listID).style.visibility == "hidden")
    document.getElementById(listID).style.visibility = "visible";
    else{
        document.getElementById(listID).style.visibility = "hidden"
    }
}

function toggleAddList(){
    var htmlstring =  `<div class="boxx">
    <label onclick="loadPinboard()" style="margin-left:-260px;font-size:16px;color:red;">X</label>
    <h3 class="teal-text text-darken-2">Create new list</h3>
    <form id="createListForm" class="flex-column">
          <input  type="text" class="validate" placeholder="List Title">
          <input  type="text" class="validate" placeholder="List Item">
    </form>
    <button onclick="addRowListCreate()" class="add-icon" ><i class="material-icons">add_circle_outline</i></button>
    <p onclick='addList()'class="button" style="width:60px;background-color:#13524B;color:white;padding:5px;border-radius:5%;">Create</p>
 </div>`;
 document.getElementById('mainarea').innerHTML = htmlstring;
 document.getElementById('pinboardadd').style.display = 'none';
 hidePinboardMenu();
 }

 function addList(){
    var currentPinboard = $('#pinboardselect').find(":selected").val();
    var listItems = document.getElementById('createListForm').children;
    var ListArray = [];
    for (i=0;i<listItems.length;i++){
        ListArray.push(listItems[i].value);
    }
    var obj = {"pinboardID":currentPinboard,"items":ListArray,"username":getUsername()};
        $.ajax({
        type: "POST",
        contentType:'application/json',
        beforeSend: function(request) {
            request.setRequestHeader("x-access-token", getJWT());
          },
        url: "http://listed.ddns.net:8080/addList",
        data: JSON.stringify(obj),
        cache: false,
        success: function(data){
           
         },
        error: function(data){
          alert("failed");
        }
      });
      $('#mainarea').innerHTML = "";
      loadPinboard();
      document.getElementById('mainarea').style.display = 'none';
      document.getElementById('mainarea').style.display = 'flex';

 }

 function addPinboard() {
     var currentUser = getUsername();
     var listItems = document.getElementById('createListForm').children;
     var ListArray = [];
     for (i=0;i<listItems.length;i++){
         ListArray.push(listItems[i].value);
     }
     var obj = {"userID":currentUser,"title":ListArray[0]};
        $.ajax({
        type: "POST",
        contentType:'application/json',
        beforeSend: function(request) {
            request.setRequestHeader("x-access-token", getJWT());
          },
        url: "http://listed.ddns.net:8080/addPinboard",
        data: JSON.stringify(obj),
        cache: false,
        success: function(data){
           
         },
        error: function(data){
          alert("failed");
        }
      });
      $('#mainarea').innerHTML = "";
      loadPinboard();
      document.getElementById('mainarea').style.display = 'none';
        document.getElementById('mainarea').style.display = 'flex';
 }
function toggleAddPin(){
   var htmlstring =  `<div class="boxx">
   <label onclick="loadPinboard()" style="margin-left:-260px;font-size:16px;color:red;">X</label>
   <h3 class="teal-text text-darken-2">Create new list</h3>
   <form id="createListForm" class="flex-column">
         <input  type="text" class="validate" placeholder="Pinboard Title">
   </form>
   <p onclick='loadPinboard()'class="button" style="width:60px;background-color:#13524B;color:white;padding:5px;border-radius:5%;">Create</p>
</div>`;
document.getElementById('mainarea').innerHTML = htmlstring;
document.getElementById('pinboardadd').style.display = 'none';
hidePinboardMenu();
}

function addRowListCreate(){
    var newInput = document.createElement('input');
    newInput.innerHTML = `<input  type="text" class="validate" placeholder="List Item">`;
    document.getElementById('createListForm').appendChild(newInput);
}

function makeCheckable(listID){

    $.ajax({
        type: "POST",
        contentType:'application/json',
        beforeSend: function(request) {
            request.setRequestHeader("x-access-token", getJWT());
          },
        url: "http://listed.ddns.net:8080/makeCheckable",
        data: JSON.stringify({"listID":listID}),
        cache: false,
        success: function(data){

      
         },
        error: function(data){
          alert("failed");
        }
      });
  $('#mainarea').innerHTML = "";
  loadPinboard();
  document.getElementById('mainarea').style.display = 'none';
  document.getElementById('mainarea').style.display = 'flex';
}

function makeEnumerable(listID){
    $.ajax({
        type: "POST",
        contentType:'application/json',
        beforeSend: function(request) {
            request.setRequestHeader("x-access-token", getJWT());
          },
        url: "http://listed.ddns.net:8080/makeEnumerable",
        data: JSON.stringify({"listID":listID}),
        cache: false,
        success: function(data){

      
         },
        error: function(data){
          alert("failed");
        }
      });
  $('#mainarea').innerHTML = "";
  loadPinboard();
  document.getElementById('mainarea').style.display = 'none';
  document.getElementById('mainarea').style.display = 'flex';
}

function deleteList(listID){
    $.ajax({
        type: "POST",
        contentType:'application/json',
        beforeSend: function(request) {
            request.setRequestHeader("x-access-token", getJWT());
          },
        url: "http://listed.ddns.net:8080/deleteList",
        data: JSON.stringify({"listID":listID}),
        cache: false,
        success: function(data){

      
         },
        error: function(data){
          alert("failed");
        }
      });
  $('#mainarea').innerHTML = "";
  loadPinboard();
  document.getElementById('mainarea').style.display = 'none';
  document.getElementById('mainarea').style.display = 'flex';
}