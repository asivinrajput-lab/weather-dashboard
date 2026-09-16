const $ = (id) => document.getElementById(id);
const state = { unit: localStorage.getItem('weather-unit') || 'celsius', weather: null };
const weatherCodes = { 0:['Clear sky','☀️'],1:['Mainly clear','🌤️'],2:['Partly cloudy','⛅'],3:['Overcast','☁️'],45:['Fog','🌫️'],48:['Rime fog','🌫️'],51:['Light drizzle','🌦️'],53:['Drizzle','🌦️'],55:['Heavy drizzle','🌧️'],61:['Light rain','🌧️'],63:['Rain','🌧️'],65:['Heavy rain','🌧️'],71:['Light snow','🌨️'],73:['Snow','❄️'],75:['Heavy snow','❄️'],80:['Rain showers','🌦️'],81:['Rain showers','🌧️'],82:['Heavy showers','🌧️'],95:['Thunderstorm','⛈️'],96:['Thunderstorm','⛈️'],99:['Thunderstorm','⛈️'] };
function setStatus(message='') { $('status').textContent = message; }
function temperature(value) { const c = Number(value); return state.unit === 'fahrenheit' ? Math.round(c * 9 / 5 + 32) : Math.round(c); }
function unit() { return state.unit === 'fahrenheit' ? '°F' : '°C'; }
function weatherInfo(code) { return weatherCodes[code] || ['Unknown','🌡️']; }
function render(data, place) {
  state.weather = data; const current = data.current, info = weatherInfo(current.weather_code);
  $('weatherContent').hidden = false; $('locationName').textContent = `${place.name}, ${place.country_code || place.country}`;
  $('updatedAt').textContent = `Updated ${new Date().toLocaleTimeString([], {hour:'numeric', minute:'2-digit'})}`;
  $('weatherIcon').textContent = info[1]; $('condition').textContent = info[0];
  $('currentTemp').textContent = temperature(current.temperature_2m); $('currentUnit').textContent = unit();
  $('feelsLike').textContent = `${temperature(current.apparent_temperature)}${unit()}`;
  $('humidity').textContent = `${Math.round(current.relative_humidity_2m)}%`;
  $('wind').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  $('pressure').textContent = `${Math.round(current.surface_pressure)} hPa`;
  $('uv').textContent = current.uv_index == null ? '—' : current.uv_index.toFixed(1);
  $('forecast').innerHTML = data.daily.time.map((date, i) => { const day = i === 0 ? 'Today' : new Date(`${date}T12:00:00`).toLocaleDateString([], {weekday:'short'}); const f = weatherInfo(data.daily.weather_code[i]); return `<article class="forecast-day card"><span class="day">${day}</span><span class="day-icon">${f[1]}</span><div class="temps">${temperature(data.daily.temperature_2m_max[i])}° <span class="low">${temperature(data.daily.temperature_2m_min[i])}°</span></div></article>`; }).join('');
}
async function fetchWeather(place) { setStatus('Loading weather…'); try { const params = new URLSearchParams({latitude:place.latitude, longitude:place.longitude, current:'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,uv_index',daily:'weather_code,temperature_2m_max,temperature_2m_min',timezone:'auto',forecast_days:'7'}); const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`); if (!response.ok) throw new Error('Weather service unavailable'); render(await response.json(), place); setStatus(''); } catch (error) { setStatus(error.message || 'Unable to load weather. Please try again.'); } }
async function searchCity(name) { setStatus('Finding location…'); try { const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`); const data = await response.json(); if (!data.results?.length) throw new Error('City not found. Try another search.'); fetchWeather(data.results[0]); } catch (error) { setStatus(error.message); } }
$('searchForm').addEventListener('submit', (event) => { event.preventDefault(); searchCity($('searchInput').value.trim()); });
$('locationButton').addEventListener('click', () => { if (!navigator.geolocation) return setStatus('Location is not supported by this browser.'); setStatus('Finding your location…'); navigator.geolocation.getCurrentPosition(({coords}) => fetchWeather({latitude:coords.latitude, longitude:coords.longitude, name:'Your location', country:'Current position'}), () => setStatus('Could not access your location. Search for a city instead.')); });
$('unitToggle').addEventListener('click', () => { state.unit = state.unit === 'celsius' ? 'fahrenheit' : 'celsius'; localStorage.setItem('weather-unit', state.unit); if (state.weather) render(state.weather, {name:$('locationName').textContent.split(',')[0], country:$('locationName').textContent.split(',')[1] || ''}); });
searchCity('London');
