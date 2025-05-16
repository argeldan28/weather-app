function WeatherCard({ day, isToday }) {
  return (
    <div
      className={`${isToday ? 'h-80 bg-white/70' : 'h-64 bg-white/30'} 
       backdrop-blur-md border border-white/40 
      p-4 rounded shadow text-center w-full max-w-xs mx-auto 
      flex flex-col items-center justify-center text-center`}
    >
      <p className={`mb-2 ${isToday ? 'font-bold text-3xl' : 'font-semibold'}`}>
        {isToday
          ? "Today"
          : new Date(day.dt_txt).toLocaleDateString(undefined, {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            })}
      </p>
      <img
        src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
        alt={day.weather[0].description}
        className="mx-auto w-24 h-24 drop-shadow-[0_5px_8px_rgba(59,130,246,0.5)]"
      />
      <p className="text-lg font-bold">{day.main.temp.toFixed(0)}°C</p>
      <p className="text-sm text-gray-600">{day.weather[0].description}</p>
    </div>
  );
}

export default WeatherCard;