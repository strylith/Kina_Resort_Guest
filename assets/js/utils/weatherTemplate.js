// Weather Template Configuration
// This template provides a simple structure for weather data

export const WEATHER_TEMPLATE = {
  location: 'Kina Resort',
  
  // Current weather template
  current: {
    tempC: 28,
    condition: 'Sunny',
    icon: '☀️',
    feelslike: 30,
    humidity: 65
  },
  
  // 7-day forecast template structure
  forecast: [
    { day: 'Sun', date: 'Today', temp: 28, condition: 'Sunny', icon: '☀️' },
    { day: 'Mon', date: 'Tomorrow', temp: 29, condition: 'Partly Cloudy', icon: '🌤️' },
    { day: 'Tue', date: 'Jan 2', temp: 27, condition: 'Cloudy', icon: '☁️' },
    { day: 'Wed', date: 'Jan 3', temp: 28, condition: 'Sunny', icon: '☀️' },
    { day: 'Thu', date: 'Jan 4', temp: 29, condition: 'Partly Cloudy', icon: '🌤️' },
    { day: 'Fri', date: 'Jan 5', temp: 28, condition: 'Sunny', icon: '☀️' },
    { day: 'Sat', date: 'Jan 6', temp: 27, condition: 'Cloudy', icon: '☁️' }
  ],
  
  // Visit suggestion template
  suggestion: 'Perfect weather for outdoor activities. Best visiting days: Sun, Mon, Thu, Fri with sunny skies.'
};

// Helper to generate forecast dates starting from today
export function generateForecastDates(baseForecast = WEATHER_TEMPLATE.forecast) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return baseForecast.map((day, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    
    const dayOfWeek = weekdays[date.getDay()];
    const month = monthNames[date.getMonth()];
    const dayNum = date.getDate();
    
    // First day is "Today", second is "Tomorrow", rest show date
    let dateLabel;
    if (index === 0) {
      dateLabel = 'Today';
    } else if (index === 1) {
      dateLabel = 'Tomorrow';
    } else {
      dateLabel = `${month} ${dayNum}`;
    }
    
    return {
      d: dayOfWeek,
      date: dateLabel,
      fullDate: date.toISOString().split('T')[0],
      t: day.temp || 28,
      c: day.condition || 'Sunny',
      icon: day.icon || '☀️'
    };
  });
}

// Helper to format current date
export function formatCurrentDate() {
  const today = new Date();
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayName = weekdays[today.getDay()];
  const monthName = months[today.getMonth()];
  const day = today.getDate();
  const year = today.getFullYear();
  
  return `${dayName}, ${monthName} ${day}, ${year}`;
}

// Generate weather summary from template
export function getWeatherFromTemplate() {
  const currentDate = formatCurrentDate();
  const forecast = generateForecastDates();
  
  return {
    location: WEATHER_TEMPLATE.location,
    current: {
      tempC: WEATHER_TEMPLATE.current.tempC,
      condition: WEATHER_TEMPLATE.current.condition,
      icon: WEATHER_TEMPLATE.current.icon,
      date: currentDate
    },
    nextDays: forecast,
    suggestion: WEATHER_TEMPLATE.suggestion
  };
}
