// RAIS Chat Widget - Powers the existing website chat interface
(function() {
  const WEBHOOK_URL = 'https://n8n.ritz-ai.solutions/webhook/chat';
  
  // Session ID for conversation memory
  let sessionId = localStorage.getItem('rais_session_id');
  if (!sessionId) {
    sessionId = 'sid_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('rais_session_id', sessionId);
  }

  // Wait for DOM to be ready
  function init() {
    const input = document.getElementById('chatInput');
    const display = document.getElementById('chatDisplay');
    
    if (!input || !display) {
      // Retry if DOM not ready yet
      setTimeout(init, 200);
      return;
    }

    // Override: clear static placeholder messages and show welcome
    display.innerHTML = '';
    addLine(display, '> SYSTEM: RAIS AI v2.0 initialized.', 'text-industrial-orange-bright');
    addLine(display, '> AI: Hello! Ask me anything about RAIS, our services, or how AI automation could benefit your business.', 'text-green-400');
    addLine(display, '> Ready. Type your message and press Enter.', 'text-gray-400');

    // Find and override all existing submit handlers by replacing input
    const newInput = input.cloneNode(true);
    input.parentNode.replaceChild(newInput, input);

    // Find send button if exists
    const sendBtn = newInput.parentElement ? newInput.parentElement.querySelector('button[type="submit"], button svg') : null;
    
    // Add our handler
    newInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        handleSend(newInput, display);
      }
    });

    // Also intercept send button clicks if a button is nearby
    const parentForm = newInput.closest('form');
    if (parentForm) {
      parentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        handleSend(newInput, display);
      });
    }

    // Find any send button in the chat widget area
    const chatContainer = newInput.closest('[id]') || newInput.parentElement.parentElement;
    const buttons = chatContainer ? chatContainer.querySelectorAll('button') : [];
    buttons.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        handleSend(newInput, display);
      });
    });
  }

  function addLine(display, text, colorClass) {
    const p = document.createElement('p');
    p.className = colorClass || 'text-gray-300';
    p.textContent = text;
    display.appendChild(p);
    display.scrollTop = display.scrollHeight;
  }

  async function handleSend(input, display) {
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    input.disabled = true;

    // Show user message
    addLine(display, '> USER: ' + text, 'text-industrial-orange-bright');
    const typingP = document.createElement('p');
    typingP.className = 'text-gray-400';
    typingP.textContent = '> AI: Processing...';
    display.appendChild(typingP);
    display.scrollTop = display.scrollHeight;

    try {
      const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 30000); const resp = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: sessionId }), signal: controller.signal
      });
      const data = await resp.json();
      const reply = data.reply || data.output || data.message || 'I could not process that. Please email kevin@ritz-ai.solutions';
      typingP.className = 'text-green-400';
      typingP.textContent = '> AI: ' + reply;
    } catch(err) {
      typingP.className = 'text-red-400';
      typingP.textContent = '> ERROR: Connection failed. Email kevin@ritz-ai.solutions';
    }

    display.scrollTop = display.scrollHeight;
    input.disabled = false;
    input.focus();
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
