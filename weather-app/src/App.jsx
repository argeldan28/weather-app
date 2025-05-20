import { useState, useEffect } from 'react';
import './App.css';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiDayCloudyHigh } from 'react-icons/wi';
import WeatherCard from './components/WeatherCard.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const API_KEY = "ab858d8eebc56b4428bd6ea34183c739";

function App() {
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState("Milan");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [weatherCondition, setWeatherCondition] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
        );
        const data = await response.json();
        
        if (data.cod === "200") {
          setWeatherCondition(data.list[0].weather[0].main);
          const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));
          setForecast(dailyData.slice(0, 5));
          setError("");
        } else {
          setForecast([]);
          setError(`City '${city}' not found. Please try again.`);
        }
      } catch (err) {
        setError("Error fetching data. Please try again later.");
        setForecast([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [city]);

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim() !== "") {
      setCity(search.trim());
      setSearch("");
    }
  }

  function getWeatherIcon(condition) {
    switch (condition) {
      case "Clear":
        return <WiDaySunny className="text-6xl text-yellow-400" />;
      case "Clouds":
        return <WiCloudy className="text-6xl text-gray-400" />;
      case "Rain":
        return <WiRain className="text-6xl text-blue-600" />;
      case "Snow":
        return <WiSnow className="text-6xl text-blue-200" />;
      case "Thunderstorm":
        return <WiThunderstorm className="text-6xl text-purple-600" />;
      default:
        return <WiDayCloudyHigh className="text-6xl text-blue-400" />;
    }
  }

  function getBackground(condition) {
    switch (condition) {
      case "Clear":
        return "bg-gradient-to-br from-blue-400 via-blue-300 to-yellow-100";
      case "Clouds":
        return "bg-gradient-to-br from-gray-500 via-gray-300 to-gray-100";
      case "Rain":
        return "bg-gradient-to-br from-blue-900 via-blue-600 to-blue-300";
      case "Snow":
        return "bg-gradient-to-br from-blue-100 via-blue-50 to-white";
      case "Thunderstorm":
        return "bg-gradient-to-br from-gray-900 via-purple-800 to-indigo-700";
      default:
        return "bg-gradient-to-br from-blue-500 via-blue-400 to-blue-300";
    }
  }

  return (
    <div className={`App ${getBackground(weatherCondition)} min-h-screen p-4 md:p-8 transition-colors duration-1000`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2">
            Weather Forecast
          </h1>
          <p className="text-lg text-white/80">
            Get 5-day weather predictions for any city
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSearch}
          className="flex justify-center mb-8 gap-2 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search a city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-0 rounded-full  px-6 pl-8 py-3 shadow-lg focus:ring-1 focus:ring-blue-400 focus:outline-none"
            />
            <FiMapPin className="absolute left-3 top-3.5 text-black-400" />
          </div>
          <button
            className="bg-white/90 text-blue-600 p-3 rounded-full hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
            type="submit"
            aria-label="Search"
          >
            <FiSearch size={20} />
          </button>
        </motion.form>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center mb-6"
            >
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-lg text-white font-medium text-center mb-6 bg-red-500/80 py-2 px-4 rounded-full inline-block"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {forecast.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8 text-center"
          >
            <motion.div 
              className="flex items-center justify-center gap-2 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <FiMapPin className="text-white" />
              <h2 className="text-2xl md:text-3xl font-semibold text-white capitalize">
                {city}
              </h2>
            </motion.div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-center">
          <AnimatePresence>
            {forecast.map((day, index) => (
              <motion.div
                key={day.dt}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="h-full flex items-center"
              >
                <WeatherCard 
                  day={day} 
                  isToday={index === 0} 
                  className="h-full w-full"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default App;