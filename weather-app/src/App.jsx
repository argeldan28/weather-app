import { useState, useEffect } from 'react'
import './App.css'
import { FiSearch } from 'react-icons/fi';

const API_KEY = "ab858d8eebc56b4428bd6ea34183c739";

function App() {
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState("Milan");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        if(data.cod === "200") {
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

  return (
    <div className="App bg-blue-300 min-h-screen p-6 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-semibold text-center mb-6">Weather Forecast</h1>

      <form onSubmit={handleSearch} className="flex justify-center mb-6 gap-1">
        <input
          type="text"
          placeholder="Search a city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded"
        />
        <button className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition duration-200" type="submit">
           <FiSearch size={20} />
        </button>
      </form>

      {error && (
        <p className="text-xl text-red-600 font-medium text-center mb-4">{error}</p>
      )}

      <h1 className="text-3xl font-semibold text-center my-3 capitalize">{city}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 w-full">
        {forecast.map((day, index) => (
          <div key={day.dt} className="bg-white/30 backdrop-blur-md border border-white/40 p-4 rounded shadow text-center w-full max-w-xs mx-auto">
            <p className="font-semibold mb-2">
              {index === 0 
                ? "Today" 
                : new Date(day.dt_txt).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
            </p>
            <img 
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} 
              alt={day.weather[0].description} 
              className="mx-auto w-24 h-24 drop-shadow-[0_5px_8px_rgba(59,130,246,0.5)]"
            />
            <p className="text-lg font-bold">{day.main.temp.toFixed(0)}°C</p>
            <p className="text-sm text-gray-600">{day.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;