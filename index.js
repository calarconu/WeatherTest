var appState = mobx.observable({
	weather: {
				hora: "",
				temperatura: "",
				srcimg: "default",
				iconsrc: "defaultIcon.gif"
			}
});

mobx.autorun(() => {
	document.getElementById("time_hour").innerHTML = appState.weather.hora;
	document.getElementById("temperature").innerHTML = appState.weather.temperatura;
	document.getElementById("img-icon").src = "components/img/"+appState.weather.iconsrc;
	document.getElementById("blur").style.backgroundImage = "url('components/img/"+appState.weather.srcimg+".jpg')";
	
});

getApiRequest('santiago');

function getApiRequest(cityName){
	document.getElementById("modalLoading").classList.add("show");
	var nameOfCity = {cityName:cityName};
	$.post("/getData", nameOfCity, function(response) {
		response = JSON.parse(response.body);
		
		var offset = response.offset;
		
		var date = new Date((response.currently.time + (offset*3600))*1000);
		var hours = date.getUTCHours();
		var minutes = date.getUTCMinutes();
		
		var hourMins = (hours) + ":" + minutes;
		console.log(offset*3600, response.currently.time*1000);
		
		
		appState.weather.temperatura = parseInt(response.currently.temperature) + "°";
		appState.weather.hora = hourMins;
		appState.weather.iconsrc = response.currently.icon+".svg";
		appState.weather.srcimg = cityName;
		
		document.getElementById("modalLoading").classList.remove("show");
	});
}