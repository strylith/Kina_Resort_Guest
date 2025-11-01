// Luxury Resort Card Component
export function createLuxuryCard(cardData) {
  const {
    image,
    title,
    price,
    description,
    onBook,
    groupDiscount = false,
    discountText = '10% off for groups of 4+ guests'
  } = cardData;

  const card = document.createElement('div');
  card.className = 'luxury-card';
  
  // Add discount badge HTML if discount is enabled
  const discountBadgeHTML = groupDiscount ? `
    <div class="discount-badge">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
      Group Discount
    </div>
  ` : '';
  
  // Show discount info in hover content if available
  const discountInfoHTML = groupDiscount ? `
    <div class="discount-info">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 6v6l4 2"></path>
      </svg>
      <span>${discountText}</span>
    </div>
  ` : '';
  
  card.innerHTML = `
    <div class="relative h-full w-full overflow-hidden">
      ${discountBadgeHTML}
      <!-- Background Image -->
      <img 
        src="${image}" 
        alt="${title}"
        class="w-full h-full object-cover"
        loading="lazy"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
      />
      <!-- Fallback background -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600" style="display: none;"></div>
      
      <!-- Content Container -->
      <div class="content-container">
        <!-- Always Visible Content -->
        <div class="always-visible">
          <h3 class="card-title">${title}</h3>
          <p class="card-price">${price}</p>
        </div>
        
        <!-- Hover-Only Content -->
        <div class="hover-content">
          <p class="card-description">${description}</p>
          ${discountInfoHTML}
          <button 
            class="book-button"
            onclick="handleBookNow('${title}')"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  `;

  return card;
}

// Handle Book Now button click
window.handleBookNow = function(packageName, category = null) {
  // Determine reservation type and category from package name or explicit parameter
  let reservationType = 'room';
  let calendarCategory = 'rooms';
  let packageTitle = 'Standard Room';
  let reservationCount = 4;
  
  // Use explicit category if provided, otherwise infer from package name
  if (category === 'cottages' || packageName.includes('Cottage')) {
    reservationType = 'cottage';
    calendarCategory = 'cottages';
    packageTitle = packageName || 'Cottage Booking';
    reservationCount = 8; // Approximate count for cottages
    // Store the selected cottage name for downstream preselection in booking modal
    try { window.preselectedCottageType = packageTitle; } catch(_){}
  } else if (category === 'function-halls' || packageName.includes('Function Hall')) {
    reservationType = 'function-hall';
    calendarCategory = 'function-halls';
    packageTitle = packageName || 'Function Hall Booking';
    reservationCount = 5; // Approximate count for function halls
  } else if (category === 'rooms' || packageName === 'Standard Room' || packageName.includes('Standard Room')) {
    reservationType = 'room';
    calendarCategory = 'rooms';
    packageTitle = 'Standard Room';
    reservationCount = 4;
  }
  
  console.log('[handleBookNow] Opening calendar for category:', calendarCategory, 'package:', packageTitle);
  
  // Open calendar modal for ALL categories (unified flow)
  if (window.openCalendarModal) {
    window.openCalendarModal(packageTitle, reservationCount, calendarCategory);
  } else {
    alert('Calendar modal not loaded');
  }
};

// Create packages grid
export function createPackagesGrid(packages) {
  const grid = document.createElement('div');
  grid.className = 'packages-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8';
  
  packages.forEach(packageData => {
    const card = createLuxuryCard(packageData);
    grid.appendChild(card);
  });
  
  return grid;
}

// All packages data organized by category
export const allPackages = {
  cottages: [
    {
      image: 'images/cottage_1.JPG',
      title: 'Standard Cottage',
      price: '₱9,500/night',
      capacity: 6,
      description: 'Private cottage with scenic views, outdoor seating area, and basic amenities.',
      category: 'cottages',
      groupDiscount: true,
      discountText: '10% off for groups of 4+ guests'
    },
    {
      image: 'images/cottage_2.JPG',
      title: 'Garden Cottage',
      price: '₱7,500/night',
      capacity: 4,
      description: 'Cozy cottage surrounded by tropical gardens, perfect for peaceful relaxation.',
      category: 'cottages',
      groupDiscount: true,
      discountText: '10% off for groups of 4+ guests'
    },
    {
      image: 'images/kina1.jpg',
      title: 'Family Cottage',
      price: '₱10,200/night',
      capacity: 7,
      description: 'Spacious cottage with 2 bedrooms, kitchenette, and living area for families.',
      category: 'cottages',
      groupDiscount: true,
      discountText: '10% off for groups of 4+ guests'
    }
  ],
  rooms: [
    {
      image: 'images/kina1.jpg',
      title: 'Standard Room',
      price: '₱5,500/night',
      description: 'Comfortable room with air conditioning, private bathroom, and garden view.',
      category: 'rooms',
      groupDiscount: true,
      discountText: '10% off for groups of 4+ guests'
    },
    {
      image: 'images/kina2.jpg',
      title: 'Scenic View Room',
      price: '₱7,200/night',
      description: 'Room with balcony overlooking scenic mountains, perfect for sunset views.',
      category: 'rooms',
      groupDiscount: true,
      discountText: '10% off for groups of 4+ guests'
    },
    {
      image: 'images/kina3.jpg',
      title: 'Deluxe Suite',
      price: '₱8,500/night',
      description: 'Spacious suite with separate living area, mini-fridge, and premium amenities.',
      category: 'rooms',
      groupDiscount: true,
      discountText: '10% off for groups of 4+ guests'
    },
    {
      image: 'images/resort1.JPG',
      title: 'Premium King',
      price: '₱7,500/night',
      description: 'Executive comfort with elegant design and premium furnishings.',
      category: 'rooms',
      groupDiscount: true,
      discountText: '10% off for groups of 4+ guests'
    }
  ],
  menu: [
    {
      image: 'images/kina1.jpg',
      title: 'Breakfast Package',
      price: '₱800/person',
      description: 'Continental breakfast with local fruits, coffee, and tropical juices.',
      category: 'menu',
      groupDiscount: true,
      discountText: '10% off for groups of 4+ guests'
    },
    {
      image: 'images/kina2.jpg',
      title: 'Lunch Special',
      price: '₱1,200/person',
      description: 'Fresh seafood lunch with local specialties and tropical drinks.',
      category: 'menu',
      groupDiscount: true,
      discountText: '10% off for groups of 4+ guests'
    },
    {
      image: 'images/kina3.jpg',
      title: 'Dinner Experience',
      price: '₱1,800/person',
      description: '3-course dinner featuring local cuisine and fresh catch of the day.',
      category: 'menu',
      groupDiscount: true,
      discountText: '10% off for groups of 4+ guests'
    },
    {
      image: 'images/resort1.JPG',
      title: 'All-Day Dining',
      price: '₱2,500/person',
      description: 'Breakfast, lunch, and dinner with unlimited non-alcoholic beverages.',
      category: 'menu',
      groupDiscount: true,
      discountText: '10% off for groups of 4+ guests'
    }
  ],
  activities: [
    {
      image: 'images/pool.jpg',
      title: 'Water Sports Package',
      price: '₱1,500/person',
      description: 'Snorkeling gear, kayak rental, and paddleboard access for the day.',
      category: 'activities',
      groupDiscount: true,
      discountText: '10% off for groups of 4+ guests'
    },
    {
      image: 'images/kina2.jpg',
      title: 'Island Tour',
      price: '₱2,000/person',
      description: 'Half-day boat tour to nearby islands with lunch and snorkeling.',
      category: 'activities',
      groupDiscount: true,
      discountText: '10% off for groups of 4+ guests'
    },
    {
      image: 'images/kina3.jpg',
      title: 'Spa Treatment',
      price: '₱1,800/person',
      description: '60-minute massage with tropical oils and relaxation treatment.',
      category: 'activities',
      groupDiscount: true,
      discountText: '10% off for groups of 4+ guests'
    },
    {
      image: 'images/resort1.JPG',
      title: 'Cultural Tour',
      price: '₱1,200/person',
      description: 'Guided tour of local villages, markets, and cultural sites.',
      category: 'activities',
      groupDiscount: true,
      discountText: '10% off for groups of 4+ guests'
    },
    {
      image: 'images/kina1.jpg',
      title: 'Fishing Trip',
      price: '₱2,500/person',
      description: '4-hour fishing excursion with equipment and guide included.',
      category: 'activities',
      groupDiscount: true,
      discountText: '10% off for groups of 4+ guests'
    },
    {
      image: 'images/pool_2.jpg',
      title: 'Sunset Cruise',
      price: '₱1,500/person',
      description: 'Evening boat ride with drinks and snacks to watch the sunset.',
      category: 'activities',
      groupDiscount: true,
      discountText: '10% off for groups of 4+ guests'
    }
  ],
  functionHalls: [
    {
      image: 'images/Function Hall.JPG',
      title: 'Grand Function Hall',
      price: '₱15,000/day',
      description: 'Spacious hall perfect for weddings, conferences, and large events. Includes tables, chairs, sound system, and air conditioning.',
      category: 'function-halls',
      capacity: 200,
      groupDiscount: true,
      discountText: 'Special rates for multi-day bookings'
    },
    {
      image: 'images/Function Hall.JPG',
      title: 'Intimate Function Hall',
      price: '₱10,000/day',
      description: 'Cozy hall ideal for birthday parties, meetings, and gatherings. Perfect for smaller celebrations with modern amenities.',
      category: 'function-halls',
      capacity: 100,
      groupDiscount: true,
      discountText: 'Special rates for multi-day bookings'
    }
  ]
};

// Combined packages for search/filter
export const samplePackages = [
  ...allPackages.cottages,
  ...allPackages.rooms,
  ...allPackages.functionHalls
];

// Category Card Component for expandable hover cards
export function createCategoryCard(categoryData) {
  const {
    title,
    price,
    capacity,
    description,
    availableCount,
    category,
    image
  } = categoryData;

  const card = document.createElement('div');
  card.className = 'category-card';
  card.setAttribute('data-category', category);
  
  card.innerHTML = `
    <!-- Image Top -->
    <div class="category-image">
      <img src="${image || 'images/kina1.jpg'}" alt="${title}" loading="lazy">
    </div>

    <!-- Content Below -->
    <div class="category-content">
      <div class="category-info-collapsed">
        <div class="category-header">
          <h3 class="category-title">${title}</h3>
          <span class="category-price">${price}</span>
        </div>
        <div class="category-meta">
          <div class="category-capacity">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Up to ${capacity} guests
          </div>
          <div class="category-count">${availableCount}</div>
          <div class="category-discount">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 6v6l4 2"></path>
            </svg>
            Discounts Available
          </div>
        </div>
      </div>

      <!-- Expanded State (Visible on Hover) -->
      <div class="category-info-expanded">
        <p class="category-description">${description}</p>
        <div class="discount-details">
          <h4>Available Discounts</h4>
          <div class="discount-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 6v6l4 2"></path>
            </svg>
            <span>Children: <strong>10% off</strong></span>
          </div>
          <div class="discount-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Groups of 4+: <strong>10% off</strong></span>
          </div>
        </div>
        <button class="category-book-btn" onclick="handleBookNow('${title}', '${category}')">
          Book Now
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  `;

  return card;
}
