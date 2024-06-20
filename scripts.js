$(document).ready(function () {
    var omdbApiUrl = "http://www.omdbapi.com/";
    var omdbApiKey = "9c847659";
    var weatherApiUrl = "http://api.weatherapi.com/v1/current.json?q=toronto&key=a64c846ff2c24f0dad0201620242006";
    var jokeApiUrl = "https://official-joke-api.appspot.com/jokes/random";

    // Function to fetch movies based on year
    function fetchMovies(year) {
        var movieList = $('#movie-list');
        movieList.empty();

        // Since OMDB API doesn't support direct year search, we use a common title part and filter results
        var commonTitle = "Oscar"; // This is just an example, adjust accordingly
        $.ajax({
            url: omdbApiUrl,
            method: 'GET',
            dataType: 'json',
            data: {
                apikey: omdbApiKey,
                s: commonTitle,
                y: year,
                type: 'movie'
            },
            success: function (data) {
                console.log(data); // Debug: log the response to check the structure
                if (data.Search && data.Search.length > 0) {
                    $.each(data.Search, function (index, movie) {
                        console.log(movie); // Debug: log each movie object
                        var posterURL = movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/150'; // Use a placeholder image if posterURL is missing
                        var movieItem = `<div class="col-md-3 movie-poster">
                                            <img src="${posterURL}" alt="${movie.Title}">
                                            <p>${movie.Title} (${movie.Year})</p>
                                        </div>`;
                        movieList.append(movieItem);
                    });
                } else {
                    movieList.html('<p>No movies found for the year ' + year + '</p>'); // Show a message if no movies are found
                }
            },
            error: function (xhr, status, error) {
                console.error('Error fetching movies:', error);
                $('#movie-list').html('<p>Error fetching movies</p>'); // Show error message
            }
        });
    }

    // Fetch weather
    $.get(weatherApiUrl, function (data) {
        var weather = $('#weather');
        weather.html(`Temperature: ${data.current.temp_c}°C <br> Weather: ${data.current.condition.text}`);
    }).fail(function (xhr, status, error) {
        console.error('Error fetching weather:', error);
        $('#weather').html('<p>Error fetching weather</p>'); // Show error message
    });

    // Fetch joke
    $.get(jokeApiUrl, function (data) {
        var joke = $('#joke');
        joke.html(`${data.setup} - ${data.punchline}`);
    }).fail(function (xhr, status, error) {
        console.error('Error fetching joke:', error);
        $('#joke').html('<p>Error fetching joke</p>'); // Show error message
    });

    // Event listener for search button
    $('#searchButton').click(function () {
        var year = $('#yearInput').val();
        if (year) {
            fetchMovies(year);
        } else {
            alert('Please enter a year.');
        }
    });
});
