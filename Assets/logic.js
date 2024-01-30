$(document).ready(function () {
    // API key
    var APIKey = "68d8ae14240405aabf44b39f20638690";

    // Function to update and retrieve search history using Local Storage
    function updateSearchHistory(city) {
        var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        // Check if the city is already in the search history
        if (!searchHistory.includes(city)) {
            // Add the current city to the beginning of the search history array
            searchHistory.unshift(city);
        }
        searchHistory = searchHistory.slice(0, 8);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

        // Update the search history display on the website
        var historyContainer = $('#history');
        historyContainer.empty();
        searchHistory.forEach(function (search) {
            // Create a button element for each search history item
            var historyItem = $('<button class="btn btn-secondary m-1 history-item">');
            historyItem.text(search);
            historyItem.on('click', function () {
                updateWeather(search);
            });
            historyContainer.append(historyItem);
        });
    }
    // Function to convert temperature from Kelvin to Celsius
    function kelvinToCelsius(temperatureKelvin) {
        return (temperatureKelvin - 273.15).toFixed(2);
    }
    // Function to update weather based on user input
    function updateWeather(city) {
        var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

        // Fetch the current weather data
        fetch(currentWeatherURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (currentData) {

                // Extract information about the current weather
                var currentDate = new Date(currentData.dt * 1000);
                var cityName = currentData.name;
                var temperatureCelsiusCurrent = kelvinToCelsius(currentData.main.temp);
                var humidity = currentData.main.humidity;
                var windSpeed = currentData.wind.speed;
                var weatherIcon = currentData.weather[0].icon;

                // Clear the existing content before the new data
                $('#today').empty();

                // Log the additional information
                var targetDiv = $('#today');

                var cardDiv = $('<div class="card">');
                targetDiv.append(cardDiv);

                var heading = $('<h4 class="card-title p-2 font-weight-bold" id="heading">');
                heading.text(cityName + ' (' + currentDate.toLocaleDateString() + ') ');

                var weatherIconElement = $('<img class="weather-icon" id="icon">');
                // URL is dynamically constructed based on the weather icon code
                weatherIconElement.attr('src', 'https://openweathermap.org/img/w/' + weatherIcon + '.png');
                heading.append(weatherIconElement);

                var currentTemp = $('<p class="card-text p-2" id="currentTemp">');
                currentTemp.text('Temp: ' + temperatureCelsiusCurrent + ' °C');

                var currentWind = $('<p class="card-text p-2" id="currentWind">');
                currentWind.text('Wind Speed: ' + windSpeed + ' KPH');

                var currentHumidity = $('<p class="card-text p-2" id="currentHumidity">');
                currentHumidity.text('Humidity: ' + humidity + ' %');

                cardDiv.append(heading, currentTemp, currentWind, currentHumidity);

                // Update and retrieve search history using Local Storage
                updateSearchHistory(city);

                // Extract latitude and longitude for the forecast
                var lat = currentData.coord.lat;
                var lon = currentData.coord.lon;
                var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

                // Fetch the 5-day forecast data
                fetch(fiveDayURL)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (forecastData) {

                        // Extract detailed information for each day
                        var dailyInfo = [];
                        for (var i = 0; i < forecastData.list.length; i += 8) {
                            var date = new Date(forecastData.list[i].dt * 1000);
                            var temperatureCelsiusDaily = kelvinToCelsius(forecastData.list[i].main.temp);
                            var humidity = forecastData.list[i].main.humidity;
                            var windSpeed = forecastData.list[i].wind.speed;
                            var weatherIcon = forecastData.list[i].weather[0].icon;

                            dailyInfo.push({
                                date: date.toLocaleDateString(),
                                temperatureCelsius: temperatureCelsiusDaily,
                                humidity: humidity,
                                windSpeed: windSpeed,
                                weatherIcon: weatherIcon
                            });
                        }

                        // Log the collected daily information
                        console.log(dailyInfo);
                        $('#forecast').empty();

                        // Display daily information on the website
                        var forecastContainer = $('#forecast');

                        dailyInfo.forEach(function (dayInfo) {
                            var dayContainer = $('<div class="day-container card col-lg-2 text-white m-1">');

                            var dateElement = $('<p class="date">');
                            dateElement.text(dayInfo.date);

                            var weatherIconElement = $('<img class="weather-icon" id="icon">');
                            weatherIconElement.attr('src', 'https://openweathermap.org/img/w/' + dayInfo.weatherIcon + '.png');

                            var temperatureElement = $('<p class="temperature">');
                            temperatureElement.text('Temp: ' + dayInfo.temperatureCelsius + ' °C');

                            var windSpeedElement = $('<p class="wind-speed">');
                            windSpeedElement.text('Wind: ' + dayInfo.windSpeed + ' KPH');

                            var humidityElement = $('<p class="humidity">');
                            humidityElement.text('Humidity: ' + dayInfo.humidity + ' %');

                            dayContainer.append(dateElement, weatherIconElement, temperatureElement, windSpeedElement, humidityElement);
                            forecastContainer.append(dayContainer);
                        });
                    });
            });
    }

    // Event listener for the search button
    $('#search-button').on('click', function (event) {
        event.preventDefault();
        var city = $('#search-input').val();
        updateWeather(city);
    });

    // Initial weather update with the default city (London)
    updateWeather('London');
});