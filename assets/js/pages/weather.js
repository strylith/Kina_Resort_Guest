import { fetchWeatherSummary } from '../utils/api.js';
import { showToast } from '../components/toast.js';

export async function WeatherPage(){
  try{
    const w = await fetchWeatherSummary();
    
    // Validate weather data
    if (!w) {
      throw new Error('No weather data received');
    }
    
    if (!w.current) {
      console.error('Weather data missing current:', w);
      throw new Error('Weather data incomplete: missing current weather');
    }
    
    if (!w.nextDays || !Array.isArray(w.nextDays)) {
      console.error('Weather data missing nextDays:', w);
      w.nextDays = []; // Ensure it's an array
    }
    
    // Use the actual forecast days in order (starting from today) - 5 days for accuracy
    const five = (w.nextDays || []).slice(0, 5);
    console.log('📊 Weather page - forecast days:', five.length);
    
    // Helper to get activity recommendation based on weather - Resort specific
    const getActivityRecommendation = (condition, temp) => {
      const cond = (condition || '').toLowerCase();
      const tempNum = parseInt(temp) || 0;
      
      if (cond.includes('rain') || cond.includes('storm')) {
        return { icon: '💆', text: 'Perfect day for spa treatments & indoor relaxation', color: '#9e9e9e' };
      } else if (cond.includes('drizzle')) {
        return { icon: '🏛️', text: 'Enjoy resort facilities & function halls', color: '#64b5f6' };
      } else if (tempNum >= 32) {
        return { icon: '🏊', text: 'Ideal for pool & water activities', color: '#42a5f5' };
      } else if (tempNum >= 25 && tempNum < 32) {
        return { icon: '🏖️', text: 'Perfect for beach access & outdoor resort activities', color: '#26a69a' };
      } else if (tempNum >= 20 && tempNum < 25) {
        return { icon: '🚶', text: 'Great weather for resort tours & garden walks', color: '#66bb6a' };
      } else {
        return { icon: '🧥', text: 'Cooler day - enjoy indoor dining & cozy resort amenities', color: '#78909c' };
      }
    };
    
    // Format current date
    const today = new Date();
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayName = weekdays[today.getDay()];
    const monthName = months[today.getMonth()];
    const day = today.getDate();
    const year = today.getFullYear();
    const currentDate = `${dayName}, ${monthName} ${day}, ${year}`;
    const shortDate = `${dayName}, ${day} ${monthName}`;
    
    return `
      <section class="container">
        <div class="weather" role="region" aria-label="Current weather">
          <div class="current-weather-section">
            <div class="current-weather-label" style="font-size: 13px; color: #666; font-weight: 600; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Current Weather (Real-time)</div>
            <div class="current">
              <div class="temp">${w.current.tempC}°C</div>
              <div class="weather-info">
                <div class="condition">${w.current.icon} ${w.current.condition}</div>
                <div class="date">📅 ${currentDate}</div>
                <div class="location">📍 ${w.location}</div>
                ${w.current.humidity ? `<div class="humidity">💧 Humidity: ${w.current.humidity}%</div>` : ''}
                <div class="suggestion">💡 ${w.suggestion}</div>
              </div>
            </div>
          </div>
          <div class="future-header">
            <h3>Detailed weather outlook for planning your perfect stay</h3>
            <p style="font-size: 13px; color: #666; margin-top: 8px; font-style: italic;">5-Day Forecast showing midday representative values (not real-time)</p>
          </div>
          <div class="future">
            ${five.map((d, index) => {
              const activity = getActivityRecommendation(d.condition, d.t);
              const isToday = index === 0;
              const tempHigh = d.t;
              const tempLow = d.tMin !== undefined ? d.tMin : d.t;
              
              return `
                <div class="chip weather-chip ${isToday ? 'chip-today' : ''}">
                  <div class="chip-header">
                    <div class="chip-day-info">
                      <div class="day">${d.d}</div>
                      <div class="date">${d.date || ''}</div>
                    </div>
                    ${isToday ? '<div class="today-badge-small">Today</div>' : ''}
                  </div>
                  
                  <div class="chip-main-content">
                    <div class="weather-icon-large">${d.icon || '🌤️'}</div>
                    <div class="condition-badge">${d.condition || 'Clear'}</div>
                    <div class="temp-range">
                      <span class="temp-high">${tempHigh}°</span>
                      ${tempLow !== undefined ? `<span class="temp-separator">/</span><span class="temp-low">${tempLow}°</span>` : ''}
                    </div>
                  </div>
                  
                  <div class="chip-details">
                    ${d.humidity ? `
                      <div class="chip-detail-item">
                        <span class="detail-icon">💧</span>
                        <span class="detail-label">Humidity</span>
                        <span class="detail-value">${d.humidity}%</span>
                      </div>
                    ` : ''}
                    
                    <div class="chip-detail-item activity-recommendation">
                      <span class="detail-icon" style="color: ${activity.color}">${activity.icon}</span>
                      <span class="detail-text">${activity.text}</span>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          
          <!-- Weather Disclaimer -->
          <div style="margin-top: 30px; padding: 15px; background: #fff9e6; border-left: 4px solid #ffa726; border-radius: 8px; font-size: 13px; color: #666; line-height: 1.6;">
            <div style="display: flex; align-items: start; gap: 10px;">
              <div style="font-size: 18px; flex-shrink: 0;">⚠️</div>
              <div>
                <strong style="color: #333; display: block; margin-bottom: 5px;">Weather Planning Reminder</strong>
                <p style="margin: 0;">Weather conditions can change rapidly and forecasts are predictions based on current atmospheric data. Values shown for "Today" in the detailed forecast use midday representative readings (not real-time), which may differ from current readings. Please check weather updates regularly before planning outdoor activities and have backup plans ready.</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- AI Recommendation Feature -->
        <div class="ai-recommendation-card">
          <div class="ai-recommendation-icon">✨</div>
          <div class="ai-recommendation-content">
            <h3 class="ai-recommendation-title">Need the Perfect Date Recommendation?</h3>
            <p class="ai-recommendation-text">Ask our AI assistant to find the best dates for your ideal weather and resort experience!</p>
            <button class="ai-recommendation-button" onclick="openAIChat()">
              <span class="button-icon">💬</span>
              <span class="button-text">Ask AI for Date Suggestions</span>
              <span class="button-arrow">→</span>
            </button>
          </div>
        </div>
        
        <style>
          .weather {
            background: linear-gradient(135deg, #ffffff 0%, #f8fcff 100%);
            border: 1px solid rgba(56, 182, 255, 0.15);
            border-radius: 20px;
            padding: 32px;
            box-shadow: 0 12px 40px rgba(56, 182, 255, 0.12);
            margin-bottom: 30px;
          }
          
          .current {
            display: flex;
            align-items: center;
            gap: 28px;
            padding: 28px;
            background: linear-gradient(135deg, #fffbf0 0%, #fff9e6 50%, #ffffff 100%);
            border: 1px solid rgba(255, 215, 0, 0.3);
            border-radius: 18px;
            margin-bottom: 28px;
            box-shadow: 0 6px 20px rgba(255, 215, 0, 0.2);
          }
          
          .temp {
            font-size: 64px;
            font-weight: 800;
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1;
            letter-spacing: -3px;
          }
          
          .weather-info {
            flex: 1;
          }
          
          .condition {
            font-weight: 600;
            font-size: 22px;
            color: var(--color-text);
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .date {
            color: var(--color-muted);
            font-size: 14px;
            margin-bottom: 4px;
            font-weight: 500;
          }
          
          .location {
            color: var(--color-muted);
            margin-bottom: 4px;
          }
          
          .humidity {
            color: var(--color-muted);
            margin-bottom: 4px;
            font-size: 14px;
          }
          
          .suggestion {
            color: var(--color-muted);
            font-style: italic;
          }
          
          .future-header {
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 2px solid rgba(56, 182, 255, 0.15);
          }
          
          .future-header h3 {
            font-size: 20px;
            font-weight: 600;
            color: var(--color-text);
            margin: 0;
            text-align: center;
          }
          
          .future {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
          }
          
          .chip {
            background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
            border: 1px solid rgba(56, 182, 255, 0.2);
            border-radius: 16px;
            padding: 20px;
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          
          .chip::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #38b6ff 0%, #1e88e5 100%);
            transform: scaleX(0);
            transition: transform 0.3s ease;
          }
          
          .chip:hover::before {
            transform: scaleX(1);
          }
          
          .chip:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 28px rgba(56, 182, 255, 0.2);
            border-color: rgba(56, 182, 255, 0.4);
            background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%);
          }
          
          .chip-today {
            border: 2px solid #38b6ff;
            background: linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%);
            box-shadow: 0 8px 24px rgba(56, 182, 255, 0.25);
          }
          
          .chip-today::before {
            transform: scaleX(1);
          }
          
          .chip-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(56, 182, 255, 0.1);
          }
          
          .chip-day-info {
            flex: 1;
            text-align: left;
          }
          
          .chip-main-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
          }
          
          .chip-details {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 8px;
            padding-top: 12px;
            border-top: 1px solid rgba(56, 182, 255, 0.1);
          }
          
          .chip-detail-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            justify-content: space-between;
          }
          
          .today-badge-small {
            background: linear-gradient(135deg, #38b6ff 0%, #1e88e5 100%);
            color: white;
            font-size: 10px;
            font-weight: 700;
            padding: 4px 8px;
            border-radius: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 2px 6px rgba(56, 182, 255, 0.3);
          }
          
          .chip .day {
            font-weight: 700;
            font-size: 16px;
            color: var(--color-text);
            margin-bottom: 2px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .chip .date {
            font-size: 12px;
            color: var(--color-muted);
            font-weight: 500;
          }
          
          .chip .weather-icon-large {
            font-size: 48px;
            margin: 4px 0;
            filter: drop-shadow(0 2px 6px rgba(0,0,0,0.1));
          }
          
          .condition-badge {
            font-size: 13px;
            font-weight: 600;
            color: #38b6ff;
            background: rgba(56, 182, 255, 0.1);
            padding: 6px 12px;
            border-radius: 10px;
            text-transform: capitalize;
            display: inline-block;
          }
          
          .chip .temp-range {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            margin-top: 4px;
          }
          
          .chip .temp-high {
            font-size: 24px;
            font-weight: 800;
            color: var(--color-text);
            line-height: 1;
          }
          
          .chip .temp-separator {
            font-size: 18px;
            color: var(--color-muted);
            margin: 0 2px;
          }
          
          .chip .temp-low {
            font-size: 18px;
            font-weight: 600;
            color: var(--color-muted);
            opacity: 0.8;
          }
          
          .detail-icon {
            font-size: 14px;
            width: 18px;
            text-align: center;
          }
          
          .detail-label {
            color: var(--color-muted);
            font-weight: 500;
            flex: 1;
            font-size: 11px;
          }
          
          .detail-value {
            color: var(--color-text);
            font-weight: 700;
            font-size: 11px;
          }
          
          .activity-recommendation {
            background: rgba(56, 182, 255, 0.05);
            padding: 8px 10px;
            border-radius: 8px;
            margin-top: 4px;
          }
          
          .activity-recommendation .detail-text {
            color: var(--color-text);
            font-weight: 600;
            font-size: 11px;
            flex: 1;
          }
          
          /* AI Recommendation Card */
          .ai-recommendation-card {
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #fff9e6 100%);
            border: 2px solid rgba(255, 215, 0, 0.3);
            border-radius: 20px;
            padding: 32px;
            margin-top: 32px;
            display: flex;
            align-items: center;
            gap: 24px;
            box-shadow: 0 8px 24px rgba(255, 215, 0, 0.15);
            transition: all 0.3s ease;
          }
          
          .ai-recommendation-card:hover {
            box-shadow: 0 12px 32px rgba(255, 215, 0, 0.2);
          }
          
          .ai-recommendation-icon {
            font-size: 56px;
            line-height: 1;
            flex-shrink: 0;
            animation: float 3s ease-in-out infinite;
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          
          .ai-recommendation-content {
            flex: 1;
          }
          
          .ai-recommendation-title {
            font-size: 24px;
            font-weight: 700;
            color: #1a1a1a;
            margin: 0 0 8px 0;
          }
          
          .ai-recommendation-text {
            font-size: 16px;
            color: #4a4a4a;
            margin: 0 0 20px 0;
            line-height: 1.6;
          }
          
          .ai-recommendation-button {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            background: #ffffff;
            color: #1a1a1a;
            border: 2px solid #ffd700;
            border-radius: 50px;
            padding: 14px 28px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
            text-transform: none;
            box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2);
          }
          
          .ai-recommendation-button:hover {
            background: #fff9e6;
            border-color: #ffed4e;
            box-shadow: 0 6px 16px rgba(255, 215, 0, 0.3);
            transform: translateY(-2px);
          }
          
          .ai-recommendation-button:active {
            transform: scale(0.98);
          }
          
          .button-icon {
            font-size: 20px;
            line-height: 1;
          }
          
          .button-text {
            font-weight: 700;
          }
          
          .button-arrow {
            font-size: 20px;
            transition: transform 0.2s ease;
          }
          
          .ai-recommendation-button:hover .button-arrow {
            transform: translateX(2px);
          }
          
          @media (max-width: 768px) {
            .ai-recommendation-card {
              flex-direction: column;
              text-align: center;
              padding: 24px;
            }
            
            .ai-recommendation-icon {
              font-size: 48px;
            }
            
            .ai-recommendation-title {
              font-size: 20px;
            }
            
            .ai-recommendation-text {
              font-size: 14px;
            }
            
            .ai-recommendation-button {
              width: 100%;
              justify-content: center;
            }
          }
          
          @media (max-width: 768px) {
            .current {
              flex-direction: column;
              text-align: center;
              gap: 16px;
            }
            
            .future {
              grid-template-columns: 1fr;
            }
            
            .future-header h3 {
              font-size: 18px;
            }
          }
        </style>
      </section>`;
  }catch(e){
    showToast('Weather unavailable','error');
    return `
      <section class="container">
        <div class="section-head">
          <h2>Weather</h2>
          <p>Try again later.</p>
        </div>
      </section>`;
  }
}


