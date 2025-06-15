// Main JavaScript for TedouaR Robotics Hub - Mobile Optimized
document.addEventListener('DOMContentLoaded', function() {
    // Ensure logo and hero robot are always visible immediately
    ensureLogoVisibility();
    ensureHeroRobotVisibility();
    
    // Mobile menu handling
    setupMobileMenu();
    
    // AI Assistant button
    setupAIAssistant();
    
    // Smooth scrolling for anchor links
    setupSmoothScrolling();
    
    // Header scroll effects
    setupHeaderScrollEffects();
    
    // Load featured robots if on home page
    if (document.querySelector('.robot-grid')) {
        loadFeaturedRobots();
    }
    
    // Setup intersection observer for animations
    setupAnimations();
    
    // Setup card hover effects
    setupCardEffects();
    
    // Mobile touch optimizations
    setupMobileTouchOptimizations();
});

// Ensure logo is always visible
function ensureLogoVisibility() {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.opacity = '1';
        logo.style.transform = 'scale(1)';
        logo.style.transition = 'none';
        logo.style.visibility = 'visible';
        logo.style.display = 'block';
        
        // Handle load event
        logo.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
        
        // If already loaded (cached)
        if (logo.complete && logo.naturalWidth !== 0) {
            logo.style.opacity = '1';
            logo.style.transform = 'scale(1)';
        }
    }
}

// Ensure hero robot is always visible
function ensureHeroRobotVisibility() {
    const heroRobot = document.querySelector('.hero-image img');
    if (heroRobot) {
        heroRobot.style.opacity = '1';
        heroRobot.style.transform = 'scale(1)';
        heroRobot.style.transition = 'none';
        heroRobot.style.visibility = 'visible';
        heroRobot.style.display = 'block';
        
        // Handle load event
        heroRobot.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
            // Re-enable transition after ensuring visibility
            setTimeout(() => {
                this.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            }, 100);
        });
        
        // If already loaded (cached)
        if (heroRobot.complete && heroRobot.naturalWidth !== 0) {
            heroRobot.style.opacity = '1';
            heroRobot.style.transform = 'scale(1)';
            setTimeout(() => {
                heroRobot.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            }, 100);
        }
    }
}

// Mobile menu setup
function setupMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (mobileMenuButton && navLinks) {
        mobileMenuButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle menu visibility
            navLinks.classList.toggle('mobile-active');
            if (authButtons) {
                authButtons.classList.toggle('mobile-active');
            }
            
            // Toggle hamburger icon
            const icon = this.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('mobile-active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-links') && 
                !e.target.closest('.mobile-menu-button') && 
                !e.target.closest('.auth-buttons')) {
                navLinks.classList.remove('mobile-active');
                if (authButtons) {
                    authButtons.classList.remove('mobile-active');
                }
                const icon = mobileMenuButton.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            }
        });
        
        // Close menu when clicking on nav links
        const navLinksItems = navLinks.querySelectorAll('a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('mobile-active');
                if (authButtons) {
                    authButtons.classList.remove('mobile-active');
                }
                const icon = mobileMenuButton.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            });
        });
    }
}

// AI Assistant setup
function setupAIAssistant() {
    const aiButton = document.getElementById('ai-button');
    if (aiButton) {
        aiButton.addEventListener('click', function() {
            window.location.href = 'contact.html?assistant=open';
        });
    }
}

// Smooth scrolling setup
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Header scroll effects
function setupHeaderScrollEffects() {
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (header) {
            // Update background opacity based on scroll
            if (scrollTop > 100) {
                header.style.background = 'rgba(10, 10, 15, 0.98)';
                header.style.backdropFilter = 'blur(25px)';
            } else {
                header.style.background = 'rgba(10, 10, 15, 0.95)';
                header.style.backdropFilter = 'blur(20px)';
            }
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });
}

// Load featured robots
function loadFeaturedRobots() {
    const robotGrid = document.querySelector('.robot-grid');
    if (!robotGrid) return;
    
    // Show loading state
    robotGrid.innerHTML = '<div class="loading">Loading robots...</div>';
    
    fetch('robots.json')
        .then(response => response.json())
        .then(robots => {
            // Filter featured robots
            const featuredRobots = robots.filter(robot => robot.featured === true);
            
            // Display featured robots (max 3)
            const robotsToShow = featuredRobots.slice(0, 3);
            
            if (robotsToShow.length > 0) {
                robotGrid.innerHTML = '';
                robotsToShow.forEach(robot => {
                    const imageUrl = robot.image || 'images/robots/placeholder.jpg';
                    const truncatedDescription = robot.description.length > 120 ? 
                        robot.description.substring(0, 120) + '...' : 
                        robot.description;
                    
                    const robotCard = document.createElement('div');
                    robotCard.className = 'robot-card';
                    
                    robotCard.innerHTML = `
                        <div class="robot-card-image">
                            <img src="${imageUrl}" alt="${robot.title}" loading="lazy">
                        </div>
                        <div class="robot-card-content">
                            <h3 class="robot-card-title">${robot.title}</h3>
                            <div class="robot-card-categories">
                                ${robot.category ? `<span class="category-pill">${robot.category}</span>` : ''}
                            </div>
                            ${robot.manufacturer ? `<div class="robot-card-manufacturer">${robot.manufacturer}</div>` : ''}
                            <p class="robot-card-description">${truncatedDescription}</p>
                            <a href="robots/${robot.slug}.html" class="robot-view-details">View Details</a>
                        </div>
                    `;
                    
                    robotGrid.appendChild(robotCard);
                });
            } else {
                // Show default robots if none are featured
                showDefaultRobots(robotGrid);
            }
        })
        .catch(error => {
            console.error('Error loading featured robots:', error);
            showDefaultRobots(robotGrid);
        });
}

// Show default robots
function showDefaultRobots(container) {
    const defaultRobots = [
        {
            title: "Tesla Optimus",
            slug: "tesla-optimus",
            category: "Humanoid",
            manufacturer: "Tesla, Inc.",
            image: "images/robots/tesla-optimus.jpg",
            description: "Tesla Optimus is a humanoid robot designed to perform manual tasks, blending AI with robotics for future labor automation."
        }
    ];
    
    container.innerHTML = '';
    defaultRobots.forEach(robot => {
        const imageUrl = robot.image || 'images/robots/placeholder.jpg';
        
        const robotCard = document.createElement('div');
        robotCard.className = 'robot-card';
        
        robotCard.innerHTML = `
            <div class="robot-card-image">
                <img src="${imageUrl}" alt="${robot.title}" loading="lazy">
            </div>
            <div class="robot-card-content">
                <h3 class="robot-card-title">${robot.title}</h3>
                <div class="robot-card-categories">
                    ${robot.category ? `<span class="category-pill">${robot.category}</span>` : ''}
                </div>
                ${robot.manufacturer ? `<div class="robot-card-manufacturer">${robot.manufacturer}</div>` : ''}
                <p class="robot-card-description">${robot.description}</p>
                <a href="robots/${robot.slug}.html" class="robot-view-details">View Details</a>
            </div>
        `;
        
        container.appendChild(robotCard);
    });
}

// Setup animations with Intersection Observer
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
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
    const animateElements = document.querySelectorAll('.robot-card, .category-card, .feature-card');
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Setup card hover effects (optimized for mobile)
function setupCardEffects() {
    const cards = document.querySelectorAll('.robot-card, .category-card');
    
    cards.forEach(card => {
        // For touch devices, use touch events
        if ('ontouchstart' in window) {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = 'translateY(0) scale(1)';
                }, 150);
            });
        } else {
            // For non-touch devices, use mouse events
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        }
    });
}

// Mobile touch optimizations
function setupMobileTouchOptimizations() {
    // Prevent zoom on double tap for buttons
    const buttons = document.querySelectorAll('.btn, .ai-button, .mobile-menu-button');
    buttons.forEach(button => {
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.click();
        });
    });
    
    // Optimize scroll performance
    let ticking = false;
    
    function updateScrollEffects() {
        // Any scroll-based animations or effects
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }, { passive: true });
    
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            // Recalculate any position-dependent elements
            window.scrollTo(window.scrollX, window.scrollY);
        }, 100);
    });
    
    // Improve touch feedback for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .robot-card, .category-card');
    interactiveElements.forEach(element => {
        element.style.webkitTapHighlightColor = 'rgba(0, 255, 255, 0.3)';
        element.style.tapHighlightColor = 'rgba(0, 255, 255, 0.3)';
    });
}

// Utility function to detect mobile devices
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

// Handle viewport meta tag for mobile
function setupMobileViewport() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
        const newViewport = document.createElement('meta');
        newViewport.name = 'viewport';
        newViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
        document.head.appendChild(newViewport);
    }
}

// Initialize mobile optimizations
setupMobileViewport();

// Handle images with lazy loading and error handling
function handleImages() {
    const images = document.querySelectorAll('img:not(.logo):not(.hero-image img)');
    
    images.forEach(img => {
        // Add loading attribute for browsers that support it
        img.loading = 'lazy';
        
        // Add error handling
        img.addEventListener('error', function() {
            this.src = 'images/robots/placeholder.jpg';
            this.alt = 'Robot placeholder image';
        });
        
        // Fade in effect for loaded images
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
        
        // Set initial state for lazy loaded images
        if (!img.complete) {
            img.style.opacity = '0';
            img.style.transform = 'scale(0.9)';
            img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        }
    });
}

// Initialize image handling
handleImages();

// Export functions for use in other scripts
window.TedouarRoboticsHub = {
    ensureLogoVisibility,
    ensureHeroRobotVisibility,
    setupMobileMenu,
    isMobileDevice,
    loadFeaturedRobots
};
