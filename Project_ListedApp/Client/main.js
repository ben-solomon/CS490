$(document).ready(function(){
    // checks if user is logged in properly, else redirects to login page
    $.ajax({
        type: "POST",
        contentType:'application/json',
        url: "http://listed.ddns.net:8080/verify",
        data: JSON.stringify({"token": getJWT()}),
        cache: false,
        success: function(data){
            loadPinboardsList();
        },
        error: function(data){
            window.location.href = '/index.html'
        }
        ,complete:function(){
            
        }
      });
      
})

// hides or shows the pinboard menu
function togglePinboardMenu() {

    // check if already visible (if height > 0 its visbile)
    if (document.getElementById('pinboardselectmenu').style.height == "60px"){
        
        document.getElementById('pinboardselectmenu').style.transition = "0.1s";
        document.getElementById('pinboardselectmenu').style.height = "0";
        // chang arrow to point down since were collapsing
        document.getElementById('pinboardtab').innerHTML = "▼";
        //hide all elements in the pinboard select menu
        document.getElementById('pinboardtab').style.marginTop = "0px";
        document.getElementById('pinboardselect').style.display = "none";
        document.getElementById('pinboardlabel').style.display = "none";
        document.getElementById('pinboardadd').style.display = 'none';

        

        
    }
    //does the opposite of the above
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
//force hide pinboard menu
function hidePinboardMenu() {
    document.getElementById('pinboardselectmenu').style.transition = "0.1s";
    document.getElementById('pinboardselectmenu').style.height = "0";
    document.getElementById('pinboardtab').innerHTML = "▼";
    document.getElementById('pinboardtab').style.marginTop = "0px";
    document.getElementById('pinboardselect').style.display = "none";
    document.getElementById('pinboardlabel').style.display = "none";
    document.getElementById('pinboardadd').style.display = 'none';
}

// returns the users JSON authorization token - loaded into local storage initially on login page
function getJWT(){
    return localStorage.token;
}

// returns username of currently signed in user (email)
function getUsername(){
    return localStorage.username;
}


// used to initially load the pinboard dropdown list options (select menu)
function loadPinboardsList(){
    //clears whatever is in dropdown currently
  document.getElementById("pinboardselect").innerHTML = "";
  var str = "";
  var obj = {"userID": getUsername()};
  //ajax API call to get pinboard names and IDs
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
                // load options into select menu
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
              //("failed");
            }
          });
        
}

// load all lists in currently selected pinboard
function loadPinboard(){
    $('#mainarea').innerHTML = "";
    var SelectedPinboard = $('#pinboardselect').find(":selected").val(); // must load the ID as the value, the NAME as the dropdown items text.

    if (SelectedPinboard === '0'){
        var obj = {"pinboardID": "1000"};
    }
    else{
        var obj = {"pinboardID": SelectedPinboard};
    }
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
            // used to distinguish list items between the lists they belong to, SQL data set is all list items across all lists -- faster loading than individual ajax call for each list,but more complex code 
            else if(listrow["ListID"] != lastlistID){
                
                htmlstring +=`</div><div class="list" id="`+ (listrow["ListID"] + i.toString() )+ `">
                <p class="listTitle">`+ listrow["listTitle"]+`</p>
                <label data-listID="`+listrow["ListID"]+`" onclick="toggleOptionsMenu('listoptionmenu`+listrow["ListID"]+`')" class="listoptionsbtn">≡</label> 
                <label data-listID="`+listrow["ListID"]+`" onclick="deleteList(this.getAttribute('data-listID'))" class="Deletebtn">X</label>
                <div id="listoptionmenu`+listrow["ListID"]+`" class="listoptionmenu">
                <span class="listoption">`;
                    
                // check if list is checkable to know if we should render checklist or not
                 if(listrow["isCheckable"]){
                    htmlstring += `Checklist: <input onchange="makeCheckable(this.getAttribute('data-listID'))" style="opacity:100;z-index:100" type="checkbox" data-listID="`+listrow["ListID"]+`" checked></label></span>
                    &nbsp;&nbsp;`;
                }
                else{
                    htmlstring+= `Checklist: <input onchange="makeCheckable(this.getAttribute('data-listID'))" style="opacity:100;z-index:100" type="checkbox" data-listID="`+listrow["ListID"]+`"></label></span>
                 &nbsp;&nbsp;`;

                }
                // check to see if list is numbered
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
          //alert("failed");
        }
      });
}


function logout(){
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    window.location.href = '/index.html'
}

//changing the dropdown menu
function onPinChange(){
    $('#mainarea').innerHTML = "";
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

// brings the add list menu up
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
    <p onclick='loadPinboard()'class="button" style="width:60px;background-color:#13524B;color:white;padding:5px;border-radius:5%;">Cancel</p>
 </div>`;
 document.getElementById('mainarea').innerHTML = htmlstring;
 document.getElementById('pinboardadd').style.display = 'none';
 hidePinboardMenu();
 }

 // actually inserts the list into the DB
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
          //alert("failed");
        }
      });
      $('#mainarea').innerHTML = "";
      document.getElementById('mainarea').style.display = 'none';
      document.getElementById('mainarea').style.display = 'flex';
      loadPinboard();

 }

 // insert pinboard into DB
 function addPinboard() {
     var currentUser = getUsername();
     var listItems = document.getElementById('createPinForm').children;
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
         // alert("failed");
        }
      });
      $('#mainarea').innerHTML = "";
      loadPinboard();
      document.getElementById('mainarea').style.display = 'none';
        document.getElementById('mainarea').style.display = 'flex';
        loadPinboardsList();
 }

 //show add pinboard menu
function toggleAddPin(){
   var htmlstring =  `<div class="boxx">
   <h3 class="teal-text text-darken-2">Create New Pinboard</h3>
   <form id="createPinForm" class="flex-column">
         <input  type="text" class="validate" placeholder="Pinboard Title">
   </form>
   <p onclick='addPinboard()'class="button" style="width:60px;background-color:#13524B;color:white;padding:5px;border-radius:5%;">Create</p>
   <p onclick='loadPinboard()'class="button" style="width:60px;background-color:#13524B;color:white;padding:5px;border-radius:5%;">Cancel</p>
</div>`;
document.getElementById('mainarea').innerHTML = htmlstring;
document.getElementById('pinboardadd').style.display = 'none';
hidePinboardMenu();
}

// add row during list creation
function addRowListCreate(){
    var newInput = document.createElement('input');
    newInput.innerHTML = `<input  type="text" class="validate" placeholder="List Item">`;
    document.getElementById('createListForm').appendChild(newInput);
}

// makes list checkable
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
        //  alert("failed");
        }
      });
  $('#mainarea').innerHTML = "";
  loadPinboard();
  document.getElementById('mainarea').style.display = 'none';
  document.getElementById('mainarea').style.display = 'flex';
}

// makes list numbered or not
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
        //  alert("failed");
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
         // alert("failed");
        }
      });
  $('#mainarea').innerHTML = "";
  loadPinboard();
  document.getElementById('mainarea').style.display = 'none';
  document.getElementById('mainarea').style.display = 'flex';
}

//complete list item (checkbox event)
function completeItem(listItemID){
    $.ajax({
        type: "POST",
        contentType:'application/json',
        beforeSend: function(request) {
            request.setRequestHeader("x-access-token", getJWT());
          },
        url: "http://listed.ddns.net:8080/markComplete",
        data: JSON.stringify({"listItemID":listItemID}),
        cache: false,
        success: function(data){
      
         },
        error: function(data){
          //alert("failed");
        }
      });
  $('#mainarea').innerHTML = "";
  loadPinboard();
  document.getElementById('mainarea').style.display = 'none';
  document.getElementById('mainarea').style.display = 'flex';
}