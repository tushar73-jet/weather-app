import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [bgClass, setBgClass] = useState(""); 

  const getWeather = async () => {
    if (!city || city.trim() === "") {
      setErrorMsg("Please enter a city name");
      setWeatherData(null);
      setBgClass("");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/weather?city=${city.trim()}`);
      const data = await res.json();

      if (data.error) {
        setErrorMsg(data.error);
        setWeatherData(null);
        setBgClass("");
        return;
      }

      setErrorMsg("");
      setWeatherData(data);

      // Set background based on weather
      const mainWeather = data.weather?.[0]?.main.toLowerCase();
      if (mainWeather.includes("cloud")) setBgClass("cloudy");
      else if (mainWeather.includes("rain") || mainWeather.includes("drizzle")) setBgClass("rainy");
      else if (mainWeather.includes("snow")) setBgClass("snowy");
      else if (mainWeather.includes("thunder")) setBgClass("thunderstorm");
      else setBgClass("clear");

    } catch (err) {
      console.error("Frontend error:", err);
      setErrorMsg("Failed to fetch weather data");
      setWeatherData(null);
      setBgClass("");
    }
  };

  return (
    <div className={`app ${bgClass}`}>
      <div className="container">
        <h1>Weather App</h1>
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && getWeather()}
        />
        <button onClick={getWeather}>Get Weather</button>

        {errorMsg && <p id="error-msg">{errorMsg}</p>}

        {weatherData && (
          <div id="weather-info">
            <h2>{weatherData.name}</h2>
            <p>🌡️ Temperature: {weatherData.main?.temp}°C</p>
            <p>🌥 Condition: {weatherData.weather?.[0]?.description}</p>
            <p>💧 Humidity: {weatherData.main?.humidity}%</p>
            <p>🌬 Wind Speed: {weatherData.wind?.speed} m/s</p>
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather?.[0]?.icon}@2x.png`}
              alt="weather icon"
            />
          </div>
        )}
      </div>

      <footer>
        <p>© 2025 Weather App | By Tushar</p>
      </footer>
    </div>
  );
}

export default App;
