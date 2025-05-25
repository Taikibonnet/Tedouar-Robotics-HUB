// Enhanced Authentication System for TedouaR Robotics Hub
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = {
            'tedouar.robotics@gmail.com': {
                password: 'admin123',
                name: 'Tedouar Robotics',
                role: 'admin',
                avatar: 'TR'
            },
            'admin@tedouarrobotics.com': {
                password: 'admin123',
                name: 'Admin User',
                role: 'admin', 
                avatar: 'AU'
            },
            'user@example.com': {
                password: 'user123',
                name: 'Demo User',
                role: 'user',
                avatar: 'DU'
            }
        };
        this.init();
    }

    init() {
        // Check if user is already logged in
        const savedUser = localStorage.getItem('tedouar_auth_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateAuthUI();
        }

        // Add event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login form handler
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Signup form handler  
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Logout handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('logout-btn') || e.target.closest('.logout-btn')) {
                e.preventDefault();
                this.logout();
            }
        });
    }

    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Clear previous errors
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(el => el.style.display = 'none');

        if (this.authenticate(email, password)) {
            this.showSuccess('Login successful! Welcome back.');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            this.showError('Invalid email or password. Please try again.');
        }
    }

    handleSignup(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = {
            name: formData.get('fullName'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };

        // Validate signup data
        if (this.validateSignup(userData)) {
            // Add new user (in real app, this would go to backend)
            this.users[userData.email] = {
                password: userData.password,
                name: userData.name,
                role: 'user',
                avatar: userData.name.split(' ').map(n => n[0]).join('').toUpperCase()
            };

            this.showSuccess('Account created successfully! You can now log in.');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    }

    authenticate(email, password) {
        const user = this.users[email];
        if (user && user.password === password) {
            this.currentUser = {
                email: email,
                name: user.name,
                role: user.role,
                avatar: user.avatar
            };
            
            // Save to localStorage
            localStorage.setItem('tedouar_auth_user', JSON.stringify(this.currentUser));
            
            // Update UI
            this.updateAuthUI();
            return true;
        }
        return false;
    }

    validateSignup(userData) {
        // Check if passwords match
        if (userData.password !== userData.confirmPassword) {
            this.showError('Passwords do not match.');
            return false;
        }

        // Check password strength
        if (userData.password.length < 6) {
            this.showError('Password must be at least 6 characters long.');
            return false;
        }

        // Check if email already exists
        if (this.users[userData.email]) {
            this.showError('An account with this email already exists.');
            return false;
        }

        return true;
    }

    updateAuthUI() {
        if (!this.currentUser) return;

        // Update all auth buttons on all pages
        const authButtons = document.querySelectorAll('.auth-buttons');
        authButtons.forEach(authButton => {
            if (authButton) {
                authButton.innerHTML = `
                    <div class="user-menu">
                        <div class="user-avatar">${this.currentUser.avatar}</div>
                        <div class="user-info">
                            <span class="user-name">${this.currentUser.name}</span>
                            <div class="user-dropdown">
                                <div class="dropdown-content">
                                    ${this.currentUser.role === 'admin' ? 
                                        '<a href="admin.html" class="dropdown-item"><i class="fas fa-cog"></i> Admin Panel</a>' : 
                                        ''
                                    }
                                    <a href="#" class="dropdown-item"><i class="fas fa-user"></i> Profile</a>
                                    <a href="#" class="dropdown-item"><i class="fas fa-cog"></i> Settings</a>
                                    <div class="dropdown-divider"></div>
                                    <a href="#" class="dropdown-item logout-btn"><i class="fas fa-sign-out-alt"></i> Sign Out</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        });

        // Add user menu styles if not already added
        this.addUserMenuStyles();

        // Setup dropdown functionality
        this.setupUserDropdown();
    }

    addUserMenuStyles() {
        if (document.getElementById('auth-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'auth-styles';
        styles.textContent = `
            .user-menu {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                position: relative;
                cursor: pointer;
                padding: 0.5rem 1rem;
                border-radius: 50px;
                border: 1px solid rgba(0, 255, 255, 0.3);
                background: rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
            }

            .user-menu:hover {
                border-color: var(--primary-color);
                box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
                transform: translateY(-2px);
            }

            .user-avatar {
                width: 35px;
                height: 35px;
                border-radius: 50%;
                background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: var(--bg-color);
                font-size: 0.9rem;
            }

            .user-info {
                position: relative;
            }

            .user-name {
                color: var(--text-color);
                font-weight: 500;
                font-size: 0.9rem;
            }

            .user-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                margin-top: 0.5rem;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                z-index: 1000;
            }

            .user-menu:hover .user-dropdown {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .dropdown-content {
                background: rgba(17, 17, 17, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid var(--border-color);
                border-radius: 10px;
                min-width: 200px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                overflow: hidden;
            }

            .dropdown-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1rem;
                color: var(--text-color);
                text-decoration: none;
                transition: all 0.3s ease;
                font-size: 0.9rem;
            }

            .dropdown-item:hover {
                background: rgba(0, 255, 255, 0.1);
                color: var(--primary-color);
            }

            .dropdown-item i {
                width: 16px;
                text-align: center;
            }

            .dropdown-divider {
                height: 1px;
                background: var(--border-color);
                margin: 0.5rem 0;
            }

            .logout-btn:hover {
                background: rgba(255, 68, 68, 0.1) !important;
                color: #ff4444 !important;
            }

            @media (max-width: 768px) {
                .user-menu {
                    padding: 0.4rem 0.75rem;
                }

                .user-name {
                    display: none;
                }

                .user-avatar {
                    width: 30px;
                    height: 30px;
                    font-size: 0.8rem;
                }

                .dropdown-content {
                    right: -20px;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    setupUserDropdown() {
        // Prevent dropdown from closing when clicking inside
        const dropdowns = document.querySelectorAll('.dropdown-content');
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('click', (e) => {
                if (!e.target.classList.contains('logout-btn') && !e.target.closest('.logout-btn')) {
                    e.stopPropagation();
                }
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                const dropdowns = document.querySelectorAll('.user-dropdown');
                dropdowns.forEach(dropdown => {
                    dropdown.style.opacity = '0';
                    dropdown.style.visibility = 'hidden';
                    dropdown.style.transform = 'translateY(-10px)';
                });
            }
        });
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('tedouar_auth_user');
        
        // Reset auth buttons
        const authButtons = document.querySelectorAll('.auth-buttons');
        authButtons.forEach(authButton => {
            if (authButton) {
                authButton.innerHTML = `
                    <a href="login.html" class="btn btn-outline">Log In</a>
                    <a href="signup.html" class="btn btn-primary">Sign Up</a>
                `;
            }
        });

        this.showSuccess('You have been logged out successfully.');
        
        // Redirect to home after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    showSuccess(message) {
        this.showAlert(message, 'success');
    }

    showError(message) {
        this.showAlert(message, 'error');
    }

    showAlert(message, type) {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.auth-alert');
        existingAlerts.forEach(alert => alert.remove());

        // Create new alert
        const alert = document.createElement('div');
        alert.className = `auth-alert auth-alert-${type}`;
        alert.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        // Add alert styles if not already added
        if (!document.getElementById('alert-styles')) {
            const alertStyles = document.createElement('style');
            alertStyles.id = 'alert-styles';
            alertStyles.textContent = `
                .auth-alert {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 10px;
                    color: white;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    z-index: 10000;
                    animation: slideInRight 0.3s ease;
                    backdrop-filter: blur(10px);
                    border: 1px solid;
                }

                .auth-alert-success {
                    background: rgba(0, 255, 136, 0.2);
                    border-color: var(--success-color);
                    color: var(--success-color);
                }

                .auth-alert-error {
                    background: rgba(255, 68, 68, 0.2);
                    border-color: var(--danger-color);
                    color: var(--danger-color);
                }

                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `;
            document.head.appendChild(alertStyles);
        }

        // Add to page
        document.body.appendChild(alert);

        // Auto remove after 4 seconds
        setTimeout(() => {
            alert.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => alert.remove(), 300);
        }, 4000);
    }

    // Method to check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Method to check if user is admin
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    // Method to get current user
    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize auth system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.authSystem = new AuthSystem();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthSystem;
}