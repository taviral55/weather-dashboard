const secretKey = "dde09423cdf3a06c9d470dfd38e6f144";
const baseURL = `https://api.openweathermap.org/data/2.5/forecast?`;
var searchedHistory = JSON.parse(window.localStorage.getItem("weather-cities-list")) ?? [];
const searchedCities = ["Atlanta", "Denver", "Seattle", "San Francisco", "Orlando", "New york"];
const searchedCitiesContainer = document.querySelector(".searched-cities-container");
const searchInput = document.querySelector("#search-city-input");
const searchBtn = document.querySelector(".search-btn");
const currentWeatherContainer = document.querySelector(".today-weather");

searchBtn.addEventListener("click", () => {
    fetchWeatherInfo(searchInput.value);
    if (!searchedHistory.includes(searchInput.value.toLowerCase())) {
        console.log(searchedHistory.includes(searchInput.value));
        searchedHistory = [...searchedHistory, searchInput.value.toLowerCase()];
        window.localStorage.setItem("weather-cities-list", JSON.stringify(searchedHistory));
    }
});

const fetchWeatherInfo = async (value) => {
    const geoLoc = await getGeoLocationCoordinates(value);
    const { lat, lon } = geoLoc[0];
    const response = await fetch(baseURL + `lat=${lat}&lon=${lon}&appid=${secretKey}`);
    const data = await response.json();

    currentWeather(data);
    setFiveDaysForcast(data);
};
const setFiveDaysForcast = (currentWeather) => {
    const currentDate = new Date().getDate();
    const cardsContainer = document.querySelector(".five-days-weather-cards");
    cardsContainer.innerHTML = "";
    currentWeather.list.forEach((item) => {
        const date = item.dt_txt.split("-")[2].split(" ")[0];
        if (date !== currentDate && item.dt_txt.split(" ")[1].split(":")[0] === "00") {
            var forcastDate = document.createElement("p");
            var forcastIcon = document.createElement("img");
            var forcastTemp = document.createElement("p");
            var forcastWind = document.createElement("p");
            var forcastHumidity = document.createElement("p");
            var card = document.createElement("div");
            card.classList.add("weather-forcast-card");
            forcastDate.textContent = `${item.dt_txt.split(" ")[0]}`;
            forcastIcon.src = `http://openweathermap.org/img/w/${item.weather[0].icon}.png`;
            const tempInFahrenheit = (item.main.temp - 273.15) * 1.8 + 32;
            forcastTemp.textContent = `Temp: ${tempInFahrenheit.toPrecision(2)} °F`;
            forcastWind.textContent = `Wind: ${item.wind.speed} MPH`;
            forcastHumidity.textContent = `Humidity: ${item.main.humidity}`;
            card.appendChild(forcastDate);
            card.appendChild(forcastIcon);
            card.appendChild(forcastTemp);
            card.appendChild(forcastWind);
            card.appendChild(forcastHumidity);
            cardsContainer.appendChild(card);
        }
    });
    searchedCitiesContainer.innerHTML = "";
    renderSearchHistory();
};
const currentWeather = (data) => {
    const currentWeatherData = data.list[0];
    console.log(currentWeatherData);
    var currentWeatherHeader = document.querySelector(".place-name");
    var currentWeatherTemp = document.querySelector(".today-weather-temp");
    var currentWeatherWind = document.querySelector(".today-weather-wind");
    var currentWeatherHumidity = document.querySelector(".today-weather-humidity");
    currentWeatherHeader.textContent =
        data.city.name + " (" + currentWeatherData.dt_txt.split(" ")[0] + ")";
    const tempInFahrenheit = (currentWeatherData.main.temp - 273.15) * 1.8 + 32;
    currentWeatherTemp.textContent = `Temp: ${tempInFahrenheit.toPrecision(2)} °F`;
    currentWeatherWind.textContent = `Wind: ${currentWeatherData.wind.speed} MPH`;
    currentWeatherHumidity.textContent = `Humidity: ${currentWeatherData.main.humidity} %`;
    currentWeatherContainer.appendChild(currentWeatherHeader);
    currentWeatherContainer.appendChild(currentWeatherTemp);
    currentWeatherContainer.appendChild(currentWeatherWind);
    currentWeatherContainer.appendChild(currentWeatherHumidity);
};

const getGeoLocationCoordinates = async (location) => {
    const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${secretKey}`
    );
    const data = await response.json();
    return data;
};

const renderSearchHistory = () => {
    searchedHistory.forEach((city) => {
        var btn = document.createElement("button");
        btn.addEventListener("click", () => {
            fetchWeatherInfo(city);
        });
        btn.textContent = city;
        searchedCitiesContainer.appendChild(btn);
    });
};

renderSearchHistory();
fetchWeatherInfo('usa');