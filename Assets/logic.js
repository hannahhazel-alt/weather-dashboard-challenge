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