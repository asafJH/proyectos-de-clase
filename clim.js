const spinner = document.getElementById('spinner');
const card = document.getElementById('weather-info');
const errorDiv = document.getElementById('error');
const citySearch = document.getElementById('city-search');

navigator.geolocation.getCurrentPosition(success, error);

function success(position) {
  const { latitude, longitude } = position.coords;
  fetchWeather(latitude, longitude);
  fetchForecast(latitude, longitude);
}

function error() {
  spinner.style.display = 'none';
  errorDiv.textContent = 'Ubicación denegada. Puedes buscar por ciudad.';
  citySearch.hidden = false;
}

function searchCity() {
  const city = document.getElementById('city-input').value;
  if (city) {
    spinner.style.display = 'block';
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`)
      .then(res => res.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          const { latitude, longitude, name } = data.results[0];
          document.getElementById('city-name').textContent = name;
          fetchWeather(latitude, longitude);
          fetchForecast(latitude, longitude);
        } else {
          showError('Ciudad no encontrada');
        }
      })
      .catch(() => showError('Error al buscar ciudad'));
  }
}

function fetchWeather(lat, lon) {
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
    .then(res => res.json())
    .then(data => {
      spinner.style.display = 'none';
      card.hidden = false;
      citySearch.hidden = true;

      const temp = data.current_weather.temperature;
      const time = data.current_weather.time;
      const code = data.current_weather.weathercode;

      document.getElementById('temp').textContent = temp;
      document.getElementById('time').textContent = `Hora: ${time}`;
      document.getElementById('city-name').textContent ||= 'Tu ubicación';
      document.getElementById('weather-comment').textContent = getComment(code);
      document.getElementById('icon').textContent = getIcon(code);

      // Fondo dinámico
      if (temp >= 30) {
        document.body.style.background = 'linear-gradient(to top right, #ff9966, #ff5e62)';
      } else if (temp <= 10) {
        document.body.style.background = 'linear-gradient(to top right, #cfd9df, #e2ebf0)';
      } else {
        document.body.style.background = 'linear-gradient(to top right, #74ebd5, #ACB6E5)';
      }
    })
    .catch(() => showError('Error al obtener clima'));
}

function fetchForecast(lat, lon) {
  const today = new Date().toISOString().split('T')[0];
  const endDate = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&start_date=${today}&end_date=${endDate}`)
    .then(res => res.json())
    .then(data => {
      const forecastDiv = document.getElementById('forecast');
      const forecastDays = document.getElementById('forecast-days');
      forecastDiv.hidden = false;
      forecastDays.innerHTML = '';

      for (let i = 0; i < data.daily.time.length; i++) {
        const date = new Date(data.daily.time[i]).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' });
        const max = data.daily.temperature_2m_max[i];
        const min = data.daily.temperature_2m_min[i];
        const code = data.daily.weathercode[i];
        const description = getComment(code);
        const icon = getIcon(code);

        const dayHTML = `
          <div class="forecast-day">
            <strong>${date}</strong><br>
            ${icon} ${description}<br>
            🌡️ Máx: ${max}°C / Mín: ${min}°C
          </div>
        `;
        forecastDays.innerHTML += dayHTML;
      }
    })
    .catch(() => console.log("Error al obtener pronóstico"));
}

function getComment(code) {
  const comments = {
    0: "Día soleado, perfecto para salir.",
    1: "Mayormente despejado, ideal para caminar.",
    2: "Parcialmente nublado, clima agradable.",
    3: "Nublado, puede refrescar.",
    45: "Neblina presente, maneja con precaución.",
    48: "Neblina densa, visibilidad reducida.",
    51: "Llovizna ligera, lleva paraguas.",
    53: "Llovizna moderada, mejor estar cubierto.",
    55: "Llovizna intensa, evita mojarte.",
    61: "Lluvia ligera, día húmedo.",
    63: "Lluvia moderada, mejor quedarse seco.",
    65: "Lluvia fuerte, cuidado en exteriores.",
    71: "Nieve ligera, abrígate bien.",
    73: "Nieve moderada, posible acumulación.",
    75: "Nieve intensa, condiciones difíciles.",
    80: "Chubascos, clima cambiante.",
    81: "Chubascos moderados, lleva impermeable.",
    82: "Chubascos intensos, mejor en casa.",
    95: "Tormenta eléctrica, evita salir.",
    96: "Tormenta con granizo, peligro potencial.",
    99: "Tormenta severa, mantente seguro."
  };
  return comments[code] || "Clima variable, revisa el cielo.";
}

function getIcon(code) {
  const icons = {
    0: "☀️",
    1: "🌤️",
    2: "⛅",
    3: "☁️",
    45: "🌫️",
    48: "🌫️",
    51: "🌦️",
    53: "🌦️",
    55: "🌧️",
    61: "🌧️",
    63: "🌧️",
    65: "🌧️",
    71: "❄️",
    73: "❄️",
    75: "❄️",
    80: "⛈️",
    81: "⛈️",
    82: "⛈️",
    95: "🌩️",
    96: "🌩️",
    99: "🌩️"
  };
  return icons[code] || "🌈";
}
