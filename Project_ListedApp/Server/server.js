////node modules/////
//api
var express = require("express");
//middleware
var bodyParser = require("body-parser");
//MS SQL Server
var sql = require("mssql");
//JSON Web Tokens for Auth
var jwt = require("jsonwebtoken");
const salt = "whiskey282Tango";
var moment = require('moment-timezone');

////config////
var app = express(); 
//used for JSON web token
var secretKey = 'noOneShouldKnowThis';
var parameters = [];
moment().tz('America/Chicago').format();

app.set('superSecret', secretKey);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const cors = require('cors')

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}
app.use(cors(corsOptions));


////CORS Middleware - Enable 'cross-site' requests////
app.use(function (req, res, next) {
    //Enabling CORS - e.g * allow-origin access from any client browser
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, x-access-token, Accept, Authorization");
	
    if ('OPTIONS' === req.method) {
      res.sendStatus(200);
    }
    next();
});

////Setting up/starting  server - node cant run on ports 80/443 directly////
//we will use nginx to reverse proxy requests on 80 to 8080
 var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("API now running on port", port);
 });

////Database Connection////
var dbConfig = {
    user:  'dbuser',
    password: 'PASS@1234',
    server: 'SRV\\SQLEXPRESS',
    database: 'ListedApp',
    pool: {max: 50,min:0,idleTimeoutsMillis: 30000}
};

sql.connect(dbConfig, function(err){if(err){console.log(err);}});

//Function to connect to database and execute query
var  executeQuery = function(res, query, parameters){             
     const poolx = new sql.ConnectionPool(dbConfig, function (err) {
         if (err) {   
                     console.log("Error while connecting database :- " + err);
                     res.send(err);
                  }
                  else {
                         // create Request object
                         var request = new sql.Request(poolx);
                         // query to the database
                         if (parameters.length < 1){
                            request.query(query, function (err, resp) {
                                if (err) {
                                           console.log("Error while querying database");
                                           //res.send(err);
                                         
                                          }
                                          else {
                                            res.send(resp);
                                           
                                                 }
                                    });

                         }
                         else{
                             for (j=0;j<parameters.length;j++){
                                 request.input(parameters[j].name,parameters[j].sqltype,parameters[j].value);   
                             }
                                request.query(query, function (err, resp) {
                                if (err) {
                                           console.log("Error while querying database");

                                          }
                                          else {
                                            res.json(resp);
                                           
                                                 }
                                    });
								
                             
                         }
                       }
      });           
}

// fully CORS enabled
app.get('/', function(req, res, next) {
  res.sendStatus(200);
});

app.post('/', function(req, res, next) {
  res.sendStatus(200);
});

app.post("/login", function(req , res){
   var user = req.body.user;
   var pw = req.body.pass;
   console.log(user);
   console.log(pw);
   var query = "select * from [ListedApp].[dbo].[Logins] where username=@USERNAME and password=@PASSWORD";
   var parameters = [
   {name: "USERNAME", sqltype: sql.VarChar, value: user},
   {name: "PASSWORD", sqltype: sql.VarChar, value: pw}];
   var request = new sql.Request();
   for (j=0;j<parameters.length;j++)
   {
    request.input(parameters[j].name,parameters[j].sqltype,parameters[j].value);                               
   }
   request.query(query)
		.then(function (data) {
			if (data.recordset.length > 0) {
				console.log("GOOD LOGIN.");
				// Create payload for JSON Web token, this will become encoded
				// In a production enviornment this API would need HTTPS, the encoding is simple base64
				const payload = {name:user,salt:salt};
				 var token = jwt.sign(payload, app.get('superSecret'),{expiresIn: 604800});
				 res.jsonp({
					 token: token
				 });
			}
			else{
				console.log("BAD LOGIN!!");
				res.sendStatus(401);
			}
		})
		.catch(function(err){console.log("ERR " + err);});
   
});


app.use(function(req,res,next){
var tokenx = req.body.token || req.query.token || req.headers['x-access-token'];
if (tokenx){
    jwt.verify(tokenx, app.get('superSecret'),function(err, decoded) {
        if (err){
            //console.log(err);ccc
                        return res.json({success: false, message: 'token auth error'});

        }else{
            req.decoded = decoded;
            next();
        }
    })
}else {
    return res.status(403).send({success: false, message: ' no token'});
}
});

app.post("/verify", function(req , res){
   var tokenx = req.body.token
  if (tokenx){
    jwt.verify(tokenx, app.get('superSecret'),function(err, decoded) {
        if (err){
            res.sendStatus(500);
			return;

        }else{
            res.sendStatus(200);
			return;
        }
    })
}else {
    res.sendStatus(500);
	return;

}
});

app.post("/loadpinboardlist", function(req , res){
   var userID = req.body.userID;
   var query = "select ID,pinboardName from [ListedApp].[dbo].[User_Pinboards] where userID=(SELECT ID from Logins Where username=@USERNAME)";
   var parameters = [{name: "USERNAME", sqltype: sql.VarChar, value: userID}];
   executeQuery(res,query,parameters); 
});

app.post("/loadpinboard", function(req , res){
   var pinboardID = req.body.pinboardID;
   var query = "select * from [ListedApp].[dbo].[ListPlusItems] where pinboardID=@PINBOARDID";
   var parameters = [{name: "PINBOARDID", sqltype: sql.VarChar, value: pinboardID}];
   executeQuery(res,query,parameters); 
});

app.post("/addList", function(req , res){
   var pinBoardID = req.body.pinboardID;
   var items = req.body.items;
   var username = req.body.username;
   var query = `insert into User_Lists 
   ([ID],
   [pinboardID]
      ,[userID]
      ,[creatorID]
      ,[listTitle]
      ,[isCheckable]
      ,[isNumbered]
      ,[isComplete]
      ,[dueDate]
      ,[createDate]) values ((SELECT MAX(ID)+1 from User_Lists Where userID=(SELECT ID FROM Logins Where username=@USERNAME)),@PINBOARDID,(SELECT ID FROM Logins Where username=@USERNAME),(SELECT ID FROM Logins Where username=@USERNAME),@TITLE,1,1,0,null,CURRENT_TIMESTAMP);`;
   var parameters = [
   {name: "PINBOARDID", sqltype: sql.VarChar, value: pinBoardID},
   {name: "USERNAME", sqltype: sql.VarChar, value: username},
   {name: "TITLE", sqltype: sql.VarChar, value: items[0]}];
   for (j=1;j<items.length;j++){
	   parameters.push({name: "ITEM"+j.toString(), sqltype: sql.VarChar, value: items[j]})
	   query+="INSERT Into User_Lists_Items ( [ListID],[itemText],[isComplete]) values ((SELECT MAX(ID) from User_Lists where userID=(SELECT ID FROM Logins Where username=@USERNAME)),@ITEM"+ j.toString() +",0);"
   }
   var request = new sql.Request();
   for (j=0;j<parameters.length;j++)
   {
    request.input(parameters[j].name,parameters[j].sqltype,parameters[j].value);                               
   }
   request.query(query);	
   
});

app.post("/makeCheckable", function(req , res){
   var listID = req.body.listID;
  
   var query = "UPDATE User_Lists set isCheckable=(SELECT ~isCheckable from User_Lists Where ID=@LISTID) where ID=@LISTID";
   var parameters = [
   {name: "LISTID", sqltype: sql.VarChar, value: listID}];
   var request = new sql.Request();
   for (j=0;j<parameters.length;j++)
   {
    request.input(parameters[j].name,parameters[j].sqltype,parameters[j].value);                               
   }
   request.query(query);	
   
});

app.post("/makeEnumerable", function(req , res){
   var listID = req.body.listID;
  
   var query = "UPDATE User_Lists set isNumbered=(SELECT ~isNumbered from User_Lists Where ID=@LISTID) where ID=@LISTID";
   var parameters = [
   {name: "LISTID", sqltype: sql.VarChar, value: listID}];
   var request = new sql.Request();
   for (j=0;j<parameters.length;j++)
   {
    request.input(parameters[j].name,parameters[j].sqltype,parameters[j].value);                               
   }
   request.query(query);	
   
});

app.post("/deleteList", function(req , res){
   var listID = req.body.listID;
  
   var query = "DELETE FROM User_Lists Where ID=@LISTID;Delete from User_Lists_Items where listID=@LISTID;";
   var parameters = [
   {name: "LISTID", sqltype: sql.VarChar, value: listID}];
   var request = new sql.Request();
   for (j=0;j<parameters.length;j++)
   {
    request.input(parameters[j].name,parameters[j].sqltype,parameters[j].value);                               
   }
   request.query(query);	
   
});

app.post("/addPinboard", function(req , res){
   var userID = req.body.userID;
   var title = req.body.title;
  
   var query = "Insert into User_Pinboards values((SELECT ID from Logins where username=@USERID),@TITLE)";
   var parameters = [
   {name: "USERID", sqltype: sql.VarChar, value: userID},
    {name: "TITLE", sqltype: sql.VarChar, value: title}];
   var request = new sql.Request();
   for (j=0;j<parameters.length;j++)
   {
    request.input(parameters[j].name,parameters[j].sqltype,parameters[j].value);                               
   }
   request.query(query);	
   
});

app.post("/markComplete", function(req , res){
   var ListItemID = req.body.listItemID;
  
   var query = "Update User_Lists_Items set isComplete = (SELECT ~isComplete from User_Lists_Items where ID =@LISTITEMID) where ID = @LISTITEMID";
   var parameters = [
   {name: "LISTITEMID", sqltype: sql.VarChar, value: ListItemID}];
   var request = new sql.Request();
   for (j=0;j<parameters.length;j++)
   {
    request.input(parameters[j].name,parameters[j].sqltype,parameters[j].value);                               
   }
   request.query(query);	
   
});