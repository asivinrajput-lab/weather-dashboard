# Weatherly 🌤️

A responsive weather dashboard built with vanilla HTML, CSS, and JavaScript. Search for any city, use your current location, and view current conditions plus a seven-day forecast.

## Features

- City search powered by the Open-Meteo geocoding API
- Current temperature, humidity, wind, pressure, UV index, and feels-like temperature
- Seven-day forecast with weather icons
- Celsius/Fahrenheit toggle remembered in local storage
- Mobile-friendly responsive layout
- No API key required

## Run locally

Open `index.html` in a browser, or serve the folder with any static server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## APIs

Weather data and geocoding are provided by [Open-Meteo](https://open-meteo.com/).
