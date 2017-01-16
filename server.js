var express	= require("express"),
	request	= require("request"),
	bodyParser = require('body-parser'),
	app = express();
	
if (process.env.REDISTOGO_URL) {
	var rtg   = require("url").parse(process.env.REDISTOGO_URL);
	var client = require("redis").createClient(rtg.port, rtg.hostname);

	client.auth(rtg.auth.split(":")[1]);
} else {
    var client = require("redis").createClient();
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.set('port', process.env.PORT || 8000);

var server = app.listen(app.get('port'), function(){
	console.log('app started at port: '+app.get('port'));
});

client.set("santiago", "-33.4724228,-70.7699159");
client.set("zurich", "47.3773697,8.3966319");
client.set("auckland", "-36.8621448,174.5852842");
client.set("sydney", "-33.8474027,150.6517762");
client.set("londres", "51.5287718,-0.2416819");
client.set("georgia", "42.302985,41.1280837");

app.post('/getData', function (req, res) {
	res.setHeader('Content-Type', 'application/json');
	
	client.get(req.body.cityName, function(err, retry) {
		// reply is null when the key is missing
		getApiRequest(retry);
	});
	
	function getApiRequest(latLon){
		request.get("https://api.darksky.net/forecast/2cef172cfbbfb8ed99296f35b66379fd/"+latLon+"?units=si", function (error, response, body) {
			if (Math.random(0, 1) < 0.1){
				client.hset(new Date().getTime(), "api.errors", "How unfortunate! The API Request Failed");
				//throw new Error('How unfortunate! The API Request Failed');
				getApiRequest(latLon);
			}else{
				res.send(response);
			}
		});
	}
	
});