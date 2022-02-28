// DOM Global VARs
var citySearchEl = document.querySelector("#city-search-form");
var cityInfoEl = document.querySelector("#city");
var weatherContainerEl = document.querySelector("#weather-container");
var citySearchInputEl = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#fiveday-container");
var pastSearchButtonEl = document.querySelector("#pastSearch-buttons");

var CityArray = [];

// To get city information from weather form
var formSubmitHandler = function (event) {
    event.preventDefault();
    var city = cityInfoEl.value.trim();
    if (city) {
        getCityWeather(city);
        get5Day(city);
        CityArray.unshift({ city });
        cityInfoEl.value = "";
    } else {
        alert("Please enter a City");
    }
    saveSearch();
    pastSearch(city);
};

// To save search to local storage
var saveSearch = function () {
    localStorage.setItem("CityArray", JSON.stringify(CityArray));
};

// To get the city weather from OpenWeather One Call API
var getCityWeather = function (city) {
    var apiKey = "077b95b0a626d04f19bb53c1b07c4515";
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiURL).then(function (response) {
        response.json().then(function (data) {
            displayWeather(data, city);
        });
    });
};

// To display the weather in the current weather container
var displayWeather = function (weather, searchCity) {
    // To delete old content
    weatherContainerEl.textContent = "";
    citySearchInputEl.textContent = searchCity;

    // To create date element
    var currentDate = document.createElement("span");
    currentDate.textContent =" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
    citySearchInputEl.appendChild(currentDate);

    // To create an image element
    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute( "src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    citySearchInputEl.appendChild(weatherIcon);

    // To create a span element to hold temperature data
    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
    temperatureEl.classList = "list-group-item";

    // To create a span element to hold Humidity data
    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "list-group-item";

    // To create a span element to hold Wind data
    var windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windSpeedEl.classList = "list-group-item";

    // To append to container
    weatherContainerEl.appendChild(temperatureEl);
    weatherContainerEl.appendChild(humidityEl);
    weatherContainerEl.appendChild(windSpeedEl);

    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    getUvIndex(lat, lon);
};

var getUvIndex = function(lat,lon){
    var apiKey = "077b95b0a626d04f19bb53c1b07c4515"
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayUvIndex(data)

        });
    });
};

// To display the UV index for current weather
var displayUvIndex = function(index){
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if(index.value <=2){
        uvIndexValue.classList = "favorable"
    }else if(index.value >2 && index.value<=8){
        uvIndexValue.classList = "moderate "
    }
    else if(index.value >8){
        uvIndexValue.classList = "severe"
    };

    // To append to elements
    uvIndexEl.appendChild(uvIndexValue);
    weatherContainerEl.appendChild(uvIndexEl);
};

// Section for 5-Day weather
var get5Day = function (city) {
    var apiKey = "077b95b0a626d04f19bb53c1b07c4515";
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiURL).then(function (response) {
        response.json().then(function (data) {
            display5Day(data);
        });
    });
};

// To display the five day weather section
var display5Day = function (weather) {
    forecastContainerEl.textContent = "";
    forecastTitle.textContent = "5-Day Forecast:";

    var forecast = weather.list;
    for (var i = 5; i < forecast.length; i = i + 8) {
        var dailyForecast = forecast[i];

        var forecastEl = document.createElement("div");
        forecastEl.classList = "card bg-info text-light m-2";

        // To create date element
        var forecastDate = document.createElement("h5");
        forecastDate.textContent = moment
            .unix(dailyForecast.dt)
            .format("MMM D, YYYY");
        forecastDate.classList = "card-header text-center";
        forecastEl.appendChild(forecastDate);

        // To create an image element
        var weatherIcon = document.createElement("img");
        weatherIcon.classList = "card-body text-center";
        weatherIcon.setAttribute(
            "src",
            `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`
        );
        forecastEl.appendChild(weatherIcon);

        // To create temperature span
        var forecastTempEl = document.createElement("span");
        forecastTempEl.classList = "card-body text-center";
        forecastTempEl.textContent = "Temperature: " + dailyForecast.main.temp + " °F";
        forecastEl.appendChild(forecastTempEl);
        
        // To create wind span
        var forecastWindEl = document.createElement("span");
        forecastWindEl.classList = "card-body text-center";
        forecastWindEl.textContent = "Wind: " + dailyForecast.wind.speed + " MPH";
        forecastEl.appendChild(forecastWindEl);
        
        // To create humidity span
        var forecastHumEl = document.createElement("span");
        forecastHumEl.classList = "card-body text-center";
        forecastHumEl.textContent = "Humidity: " + dailyForecast.main.humidity + "  %";

        // To append to forecast card
        forecastEl.appendChild(forecastHumEl);
        forecastContainerEl.appendChild(forecastEl);
    }
};

// To display the past searched CityArray
var pastSearch = function(pastSearch){

    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
    pastSearchEl.setAttribute("data-city",pastSearch)
    pastSearchEl.setAttribute("type", "submit");

    pastSearchButtonEl.prepend(pastSearchEl);
};

var pastSearchHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        get5Day(city);
    }
};


// Event Listeners with Submit & Click
citySearchEl.addEventListener("submit", formSubmitHandler);
pastSearchButtonEl.addEventListener("click", pastSearchHandler);