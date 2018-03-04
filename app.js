var http = require('http');
var requestRatpApi = require('request');
var apiai = require('apiai');

var schedules = [];
var requestNb = 0;

var server = http.createServer((request, response) => {
	requestNb++;
	if(requestNb <= 1) {
		response.writeHead(200, {'Content-Type': 'text/plain'});

		// use client access token to connect to dialogFlow my-next-metro agent
		var app = apiai("e0fcc0cd612e492ca9db0d1110e13487");
		var dialogFlowTextRequest = 'Prochain métro ligne 9 arrêt Bonne Nouvelle direction Montreuil';
		
		requestDialogFlowAndSchedules(app, dialogFlowTextRequest, requestSchedules);
		
		response.end('hello world');
	}
});
server.listen(8000);

function requestDialogFlowAndSchedules(app, textRequest, callbackSchedules) {
	var requestApiAi = app.textRequest(textRequest, {
	    sessionId: 'my_unique_session_id_1'
	});

	var metro = '';
	var station = '';
	var destination = '';
	requestApiAi.on('response', function(response) {
		var parameters = response.result.parameters;
	    if(isEmpty(parameters)) {
	    	console.log('error : no parameters detected');
		} else {
			metro = parameters.metros;
		    station = parameters.stations;
		    destination = parameters.destinations;
		    if(metro.length > 0 && station.length > 0 && destination.length > 0) {
		    	var url = 'https://api-ratp.pierre-grimaud.fr/v3/schedules/metros/'+metro+'/'+station+'/'+destination;
		    	callbackSchedules(url);
		    } else {
		    	if(metro.length == 0) {
		    		console.log('error : no metro detected in your request');
		    	}
		    	if(station.length == 0) {
		    		console.log('error : no station detected in your request');
		    	}
		    	if(destination.length == 0) {
		    		console.log('error : no destination detected in you request');
		    	}
		    }
		}
	});

	requestApiAi.on('error', function(error) {
	    console.log(error);
	});

	requestApiAi.end();
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function requestSchedules(url) {

	requestRatpApi(url, { json: true }, (err, res, body) => {
		var result = body.result;
		
		if (err) { 
			return console.log(err); 
		}

		if(result.code) {
			console.log(result.message);
		} else {
			schedules = result.schedules;
			if(schedules.length > 0) {
				schedules.forEach(function(elt) {
			    	console.log('direction '+elt.destination+' prochain métro dans '+elt.message);
			    });
			}
		}
	});
}