import express from 'express';
import { mockClient } from '../db/databaseClient.js';

const router = express.Router();

// Health check for mock API
router.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Mock API is running',
    routes: ['GET /mock/bookings', 'POST /mock/bookings']
  });
});

// GET /mock/bookings - Get all bookings (no auth required)
router.get('/bookings', (req, res) => {
  try {
    const { userId, email } = req.query;
    console.log('[MockBookings] GET /bookings called', userId || email ? `(filtered by ${userId ? 'userId' : 'email'})` : '(all bookings)');
    let bookings = Array.from(mockClient.tables.bookings.values());
    
    // Filter by user if provided (for MyBookings page)
    if (userId || email) {
      bookings = bookings.filter(booking => {
        const matchesId = userId && booking.user_id === userId;
        const matchesEmail = email && booking.guest_email === email;
        return matchesId || matchesEmail;
      });
      console.log('[MockBookings] Filtered to', bookings.length, 'bookings for user');
    } else {
      console.log('[MockBookings] Found', bookings.length, 'bookings (no filter - for calendar)');
    }
    
    // Enrich with booking items and package info
    const enrichedBookings = bookings.map(booking => {
      const items = Array.from(mockClient.tables.booking_items.values())
        .filter(item => item.booking_id === booking.id);
      
      const packageData = mockClient.tables.packages.get(String(booking.package_id));
      
      return {
        ...booking,
        booking_items: items || [],
        packages: packageData || null
      };
    });
    
    console.log('[MockBookings] Returning', enrichedBookings.length, 'enriched bookings');
    res.json({ success: true, data: enrichedBookings });
  } catch (error) {
    console.error('[MockBookings] Fetch error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch bookings' });
  }
});

// POST /mock/bookings - Create new booking (no auth required)
router.post('/bookings', async (req, res) => {
  try {
    const { 
      packageId, 
      checkIn, 
      checkOut, 
      guests,
      totalCost,
      paymentMode,
      perRoomGuests,
      contactNumber,
      specialRequests,
      selectedCottages,
      selectedHall
    } = req.body;

    console.log('[MockBookings] Creating booking:', { packageId, checkIn, checkOut });

    // Verify package exists
    const packageData = mockClient.tables.packages.get(String(packageId));
    if (!packageData) {
      return res.status(404).json({
        success: false,
        error: `Package not found (ID: ${packageId})`
      });
    }

    // Generate booking ID
    const bookingId = Date.now().toString();
    const userId = req.body.userId || 'mock-user-1'; // Default user for mock mode
    const guestEmail = req.body.email || null; // Store guest email for user filtering
    const category = req.body.category || 'rooms'; // Store category (rooms, cottages, function-halls)

    // Create booking
    const booking = {
      id: bookingId,
      user_id: userId,
      guest_email: guestEmail,
      package_id: packageId,
      check_in: checkIn,
      check_out: checkOut,
      guests: guests,
      total_cost: totalCost,
      payment_mode: paymentMode,
      contact_number: contactNumber,
      special_requests: specialRequests || '',
      category: category, // Store category for filtering and re-edit
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    console.log('[MockBookings] Creating booking with user association:', { userId, email: guestEmail });

    mockClient.tables.bookings.set(bookingId, booking);

    // Create booking items for rooms
    if (perRoomGuests && perRoomGuests.length > 0) {
      perRoomGuests.forEach(room => {
        const itemId = `${bookingId}-${room.roomId}`;
        mockClient.tables.booking_items.set(itemId, {
          id: itemId,
          booking_id: bookingId,
          item_type: 'room',
          item_id: room.roomId,
          guest_name: room.guestName,
          adults: room.adults,
          children: room.children
        });
      });
    }

    // Create booking items for cottages
    if (selectedCottages && selectedCottages.length > 0) {
      selectedCottages.forEach((cottageId, index) => {
        const itemId = `${bookingId}-cottage-${index}`;
        mockClient.tables.booking_items.set(itemId, {
          id: itemId,
          booking_id: bookingId,
          item_type: 'cottage',
          item_id: cottageId
        });
      });
    }

    // Create booking items for function halls
    if (selectedHall) {
      const itemId = `${bookingId}-hall`;
      mockClient.tables.booking_items.set(itemId, {
        id: itemId,
        booking_id: bookingId,
        item_type: 'function-hall',
        item_id: selectedHall
      });
    }

    // Get booking items for response
    const bookingItems = Array.from(mockClient.tables.booking_items.values())
      .filter(item => item.booking_id === bookingId);

    const bookingResponse = {
      ...booking,
      booking_items: bookingItems,
      packages: packageData
    };

    console.log('[MockBookings] Booking created:', bookingId);

    res.status(201).json({
      success: true,
      data: bookingResponse
    });
  } catch (error) {
    console.error('[MockBookings] Create error:', error);
    res.status(500).json({ success: false, error: 'Failed to create booking' });
  }
});

// PATCH /mock/bookings/:id - Update existing booking (no auth required)
router.patch('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    console.log('[MockBookings] Updating booking:', id, updates);
    
    // Get existing booking
    const existingBooking = mockClient.tables.bookings.get(id);
    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        error: `Booking not found (ID: ${id})`
      });
    }
    
    // Permission check: verify user owns this booking
    const requestUserId = updates.userId;
    const requestEmail = updates.email;
    const bookingUserId = existingBooking.user_id;
    const bookingEmail = existingBooking.guest_email;
    
    if (requestUserId || requestEmail) {
      const isOwner = (requestUserId && bookingUserId === requestUserId) || 
                      (requestEmail && bookingEmail === requestEmail);
      if (!isOwner) {
        console.log('[MockBookings] Unauthorized edit attempt:', {
          requestUserId,
          requestEmail,
          bookingUserId,
          bookingEmail
        });
        return res.status(403).json({
          success: false,
          error: 'Unauthorized: Cannot edit this booking'
        });
      }
    }
    
    // If package is changing, verify it exists
    if (updates.packageId && updates.packageId !== existingBooking.package_id) {
      const packageData = mockClient.tables.packages.get(String(updates.packageId));
      if (!packageData) {
        return res.status(404).json({
          success: false,
          error: `Package not found (ID: ${updates.packageId})`
        });
      }
    }
    
    // Update booking
    const updatedBooking = {
      ...existingBooking,
      package_id: updates.packageId || existingBooking.package_id,
      check_in: updates.checkIn || existingBooking.check_in,
      check_out: updates.checkOut || existingBooking.check_out,
      guests: updates.guests || existingBooking.guests,
      total_cost: updates.totalCost || existingBooking.total_cost,
      payment_mode: updates.paymentMode || existingBooking.payment_mode,
      contact_number: updates.contactNumber || existingBooking.contact_number,
      special_requests: updates.specialRequests !== undefined ? updates.specialRequests : existingBooking.special_requests,
      category: updates.category || existingBooking.category || 'rooms', // Preserve category or default to rooms
      updated_at: new Date().toISOString()
    };
    
    mockClient.tables.bookings.set(id, updatedBooking);
    
    // Update booking items if provided
    if (updates.perRoomGuests) {
      // Remove old room items
      Array.from(mockClient.tables.booking_items.values())
        .filter(item => item.booking_id === id && item.item_type === 'room')
        .forEach(item => mockClient.tables.booking_items.delete(item.id));
      
      // Add new room items
      updates.perRoomGuests.forEach(room => {
        const itemId = `${id}-${room.roomId}`;
        mockClient.tables.booking_items.set(itemId, {
          id: itemId,
          booking_id: id,
          item_type: 'room',
          item_id: room.roomId,
          guest_name: room.guestName,
          adults: room.adults,
          children: room.children
        });
      });
    }
    
    // Update cottages if provided
    if (updates.selectedCottages) {
      // Remove old cottage items
      Array.from(mockClient.tables.booking_items.values())
        .filter(item => item.booking_id === id && item.item_type === 'cottage')
        .forEach(item => mockClient.tables.booking_items.delete(item.id));
      
      // Add new cottage items
      updates.selectedCottages.forEach((cottageId, index) => {
        const itemId = `${id}-cottage-${index}`;
        mockClient.tables.booking_items.set(itemId, {
          id: itemId,
          booking_id: id,
          item_type: 'cottage',
          item_id: cottageId
        });
      });
    }
    
    // Update function halls if provided
    if (updates.selectedHall) {
      // Remove old function hall items
      Array.from(mockClient.tables.booking_items.values())
        .filter(item => item.booking_id === id && item.item_type === 'function-hall')
        .forEach(item => mockClient.tables.booking_items.delete(item.id));
      
      // Add new function hall item
      const itemId = `${id}-hall`;
      mockClient.tables.booking_items.set(itemId, {
        id: itemId,
        booking_id: id,
        item_type: 'function-hall',
        item_id: updates.selectedHall
      });
    }
    
    // Get updated booking items
    const bookingItems = Array.from(mockClient.tables.booking_items.values())
      .filter(item => item.booking_id === id);
    
    const packageData = mockClient.tables.packages.get(String(updatedBooking.package_id));
    
    const bookingResponse = {
      ...updatedBooking,
      booking_items: bookingItems,
      packages: packageData
    };
    
    console.log('[MockBookings] Booking updated:', id);
    
    res.json({
      success: true,
      data: bookingResponse
    });
  } catch (error) {
    console.error('[MockBookings] Update error:', error);
    res.status(500).json({ success: false, error: 'Failed to update booking' });
  }
});

// DELETE /mock/bookings/:id - Cancel booking (no auth required)
router.delete('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, email } = req.query; // Get from query params
    
    console.log('[MockBookings] Cancelling booking:', id, { userId, email });
    
    const existingBooking = mockClient.tables.bookings.get(id);
    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        error: `Booking not found (ID: ${id})`
      });
    }
    
    // Permission check: verify user owns this booking
    if (userId || email) {
      const bookingUserId = existingBooking.user_id;
      const bookingEmail = existingBooking.guest_email;
      const isOwner = (userId && bookingUserId === userId) || 
                      (email && bookingEmail === email);
      if (!isOwner) {
        console.log('[MockBookings] Unauthorized cancel attempt:', {
          requestUserId: userId,
          requestEmail: email,
          bookingUserId,
          bookingEmail
        });
        return res.status(403).json({
          success: false,
          error: 'Unauthorized: Cannot cancel this booking'
        });
      }
    }
    
    // Update status to cancelled instead of deleting
    const cancelledBooking = {
      ...existingBooking,
      status: 'cancelled',
      updated_at: new Date().toISOString()
    };
    
    mockClient.tables.bookings.set(id, cancelledBooking);
    
    console.log('[MockBookings] Booking cancelled:', id);
    
    res.json({
      success: true,
      data: cancelledBooking,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('[MockBookings] Cancel error:', error);
    res.status(500).json({ success: false, error: 'Failed to cancel booking' });
  }
});

// Category normalization helper - handles singular/plural forms and undefined
function normalizeCategory(category) {
  if (!category) return 'rooms'; // Default fallback
  
  const normalized = category.toLowerCase().trim();
  
  // Handle singular and plural forms
  if (normalized === 'room' || normalized === 'rooms') return 'rooms';
  if (normalized === 'cottage' || normalized === 'cottages') return 'cottages';
  if (normalized === 'function-hall' || normalized === 'function-halls' || normalized === 'functionhall' || normalized === 'functionhalls') {
    return 'function-halls';
  }
  
  // Return as-is if already in correct format
  return normalized;
}

// GET /mock/bookings/availability/:packageId - Check availability (no auth required)
router.get('/bookings/availability/:packageId', async (req, res) => {
  console.log('[MockAvailability] ⚡ Availability endpoint hit!');
  try {
    const { packageId } = req.params;
    const { checkIn, checkOut, category, excludeBookingId } = req.query;
    
    // Normalize requested category
    const requestedCategory = normalizeCategory(category);
    
    console.log(`[MockAvailability] Request for package ${packageId} from ${checkIn} to ${checkOut}, category: ${category || 'all'} (normalized: ${requestedCategory}), excludeBookingId: ${excludeBookingId || 'none'}`);
    console.log(`[MockAvailability] Full query params:`, req.query);
    console.log(`[MockAvailability] Request URL:`, req.originalUrl);
    
    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        error: 'Check-in and check-out dates required'
      });
    }
    
    // Map normalized category to itemType for booking_items filtering
    const itemTypeMap = {
      'rooms': 'room',
      'cottages': 'cottage',
      'function-halls': 'function-hall'
    };
    const itemType = itemTypeMap[requestedCategory] || 'room';
    
    console.log(`[MockAvailability] Looking for item_type='${itemType}' for category '${requestedCategory}'`);
    
    // Get all bookings from mock database
    const allBookings = Array.from(mockClient.tables.bookings.values());
    
    // Add debug logging
    console.log(`[MockAvailability] Total bookings in mock DB: ${allBookings.length}`);
    if (allBookings.length > 0) {
      console.log(`[MockAvailability] Sample booking IDs: ${allBookings.slice(0, 3).map(b => b.id).join(', ')}`);
      
      // Log booking categories found in database for diagnostic purposes
      const bookingCategories = allBookings.map(b => b.category || 'undefined').filter((cat, idx, arr) => arr.indexOf(cat) === idx);
      console.log(`[MockAvailability] Booking categories found in DB:`, bookingCategories);
      console.log(`[MockAvailability] Example booking categories (first 5):`, 
        allBookings.slice(0, 5).map(b => ({ id: b.id, category: b.category || 'undefined' })));
    }
    
    // Helper function to normalize date strings to YYYY-MM-DD format (returns string, not Date)
    function normalizeDateString(dateStr) {
      if (!dateStr) return null;
      const dateStrTrimmed = dateStr.trim();
      
      // If already in YYYY-MM-DD format, return as-is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStrTrimmed)) {
        return dateStrTrimmed;
      }
      
      // Parse date and extract local date components (avoid timezone issues)
      const d = dateStrTrimmed.includes('T') 
        ? new Date(dateStrTrimmed)
        : new Date(dateStrTrimmed + 'T00:00:00');
      
      // Return YYYY-MM-DD string using local date components
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    // Filter for relevant bookings (pending/confirmed, matching package, date overlap)
    // Normalize dates to YYYY-MM-DD strings to avoid timezone issues
    const checkInDateStr = normalizeDateString(checkIn);
    const checkOutDateStr = normalizeDateString(checkOut);
    
    console.log(`[MockAvailability] Normalized checkIn: ${checkInDateStr}, checkOut: ${checkOutDateStr}`);
    console.log(`[MockAvailability] Original dates checkIn: ${checkIn}, checkOut: ${checkOut}`);
    
    if (!checkInDateStr || !checkOutDateStr) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid date format. Use YYYY-MM-DD.' 
      });
    }
    
    // Filter bookings by category (if provided) - this ensures category-specific availability
    const relevantBookings = allBookings.filter(booking => {
      if (booking.package_id != packageId) return false;
      if (!['pending', 'confirmed'].includes(booking.status)) return false;
      
      // Filter by category if specified - normalize both sides for comparison
      if (category) {
        // Try booking.category first, then fallback to inferring from booking_items or default to 'rooms'
        let bookingCategory = booking.category;
        
        // If booking doesn't have category field, try to infer from booking_items
        if (!bookingCategory) {
          const bookingItems = Array.from(mockClient.tables.booking_items.values())
            .filter(item => item.booking_id === booking.id);
          
          if (bookingItems.length > 0) {
            const itemTypes = bookingItems.map(item => item.item_type).filter((type, idx, arr) => arr.indexOf(type) === idx);
            // Infer category from item_type (prioritize non-room types)
            if (itemTypes.includes('function-hall')) {
              bookingCategory = 'function-halls';
            } else if (itemTypes.includes('cottage')) {
              bookingCategory = 'cottages';
            } else {
              bookingCategory = 'rooms'; // Default (or if only rooms found)
            }
          } else {
            bookingCategory = 'rooms'; // No items found, default to rooms
          }
          console.log(`[MockAvailability] Inferred category '${bookingCategory}' from booking_items for booking ${booking.id}`);
        }
        
        // Normalize both categories before comparison
        const normalizedBookingCategory = normalizeCategory(bookingCategory);
        
        if (normalizedBookingCategory !== requestedCategory) {
          return false; // Skip bookings that don't match the requested category
        }
      }
      
      // Exclude the booking being re-edited from conflict checks
      if (excludeBookingId && booking.id == excludeBookingId) {
        console.log(`[MockAvailability] Excluding booking ${booking.id} from conflict checks (re-edit mode)`);
        return false;
      }
      
      // Normalize booking dates to YYYY-MM-DD strings
      const bookingStart = normalizeDateString(booking.check_in);
      const bookingEnd = normalizeDateString(booking.check_out);
      
      if (!bookingStart || !bookingEnd) return false;
      
      // Robust overlap: booking intersects selected range in any way
      // Overlap if booking starts on/before checkout AND ends on/after check-in
      return bookingStart <= checkOutDateStr && bookingEnd >= checkInDateStr;
    });
    
    console.log(`[MockAvailability] Filtered to ${relevantBookings.length} bookings for category '${requestedCategory}' (from ${allBookings.length} total)`);
    if (category) {
      // Show counts by normalized category
      const bookingsByCategory = allBookings.filter(b => {
        const bookingCat = normalizeCategory(b.category);
        return bookingCat === requestedCategory;
      }).length;
      console.log(`[MockAvailability] Total bookings matching normalized category '${requestedCategory}': ${bookingsByCategory}`);
      console.log(`[MockAvailability] Processing itemType: '${itemType}' for category: '${requestedCategory}'`);
    }
    
    // Get booking items for these bookings
    const bookedItems = [];
    relevantBookings.forEach(booking => {
      const items = Array.from(mockClient.tables.booking_items.values())
        .filter(item => item.booking_id === booking.id && item.item_type === itemType);
      
      items.forEach(item => {
        bookedItems.push({
          ...item,
          booking: booking
        });
      });
    });
    
    console.log(`[MockAvailability] Found ${bookedItems.length} booked items of type '${itemType}' for category '${category || 'all'}'`);
    try {
      const typeSample = Array.from(new Set(bookedItems.map(b => b.item_type))).join(', ');
      console.log('[MockAvailability] Item types seen in bookedItems:', typeSample || 'none');
    } catch {}

    // Build an upfront overlap exclusion set for the entire selected range
    // Any item that appears in any overlapping booking is excluded from availableRooms
    const overlappingBookedItemIds = new Set();
    relevantBookings.forEach(booking => {
      const bookingStart = normalizeDateString(booking.check_in);
      const bookingEnd = normalizeDateString(booking.check_out);
      const items = bookedItems
        .filter(bi => bi.booking.id === booking.id)
        .map(bi => String(bi.item_id).trim());
      if (items.length > 0) {
        items.forEach(id => overlappingBookedItemIds.add(id));
        console.log(`[Availability] Excluding ${items.join(', ')} — overlaps with ${bookingStart} to ${bookingEnd}`);
      }
    });
    if (overlappingBookedItemIds.size > 0) {
      console.log('[Availability] Final exclusion set for request:', Array.from(overlappingBookedItemIds).join(', '));
    } else {
      console.log('[Availability] No overlapping items found for request — no upfront exclusions applied');
    }
    
    // Additional debug: show date ranges being processed
    console.log(`[MockAvailability] Processing date range (exclusive checkout): ${checkInDateStr} to ${checkOutDateStr}`);
    
    // Define available items based on type
    let allItems;
    if (itemType === 'room') {
      allItems = ['Room A1', 'Room A2', 'Room A3', 'Room A4'];
    } else if (itemType === 'cottage') {
      allItems = ['Standard Cottage', 'Garden Cottage', 'Family Cottage'];
    } else if (itemType === 'function-hall') {
      allItems = ['Grand Function Hall', 'Intimate Function Hall'];
    } else {
      allItems = [];
    }
    
    console.log(`[MockAvailability] Defined ${allItems.length} available items for itemType '${itemType}':`, allItems);
    
    // Build date-by-date availability map using pure string iteration
    const dateAvailability = {};
    const bookedDates = [];
    
    // Parse check-in and check-out dates as local dates for iteration
    const [checkInYear, checkInMonth, checkInDay] = checkInDateStr.split('-').map(Number);
    const [checkOutYear, checkOutMonth, checkOutDay] = checkOutDateStr.split('-').map(Number);
    
    console.log(`[MockAvailability] 🔍 DATE LOOP STARTING: checkIn=${checkInDateStr}, checkOut=${checkOutDateStr}`);
    console.log(`[MockAvailability] 🔍 Parsed dates: Year=${checkInYear}, Month=${checkInMonth}, Day=${checkInDay}`);
    
    // Iterate through dates using pure string arithmetic (avoid timezone issues)
    let currentYear = checkInYear;
    let currentMonth = checkInMonth;
    let currentDay = checkInDay;
    let iterationCount = 0;
    
    while (true) {
      iterationCount++;
      console.log(`[MockAvailability] 🔁 Loop iteration ${iterationCount}: currentDate=${currentYear}-${currentMonth}-${currentDay}`);
      
      // Build date string
      const dateString = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;
      console.log(`[MockAvailability] 🔁 Built dateString="${dateString}", checkOutDateStr="${checkOutDateStr}"`);
      console.log(`[MockAvailability] 🔁 Comparison: "${dateString}" > "${checkOutDateStr}" = ${dateString > checkOutDateStr}`);
      
      // Stop once we reach checkout date (exclusive checkout semantics)
      // Changed from >= to > to support single-day bookings where checkIn === checkOut
      if (dateString > checkOutDateStr) {
        console.log(`[MockAvailability] 🛑 Loop terminating: dateString > checkOutDateStr`);
        break;
      }
      
      const bookedIds = [];
      
      // Check each booked item for this date using string comparison
      bookedItems.forEach(item => {
        // Defensive guard against undefined items or item_ids
        if (!item || !item.item_id) return;
        
        const booking = item.booking;
        // Normalize booking dates to YYYY-MM-DD strings
        const bookingCheckIn = normalizeDateString(booking.check_in);
        const bookingCheckOut = normalizeDateString(booking.check_out);
        
        if (!bookingCheckIn || !bookingCheckOut) return;
        
        // Check if this is a single-day booking (cottage/function hall)
        const isSingleDayBooking = bookingCheckIn === bookingCheckOut;
        
        // For single-day bookings, use inclusive comparison
        // For multi-day bookings, use [check_in, check_out) semantics
        const isDateBooked = isSingleDayBooking 
          ? dateString === bookingCheckIn
          : (dateString >= bookingCheckIn && dateString < bookingCheckOut);
        
        if (isDateBooked) {
          if (!bookedIds.includes(item.item_id)) {
            bookedIds.push(item.item_id);
          }
          
          // Enhanced logging for single-day bookings
          if (isSingleDayBooking && itemType === 'cottage') {
            console.log(`[MockAvailability] Date ${dateString}: isSingleDay=true, isBooked=true, bookingCheckIn=${bookingCheckIn}, item=${item.item_id}`);
          }
          
          bookedDates.push({
            date: dateString,
            bookingStart: booking.check_in,
            bookingEnd: booking.check_out,
            itemId: item.item_id,
            guestName: item.guest_name,
            adults: item.adults,
            children: item.children
          });
        }
      });
      
      // Calculate availability per day: only remove items booked on THIS date
      const availableItems = allItems.filter(id => !bookedIds.includes(id));

      // Per-day diagnostics: log booked and available arrays
      if (itemType === 'room') {
        console.log(`[MockAvailability] date ${dateString}: bookedRooms=[${bookedIds.join(', ')}], availableRooms=[${availableItems.join(', ')}]`);
      } else {
        console.log(`[MockAvailability] date ${dateString}: bookedItems=[${bookedIds.join(', ')}], availableItems=[${availableItems.join(', ')}], category=${requestedCategory}`);
      }

      // Optional assertion: ensure disjoint sets and counts sum to total
      try {
        const overlap = bookedIds.filter(id => availableItems.includes(id));
        if (overlap.length > 0) {
          console.warn(`[MockAvailability] ⚠️ Assertion failed: overlap between booked and available on ${dateString}:`, overlap);
        }
        const total = availableItems.length + bookedIds.length;
        if (total > allItems.length) {
          console.warn(`[MockAvailability] ⚠️ Assertion failed: counts exceed total on ${dateString}: booked=${bookedIds.length}, available=${availableItems.length}, total=${allItems.length}`);
        }
      } catch (e) {
        // ignore
      }
      
      let status;
      if (itemType === 'room') {
        if (availableItems.length === 0) {
          status = 'booked-all';
        } else if (availableItems.length === 4) {
          status = 'available-all';
        } else {
          status = `available-${availableItems.length}`;
        }
        
        dateAvailability[dateString] = {
          status: status,
          availableCount: availableItems.length,
          bookedCount: bookedIds.length,
          bookedRooms: bookedIds,
          availableRooms: availableItems
        };
      } else if (itemType === 'cottage') {
        // Granular cottage status matching real endpoint
        if (bookedIds.length === 0) {
          status = 'cottage-available';
        } else if (bookedIds.length === allItems.length) {
          status = 'cottage-booked-all';
        } else {
          status = 'cottage-booked-partial';
        }
        
        console.log(`[MockAvailability] Building response for ${dateString}, itemType: ${itemType}, category: ${requestedCategory}, status: ${status}`);
        
        dateAvailability[dateString] = {
          status: status,
          isBooked: bookedIds.length > 0,
          bookedCount: bookedIds.length,
          availableCount: availableItems.length,
          bookedItems: bookedIds,
          availableItems: availableItems,
          bookedCottages: bookedIds,
          availableCottages: availableItems,
          category: requestedCategory
        };
        
        console.log(`[MockAvailability] ✅ Created dateAvailability entry for ${dateString}`);
        console.log(`[MockAvailability]    status=${status}, bookedCount=${bookedIds.length}, availableCount=${availableItems.length}`);
        console.log(`[MockAvailability]    bookedCottages=${JSON.stringify(bookedIds)}, availableCottages=${JSON.stringify(availableItems)}`);
        
        // Enhanced logging for booked cottages
        if (bookedIds.length > 0) {
          console.log(`[MockAvailability] ⚠️  ${dateString} HAS BOOKINGS: bookedCount=${bookedIds.length}, isBooked=true, status=${status}`);
        }
      } else {
        // Function hall (use same logic as cottages)
        if (bookedIds.length === 0) {
          status = 'cottage-available';
        } else if (bookedIds.length === allItems.length) {
          status = 'cottage-booked-all';
        } else {
          status = 'cottage-booked-partial';
        }
        
        console.log(`[MockAvailability] Building response for ${dateString}, itemType: ${itemType}, category: ${requestedCategory}, status: ${status}`);
        
        dateAvailability[dateString] = {
          status: status,
          isBooked: bookedIds.length > 0,
          bookedCount: bookedIds.length,
          availableCount: availableItems.length,
          bookedItems: bookedIds,
          availableItems: availableItems,
          bookedHalls: bookedIds,
          availableHalls: availableItems,
          category: requestedCategory
        };
        
        // Enhanced logging for booked function halls
        if (bookedIds.length > 0) {
          console.log(`[MockAvailability] ${dateString}: bookedCount=${bookedIds.length}, isBooked=true, status=${status}, bookedHalls=${JSON.stringify(bookedIds)}, availableHalls=${JSON.stringify(availableItems)}`);
        }
      }
      
      // Move to next day using pure date arithmetic
      const daysInCurrentMonth = new Date(currentYear, currentMonth, 0).getDate();
      currentDay++;
      if (currentDay > daysInCurrentMonth) {
        currentDay = 1;
        currentMonth++;
        if (currentMonth > 12) {
          currentMonth = 1;
          currentYear++;
        }
      }
      
      // Safety check to prevent infinite loops
      if (currentYear > checkOutYear || 
          (currentYear === checkOutYear && currentMonth > checkOutMonth) ||
          (currentYear === checkOutYear && currentMonth === checkOutMonth && currentDay > checkOutDay)) {
        break;
      }
    }
    
    // Calculate overall availability
    const allDatesAvailable = Object.values(dateAvailability).every(day => 
      itemType === 'room' ? day.availableCount > 0 : !day.isBooked
    );
    
    const avgAvailability = itemType === 'room' 
      ? Math.round(Object.values(dateAvailability).reduce((sum, day) => sum + day.availableCount, 0) / Object.keys(dateAvailability).length)
      : (allDatesAvailable ? allItems.length : 0);
    
    // Count booked dates for debug logging
    const bookedDateCount = Object.values(dateAvailability).filter(day => 
      itemType === 'room' ? day.availableCount === 0 : day.isBooked
    ).length;
    
    console.log(`[MockAvailability] Category '${requestedCategory}': Overall availability: ${allDatesAvailable}, avg: ${avgAvailability}, booked dates: ${bookedDateCount}/${Object.keys(dateAvailability).length}`);
    console.log(`[MockAvailability] 📋 Final dateAvailability keys:`, Object.keys(dateAvailability));
    console.log(`[MockAvailability] 📋 Final dateAvailability object:`, JSON.stringify(dateAvailability, null, 2));

    // Compute range-level availability across the entire requested window
    // Rooms: list those free on every date in the range
    let rangeAvailableRooms = [];
    let rangeBookedItems = [];
    if (itemType === 'room') {
      const rangeBookedSet = new Set();
      Object.values(dateAvailability).forEach(day => {
        if (Array.isArray(day.bookedRooms)) {
          day.bookedRooms.forEach(id => rangeBookedSet.add(id));
        }
      });
      rangeBookedItems = Array.from(rangeBookedSet);
      rangeAvailableRooms = allItems.filter(id => !rangeBookedSet.has(id));
      console.log(`[RangeAvailability] Final available rooms for ${checkInDateStr}→${checkOutDateStr}:`, rangeAvailableRooms);
    } else {
      const rangeBookedSet = new Set();
      Object.values(dateAvailability).forEach(day => {
        const bookedArr = requestedCategory === 'function-halls' ? day.bookedHalls : day.bookedCottages;
        if (Array.isArray(bookedArr)) bookedArr.forEach(id => rangeBookedSet.add(id));
      });
      rangeBookedItems = Array.from(rangeBookedSet);
    }

    res.json({
      success: true,
      available: allDatesAvailable,
      avgRoomAvailability: avgAvailability,
      dateAvailability: dateAvailability,
      bookedDates: bookedDates,
      rangeAvailableRooms: itemType === 'room' ? rangeAvailableRooms : undefined,
      rangeBookedItems: rangeBookedItems,
      message: allDatesAvailable ? 'Accommodation available' : 'Fully booked for selected dates'
    });
  } catch (error) {
    console.error('[MockAvailability] Error:', error);
    res.status(500).json({ success: false, error: 'Failed to check availability' });
  }
});

export default router;

