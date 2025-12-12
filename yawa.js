const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// OpenRouter Configuration
const config = {
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: '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',
    defaultHeaders: {
        'HTTP-Referer': window.location.href || 'http://localhost',
        'X-Title': 'My Chatbot'
    }
};

// Send message function
async function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    addUserMessage(message);
    userInput.value = '';
    addTypingIndicator();

    try {
        const botResponse = await main(message);
        removeTypingIndicator();
        addBotMessage(botResponse);
    } catch (error) {
        removeTypingIndicator();
        addBotMessage("Error: " + error.message);
        console.error('Full Error:', error);
    }
}

// Main function - similar to your example
async function main(userMessage) {
    const completion = await fetch(`${config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
            ...config.defaultHeaders
        },
        body: JSON.stringify({
            model: 'deepseek/deepseek-chat',
            messages: [
                {
                    role: 'user',
                    content: userMessage
                }
            ]
        })
    });

    const data = await completion.json();
    console.log('Full Response:', data);

    if (data.error) {
        throw new Error(data.error.message || JSON.stringify(data.error));
    }

    return data.choices[0].message.content;
}

// Add user message to chatbox
function addUserMessage(message) {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'question-wrapper';
    messageWrapper.innerHTML = `
        <div class="user-message">${message}</div>
    `;
    chatbox.appendChild(messageWrapper);
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Add bot message to chatbox
function addBotMessage(message) {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'bot-message-wrapper';
    messageWrapper.innerHTML = `
        <div class="bot-avatar">🤖</div>
        <div class="intro">${message}</div>
    `;
    chatbox.appendChild(messageWrapper);
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Add typing indicator
function addTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'bot-message-wrapper typing-indicator';
    typingDiv.id = 'typing';
    typingDiv.innerHTML = `
        <div class="bot-avatar">🤖</div>
        <div class="intro">Typing...</div>
    `;
    chatbox.appendChild(typingDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typing = document.getElementById('typing');
    if (typing) typing.remove();
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
