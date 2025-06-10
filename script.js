const apiKey = "62d4f7959ae0c503dd926119a4161124"; // Replace with your OpenWeatherMap API key

let unit = "metric"; // default is Celsius

window.onload = () => {
  loadHistory();
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => getWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      () => document.getElementById("weatherInfo").innerHTML = `<p>Location access denied.</p>`
    );
  }
};

function toggleUnits() {
  unit = unit === "metric" ? "imperial" : "metric";
  document.getElementById("unitLabel").textContent = unit === "metric" ? "°C" : "°F";
  const city = document.getElementById("cityInput").value;
  if (city) getWeatherByCity();
}

function showLoader(show) {
  document.getElementById("loader").style.display = show ? "block" : "none";
}

function getWeatherByCity() {
  const city = document.getElementById("cityInput").value;
  if (!city) return;
  saveToHistory(city);
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  showLoader(true);
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) throw new Error(data.message);
      displayWeather(data);
      getForecast(data.coord.lat, data.coord.lon);
    })
    .catch(err => {
      document.getElementById("weatherInfo").innerHTML = `<p style="color:red;">${err.message}</p>`;
    })
    .finally(() => showLoader(false));
}

 
function getWeatherByCoords() {
  const x = document.getElementById("show");
  if (!navigator.geolocation) {
    return alert("Geolocation not supported");
  }  
 else{
  
  navigator.geolocation.getCurrentPosition(success,error); 
 
   function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
   
   
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
    
    showLoader(true);

    fetch(url)
      .then(res => res.json())
      .then(data => {
        displayWeather(data);
        getForecast(data.coord.lat, data.coord.lon);  
        saveToHistory(data.name);
      })
      
      .catch(err => {
        document.getElementById("weatherInfo").innerHTML = `<p style="color:red;">${err.message}</p>`;
      })
      .finally(() => showLoader(false));
    
   }
   function error(){
    alert("request to allow location")
   }

}
}


function displayWeather(data) {
  const icon = data.weather[0].icon;
  const unitSymbol = unit === "metric" ? "°C" : "°F";
  document.getElementById("weatherInfo").innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="icon" />
    <p><strong>${data.weather[0].main}</strong> - ${data.weather[0].description}</p>
    <p>🌡️ Temp: ${data.main.temp} ${unitSymbol}</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>🌬️ Wind: ${data.wind.speed} ${unit === "metric" ? "m/s" : "mph"}</p>
    <p>🕹️Pressure: ${data.main.pressure} hPa</p>
  `;
}

function getForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const forecastEl = document.getElementById("forecast");
      forecastEl.innerHTML = "";
      const daily = {};
      data.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0];
        if (item.dt_txt.includes("12:00:00") && !daily[date]) {
          daily[date] = item;
        }
      });
      const unitSymbol = unit === "metric" ? "°C" : "°F";
      Object.values(daily).slice(0, 5).forEach(day => {
        forecastEl.innerHTML += `
          <div class="forecast-day">
            <strong>${new Date(day.dt_txt).toLocaleDateString()}</strong>
            <br />
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="icon" />
            <p>${day.weather[0].main}</p>
            <p>${day.main.temp} ${unitSymbol}</p>
            <p> Humidity: ${day.main.humidity}%</p>
          </div>
        `;
      });
    });
}


function saveToHistory(city) {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  if (!history.includes(city)) {
    history.unshift(city);
    if (history.length > 5) history.pop();
    localStorage.setItem("weatherHistory", JSON.stringify(history));
    loadHistory();
  }
}

function loadHistory() {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  const historyEl = document.getElementById("history");
  historyEl.innerHTML = history.map(city =>
    `<button onclick="searchFromHistory('${city}')">${city}</button>`
  ).join("");
}

function searchFromHistory(city) {
  document.getElementById("cityInput").value = city;
  getWeatherByCity();
}

// Apply saved dark mode preference on load
window.onload = () => {
  loadHistory();
  applyDarkMode();
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => getWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      () => document.getElementById("weatherInfo").innerHTML = `<p>Location access denied.</p>`
    );
  }
};

function toggleDarkMode() {
  const isDark = document.getElementById("darkModeToggle").checked;
  document.body.classList.toggle("dark", isDark);
  document.getElementById("modeLabel").textContent = isDark ? "Dark" : "Light";
  localStorage.setItem("darkMode", isDark);
}

function applyDarkMode() {
  const darkMode = localStorage.getItem("darkMode") === "true";
  document.getElementById("darkModeToggle").checked = darkMode;
  document.body.classList.toggle("dark", darkMode);
  document.getElementById("modeLabel").textContent = darkMode ? "Dark" : "Light";
}
// Observer to animate forecast cards on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Animate only once
      }
    });
  },
  { threshold: 0.2 }
);

// Observe forecast items when they’re created
function observeForecastCards() {
  document.querySelectorAll('.forecast-day').forEach(card => {
    observer.observe(card);
  });
}
document.getElementById("forecast").innerHTML = html;
observeForecastCards(); 

 function deleteItem () {
  localStorage.clear();
  document.getElementById("weatherHistory").innerHTML = "";
 }
 