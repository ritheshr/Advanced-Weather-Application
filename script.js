const API_KEY = "c8c1ecd139e6a0bc0718719f397aea1c"; // Replace with your OpenWeatherMap API Key

// Fetch Weather for a Given City
async function getWeather() {
    const city = document.getElementById("city").value;
    if (city === "") {
        alert("Please enter a city name!");
        return;
    }
    fetchWeatherData(city);
}

// Fetch Weather Using Geolocation
function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByCoords(lat, lon);
        }, () => {
            alert("Location access denied!");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Fetch Weather Data by City Name
async function fetchWeatherData(city) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c8c1ecd139e6a0bc0718719f397aea1c&units=metric`
    );
    const data = await response.json();

    if (data.cod === "404") {
        alert("City not found!");
        return;
    }

    updateWeatherUI(data);
    updateBackground(data);
    getForecast(city);
}

// Fetch Weather Data by Coordinates
async function fetchWeatherByCoords(lat, lon) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=c8c1ecd139e6a0bc0718719f397aea1c&units=metric`
    );
    const data = await response.json();
    updateWeatherUI(data);
    updateBackground(data);
    getForecast(data.name);
}

// Update the weather UI with the weather description
function updateWeatherUI(data) {
    document.getElementById("city-name").innerText = data.name;
    document.getElementById("temperature").innerText = `Temperature: ${data.main.temp}°C`;
    document.getElementById("description").innerText = data.weather[0].description;
    document.getElementById("humidity").innerText = `Humidity: ${data.main.humidity}%`;
    document.getElementById("wind").innerText = `Wind Speed: ${data.wind.speed} km/h`;

    const iconCode = data.weather[0].icon;
    document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// Update the background image using an <img> tag
function updateBackground(data) {
    const currentTime = new Date().getHours(); // Get current hour
    const sunrise = new Date(data.sys.sunrise * 1000).getHours(); // Convert sunrise time to hours
    const sunset = new Date(data.sys.sunset * 1000).getHours(); // Convert sunset time to hours

    let backgroundImage = '';

    // Debug: Log current time, sunrise, and sunset
    console.log(`Current Time: ${currentTime}, Sunrise: ${sunrise}, Sunset: ${sunset}`);

    // Determine if it's day or night
    if (currentTime >= sunrise && currentTime <= sunset) {
        // Daytime
        backgroundImage = '/images/daytime-background.jpg'; // Replace with your actual path
    } else {
        // Nighttime
        backgroundImage = '/images/nighttime-background.jpg'; // Replace with your actual path
    }

    // Change background image based on weather conditions
    if (data.weather[0].main === "Rain") {
        backgroundImage = '/images/rainy.jpg'; // Replace with your actual path
    } else if (data.weather[0].main === "Snow") {
        backgroundImage = '/images/snowy.jpg'; // Replace with your actual path
    } else if (data.weather[0].main === "Clouds") {
        backgroundImage = '/images/dark img.jpg'; // Replace with your actual path
    } else if (data.weather[0].main === "Mist") {
        backgroundImage = '/images/mist.jpg'; // Replace with your actual path
    } else if (data.weather[0].main === "Mist") {
        backgroundImage = '/images/mist.jpg';
    }
    else if (data.weather[0].main === "Clear") {
        backgroundImage = currentTime >= sunrise && currentTime <= sunset ? 
                           '/images/newday.jpg' : 
                           '/images/night.jpg';
    }

    // Debug: Log the selected background image path
    console.log(`Selected Background Image: ${backgroundImage}`);

    // Set the src of the background image
    const backgroundImageElement = document.getElementById("background-image");
    if (backgroundImageElement) {
        backgroundImageElement.src = backgroundImage;
    } else {
        console.error("Background image element not found!");
    }
}

// Fetch 5-Day Forecast
async function getForecast(city) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=c8c1ecd139e6a0bc0718719f397aea1c&units=metric`
    );
    const data = await response.json();

    const forecastContainer = document.getElementById("forecast-container");
    forecastContainer.innerHTML = "";

    for (let i = 0; i < data.list.length; i += 8) {
        const day = data.list[i];
        const forecastElement = document.createElement("div");
        forecastElement.classList.add("forecast-day");
        forecastElement.innerHTML = `
            <p>${new Date(day.dt_txt).toDateString()}</p>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="Weather Icon">
            <p>${day.main.temp}°C</p>
        `;
        forecastContainer.appendChild(forecastElement);
    }
}
