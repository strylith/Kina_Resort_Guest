import { fetchWeatherSummary } from '../utils/api.js';
import { showToast } from '../components/toast.js';
import { initPromoBanner } from '../components/promotionalBanner.js';

export async function HomePage(){
  const tpl = document.getElementById('tpl-home');
  const frag = tpl.content.cloneNode(true);

  // Populate weather
  try{
    const w = await fetchWeatherSummary();
    const root = frag.querySelector('[data-weather-section]');
    if(root){
      // Format current date
      const today = new Date();
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const dayName = weekdays[today.getDay()];
      const monthName = months[today.getMonth()];
      const day = today.getDate();
      const year = today.getFullYear();
      const currentDate = `${dayName}, ${monthName} ${day}, ${year}`;
      
      // Add current weather label
      let currentLabel = root.querySelector('[data-w-current-label]');
      if (!currentLabel) {
        const tempElement = root.querySelector('[data-w-temp]');
        currentLabel = document.createElement('div');
        currentLabel.className = 'current-weather-label';
        currentLabel.setAttribute('data-w-current-label', '');
        currentLabel.style.cssText = 'font-size: 12px; color: #666; font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;';
        currentLabel.textContent = 'Current Weather (Real-time)';
        tempElement.parentNode.insertBefore(currentLabel, tempElement);
      }
      
      root.querySelector('[data-w-temp]').textContent = `${w.current.tempC}°C`;
      root.querySelector('[data-w-cond]').innerHTML = `<span class="weather-icon-large">${w.current.icon}</span><span class="weather-condition-text">${w.current.condition}</span>`;
      
      // Add date display - create element if it doesn't exist
      let dateElement = root.querySelector('[data-w-date]');
      if (!dateElement) {
        const condElement = root.querySelector('[data-w-cond]');
        dateElement = document.createElement('div');
        dateElement.className = 'cond';
        dateElement.setAttribute('data-w-date', '');
        condElement.parentNode.insertBefore(dateElement, condElement.nextSibling);
      }
      dateElement.textContent = `📅 ${currentDate}`;
      
      root.querySelector('[data-w-loc]').textContent = w.location;
      
      // Add humidity display if available
      if (w.current.humidity !== null && w.current.humidity !== undefined) {
        let humidityElement = root.querySelector('[data-w-humidity]');
        if (!humidityElement) {
          const locElement = root.querySelector('[data-w-loc]');
          humidityElement = document.createElement('div');
          humidityElement.className = 'cond';
          humidityElement.setAttribute('data-w-humidity', '');
          locElement.parentNode.insertBefore(humidityElement, locElement.nextSibling);
        }
        humidityElement.textContent = `💧 Humidity: ${w.current.humidity}%`;
      }
      
      root.querySelector('[data-w-sugg]').textContent = w.suggestion;
      
      // Add forecast label before forecast section
      let forecastLabel = root.querySelector('[data-w-forecast-label]');
      if (!forecastLabel) {
        const future = root.querySelector('[data-w-future]');
        forecastLabel = document.createElement('div');
        forecastLabel.className = 'forecast-label';
        forecastLabel.setAttribute('data-w-forecast-label', '');
        forecastLabel.style.cssText = 'font-size: 12px; color: #666; font-weight: 600; margin: 20px 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;';
        forecastLabel.textContent = '5-Day Forecast (Midday Representative Values)';
        future.parentNode.insertBefore(forecastLabel, future);
      }
      
      const future = root.querySelector('[data-w-future]');
      future.innerHTML = w.nextDays.map(d => `
        <div class="chip weather-chip" aria-label="${d.d} ${d.date || ''}">
          <div class="chip-day">${d.d}</div>
          <div class="chip-date">${d.date || ''}</div>
          <div class="chip-weather-icon">${d.icon || '🌤️'}</div>
          <div class="chip-condition">${d.condition || 'Clear'}</div>
          <div class="chip-temp">${d.t}° <span class="chip-temp-min">/${d.tMin !== undefined ? `${d.tMin}°` : ''}</span></div>
          ${d.humidity ? `<div class="chip-humidity">💧 ${d.humidity}%</div>` : ''}
        </div>
      `).join('');
      
      // Add weather disclaimer
      let disclaimer = root.querySelector('[data-w-disclaimer]');
      if (!disclaimer) {
        disclaimer = document.createElement('div');
        disclaimer.className = 'weather-disclaimer';
        disclaimer.setAttribute('data-w-disclaimer', '');
        disclaimer.style.cssText = 'font-size: 11px; color: #888; margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 6px; line-height: 1.5; font-style: italic;';
        disclaimer.innerHTML = '⚠️ <strong>Note:</strong> Weather conditions can change rapidly. Forecasts are predictions based on current data and may vary. Please check updates regularly and plan your activities accordingly.';
        future.parentNode.appendChild(disclaimer);
      }
    }
  }catch(e){
    showToast('Unable to load weather right now.', 'error');
  }

  // Lazy load feature images and reveal on scroll
  const features = Array.from(frag.querySelectorAll('.feature'));
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      const el = entry.target;
      if(entry.isIntersecting){
        el.classList.add('is-visible');
        const media = el.querySelector('.feature-media');
        const src = el.getAttribute('data-src');
        if(media && src){ media.style.backgroundImage = `url('${src}')`; }
        obs.unobserve(el);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
  features.forEach(el => io.observe(el));

  // Initialize pool section images
  const poolHero = frag.querySelector('.pool-hero');
  if (poolHero) {
    const src = poolHero.getAttribute('data-src');
    if (src) poolHero.style.backgroundImage = `url('${src}')`;
  }

  const poolGalleryItems = Array.from(frag.querySelectorAll('.pool-gallery-item'));
  poolGalleryItems.forEach(item => {
    const src = item.getAttribute('data-src');
    if (src) item.style.backgroundImage = `url('${src}')`;
  });

  const wrapper = document.createElement('div');
  wrapper.appendChild(frag);
  
  // Initialize promotional banner after DOM insertion
  setTimeout(() => {
    initPromoBanner();
  }, 100);

  // Initialize pool section scroll animation
  setTimeout(() => {
    initPoolScrollAnimation();
  }, 150);
  
  return wrapper;
}

// Pool section scroll animation - resets on each view like gallery
function initPoolScrollAnimation() {
  const poolSection = document.getElementById('section-pool');
  if (!poolSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add visible class when scrolling into view
        entry.target.classList.add('is-visible');
      } else {
        // Remove visible class when scrolling out of view - this resets the animation
        entry.target.classList.remove('is-visible');
      }
    });
  }, {
    threshold: 0.15, // Trigger when 15% of the section is visible
    rootMargin: '0px 0px -50px 0px' // Start slightly before it comes into view
  });

  observer.observe(poolSection);
}


