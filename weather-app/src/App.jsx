import { useState, useEffect } from 'react'
import './App.css'

const API_KEY = "ab858d8eebc56b4428bd6ea34183c739";

function App() {
  const [weather, setWeather] = useState(null)
  const [city, setCity] = useState("Milan")
  const [search, setSearch] = useState("")


  function fetchWeather(cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`)
      .then(res => res.json())
      .then(data => setWeather(data))
      .catch(err => console.error(err));
  }

  useEffect(() => {
    fetchWeather(city);
  }, [city])

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim() !== "") {
      setCity(search.trim());
      setSearch("");
    }
  }


  return (
    <>
      <div className="bg-gray-100 min-h-screen flex flex-col items-center py-8">
        <h1 className="text-4xl font-semibold text-blue-600 mb-6">Weather App</h1>

        <form onSubmit={handleSearch} className="flex items-center mb-5">
          <input 
            type="text" 
            placeholder="Search a city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        {weather && weather.main ? (
            <div className="mt-8 p-6 bg-white shadow-lg rounded-lg w-80 text-center">
              <h2 className="text-3xl font-bold text-gray-800">{weather.name}</h2>
              <p className="text-2xl text-gray-700">{weather.main.temp.toFixed(1)}°C</p>
              <p className="text-xl text-gray-600">{weather.weather[0].description}</p>
            </div>
          ) : (
            <p className="mt-4 text-xl text-gray-600">City not found or loading...</p>
          )
        }
      </div>
    </>
  )
}

export default App
