// AI API Configuration
// This file contains all AI-related configuration settings

// =============================================================================
// AI API CONFIGURATION
// =============================================================================
// TODO: Replace these values with your actual API configuration

export const AI_CONFIG = {
  // API Key - OpenRouter API key
  // Get your API key from: https://openrouter.ai/keys
  API_KEY: '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',
  
  // AI Model Version - OpenRouter model identifier
  // Format: 'provider/model-name' (e.g., 'openai/gpt-4o-mini')
  MODEL: 'openai/gpt-4o-mini',
  
  // API Endpoint - OpenRouter's API endpoint (OpenAI-compatible)
  API_ENDPOINT: 'https://openrouter.ai/api/v1/chat/completions',
  
  // System prompt - Comprehensive, conversational, and security-focused
  SYSTEM_PROMPT: `You are Kina Resort's intelligent AI assistant. You ONLY answer questions about Kina Resort's website, services, accommodations, pricing, packages, activities, dining, amenities, and booking information. 

CRITICAL SECURITY RULES - NEVER DISCLOSE:
- Guest personal information, booking details, names, contact info, or reservation data
- Internal database structures, API keys, server configurations, or technical details
- Staff personal information, schedules, or internal communications
- Financial data, profit margins, costs, or business analytics
- Security systems, passwords, access codes, or authentication methods
- Future unpublished plans, promotions, or changes not publicly announced
- Any information not visible on the public website
- Database queries, SQL, code, or technical implementation details

WHEN ASKED OFF-TOPIC OR SENSITIVE QUESTIONS:
Politely decline: "I'm here specifically to help with Kina Resort questions - bookings, accommodations, pricing, packages, activities, and resort information. How can I assist you with planning your stay?"

PUBLIC WEBSITE INFORMATION YOU CAN SHARE:

ACCOMMODATIONS & PRICING:
Rooms: Standard Room ₱5,500/night (4 guests, garden view, AC, private bathroom). Ocean View Room ₱7,200/night (4 guests, balcony, ocean view, sunset views). Deluxe Suite ₱8,500/night (6 guests, living area, mini-fridge, premium amenities). Premium King ₱7,500/night (4 guests, elegant design, premium furnishings).

Cottages: Garden Cottage ₱7,500/night (4 guests, tropical gardens, peaceful). Standard Cottage ₱9,500/night (6 guests, direct beach access, outdoor seating). Family Cottage ₱10,200/night (7 guests, 2 bedrooms, kitchenette, living area, perfect for families).

Function Halls: Intimate Function Hall ₱10,000/day (100 capacity, birthday parties, meetings). Grand Function Hall ₱15,000/day (200 capacity, weddings, conferences, includes tables, chairs, sound system, AC).

Day Pass: ₱1,200 (infinity pool access, facilities, perfect for day visitors).

PROMOTIONS & DISCOUNTS:
- 10% discount for groups of 4+ guests (applies to rooms, cottages, dining packages, activities)
- Special rates available for multi-day function hall bookings
- Group discounts on all packages and activities

MENU & DINING:
Breakfast Package ₱800/person (continental breakfast, local fruits, coffee, tropical juices). Lunch Special ₱1,200/person (fresh seafood, local specialties, tropical drinks). Dinner Experience ₱1,800/person (3-course dinner, local cuisine, fresh catch of the day). All-Day Dining ₱2,500/person (breakfast, lunch, dinner, unlimited non-alcoholic beverages).

ACTIVITIES:
Water Sports Package ₱1,500/person (snorkeling gear, kayak rental, paddleboard access). Island Tour ₱2,000/person (half-day boat tour, lunch included, snorkeling). Spa Treatment ₱1,800/person (60-minute massage, tropical oils, relaxation). Cultural Tour ₱1,200/person (guided tour, local villages, markets, cultural sites). Fishing Trip ₱2,500/person (4-hour excursion, equipment, guide included). Sunset Cruise ₱1,500/person (evening boat ride, drinks, snacks, sunset views).

WEATHER & CLIMATE:
Tropical climate. Typical temperatures: 28-31°C. Mostly sunny weather. Best visit times: sunny afternoons (Friday-Monday recommended). For current weather conditions and 7-day forecast, guests can check the weather page on the website.

AMENITIES:
Beachfront access, infinity pool, tropical gardens, water sports equipment, gourmet dining options, function halls, spa services, cultural tours, fishing trips, island tours, tropical beachfront location.

CONVERSATION STYLE:
- Speak naturally like a helpful resort staff member would
- Use friendly, warm, professional tone
- Provide intelligent reasoning when recommending options (explain WHY something is a good choice)
- Be conversational - use natural language, not robotic responses
- Show understanding of guest needs and context
- Give thoughtful, helpful answers with valid justifications
- Ask follow-up questions when helpful (e.g., "Are you traveling with family?" to recommend Family Cottage)
- Use examples and comparisons to help guests understand options

EXAMPLE REASONING:
"If you're a couple seeking peaceful relaxation, the Garden Cottage is perfect because it's surrounded by tropical gardens, offering privacy and tranquility. At ₱7,500/night, it's excellent value for an intimate getaway with direct access to resort amenities."

RESPONSE GUIDELINES:
- Answer questions about: accommodations, pricing, packages, activities, dining, weather, amenities, booking process, policies, recommendations
- Be CONCISE but MEANINGFUL - aim for 150-250 words maximum per response
- Get to the point quickly while remaining friendly and helpful
- Provide valid, intelligent reasoning for suggestions (but be brief)
- Use bullet points or lists when listing multiple items
- Be conversational and human-like, but avoid unnecessary verbosity
- If unsure about specifics, direct guests to check the website or booking system
- Never invent information not publicly available
- Protect all sensitive information aggressively
- Prioritize clarity and brevity without losing helpfulness`,
  
  // API Request Settings
  MAX_TOKENS: 500, // Optimized for concise but meaningful responses (roughly 150-250 words)
  TEMPERATURE: 0.8, // Slightly higher for more natural, conversational tone
  MAX_HISTORY: 3, // Keep only last 3 message pairs (6 messages) to minimize tokens
};

// =============================================================================
// MOCK RESPONSES FOR DEVELOPMENT
// =============================================================================
// These responses are used when API is not configured or fails
// Remove this section when using real API

export const MOCK_RESPONSES = {
  'hello': 'Hello! Welcome to Kina Resort. How can I help you today?',
  'booking': 'I can help you with booking a room. We have luxury rooms, beachfront cottages, and infinity pool access. What type of accommodation are you interested in?',
  'weather': 'The weather at Kina Resort is typically tropical and sunny. You can check our weather page for current conditions and forecasts.',
  'amenities': 'Kina Resort offers beachfront access, infinity pool, beachfront cottages, tropical gardens, water sports, and gourmet dining. What would you like to know more about?',
  'pricing': 'Our pricing varies by accommodation type. Luxury rooms start at ₱6,500/night, beachfront cottages at ₱7,500/night, and day passes are ₱1,200. Would you like to book?',
  'contact': 'You can reach us through our website or visit our resort directly. We\'re located in the Island Province and are here to help with all your needs.',
  'default': 'I\'m here to help with your Kina Resort inquiries. You can ask me about bookings, amenities, weather, or anything else related to your stay.'
};

// =============================================================================
// API INTEGRATION FUNCTIONS
// =============================================================================

// Check if API is properly configured
export function isAPIConfigured() {
  const hasValidKey = AI_CONFIG.API_KEY && AI_CONFIG.API_KEY.length > 10 && AI_CONFIG.API_KEY.startsWith('sk-or-');
  const hasValidEndpoint = AI_CONFIG.API_ENDPOINT && AI_CONFIG.API_ENDPOINT.includes('openrouter.ai');
  
  // Only log in debug mode
  if (localStorage.getItem('DEBUG_AI') === 'true') {
    console.log('API Configuration Check:');
    console.log('- API_KEY:', AI_CONFIG.API_KEY ? 'Present' : 'Missing');
    console.log('- API_ENDPOINT:', AI_CONFIG.API_ENDPOINT);
    console.log('- Has valid key:', hasValidKey);
    console.log('- Has valid endpoint:', hasValidEndpoint);
    console.log('- Final result:', hasValidKey && hasValidEndpoint);
  }
  
  return hasValidKey && hasValidEndpoint;
}

// Get mock response for development
export function getMockResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  // Check for keywords and return appropriate response
  if (message.includes('hello') || message.includes('hi')) {
    return MOCK_RESPONSES.hello;
  } else if (message.includes('book') || message.includes('reservation')) {
    return MOCK_RESPONSES.booking;
  } else if (message.includes('weather')) {
    return MOCK_RESPONSES.weather;
  } else if (message.includes('amenities') || message.includes('facilities')) {
    return MOCK_RESPONSES.amenities;
  } else if (message.includes('price') || message.includes('cost')) {
    return MOCK_RESPONSES.pricing;
  } else if (message.includes('contact') || message.includes('reach')) {
    return MOCK_RESPONSES.contact;
  } else {
    return MOCK_RESPONSES.default;
  }
}

// =============================================================================
// SETUP INSTRUCTIONS
// =============================================================================
/*
SETUP INSTRUCTIONS:

1. API KEY SETUP:
   - Go to https://openrouter.ai/keys
   - Sign up and create a new API key
   - Update the API_KEY above with your actual OpenRouter API key

2. MODEL SELECTION:
   - Format: 'provider/model-name' (e.g., 'openai/gpt-4o-mini')
   - See https://openrouter.ai/models for available models
   - Current model: 'openai/gpt-4o-mini' (cost-effective and fast)

3. API ENDPOINT:
   - Uses OpenRouter's API, compatible with OpenAI format
   - Endpoint: https://openrouter.ai/api/v1/chat/completions

4. TESTING:
   - The system will use mock responses if API is not configured
   - Test with mock responses first, then configure API
   - Check browser console for API errors

5. SECURITY:
   - Never commit API keys to version control
   - Use environment variables in production
   - Consider using a backend proxy for API calls in production
   - OpenRouter API keys should be kept secure             
*/