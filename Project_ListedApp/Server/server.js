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