// AI Assistant functionality for TedouaR Robotics Hub
document.addEventListener('DOMContentLoaded', function() {
    const aiButton = document.getElementById('ai-button');
    const aiChatContainer = document.getElementById('ai-chat-container');
    const aiChatClose = document.getElementById('ai-chat-close');
    const aiInput = document.getElementById('ai-input');
    const aiSend = document.getElementById('ai-send');
    const aiMessages = document.getElementById('ai-chat-messages');
    
    let isOpen = false;
    
    // Sample robotics responses
    const responses = {
        greetings: [
            "Hello! I'm here to help you explore the fascinating world of robotics!",
            "Hi there! What would you like to know about robots today?",
            "Welcome to TedouaR Robotics Hub! How can I assist you with robotics knowledge?"
        ],
        robots: [
            "We have an extensive database of robots from companies like Boston Dynamics, Tesla, Universal Robots, and many more. Check out our Encyclopedia section!",
            "Our database includes industrial robots, humanoids, service robots, and consumer robots. What type interests you most?",
            "From Atlas by Boston Dynamics to Tesla's Optimus, we cover the most innovative robots in the world!"
        ],
        categories: [
            "We organize robots into several categories: Industrial (manufacturing), Humanoid (human-like), Service (assistive), and Consumer (home use). Which interests you?",
            "You can explore robots by category - Industrial for manufacturing, Service for healthcare and assistance, Humanoid for human-like robots, or Consumer for home robots."
        ],
        companies: [
            "We feature robots from leading companies including Boston Dynamics, Tesla, Universal Robots, SoftBank Robotics, ABB, KUKA, and many more!",
            "Major robotics companies in our database include Boston Dynamics (Atlas, Spot), Tesla (Optimus), Universal Robots (UR series), and SoftBank (Pepper, NAO)."
        ],
        help: [
            "I can help you learn about different robots, find specific models, explore categories, or discover new robotics innovations. What interests you most?",
            "You can ask me about specific robots, browse by category, learn about manufacturers, or get recommendations based on your interests!"
        ],
        default: [
            "That's an interesting question about robotics! I'd recommend checking our Encyclopedia for detailed information.",
            "Great robotics question! You might find more detailed answers in our comprehensive robot database.",
            "For specific technical details, our Encyclopedia section has in-depth information about various robots and their capabilities."
        ]
    };
    
    // Toggle chat
    function toggleChat() {
        isOpen = !isOpen;
        if (isOpen) {
            aiChatContainer.classList.add('active');
            aiInput.focus();
        } else {
            aiChatContainer.classList.remove('active');
        }
    }
    
    // Add message to chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'user-message' : 'ai-message';
        
        if (isUser) {
            messageDiv.innerHTML = `
                <div class="user-bubble">${message}</div>
                <div class="user-avatar"><i class="fas fa-user"></i></div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="ai-avatar"><i class="fas fa-robot"></i></div>
                <div class="ai-bubble">${message}</div>
            `;
        }
        
        aiMessages.appendChild(messageDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }
    
    // Get AI response
    function getResponse(userInput) {
        const input = userInput.toLowerCase();
        
        // Check for greetings
        if (input.match(/hello|hi|hey|greetings/)) {
            return getRandomResponse('greetings');
        }
        
        // Check for robot-related queries
        if (input.match(/robot|robots|atlas|optimus|spot|pepper|nao/)) {
            return getRandomResponse('robots');
        }
        
        // Check for category queries
        if (input.match(/category|categories|type|types|industrial|humanoid|service|consumer/)) {
            return getRandomResponse('categories');
        }
        
        // Check for company queries
        if (input.match(/company|companies|boston dynamics|tesla|universal robots|softbank/)) {
            return getRandomResponse('companies');
        }
        
        // Check for help queries
        if (input.match(/help|what can you|what do you|how can/)) {
            return getRandomResponse('help');
        }
        
        // Default response
        return getRandomResponse('default');
    }
    
    // Get random response from category
    function getRandomResponse(category) {
        const responseArray = responses[category];
        return responseArray[Math.floor(Math.random() * responseArray.length)];
    }
    
    // Send message
    function sendMessage() {
        const message = aiInput.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, true);
        aiInput.value = '';
        
        // Show typing indicator
        setTimeout(() => {
            const response = getResponse(message);
            addMessage(response);
        }, 1000);
    }
    
    // Event listeners
    if (aiButton) {
        aiButton.addEventListener('click', toggleChat);
    }
    
    if (aiChatClose) {
        aiChatClose.addEventListener('click', toggleChat);
    }
    
    if (aiSend) {
        aiSend.addEventListener('click', sendMessage);
    }
    
    if (aiInput) {
        aiInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Close chat when clicking outside
    document.addEventListener('click', function(e) {
        if (isOpen && !aiChatContainer.contains(e.target) && e.target !== aiButton) {
            toggleChat();
        }
    });
});
