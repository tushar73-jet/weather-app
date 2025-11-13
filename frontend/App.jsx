import { useState } from "react";
import "./App.css";
import { WiThermometer, WiStrongWind, WiHumidity, WiCloudy } from "react-icons/wi";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [bgClass, setBgClass] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const getWeather = async () => {
    if (!city || city.trim() === "") {
      setErrorMsg("Please enter a city name");
      setWeatherData(null);
      setBgClass("");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setWeatherData(null);
    setBgClass("");

    try {
      const res = await fetch(`${API_URL}/weather?city=${city.trim()}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMsg(data.error || "Failed to fetch weather data");
        setWeatherData(null);
        setBgClass("");
        return;
      }

      setErrorMsg("");
      setWeatherData(data);

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
          disabled={isLoading}
        />
        <button onClick={getWeather} disabled={isLoading}>
          {isLoading ? "Loading..." : "Get Weather"}
        </button>

        {errorMsg && <p id="error-msg">{errorMsg}</p>}

        {weatherData && (
          <div id="weather-info">
            <h2>{weatherData.name}</h2>
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather?.[0]?.icon}@2x.png`}
              alt="weather icon"
              style={{ width: '120px' }} // Make icon a bit bigger
            />
            
            {/* 2. Use the new icons and style them */}
            <p className="weather-detail">
              <WiThermometer size={24} /> Temperature: {weatherData.main?.temp}°C
            </p>
            <p className="weather-detail">
              <WiCloudy size={24} /> Condition: {weatherData.weather?.[0]?.description}
            </p>
            <p className="weather-detail">
              <WiHumidity size={24} /> Humidity: {weatherData.main?.humidity}%
            </p>
            <p className="weather-detail">
              <WiStrongWind size={24} /> Wind Speed: {weatherData.wind?.speed} m/s
            </p>
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
