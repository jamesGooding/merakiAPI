var listenport = 9201;   										//TCP listening port
var secret = "FISH";											//Secret that you chose in the Meraki dashboard
var validator = "bf9909702b869223b768b71ff5bc7e9bb5624393";		//Validator string that is shown in the Meraki dashboard


var express = require('express');
var app = express();

app.use(express.bodyParser());

app.get('/meraki', function(req, res){
  res.send(validator);
  console.log("sending validation")
});


app.post('/meraki', function(req, res){ 
	try {
	  var jsoned = JSON.parse(req.body.data);
	  if (jsoned.secret == secret) {
		  for (i=0; i<jsoned.probing.length; i++) {
			  console.log("client " + jsoned.probing[i].client_mac + " seen on ap " + jsoned.probing[i].ap_mac + " with rssi " + jsoned.probing[i].rssi + " at " + jsoned.probing[i].last_seen);
		  }
	   } else {
		   console.log("invalid secret from  " + req.connection.remoteAddress);
	   }
	} catch (e) {
		// An error has occured, handle it, by e.g. logging it
  	console.log("Error.  Likely caused by an invalid POST from " + req.connection.remoteAddress + ":");
  	console.log(e);
  	res.end();
  }
  
});

app.listen(listenport);
console.log("Meraki presence API receiver listening on port " + listenport);
