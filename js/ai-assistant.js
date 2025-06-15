// Advanced AI Assistant for Robotic Solution Finding
class RoboticsAssistant {
    constructor() {
        this.conversationState = 'initial';
        this.userProfile = {
            industry: null,
            budget: null,
            purpose: null,
            experience: null,
            environment: null,
            requirements: []
        };
        this.robotDatabase = null;
        this.conversationHistory = [];
        this.init();
    }

    async init() {
        try {
            // Load robot database
            const response = await fetch('robots.json');
            this.robotDatabase = await response.json();
        } catch (error) {
            console.error('Failed to load robot database:', error);
            this.robotDatabase = [];
        }
        
        this.setupEventListeners();
        this.showWelcomeMessage();
    }

    setupEventListeners() {
        const aiButton = document.getElementById('ai-button');
        const aiChatContainer = document.getElementById('ai-chat-container');
        const aiChatClose = document.getElementById('ai-chat-close');
        const aiInput = document.getElementById('ai-input');
        const aiSend = document.getElementById('ai-send');

        if (aiButton) {
            aiButton.addEventListener('click', () => this.toggleChat());
        }

        if (aiChatClose) {
            aiChatClose.addEventListener('click', () => this.closeChat());
        }

        if (aiSend && aiInput) {
            aiSend.addEventListener('click', () => this.handleUserInput());
            aiInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleUserInput();
            });
        }
    }

    toggleChat() {
        const aiChatContainer = document.getElementById('ai-chat-container');
        if (aiChatContainer) {
            const isVisible = aiChatContainer.style.display === 'flex';
            aiChatContainer.style.display = isVisible ? 'none' : 'flex';
            
            if (!isVisible && this.conversationHistory.length === 1) {
                // First time opening, start the consultation
                setTimeout(() => this.startConsultation(), 500);
            }
        }
    }

    closeChat() {
        const aiChatContainer = document.getElementById('ai-chat-container');
        if (aiChatContainer) {
            aiChatContainer.style.display = 'none';
        }
    }

    showWelcomeMessage() {
        const welcomeMessage = `
            🤖 Hello! I'm your personal robotics consultant. I'm here to help you find the perfect robotic solution for your needs.
            
            I can assist with:
            • Finding robots for specific industries
            • Recommending solutions based on budget
            • Comparing different robot types
            • Explaining robot capabilities
            
            Would you like me to help you find the right robot for your project?
        `;
        this.addMessage(welcomeMessage, false);
    }

    startConsultation() {
        this.conversationState = 'consultation_start';
        const message = `
            Great! Let's find your perfect robotic solution! 🚀
            
            To give you the best recommendations, I'll ask you a few quick questions:
            
            **What's your primary use case?**
            🏭 Manufacturing/Industrial automation
            🏥 Healthcare/Medical assistance  
            🏠 Home/Personal use
            🎓 Education/Research
            🛒 Service/Retail
            📦 Logistics/Warehousing
            🔧 Other/Custom application
            
            Just type the number or describe your needs!
        `;
        this.addMessage(message, false);
    }

    async handleUserInput() {
        const aiInput = document.getElementById('ai-input');
        const userMessage = aiInput.value.trim();
        
        if (!userMessage) return;
        
        // Add user message
        this.addMessage(userMessage, true);
        aiInput.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Process message based on conversation state
        setTimeout(() => {
            this.hideTypingIndicator();
            this.processUserMessage(userMessage);
        }, 1000);
    }

    processUserMessage(message) {
        const lowercaseMessage = message.toLowerCase();
        
        switch (this.conversationState) {
            case 'initial':
                this.handleInitialMessage(lowercaseMessage);
                break;
            case 'consultation_start':
                this.handleIndustrySelection(lowercaseMessage);
                break;
            case 'budget_inquiry':
                this.handleBudgetInquiry(lowercaseMessage);
                break;
            case 'purpose_inquiry':
                this.handlePurposeInquiry(lowercaseMessage);
                break;
            case 'environment_inquiry':
                this.handleEnvironmentInquiry(lowercaseMessage);
                break;
            case 'recommendations':
                this.handleRecommendationQuestions(lowercaseMessage);
                break;
            default:
                this.handleGeneralQuestion(lowercaseMessage);
        }
    }

    handleInitialMessage(message) {
        if (message.includes('help') || message.includes('find') || message.includes('robot') || message.includes('yes')) {
            this.startConsultation();
        } else if (message.includes('no') || message.includes('browse')) {
            this.addMessage("No problem! Feel free to browse our robot encyclopedia. If you need help finding something specific, just ask!", false);
        } else {
            this.handleGeneralQuestion(message);
        }
    }

    handleIndustrySelection(message) {
        let industry = null;
        
        if (message.includes('manufactur') || message.includes('industrial') || message.includes('1')) {
            industry = 'industrial';
        } else if (message.includes('health') || message.includes('medical') || message.includes('2')) {
            industry = 'healthcare';
        } else if (message.includes('home') || message.includes('personal') || message.includes('3')) {
            industry = 'consumer';
        } else if (message.includes('educat') || message.includes('research') || message.includes('4')) {
            industry = 'educational';
        } else if (message.includes('service') || message.includes('retail') || message.includes('5')) {
            industry = 'service';
        } else if (message.includes('logistic') || message.includes('warehous') || message.includes('6')) {
            industry = 'logistics';
        } else if (message.includes('other') || message.includes('custom') || message.includes('7')) {
            industry = 'custom';
        }

        if (industry) {
            this.userProfile.industry = industry;
            this.askBudgetQuestion();
        } else {
            this.addMessage("I didn't quite catch that. Could you please specify your industry or use case? For example: manufacturing, healthcare, home use, education, etc.", false);
        }
    }

    askBudgetQuestion() {
        this.conversationState = 'budget_inquiry';
        const message = `
            Perfect! Now, what's your budget range?
            
            💰 **Budget Options:**
            1️⃣ Under $1,000 (Entry-level/Educational)
            2️⃣ $1,000 - $10,000 (Professional/Small business)
            3️⃣ $10,000 - $50,000 (Commercial grade)
            4️⃣ $50,000+ (Industrial/Enterprise)
            5️⃣ Budget is flexible
            
            This helps me recommend robots in your price range!
        `;
        this.addMessage(message, false);
    }

    handleBudgetInquiry(message) {
        let budget = null;
        
        if (message.includes('1') || message.includes('under') || message.includes('1000') || message.includes('entry')) {
            budget = 'entry';
        } else if (message.includes('2') || (message.includes('1000') && message.includes('10000')) || message.includes('professional')) {
            budget = 'professional';
        } else if (message.includes('3') || (message.includes('10000') && message.includes('50000')) || message.includes('commercial')) {
            budget = 'commercial';
        } else if (message.includes('4') || message.includes('50000') || message.includes('industrial') || message.includes('enterprise')) {
            budget = 'enterprise';
        } else if (message.includes('5') || message.includes('flexible') || message.includes('no limit')) {
            budget = 'flexible';
        }

        if (budget) {
            this.userProfile.budget = budget;
            this.askPurposeQuestion();
        } else {
            this.addMessage("Could you please clarify your budget range? You can use the numbers 1-5 or describe your budget in dollars.", false);
        }
    }

    askPurposeQuestion() {
        this.conversationState = 'purpose_inquiry';
        const message = `
            Great! What specific tasks do you need the robot to perform?
            
            🎯 **Common Tasks:**
            • Assembly and manufacturing
            • Cleaning and maintenance
            • Security and surveillance  
            • Education and entertainment
            • Research and development
            • Customer service
            • Material handling
            • Precision work
            
            Feel free to describe your specific needs!
        `;
        this.addMessage(message, false);
    }

    handlePurposeInquiry(message) {
        this.userProfile.purpose = message;
        this.askEnvironmentQuestion();
    }

    askEnvironmentQuestion() {
        this.conversationState = 'environment_inquiry';
        const message = `
            Perfect! One last question - what's your operating environment?
            
            🌍 **Environment Types:**
            🏭 Factory/Industrial setting
            🏢 Office/Indoor commercial space
            🏠 Home/Residential  
            🏥 Hospital/Clean room
            🌡️ Harsh conditions (outdoor, extreme temperatures)
            🔬 Laboratory/Research facility
            
            This helps ensure the robot can handle your conditions!
        `;
        this.addMessage(message, false);
    }

    handleEnvironmentInquiry(message) {
        this.userProfile.environment = message;
        this.generateRecommendations();
    }

    async generateRecommendations() {
        this.conversationState = 'recommendations';
        
        // Analyze user profile and find matching robots
        const recommendations = this.findMatchingRobots();
        
        if (recommendations.length > 0) {
            let message = `
                🎉 **Perfect! Based on your requirements, here are my top recommendations:**
                
                **Your Profile:**
                • Industry: ${this.userProfile.industry}
                • Budget: ${this.userProfile.budget}
                • Purpose: ${this.userProfile.purpose}
                • Environment: ${this.userProfile.environment}
                
                **Recommended Robots:**
            `;
            
            recommendations.slice(0, 3).forEach((robot, index) => {
                message += `
                
                **${index + 1}. ${robot.title}**
                🏭 Manufacturer: ${robot.manufacturer || 'Various'}
                📱 Category: ${robot.category}
                💡 Perfect for: ${robot.description.substring(0, 100)}...
                [View Details](robots/${robot.slug}.html)
                `;
            });
            
            message += `
                
                💬 Would you like more details about any of these robots, or do you have other questions?
            `;
            
            this.addMessage(message, false);
        } else {
            this.addMessage(`
                I couldn't find exact matches in our current database, but I can help you in other ways:
                
                🔍 **Let me suggest alternatives:**
                • Browse our [Robot Encyclopedia](encyclopedia.html) for similar solutions
                • Contact our experts for custom recommendations
                • Check back later as we regularly add new robots
                
                Would you like me to help you refine your search criteria?
            `, false);
        }
    }

    findMatchingRobots() {
        if (!this.robotDatabase || this.robotDatabase.length === 0) {
            return [];
        }

        return this.robotDatabase.filter(robot => {
            let score = 0;
            
            // Category matching
            if (this.userProfile.industry === 'industrial' && robot.category?.toLowerCase().includes('industrial')) score += 3;
            if (this.userProfile.industry === 'healthcare' && robot.category?.toLowerCase().includes('medical')) score += 3;
            if (this.userProfile.industry === 'consumer' && robot.category?.toLowerCase().includes('consumer')) score += 3;
            if (this.userProfile.industry === 'educational' && robot.category?.toLowerCase().includes('educational')) score += 3;
            if (this.userProfile.industry === 'service' && robot.category?.toLowerCase().includes('service')) score += 3;
            
            // Purpose matching (keyword search in description)
            const purpose = this.userProfile.purpose?.toLowerCase() || '';
            const description = robot.description?.toLowerCase() || '';
            
            if (purpose.includes('cleaning') && description.includes('clean')) score += 2;
            if (purpose.includes('assembly') && description.includes('assembly')) score += 2;
            if (purpose.includes('security') && description.includes('security')) score += 2;
            if (purpose.includes('education') && description.includes('education')) score += 2;
            if (purpose.includes('research') && description.includes('research')) score += 2;
            
            return score >= 2;
        }).sort((a, b) => {
            // Prioritize featured robots
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return 0;
        });
    }

    handleRecommendationQuestions(message) {
        if (message.includes('more details') || message.includes('tell me more')) {
            this.addMessage("Which robot would you like to know more about? Just mention the robot name or number!", false);
        } else if (message.includes('different') || message.includes('other options')) {
            this.addMessage("Let me find some alternative options for you...", false);
            setTimeout(() => this.generateAlternativeRecommendations(), 1000);
        } else if (message.includes('contact') || message.includes('expert')) {
            this.addMessage(`
                🤝 **Get Expert Help:**
                
                Our robotics experts are here to help! You can:
                • [Contact us directly](contact.html) for personalized consultation
                • Schedule a virtual demo
                • Get detailed technical specifications
                • Discuss custom integration options
                
                Would you like me to help you with anything else?
            `, false);
        } else {
            this.handleGeneralQuestion(message);
        }
    }

    handleGeneralQuestion(message) {
        // Handle general robotics questions
        if (message.includes('compare') || message.includes('difference')) {
            this.addMessage("I'd be happy to help you compare robots! Which specific robots or robot types would you like me to compare?", false);
        } else if (message.includes('price') || message.includes('cost')) {
            this.addMessage("Robot prices vary widely based on capabilities. Would you like me to find robots within a specific budget range?", false);
        } else if (message.includes('programming') || message.includes('code')) {
            this.addMessage("Great question about programming! Most modern robots offer user-friendly programming interfaces. Would you like information about robots that are easy to program?", false);
        } else if (message.includes('maintenance') || message.includes('support')) {
            this.addMessage("Maintenance is important! I can help you find robots with good support networks and low maintenance requirements. What type of robot are you considering?", false);
        } else {
            // Default helpful response
            this.addMessage(`
                I understand you're asking about "${message}". I'm here to help you find the perfect robotic solution!
                
                🤖 **I can help with:**
                • Finding robots for specific needs
                • Comparing different models
                • Explaining robot capabilities
                • Budget recommendations
                • Technical specifications
                
                What specific information would you like to know?
            `, false);
        }
    }

    addMessage(message, isUser = false) {
        const aiMessages = document.getElementById('ai-chat-messages');
        if (!aiMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'user-message' : 'ai-message';

        if (isUser) {
            messageDiv.innerHTML = `
                <div class="user-bubble">${this.formatMessage(message)}</div>
                <div class="user-avatar"><i class="fas fa-user"></i></div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="ai-avatar"><i class="fas fa-robot"></i></div>
                <div class="ai-bubble">${this.formatMessage(message)}</div>
            `;
        }

        aiMessages.appendChild(messageDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
        
        // Store in conversation history
        this.conversationHistory.push({ message, isUser, timestamp: Date.now() });
    }

    formatMessage(message) {
        // Convert markdown-like formatting to HTML
        return message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
            .replace(/\n/g, '<br>')
            .replace(/• /g, '• ')
            .replace(/(\d️⃣|🏭|🏥|🏠|🎓|🛒|📦|🔧|💰|🎯|🌍|🔍|🤝|🤖)/g, '$1');
    }

    showTypingIndicator() {
        const aiMessages = document.getElementById('ai-chat-messages');
        if (!aiMessages) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="ai-avatar"><i class="fas fa-robot"></i></div>
            <div class="ai-bubble">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        aiMessages.appendChild(typingDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Reset conversation for new consultation
    resetConversation() {
        this.conversationState = 'initial';
        this.userProfile = {
            industry: null,
            budget: null,
            purpose: null,
            experience: null,
            environment: null,
            requirements: []
        };
        this.conversationHistory = [];
        
        const aiMessages = document.getElementById('ai-chat-messages');
        if (aiMessages) {
            aiMessages.innerHTML = '';
            this.showWelcomeMessage();
        }
    }
}

// Initialize the assistant when the page loads
document.addEventListener('DOMContentLoaded', function() {
    window.roboticsAssistant = new RoboticsAssistant();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RoboticsAssistant;
}
