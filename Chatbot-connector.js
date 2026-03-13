// ============================================================
// RAIS Chatbot — n8n API Connector
// Version: 2.0.0
// 
// HOW TO USE:
// 1. Find the existing chatbot send handler in index.html
//    (look for the function that fires when user hits Send)
// 2. Replace the static/hardcoded response logic with the
//    sendMessageToRAIS() function below
// 3. Wire up the UI event listeners as shown at the bottom
// ============================================================

const RAIS_WEBHOOK_URL = 'https://n8n.ritz-ai.solutions/webhook/chat';

// ---- Session Management ----
// Generates a unique session ID per browser visit and persists it
// so that the AI's conversation memory works across messages.
function getSessionId() {
  let sid = sessionStorage.getItem('rais_session_id');
  if (!sid) {
    sid = 'rais_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
    sessionStorage.setItem('rais_session_id', sid);
  }
  return sid;
}

// ---- Core API Call ----
// Sends a user message to the n8n backend and returns the AI reply.
// Returns a string (either the AI reply or a fallback error message).
async function sendMessageToRAIS(userMessage) {
  const sessionId = getSessionId();

  try {
    const response = await fetch(RAIS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        message: userMessage.trim(),
        sessionId: sessionId,
        consent: true  // User has accepted the GDPR modal — required by backend
      })
    });

    if (!response.ok) {
      console.error('[RAIS Chat] HTTP Error:', response.status);
      return getFallbackMessage(response.status);
    }

    const data = await response.json();

    // Validate we got a real reply back
    if (data && typeof data.reply === 'string' && data.reply.length > 0) {
      return data.reply;
    } else {
      console.warn('[RAIS Chat] Unexpected response shape:', data);
      return 'I received an unexpected response. Please try again or email kevin@ritz-ai.solutions.';
    }

  } catch (error) {
    console.error('[RAIS Chat] Network/fetch error:', error);
    return 'I\'m having trouble connecting right now. Please email kevin@ritz-ai.solutions directly — he responds within 24 hours.';
  }
}

// ---- Fallback Messages by Status Code ----
function getFallbackMessage(statusCode) {
  if (statusCode === 429) {
    return 'You\'ve sent a lot of messages! Please wait a few minutes before trying again.';
  }
  if (statusCode === 400) {
    return 'I couldn\'t process that message. Please try rephrasing it.';
  }
  return 'I\'m temporarily unavailable. Please email kevin@ritz-ai.solutions directly.';
}

// ============================================================
// UI INTEGRATION
// 
// Find the existing chatbot HTML structure in index.html.
// Look for the section with id="rais-bot" or similar, and
// replace the send handler wiring with the block below.
//
// The existing chatbot UI likely has elements like:
//   - A message display area   → #chat-messages or .chat-body
//   - A text input field       → #chat-input or .chat-input
//   - A send button            → #chat-send or .chat-send-btn
//
// Replace whatever is currently wired to the send button
// with this pattern:
// ============================================================

function initRAISChatbot() {
  // ---- Adjust these selectors to match your actual HTML ----
  const chatInput  = document.querySelector('.rais-chat-input, #chat-input, [data-chat-input]');
  const sendBtn    = document.querySelector('.rais-send-btn, #chat-send, [data-chat-send]');
  const chatBody   = document.querySelector('.rais-chat-body, #chat-messages, [data-chat-messages]');
  // ----------------------------------------------------------

  if (!chatInput || !sendBtn || !chatBody) {
    console.warn('[RAIS Chat] Could not find chat UI elements. Check selectors in chatbot-connector.js');
    return;
  }

  // Append a message bubble to the chat window
  function appendMessage(text, role) {
    const bubble = document.createElement('div');
    bubble.className = `chat-message ${role === 'user' ? 'user-message' : 'bot-message'}`;
    bubble.textContent = text;
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // Show a typing indicator while waiting for response
  function showTyping() {
    const el = document.createElement('div');
    el.className = 'chat-message bot-message typing-indicator';
    el.id = 'rais-typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    chatBody.appendChild(el);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById('rais-typing');
    if (el) el.remove();
  }

  // Main send handler
  async function handleSend() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Clear input and disable while processing
    chatInput.value = '';
    sendBtn.disabled = true;
    chatInput.disabled = true;

    // Show user message
    appendMessage(message, 'user');
    showTyping();

    // Call n8n
    const reply = await sendMessageToRAIS(message);

    hideTyping();
    appendMessage(reply, 'bot');

    sendBtn.disabled = false;
    chatInput.disabled = false;
    chatInput.focus();
  }

  // Wire up events
  sendBtn.addEventListener('click', handleSend);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  console.log('[RAIS Chat] Connector initialised. Session:', getSessionId());
}

// Auto-initialise when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRAISChatbot);
} else {
  initRAISChatbot();
}
