// AI Chatbot functionality
// This file handles the AI chat popup and API integration

import { AI_CONFIG, isAPIConfigured, getMockResponse } from '../config/aiConfig.js';
import { fetchWeatherSummary } from '../utils/api.js';

// =============================================================================
// AI CHAT STATE MANAGEMENT
// =============================================================================
let isAIChatOpen = false;
let chatHistory = []; // For display purposes
let apiHistory = []; // Separate history for API context to avoid format conflicts
let isGeneratingResponse = false; // Track if AI is currently generating a response

// Character limits
const MAX_USER_MESSAGE_LENGTH = 500; // Maximum characters for user messages

// =============================================================================
// AI CHAT UI FUNCTIONS
// =============================================================================

// Open AI chat popup
function openAIChat() {
  console.log('Opening AI chat...');
  const chatPopup = document.getElementById('ai-chat-popup');
  const aiButton = document.getElementById('resort-ai');
  const notification = document.getElementById('ai-notification');
  const messagesContainer = document.getElementById('ai-chat-messages');
  
  if (chatPopup) {
    console.log('Chat popup found, showing...');
    chatPopup.style.display = 'flex';
    setTimeout(() => {
      chatPopup.classList.add('show');
      console.log('Chat popup should be visible now');
    }, 10);
    isAIChatOpen = true;
    
    // Hide FAB when chat is open
    if (aiButton) {
      aiButton.classList.add('hidden');
    }
    
    // Hide notification when chat is open
    if (notification) {
      notification.style.display = 'none';
    }
    
    // Check if this is a new conversation (no previous messages)
    const hasUserMessages = messagesContainer ? 
      Array.from(messagesContainer.children).some(child => 
        child.classList.contains('user-message-group')
      ) : false;
    
    // Reset API history for new conversations to minimize tokens
    // Only reset if there are no previous messages in the chat
    if (!hasUserMessages && apiHistory.length > 0) {
      console.log('New conversation detected - resetting API history');
      apiHistory = [];
      chatHistory = [];
    }
    
    // Show suggested questions if user hasn't sent any messages yet
    setTimeout(() => {
      if (messagesContainer && !hasUserMessages) {
        showSuggestedQuestions();
      }
    }, 300);
  } else {
    console.error('Chat popup element not found!');
  }
}


// Show suggested questions in chat conversation
function showSuggestedQuestions() {
  const messagesContainer = document.getElementById('ai-chat-messages');
  if (!messagesContainer) return;
  
  // Remove existing suggested questions if any
  hideSuggestedQuestions();
  
  // Create suggested questions container
  const suggestedContainer = document.createElement('div');
  suggestedContainer.id = 'ai-suggested-questions';
  suggestedContainer.className = 'ai-suggested-questions';
  
  // Predefined 3 suggested questions - Formal and professional
  const questions = [
    'What are your room rates and packages?',
    'What is the best time to visit?',
    'What accommodations are currently available?'
  ];
  
  suggestedContainer.innerHTML = `
    <div class="suggested-questions-list">
      ${questions.map(q => `
        <button class="suggested-question-button" data-question="${q.replace(/"/g, '&quot;')}">
          ${q}
        </button>
      `).join('')}
    </div>
  `;
  
  // Add click event listeners
  const questionButtons = suggestedContainer.querySelectorAll('.suggested-question-button');
  questionButtons.forEach(button => {
    button.addEventListener('click', function() {
      const question = this.getAttribute('data-question');
      const input = document.getElementById('ai-chat-input');
      if (input) {
        input.value = question;
        // Auto-resize if it's a textarea
        autoResizeTextarea();
        sendAIMessage();
      }
    });
  });
  
  // Append to messages container
  messagesContainer.appendChild(suggestedContainer);
  
  // Scroll to bottom to show suggestions
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Hide suggested questions (remove from DOM)
function hideSuggestedQuestions() {
  const suggestedContainer = document.getElementById('ai-suggested-questions');
  if (suggestedContainer) {
    suggestedContainer.remove();
  }
}

// Close AI chat popup
function closeAIChat() {
  console.log('Closing AI chat...');
  const chatPopup = document.getElementById('ai-chat-popup');
  const aiButton = document.getElementById('resort-ai');
  
  if (chatPopup) {
    chatPopup.classList.remove('show');
    setTimeout(() => {
      chatPopup.style.display = 'none';
      console.log('Chat popup hidden');
    }, 300);
    isAIChatOpen = false;
    
    // Show FAB when chat is closed
    if (aiButton) {
      aiButton.classList.remove('hidden');
    }
  } else {
    console.error('Chat popup element not found for closing!');
  }
}

// Handle Enter key press in chat input - Shift+Enter for new line, Enter to send
function handleAIChatKeypress(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendAIMessage();
  }
  // Allow Shift+Enter for new line - textarea will handle it automatically
}

// Auto-resize textarea based on content
function autoResizeTextarea() {
  const input = document.getElementById('ai-chat-input');
  if (input && input.tagName === 'TEXTAREA') {
    // Reset height to auto to get the correct scrollHeight
    input.style.height = 'auto';
    // Set height based on scrollHeight, with max height constraint
    const maxHeight = 120; // Maximum height in pixels (about 5 lines)
    const newHeight = Math.min(input.scrollHeight, maxHeight);
    input.style.height = newHeight + 'px';
    input.style.overflowY = input.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }
}

// Update character counter and enforce limit
function updateCharacterCounter() {
  const input = document.getElementById('ai-chat-input');
  const counter = document.getElementById('ai-char-counter');
  
  if (!input || !counter) return;
  
  const currentLength = input.value.length;
  const remaining = MAX_USER_MESSAGE_LENGTH - currentLength;
  
  // Update counter text
  counter.textContent = `${currentLength}/${MAX_USER_MESSAGE_LENGTH}`;
  
  // Update counter color based on remaining characters
  if (remaining < 50) {
    counter.classList.add('warning');
    counter.classList.remove('error');
  } else if (remaining < 0) {
    counter.classList.add('error');
    counter.classList.remove('warning');
  } else {
    counter.classList.remove('warning', 'error');
  }
  
  // Enforce character limit
  if (currentLength > MAX_USER_MESSAGE_LENGTH) {
    input.value = input.value.substring(0, MAX_USER_MESSAGE_LENGTH);
    autoResizeTextarea();
    updateCharacterCounter(); // Update counter after truncation
  }
}

// Enable/disable chat input and send button
function setChatInputEnabled(enabled) {
  const input = document.getElementById('ai-chat-input');
  const sendButton = document.querySelector('.ai-chat-send');
  
  if (input) {
    input.disabled = !enabled;
    if (input.tagName === 'TEXTAREA') {
      input.style.opacity = enabled ? '1' : '0.6';
      input.style.cursor = enabled ? 'text' : 'not-allowed';
    }
  }
  
  if (sendButton) {
    sendButton.disabled = !enabled;
    sendButton.style.opacity = enabled ? '1' : '0.6';
    sendButton.style.cursor = enabled ? 'pointer' : 'not-allowed';
  }
}

// Send message to AI
async function sendAIMessage() {
  console.log('sendAIMessage called');
  
  // Prevent sending multiple messages while AI is generating
  if (isGeneratingResponse) {
    console.log('AI is already generating a response, ignoring new message');
    return;
  }
  
  const input = document.getElementById('ai-chat-input');
  const messagesContainer = document.getElementById('ai-chat-messages');
  
  if (!input || !messagesContainer) {
    console.error('Input or messages container not found');
    return;
  }
  
  const message = input.value.trim();
  if (!message) {
    console.log('No message to send');
    return;
  }
  
  // Check character limit
  if (message.length > MAX_USER_MESSAGE_LENGTH) {
    // This shouldn't happen if limit is enforced, but add safety check
    addMessageToChat(`Message is too long. Please keep it under ${MAX_USER_MESSAGE_LENGTH} characters.`, 'ai');
    isGeneratingResponse = false;
    setChatInputEnabled(true);
    input.focus();
    return;
  }
  
  console.log('Sending message:', message);
  
  // Set generating state and disable input
  isGeneratingResponse = true;
  setChatInputEnabled(false);
  
  // Hide suggested questions when user sends message
  hideSuggestedQuestions();
  
  // Clear input and reset height
  input.value = '';
  if (input.tagName === 'TEXTAREA') {
    autoResizeTextarea();
  }
  
  // Add user message to chat
  addMessageToChat(message, 'user');
  
  // Show typing indicator
  const typingId = addTypingIndicator();
  
  try {
    console.log('Calling getAIResponse...');
    // Get AI response
    const response = await getAIResponse(message);
    console.log('AI Response received:', response);
    
    // Remove typing indicator
    removeTypingIndicator(typingId);
    
    // Add AI response to chat
    addMessageToChat(response, 'ai');
    
  } catch (error) {
    console.error('AI Chat Error:', error);
    
    // Remove typing indicator
    removeTypingIndicator(typingId);
    
    // Add error message
    addMessageToChat('Sorry, there was an error. Please try again.', 'ai');
  } finally {
    // Re-enable input and send button when done (success or error)
    isGeneratingResponse = false;
    setChatInputEnabled(true);
    
    // Focus input for next message
    const input = document.getElementById('ai-chat-input');
    if (input && !input.disabled) {
      input.focus();
    }
  }
}

// Format message text for better readability (convert markdown-like syntax to HTML)
function formatMessageText(text) {
  if (!text) return '';
  
  // Split into lines for processing
  const lines = text.split('\n');
  const output = [];
  let inList = false;
  let listType = null; // 'ul' or 'ol'
  let listItems = [];
  let inCodeBlock = false;
  let codeBlockContent = [];
  
  function closeList() {
    if (listItems.length > 0) {
      // Always use ul (bullet list) instead of ol
      output.push(`<ul>${listItems.join('')}</ul>`);
      listItems = [];
      inList = false;
      listType = null;
    }
  }
  
  function closeCodeBlock() {
    if (codeBlockContent.length > 0) {
      output.push(`<pre><code>${codeBlockContent.join('\n')}</code></pre>`);
      codeBlockContent = [];
      inCodeBlock = false;
    }
  }
  
  function formatInline(text) {
    if (!text || typeof text !== 'string') return '';
    
    // First escape HTML to prevent XSS
    let formatted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Process formatting in specific order to avoid conflicts
    
    // 1. Code inline (`code`) - process first and protect from other formatting
    const codeBlocks = [];
    formatted = formatted.replace(/`([^`]+)`/g, function(match, content) {
      const id = `__CODE_${codeBlocks.length}__`;
      codeBlocks.push(`<code>${content}</code>`);
      return id;
    });
    
    // 2. Combined bold italic (***text*** or ___text___) - process before single formats
    formatted = formatted.replace(/\*\*\*([^*]+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    formatted = formatted.replace(/___([^_]+?)___/g, '<strong><em>$1</em></strong>');
    
    // 3. Bold (**text** or __text__)
    formatted = formatted.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/__([^_]+?)__/g, '<strong>$1</strong>');
    
    // 4. Strikethrough (~~text~~)
    formatted = formatted.replace(/~~([^~]+?)~~/g, '<del>$1</del>');
    
    // 5. Underline (++text++)
    formatted = formatted.replace(/\+\+([^+]+?)\+\+/g, '<u>$1</u>');
    
    // 6. Italic (*text* or _text_) - process after bold to avoid conflicts
    // Use a more reliable approach that checks if already formatted
    formatted = formatted.replace(/\*([^*\n<]+?)\*/g, function(match, content) {
      // Skip if already inside a tag or is part of bold formatting
      if (match.includes('**') || match.includes('<strong>') || match.includes('<em>') || 
          match.includes('<code>') || match.includes('<del>') || match.includes('<u>')) {
        return match;
      }
      return '<em>' + content + '</em>';
    });
    formatted = formatted.replace(/_([^_\n<]+?)_/g, function(match, content) {
      // Skip if already inside a tag or is part of bold formatting
      if (match.includes('__') || match.includes('<strong>') || match.includes('<em>') ||
          match.includes('<code>') || match.includes('<del>') || match.includes('<u>')) {
        return match;
      }
      return '<em>' + content + '</em>';
    });
    
    // Restore code blocks
    codeBlocks.forEach((code, index) => {
      formatted = formatted.replace(`__CODE_${index}__`, code);
    });
    
    return formatted;
  }
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Check for code blocks (```code```)
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        closeCodeBlock();
      } else {
        closeList();
        inCodeBlock = true;
      }
      continue;
    }
    
    // If inside code block, just collect content
    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }
    
    // Process regular lines
    let trimmedLine = line.trim();
    
    // Skip empty lines that separate paragraphs
    if (trimmedLine === '') {
      closeList();
      closeCodeBlock();
      continue;
    }
    
    // Check for numbered list (1. item, 2. item) - convert to bullet list
    const numberedMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
    if (numberedMatch) {
      if (!inList || listType !== 'ul') {
        closeList();
        inList = true;
        listType = 'ul'; // Use ul (bullet list) instead of ol
      }
      const listContent = formatInline(numberedMatch[2]);
      listItems.push(`<li>${listContent}</li>`);
      continue;
    }
    
    // Check for bullet list (- item, * item, or • item)
    const bulletMatch = trimmedLine.match(/^[-•*]\s+(.+)$/);
    if (bulletMatch) {
      if (!inList || listType !== 'ul') {
        closeList();
        inList = true;
        listType = 'ul';
      }
      const listContent = formatInline(bulletMatch[1]);
      listItems.push(`<li>${listContent}</li>`);
      continue;
    }
    
    // Not a list item - close any open list and add as paragraph
    closeList();
    
    // Format inline markdown
    const formattedLine = formatInline(trimmedLine);
    output.push(`<p>${formattedLine}</p>`);
  }
  
  // Close any remaining list or code block
  closeList();
  closeCodeBlock();
  
  // If no output, return empty paragraph
  if (output.length === 0) {
    return '<p></p>';
  }
  
  let result = output.join('');
  
  // Ensure proper spacing around lists
  result = result.replace(/(<\/p>)(<[uo]l>)/g, '$1$2');
  result = result.replace(/(<\/[uo]l>)(<p>)/g, '$1$2');
  
  // Clean up any remaining unmatched markdown syntax only if it's clearly orphaned
  // Only remove if it's at the end of a paragraph and not part of content
  result = result.replace(/([^<])\*\*\s*$/gm, '$1'); // Unmatched bold at end
  result = result.replace(/([^<])__\s*$/gm, '$1'); // Unmatched bold alt at end
  result = result.replace(/([^<*])\*\s*$/gm, '$1'); // Unmatched italic at end (but not **)
  result = result.replace(/([^<_])_\s*$/gm, '$1'); // Unmatched italic alt at end (but not __)
  
  return result;
}

// Add message to chat interface
function addMessageToChat(message, sender) {
  const messagesContainer = document.getElementById('ai-chat-messages');
  if (!messagesContainer) return;
  
  const messageGroup = document.createElement('div');
  messageGroup.className = `message-group ${sender === 'user' ? 'user-message-group' : 'ai-message-group'}`;
  
  const avatar = sender === 'user' ? '👤' : '🤖';
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Only show avatar for AI messages, not for user messages
  const avatarHTML = sender === 'user' ? '' : `
    <div class="message-avatar">
      <div class="avatar-img">${avatar}</div>
    </div>
  `;
  
  // Format message text for AI messages (convert markdown to HTML)
  const formattedMessage = sender === 'ai' ? formatMessageText(message) : message.replace(/\n/g, '<br>');
  
  messageGroup.innerHTML = `
    ${avatarHTML}
    <div class="message-bubble ${sender === 'user' ? 'user-message-bubble' : 'ai-message-bubble'}">
      <div class="message-text">
        ${formattedMessage}
      </div>
      <div class="message-time">${currentTime}</div>
    </div>
  `;
  
  messagesContainer.appendChild(messageGroup);
  
  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // Add to display chat history
  chatHistory.push({ message, sender, timestamp: new Date() });
}

// Add typing indicator
function addTypingIndicator() {
  const messagesContainer = document.getElementById('ai-chat-messages');
  if (!messagesContainer) return null;
  
  const typingId = 'typing-' + Date.now();
  const typingDiv = document.createElement('div');
  typingDiv.id = typingId;
  typingDiv.className = 'message-group ai-message-group typing-indicator';
  
  typingDiv.innerHTML = `
    <div class="message-avatar">
      <div class="avatar-img">🤖</div>
    </div>
    <div class="message-bubble ai-message-bubble">
      <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
  
  messagesContainer.appendChild(typingDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  return typingId;
}

// Remove typing indicator
function removeTypingIndicator(typingId) {
  if (!typingId) return;
  
  const typingElement = document.getElementById(typingId);
  if (typingElement) {
    typingElement.remove();
  }
}

// =============================================================================
// AI API INTEGRATION
// =============================================================================

// Get AI response from API
async function getAIResponse(userMessage) {
  console.log('Getting AI response for:', userMessage);
  
  // Check if API is configured
  if (!isAPIConfigured()) {
    console.log('API not configured, using mock response');
    return getMockResponse(userMessage);
  }
  
  // Fetch current weather and forecast data for AI context
  let weatherContext = '';
  try {
    const weatherData = await fetchWeatherSummary();
    if (weatherData && weatherData.nextDays) {
      // Philippines timezone: UTC+8
      const PH_TIMEZONE_OFFSET = 8;
      
      // Get current date in Philippines timezone (UTC+8)
      const now = new Date();
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
      const phTime = new Date(utcTime + (PH_TIMEZONE_OFFSET * 3600000));
      
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      
      // Format current date in Philippines timezone
      const currentDate = `${weekdays[phTime.getDay()]}, ${months[phTime.getMonth()]} ${phTime.getDate()}, ${phTime.getFullYear()}`;
      
      // Format forecast dates - use actual dates from forecast data
      // The server provides fullDate in UTC (YYYY-MM-DD format), convert to Philippines timezone
      const forecastDates = weatherData.nextDays.map((day, index) => {
        let forecastDate;
        
        // Use fullDate if available (UTC format), convert to Philippines timezone
        if (day.fullDate) {
          const [year, month, dayNum] = day.fullDate.split('-').map(Number);
          // Create UTC date at midnight
          const utcDate = new Date(Date.UTC(year, month - 1, dayNum));
          // Convert to Philippines timezone (UTC+8)
          const phDate = new Date(utcDate.getTime() + (PH_TIMEZONE_OFFSET * 3600000));
          forecastDate = phDate;
        } else {
          // Fallback: calculate from Philippines today + index
          forecastDate = new Date(phTime);
          forecastDate.setDate(phTime.getDate() + index);
          forecastDate.setHours(0, 0, 0, 0);
        }
        
        // Get date components in Philippines timezone
        const dayName = weekdays[forecastDate.getDay()];
        const monthName = months[forecastDate.getMonth()];
        const dayNum = forecastDate.getDate();
        const year = forecastDate.getFullYear();
        
        let dateLabel;
        if (index === 0) {
          dateLabel = `Today, ${monthName} ${dayNum}, ${year}`;
        } else if (index === 1) {
          dateLabel = `Tomorrow, ${monthName} ${dayNum}, ${year}`;
        } else {
          dateLabel = `${dayName}, ${monthName} ${dayNum}, ${year}`;
        }
        
        // Get accurate weather data - use exact fields from API response
        const condition = day.condition || 'Clear';
        const temp = day.t || 28;
        const tempMin = day.tMin !== null && day.tMin !== undefined ? day.tMin : null;
        const icon = day.icon || '☀️';
        const humidity = day.humidity !== null && day.humidity !== undefined ? day.humidity : null;
        
        return {
          date: dateLabel,
          day: dayName,
          condition: condition,
          temp: temp,
          tempMin: tempMin,
          icon: icon,
          humidity: humidity,
          fullDate: day.fullDate || null // Keep original fullDate for reference
        };
      });
      
      const forecastText = forecastDates.map(f => {
        let line = `- ${f.date}: ${f.condition}, ${f.temp}°C`;
        if (f.tempMin !== null && f.tempMin !== undefined) {
          line += ` (low: ${f.tempMin}°C)`;
        }
        if (f.humidity !== null && f.humidity !== undefined) {
          line += `, humidity ${f.humidity}%`;
        }
        line += ` ${f.icon}`;
        return line;
      }).join('\n');
      
      // Log weather context for debugging (only if DEBUG_AI is enabled)
      if (localStorage.getItem('DEBUG_AI') === 'true') {
        console.log('🌤️ Weather context for AI:', {
          currentDate,
          forecastCount: forecastDates.length,
          forecastDates: forecastDates.map(f => ({ date: f.date, condition: f.condition, temp: f.temp }))
        });
      }
      
      weatherContext = `\n\nCURRENT DATE AND WEATHER FORECAST (USE THIS DATA - DO NOT CALCULATE DATES YOURSELF):\nCurrent Date (Philippines Timezone, UTC+8): ${currentDate}\n\n5-Day Weather Forecast (Philippines Timezone, UTC+8):\n${forecastText}\n\nIMPORTANT: All dates above are in Philippines timezone (UTC+8). When recommending dates, use ONLY the dates provided above. Do not calculate dates yourself. Do not use past dates. Use the exact dates from the forecast data. These are the ONLY dates available for recommendation.`;
    }
  } catch (error) {
    console.error('Error fetching weather data for AI:', error);
    // Continue without weather context if fetch fails
  }
  
  // Limit history BEFORE adding new message to maintain consistent token usage
  const maxHistoryLength = AI_CONFIG.MAX_HISTORY * 2; // MAX_HISTORY pairs (user + assistant)
  if (apiHistory.length >= maxHistoryLength) {
    // Trim history to keep only recent messages, leaving room for new message
    const keepMessages = maxHistoryLength - 2; // Leave room for new user + assistant message
    if (keepMessages > 0) {
      apiHistory = apiHistory.slice(-keepMessages);
    } else {
      apiHistory = []; // Reset if history limit is too small
    }
  }
  
  // Add user message to API history AFTER trimming
  apiHistory.push({ role: 'user', content: userMessage });
  
  try {
    console.log('Sending request to OpenRouter API...');
    
    // Construct messages array - always include system prompt for context
    // Include weather context in system prompt
    const systemPrompt = AI_CONFIG.SYSTEM_PROMPT + weatherContext;
    const messages = [
      { role: 'system', content: systemPrompt },
      ...apiHistory
    ];
    
    // Log token estimate for debugging
    if (localStorage.getItem('DEBUG_AI') === 'true') {
      const estimatedTokens = JSON.stringify(messages).length / 4; // Rough estimate: 1 token ≈ 4 chars
      console.log('Estimated input tokens:', Math.ceil(estimatedTokens));
      console.log('Messages being sent:', messages);
    }
    
    const response = await fetch(AI_CONFIG.API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_CONFIG.API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin, // Required by OpenRouter to identify your app
        'X-Title': 'Kina Resort AI Assistant' // Optional: App name for OpenRouter analytics
      },
      body: JSON.stringify({
        model: AI_CONFIG.MODEL,
        messages: messages,
        max_tokens: AI_CONFIG.MAX_TOKENS,
        temperature: AI_CONFIG.TEMPERATURE
      })
    });
    
    console.log('API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('API response data:', data);
    
    const aiResponse = data.choices?.[0]?.message?.content?.trim() || 'No response received.';
    
    // Add assistant response to API history
    apiHistory.push({ role: 'assistant', content: aiResponse });
    
    return aiResponse;
    
  } catch (error) {
    console.error('AI API Error:', error);
    
    // Remove failed user message from history
    apiHistory.pop();
    
    return `Sorry, there was an error processing your request: ${error.message}. Please try again.`;
  }
}


// =============================================================================
// INITIALIZATION
// =============================================================================

// Initialize AI chat when DOM is loaded
function initializeAIChat() {
  // Only log in debug mode
  if (localStorage.getItem('DEBUG_AI') === 'true') {
    console.log('Initializing AI chat...');
    console.log('AI_CONFIG:', AI_CONFIG);
    console.log('isAPIConfigured():', isAPIConfigured());
  }
  
  // Add click event to AI button
  const aiButton = document.getElementById('resort-ai');
  if (aiButton) {
    if (localStorage.getItem('DEBUG_AI') === 'true') {
      console.log('AI button found, adding click handler');
    }
    // Remove any existing onclick handlers
    aiButton.removeAttribute('onclick');
    aiButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('AI button clicked, isAIChatOpen:', isAIChatOpen);
      if (isAIChatOpen) {
        closeAIChat();
      } else {
        openAIChat();
      }
    });
  } else {
    console.error('AI button not found!');
  }
  
  // Prevent chat popup from closing when clicking inside it
  const chatPopup = document.getElementById('ai-chat-popup');
  if (chatPopup) {
    chatPopup.addEventListener('click', function(e) {
      e.stopPropagation();
    });
    
    // Allow wheel events in textarea - don't prevent them from bubbling
    chatPopup.addEventListener('wheel', function(e) {
      const textarea = document.getElementById('ai-chat-input');
      // If the wheel event is from the textarea, allow it to scroll normally
      if (textarea && (e.target === textarea || textarea.contains(e.target))) {
        // Don't prevent default or stop propagation - let textarea handle scrolling
        return;
      }
      // For other elements inside chat popup, allow default behavior
    }, { passive: true });
  }
  
  // Close chat when clicking outside of it
  document.addEventListener('click', function(e) {
    if (isAIChatOpen && chatPopup && !chatPopup.contains(e.target) && !aiButton.contains(e.target)) {
      closeAIChat();
    }
  });
  
  // Setup auto-resize for textarea input
  const input = document.getElementById('ai-chat-input');
  if (input && input.tagName === 'TEXTAREA') {
    input.addEventListener('input', autoResizeTextarea);
    // Initial resize
    setTimeout(autoResizeTextarea, 100);
    
    // Ensure wheel events work in textarea - explicitly handle wheel scrolling
    // Use non-passive listener so we can stop propagation to parent containers
    input.addEventListener('wheel', function(e) {
      // Allow the textarea to scroll naturally (default behavior)
      // Stop propagation to prevent parent containers (like messagesContainer) from handling it
      e.stopPropagation();
      // Don't prevent default - let the browser handle scrolling naturally
    });
  }
  
  // Prevent scroll propagation to page when scrolling inside chat messages
  const messagesContainer = document.getElementById('ai-chat-messages');
  if (messagesContainer) {
    // Always prevent wheel events from propagating when inside the messages container
    // BUT allow textarea to handle its own scroll events
    messagesContainer.addEventListener('wheel', function(e) {
      // Don't stop propagation if the event is from the textarea
      const textarea = document.getElementById('ai-chat-input');
      if (textarea && (e.target === textarea || textarea.contains(e.target))) {
        return; // Let textarea handle its own scrolling
      }
      e.stopPropagation();
    }, { passive: false });
    
    // Prevent touch scroll propagation
    messagesContainer.addEventListener('touchmove', function(e) {
      e.stopPropagation();
    }, { passive: false });
    
    // Prevent all mouse events within the container from propagating
    messagesContainer.addEventListener('mousedown', function(e) {
      e.stopPropagation();
    });
    
    messagesContainer.addEventListener('mouseup', function(e) {
      e.stopPropagation();
    });
    
    // Prevent scrollbar dragging from propagating
    messagesContainer.addEventListener('scroll', function(e) {
      e.stopPropagation();
    });
  }
  
  // CSS is now handled in the main stylesheet
}

// Test API connection function
async function testAPIConnection() {
  if (!isAPIConfigured()) {
    console.log('API not configured, skipping test');
    return;
  }
  
  try {
    console.log('Testing API connection...');
    const response = await fetch(AI_CONFIG.API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_CONFIG.API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin, // Required by OpenRouter to identify your app
        'X-Title': 'Kina Resort AI Assistant' // Optional: App name for OpenRouter analytics
      },
      body: JSON.stringify({
        model: AI_CONFIG.MODEL,
        messages: [
          { role: 'system', content: AI_CONFIG.SYSTEM_PROMPT },
          { role: 'user', content: 'Hello, this is a test.' }
        ]
      })
    });
    
    console.log('Test response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API connection successful!', data);
    } else {
      const errorText = await response.text();
      console.log('❌ API connection failed:', response.status, errorText);
    }
  } catch (error) {
    console.log('❌ API connection error:', error.message);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeAIChat);

// Also try to initialize after a short delay in case DOMContentLoaded already fired
setTimeout(initializeAIChat, 100);

// Test API connection after a delay
setTimeout(testAPIConnection, 500);

// Minimize AI chat
function minimizeAIChat() {
  console.log('Minimizing AI chat...');
  closeAIChat();
}

// Export functions for global access
window.openAIChat = openAIChat;
window.closeAIChat = closeAIChat;
window.minimizeAIChat = minimizeAIChat;
window.handleAIChatKeypress = handleAIChatKeypress;
window.sendAIMessage = sendAIMessage;
window.updateCharacterCounter = updateCharacterCounter;