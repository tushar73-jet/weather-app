import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [bgClass, setBgClass] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 1. Add loading state

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const getWeather = async () => {
    if (!city || city.trim() === "") {
      setErrorMsg("Please enter a city name");
      setWeatherData(null);
      setBgClass("");
      return;
    }

    // 2. Set loading and clear old data/errors
    setIsLoading(true);
    setErrorMsg("");
    setWeatherData(null);
    setBgClass("");

    try {
      const res = await fetch(`${API_URL}/weather?city=${city.trim()}`);
      const data = await res.json();

      // 3. Check for errors from the API (e.g., 404 "city not found")
      if (!res.ok || data.error) {
        setErrorMsg(data.error || "Failed to fetch weather data");
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
      setErrorMsg("Failed to fetch weather data. (Check server?)");
      setWeatherData(null);
      setBgClass("");
    } finally {
      // 4. Stop loading, no matter what
      setIsLoading(false);
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
          disabled={isLoading} // 5. Disable input while loading
        />
        <button onClick={getWeather} disabled={isLoading}>
          {/* 6. Show loading text in button */}
          {isLoading ? "Loading..." : "Get Weather"}
        </button>

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