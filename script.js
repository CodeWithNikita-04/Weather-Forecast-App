// Weather App JavaScript

const API_KEY = "c9f9b83ac0aa4341c02cba28c18cdd53";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// getting html elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const errorMsg = document.getElementById("errorMsg");
const errorText = document.getElementById("errorText");

const weatherCard = document.getElementById("weatherCard");
const loadingState = document.getElementById("loadingState");
const defaultState = document.getElementById("defaultState");

const celsiusBtn = document.getElementById("celsiusBtn");
const fahrenheitBtn = document.getElementById("fahrenheitBtn");

const cityNameEl = document.getElementById("cityName");
const countryEl = document.getElementById("countryCode");
const dateTimeEl = document.getElementById("dateTime");

const weatherIconEl = document.getElementById("weatherIcon");
const weatherDescEl = document.getElementById("weatherDesc");

const temperatureEl = document.getElementById("temperature");
const feelsLikeEl = document.getElementById("feelsLike");
const humidityEl = document.getElementById("humidity");
const windSpeedEl = document.getElementById("windSpeed");
const visibilityEl = document.getElementById("visibility");
const sunriseEl = document.getElementById("sunrise");
const sunsetEl = document.getElementById("sunset");

const pressureValEl = document.getElementById("pressureVal");
const pressureBar = document.getElementById("pressureBar");

// variables to save temperature
let currentTempC = null;
let currentFeelsLikeC = null;
let isCelsius = true;

// search button click
searchBtn.addEventListener("click", function () {
  searchWeather();
});

// enter key search
cityInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchWeather();
  }
});

// celsius button
celsiusBtn.addEventListener("click", function () {
  isCelsius = true;

  celsiusBtn.classList.add("active");
  fahrenheitBtn.classList.remove("active");

  updateTemperature();
});

// fahrenheit button
fahrenheitBtn.addEventListener("click", function () {
  isCelsius = false;

  fahrenheitBtn.classList.add("active");
  celsiusBtn.classList.remove("active");

  updateTemperature();
});

// main search function
function searchWeather() {
  const city = cityInput.value.trim();

  if (city === "") {
    showError("Please enter a city name.");
    return;
  }

  getWeather(city);
}

// api function
async function getWeather(city) {
  showLoading(true);
  hideError();

  try {
    const url = BASE_URL + "?q=" + encodeURIComponent(city) + "&appid=" + API_KEY + "&units=metric";

    const response = await fetch(url);

    if (response.status === 404) {
      throw new Error("City not found. Please check the spelling.");
    }

    if (response.status === 401) {
      throw new Error("API key problem. Please check your API key.");
    }

    if (!response.ok) {
      throw new Error("Something went wrong. Try again.");
    }

    const data = await response.json();
    showWeather(data);

  } catch (error) {
    showError(error.message);
    weatherCard.hidden = true;
    defaultState.hidden = true;
  }

  showLoading(false);
}

// display weather data
function showWeather(data) {
  const cityName = data.name;
  const country = data.sys.country;

  const description = data.weather[0].description;
  const icon = data.weather[0].icon;

  const temp = data.main.temp;
  const feelsLike = data.main.feels_like;
  const humidity = data.main.humidity;
  const pressure = data.main.pressure;

  const windSpeed = data.wind.speed;
  const visibility = data.visibility;

  const sunrise = data.sys.sunrise;
  const sunset = data.sys.sunset;
  const timezone = data.timezone;

  currentTempC = temp;
  currentFeelsLikeC = feelsLike;

  cityNameEl.textContent = cityName;
  countryEl.textContent = country;
  dateTimeEl.textContent = getLocalTime(timezone);

  weatherIconEl.src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
  weatherIconEl.alt = description;
  weatherDescEl.textContent = description;

  humidityEl.textContent = humidity + "%";
  windSpeedEl.textContent = (windSpeed * 3.6).toFixed(1) + " km/h";

  if (visibility) {
    visibilityEl.textContent = (visibility / 1000).toFixed(1) + " km";
  } else {
    visibilityEl.textContent = "N/A";
  }

  sunriseEl.textContent = getTimeFromUnix(sunrise, timezone);
  sunsetEl.textContent = getTimeFromUnix(sunset, timezone);

  pressureValEl.textContent = pressure + " hPa";

  let pressurePercent = ((pressure - 950) / 100) * 100;

  if (pressurePercent < 0) {
    pressurePercent = 0;
  }

  if (pressurePercent > 100) {
    pressurePercent = 100;
  }

  pressureBar.style.width = pressurePercent + "%";

  updateTemperature();

  defaultState.hidden = true;
  weatherCard.hidden = false;
}

// update celsius and fahrenheit
function updateTemperature() {
  if (currentTempC === null || currentFeelsLikeC === null) {
    return;
  }

  if (isCelsius) {
    temperatureEl.textContent = Math.round(currentTempC) + "°";
    feelsLikeEl.textContent = Math.round(currentFeelsLikeC) + "°C";
  } else {
    temperatureEl.textContent = Math.round((currentTempC * 9) / 5 + 32) + "°";
    feelsLikeEl.textContent = Math.round((currentFeelsLikeC * 9) / 5 + 32) + "°F";
  }
}

// local date and time
function getLocalTime(timezone) {
  const now = new Date();

  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  const cityTime = new Date(utcTime + timezone * 1000);

  return cityTime.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

// sunrise and sunset time
function getTimeFromUnix(unixTime, timezone) {
  const utcTime = unixTime * 1000;
  const localTime = new Date(utcTime + new Date().getTimezoneOffset() * 60000 + timezone * 1000);

  return localTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

// show loading
function showLoading(value) {
  loadingState.hidden = !value;

  if (value) {
    weatherCard.hidden = true;
    defaultState.hidden = true;
  }
}

// show error
function showError(message) {
  errorText.textContent = message;
  errorMsg.hidden = false;
}

// hide error
function hideError() {
  errorMsg.hidden = true;
}
