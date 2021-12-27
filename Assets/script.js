function pageInitial() {
    let cityElement = document.getElementById("enter-city");
    let buttonElement = document.getElementById("search-button");
    let clearEl = document.getElementById("clear-history");
    let nameEl = document.getElementById("city-name");
    let presentPicElement = document.getElementById("present-pic");
    let currentTempEl = document.getElementById("temperature");
    let currentHumidityEl = document.getElementById("humidity");
    let currentWindEl = document.getElementById("wind-speed");
    let currentUVEl = document.getElementById("UV-index");
    let historyEl = document.getElementById("history");
    var fivedayEl = document.getElementById("fiveday-header");
    var todayweatherEl = document.getElementById("today-weather");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

    // Assigned a unique API to the variable key4API
    let key4API = "84b79da5e5d7c92085660485702f4ce8";

    function searchWeather(nameOfCity) {
        // Execute a current weather get request from open weather api
        let request4URL = "https://api.openweathermap.org/data/2.5/weather?q=" + nameOfCity + "&appid=" + key4API;
        axios.get(request4URL)
            .then(function (répondre) {

                todayweatherEl.classList.remove("d-none");

                // Parse répondre to show current weather
                let presentDate = new Date(répondre.data.dt * 1000);
                let day = presentDate.getDate();
                let month = presentDate.getMonth() + 1;
                let year = presentDate.getFullYear();
                nameEl.innerHTML = répondre.data.name + " (" + month + "/" + day + "/" + year + ") ";
                let weatherImage = répondre.data.weather[0].icon;
                presentPicElement.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherImage + "@2x.png");
                presentPicElement.setAttribute("alt", répondre.data.weather[0].description);
                currentTempEl.innerHTML = "Temperature: " + k2f(répondre.data.main.temp) + " &#176F";
                currentHumidityEl.innerHTML = "Humidity: " + répondre.data.main.humidity + "%";
                currentWindEl.innerHTML = "Wind Speed: " + répondre.data.wind.speed + " MPH";
                
                // UV Index
                let lat = répondre.data.coord.lat;
                let lon = répondre.data.coord.lon;
                let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + key4API + "&cnt=1";
                axios.get(UVQueryURL)
                    .then(function (répondre) {
                        let index4UV = document.createElement("span");
                        
                        // When UV Index is good, shows green, when ok shows yellow, when bad shows red
                        if (répondre.data[0].value < 4 ) {
                            index4UV.setAttribute("class", "badge badge-success");
                        }
                        else if (répondre.data[0].value < 8) {
                            index4UV.setAttribute("class", "badge badge-warning");
                        }
                        else {
                            index4UV.setAttribute("class", "badge badge-danger");
                        }
                        console.log(répondre.data[0].value)
                        index4UV.innerHTML = répondre.data[0].value;
                        currentUVEl.innerHTML = "UV Index: ";
                        currentUVEl.append(index4UV);
                    });
                
                // Get 5 day forecast for the picked city
                let nameOfCity = répondre.data.id;
                let URL4Forecast = "https://api.openweathermap.org/data/2.5/forecast?id=" + nameOfCity + "&appid=" + key4API;
                axios.get(URL4Forecast)
                    .then(function (répondre) {
                        fivedayEl.classList.remove("d-none");
                        
                        //  Parse répondre to show forecast for next 5 days
                        let element4Forecast = document.querySelectorAll(".forecast");
                        for (i = 0; i < element4Forecast.length; i++) {
                            element4Forecast[i].innerHTML = "";
                            let forecastIndex = i * 8 + 4;
                            let dateOfForecast = new Date(répondre.data.list[forecastIndex].dt * 1000);
                            let forecastDay = dateOfForecast.getDate();
                            let forecastMonth = dateOfForecast.getMonth() + 1;
                            let forecastYear = dateOfForecast.getFullYear();
                            let forecastDateEl = document.createElement("p");
                            forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                            forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                            element4Forecast[i].append(forecastDateEl);

                            // Set the varibale for the Icon of the current weather
                            let forecastWeatherEl = document.createElement("img");
                            weatherForecastElement.setAttribute("src", "https://openweathermap.org/img/wn/" + répondre.data.list[forecastIndex].weather[0].icon + "@2x.png");
                            weatherForecastElement.setAttribute("alt", répondre.data.list[forecastIndex].weather[0].description);
                            element4Forecast[i].append(weatherForecastElement);
                            let tempeForecastElement = document.createElement("p");
                            tempeForecastElement.innerHTML = "Temp: " + k2f(répondre.data.list[forecastIndex].main.temp) + " &#176F";
                            element4Forecast[i].append(tempeForecastElement);
                            let humidityForecastElement = document.createElement("p");
                            humidityForecastElement.innerHTML = "Humidity: " + répondre.data.list[forecastIndex].main.humidity + "%";
                            element4Forecast[i].append(humidityForecastElement);
                        }
                    })
            });
    }

    // Get history from local storage
    buttonElement.addEventListener("click", function () {
        let searchWord = cityElement.value;
        searchWeather(searchWord);
        searchHistory.push(searchWord);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        searchHistory();
    })

    // Then Clear History button
    clearEl.addEventListener("click", function () {
        localStorage.clear();
        searchHistory = [];
        searchHistory();
    })

    function k2f(K) {
        return Math.floor((K - 273.15) * 1.8 + 32);
    }

    function searchHistory() {
        historyEl.innerHTML = "";
        for (let i = 0; i < searchHistory.length; i++) {
            let historyWordItem = document.createElement("input");
            historyWordItem.setAttribute("type", "text");
            historyWordItem.setAttribute("readonly", true);
            historyWordItem.setAttribute("class", "form-control d-block bg-white");
            historyWordItem.setAttribute("value", searchHistory[i]);
            historyWordItem.addEventListener("click", function () {
                searchWeather(historyWordItem.value);
            })
            historyEl.append(historyWordItem);
        }
    }

    searchHistory();
    if (searchHistory.length > 0) {
        searchWeather(searchHistory[searchHistory.length - 1]);
    }
    
}

pageInitial();
