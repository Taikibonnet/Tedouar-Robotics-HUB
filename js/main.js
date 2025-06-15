// Main JavaScript file for TedouaR Robotics Hub

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            navLinks.classList.toggle('mobile-active');
            authButtons.classList.toggle('mobile-active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('header') && navLinks && navLinks.classList.contains('mobile-active')) {
            navLinks.classList.remove('mobile-active');
            authButtons.classList.remove('mobile-active');
        }
    });
    
    // AI Assistant functionality
    const aiButton = document.getElementById('ai-button');
    const aiChatContainer = document.getElementById('ai-chat-container');
    const aiChatClose = document.getElementById('ai-chat-close');
    const aiInput = document.getElementById('ai-input');
    const aiSend = document.getElementById('ai-send');
    const aiMessages = document.getElementById('ai-chat-messages');
    
    if (aiButton && aiChatContainer) {
        aiButton.addEventListener('click', function() {
            aiChatContainer.style.display = aiChatContainer.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    if (aiChatClose && aiChatContainer) {
        aiChatClose.addEventListener('click', function() {
            aiChatContainer.style.display = 'none';
        });
    }
    
    // Simple AI chat functionality
    function addMessage(message, isUser = false) {
        if (!aiMessages) return;
        
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
    
    function handleAIResponse(userMessage) {
        const responses = [
            "That's an interesting question about robotics! I'd recommend checking our encyclopedia for detailed information.",
            "Robotics is such a fascinating field! Have you explored our featured robots section?",
            "Great question! Our database has comprehensive information about various robot types and manufacturers.",
            "I love discussing robotics! Feel free to browse through our categories to learn more.",
            "Robotics technology is advancing rapidly. Check out our latest featured robots for cutting-edge innovations!"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        setTimeout(() => {
            addMessage(randomResponse);
        }, 1000);
    }
    
    if (aiSend && aiInput) {
        aiSend.addEventListener('click', function() {
            const message = aiInput.value.trim();
            if (message) {
                addMessage(message, true);
                aiInput.value = '';
                handleAIResponse(message);
            }
        });
        
        aiInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                aiSend.click();
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 1000);
            }
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.robot-card, .category-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Global error handler
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Service Worker registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('SW registered: ', registration);
        }).catch(function(registrationError) {
            console.log('SW registration failed: ', registrationError);
        });
    });
}