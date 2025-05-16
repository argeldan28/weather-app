import { useState, useEffect } from 'react'
import './App.css'
import { FiSearch } from 'react-icons/fi';
import WeatherCard from './components/WeatherCard.jsx';

const API_KEY = "ab858d8eebc56b4428bd6ea34183c739";

function App() {
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState("Milan");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [weatherCondition, setWeatherCondition] = useState("");

  useEffect(() => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        if(data.cod === "200") {
          console.log(data);
          setWeatherCondition(data.list[0].weather[0].main);
          const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));
          setForecast(dailyData.slice(0, 5)); // prendi i primi 5 giorni
          setError("");
        } else {
          setForecast([]);
          setError(`City '${city}' not found. Please try again.`)
        }
      })
      .catch(() => {
        setError("Error fetching data. Please try again later.");
        setForecast([]);
      })
  }, [city]);

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim() !== "") {
      setCity(search.trim());
      setSearch("");
    }
  }

  function getBackground(condition) {
    switch (condition) {
      case "Clear":
        return "bg-gradient-to-b from-blue-400 to-yellow-200";
      case "Clouds":
        return "bg-gradient-to-b from-gray-400 to-gray-200";
      case "Rain":
        return "bg-gradient-to-b from-blue-800 to-blue-400";
      case "Snow":
        return "bg-gradient-to-b from-white to-blue-100";
      case "Thunderstorm":
        return "bg-gradient-to-b from-gray-800 to-purple-500";
      default:
        return "bg-blue-300";
    }
  }

  return (
    <div className={`App ${getBackground(weatherCondition)} min-h-screen p-6 flex flex-col items-center justify-center`}>
      <h1 className="text-4xl font-semibold text-center mb-6">Weather Forecast</h1>

      <form onSubmit={handleSearch} className="flex justify-center mb-6 gap-1">
        <input
          type="text"
          placeholder="Search a city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-2 w-56 rounded"
        />
        <button className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition duration-200" type="submit">
           <FiSearch size={20} />
        </button>
      </form>

      {error && (
        <p className="text-xl text-red-600 font-medium text-center mb-4">{error}</p>
      )}

      <h1 className="text-3xl font-semibold text-center my-3 capitalize">{city}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 w-full items-center">
        {forecast.map((day, index) => {

          return <WeatherCard key={day.dt} day={day} isToday={index===0} />

        })}
      </div>
    </div>
  );
}

export default App;