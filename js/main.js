// Main JavaScript for TedouaR Robotics Hub
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu handling
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            navLinks.classList.toggle('mobile-active');
            authButtons.classList.toggle('mobile-active');
        });
    }
    
    // AI Assistant button
    const aiButton = document.getElementById('ai-button');
    if (aiButton) {
        aiButton.addEventListener('click', function() {
            window.location.href = 'contact.html?assistant=open';
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    // Add parallax effect to hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero');
        if (parallax) {
            const speed = scrolled * 0.3;
            parallax.style.transform = `translateY(${speed}px)`;
        }
        
        // Update header background on scroll
        const header = document.querySelector('header');
        if (header) {
            if (scrolled > 100) {
                header.style.background = 'rgba(10, 10, 15, 0.98)';
            } else {
                header.style.background = 'rgba(10, 10, 15, 0.95)';
            }
        }
    });
    
    // Ensure logo is always visible immediately
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.opacity = '1';
        logo.style.transform = 'scale(1)';
        logo.style.transition = 'none'; // Remove any transition that might delay visibility
        
        // If logo has load event, ensure it's visible
        logo.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
        
        // If logo is already loaded (cached)
        if (logo.complete && logo.naturalWidth !== 0) {
            logo.style.opacity = '1';
            logo.style.transform = 'scale(1)';
        }
    }
    
    // Ensure hero robot is always visible immediately
    const heroRobot = document.querySelector('.hero-image img');
    if (heroRobot) {
        heroRobot.style.opacity = '1';
        heroRobot.style.transform = 'scale(1)';
        heroRobot.style.transition = 'none'; // Remove any transition that might delay visibility
        
        // If hero robot has load event, ensure it's visible
        heroRobot.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
            // Re-enable transition after ensuring visibility
            setTimeout(() => {
                this.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            }, 100);
        });
        
        // If hero robot is already loaded (cached)
        if (heroRobot.complete && heroRobot.naturalWidth !== 0) {
            heroRobot.style.opacity = '1';
            heroRobot.style.transform = 'scale(1)';
            // Re-enable transition after ensuring visibility
            setTimeout(() => {
                heroRobot.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            }, 100);
        }
    }
    
    // Add loading animation to other images (but not logo and hero robot)
    const images = document.querySelectorAll('img:not(.logo):not(.hero-image img)');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
        
        // Set initial state for other images
        img.style.opacity = '0';
        img.style.transform = 'scale(0.9)';
        img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation (but not logo and hero elements)
    const animateElements = document.querySelectorAll('.robot-card, .category-card, .feature-card, .section-title:not(.hero .section-title)');
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.robot-card, .category-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});
