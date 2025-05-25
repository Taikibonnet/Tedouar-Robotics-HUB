// Dynamic Robot Page Generator for Admin Panel
class RobotPageGenerator {
    constructor() {
        this.templatePath = 'robots/template.html';
    }

    // Generate HTML content for a robot detail page
    generateRobotPage(robotData) {
        const specificationsTable = this.generateSpecificationsTable(robotData.specifications || {});
        const capabilitiesList = this.generateCapabilitiesList(robotData.capabilities || []);
        const applicationsList = this.generateApplicationsList(robotData.applications || []);

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${robotData.title} - TedouaR Robotics Hub</title>
    <link rel="stylesheet" href="../styles/main.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* Robot Detail Page Styles */
        .robot-hero {
            padding: 120px 0 60px;
            background: linear-gradient(135deg, rgba(12, 235, 235, 0.1), rgba(32, 227, 178, 0.1));
            position: relative;
            overflow: hidden;
        }

        .robot-hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M10 0v5M0 10h5M10 15v5M15 10h5M10 10m-2 0a2 2 0 1 1 4 0a2 2 0 1 1 -4 0" stroke="rgba(32,227,178,0.1)" stroke-width="0.5" fill="none"/></pattern></defs><rect width="100" height="100" fill="url(%23circuit)"/></svg>') repeat;
            animation: circuit-flow 15s linear infinite;
            opacity: 0.3;
            z-index: 0;
        }

        @keyframes circuit-flow {
            0% { transform: translate(0, 0); }
            100% { transform: translate(20px, 20px); }
        }

        .robot-header {
            position: relative;
            z-index: 1;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            align-items: center;
        }

        .robot-info {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .robot-title {
            font-size: 3.5rem;
            font-weight: 700;
            color: var(--primary-color);
            margin-bottom: 10px;
            text-shadow: 0 0 20px rgba(32, 227, 178, 0.5);
        }

        .robot-manufacturer {
            font-size: 1.2rem;
            color: var(--secondary-color);
            margin-bottom: 20px;
        }

        .robot-short-desc {
            font-size: 1.3rem;
            line-height: 1.6;
            color: var(--text-color);
            opacity: 0.9;
        }

        .robot-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-top: 20px;
        }

        .meta-item {
            background: rgba(32, 227, 178, 0.1);
            border: 1px solid rgba(32, 227, 178, 0.3);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            color: var(--primary-color);
        }

        .robot-image-container {
            position: relative;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(32, 227, 178, 0.2);
        }

        .robot-image {
            width: 100%;
            height: 400px;
            object-fit: cover;
            display: block;
        }

        .robot-content {
            padding: 80px 0;
        }

        .content-section {
            margin-bottom: 60px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 15px;
            padding: 40px;
            border: 1px solid rgba(32, 227, 178, 0.1);
            position: relative;
            overflow: hidden;
        }

        .content-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        }

        .section-title {
            font-size: 2rem;
            color: var(--primary-color);
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .section-content {
            font-size: 1.1rem;
            line-height: 1.8;
            color: var(--text-color);
        }

        .specs-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        .specs-table th,
        .specs-table td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid rgba(32, 227, 178, 0.2);
        }

        .specs-table th {
            background: rgba(32, 227, 178, 0.1);
            color: var(--primary-color);
            font-weight: 600;
            width: 30%;
        }

        .capability-list,
        .application-list {
            list-style: none;
            padding: 0;
        }

        .capability-list li,
        .application-list li {
            padding: 12px 0;
            border-bottom: 1px solid rgba(32, 227, 178, 0.1);
            position: relative;
            padding-left: 30px;
        }

        .capability-list li::before,
        .application-list li::before {
            content: '▶';
            position: absolute;
            left: 0;
            color: var(--primary-color);
            font-size: 0.8rem;
        }

        .back-button {
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--primary-color);
            color: var(--bg-color);
            padding: 12px 20px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 500;
            z-index: 100;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .back-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(32, 227, 178, 0.3);
        }

        @media (max-width: 768px) {
            .robot-header {
                grid-template-columns: 1fr;
                gap: 40px;
            }

            .robot-title {
                font-size: 2.5rem;
            }

            .content-section {
                padding: 25px;
                margin-bottom: 40px;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header>
        <div class="container header-container">
            <a href="../index.html" class="logo-container">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="180" height="60" class="logo">
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#0cebeb"/>
                      <stop offset="100%" stop-color="#20e3b2"/>
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2" result="blur"/>
                      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                    </filter>
                  </defs>
                  <path d="M30.96965,130.265109c4.504842-2.783085,98.787866-5.009554,85.997348-5.009554-117.352536,2.860933-40.72106,19.243294-40.493897,14.6112" transform="translate(4.592093-3.339704)" fill="none" stroke="url(#logoGradient)" stroke-width="1.5" filter="url(#glow)"/>
                  <text dx="0" dy="0" font-family="Arial, sans-serif" font-size="15" font-weight="400" font-style="italic" transform="matrix(2.322194-.031029 0.010676 0.798958 74.435681 137.109235)" fill="url(#logoGradient)" filter="url(#glow)">
                    <tspan y="0" font-weight="400">edouaR</tspan>
                  </text>
                  <text x="110" y="150" font-family="Arial, sans-serif" font-size="10" font-weight="700" letter-spacing="2" text-anchor="middle" fill="url(#logoGradient)" filter="url(#glow)">ROBOTICS</text>
                </svg>
            </a>
            <nav class="nav-links">
                <a href="../index.html">Home</a>
                <a href="../encyclopedia.html">Encyclopedia</a>
                <a href="../about.html">About Us</a>
                <a href="../contact.html">Contact</a>
            </nav>
            <button class="mobile-menu-button">
                <i class="fas fa-bars"></i>
            </button>
            <div class="auth-buttons">
                <a href="../login.html" class="btn btn-outline">Log In</a>
                <a href="../signup.html" class="btn btn-primary">Sign Up</a>
            </div>
        </div>
    </header>

    <a href="../encyclopedia.html" class="back-button">
        <i class="fas fa-arrow-left"></i>
        Back to Encyclopedia
    </a>

    <!-- Robot Hero Section -->
    <section class="robot-hero">
        <div class="container">
            <div class="robot-header">
                <div class="robot-info">
                    <h1 class="robot-title">${robotData.title}</h1>
                    <div class="robot-manufacturer">${robotData.manufacturer || 'Unknown Manufacturer'}</div>
                    <p class="robot-short-desc">${robotData.shortDescription || robotData.description}</p>
                    
                    <div class="robot-meta">
                        <div class="meta-item">
                            <i class="fas fa-tag"></i> ${robotData.category || 'General'}
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-cog"></i> ${robotData.status || 'Available'}
                        </div>
                        ${robotData.price ? `<div class="meta-item"><i class="fas fa-dollar-sign"></i> ${robotData.price}</div>` : ''}
                        ${robotData.releaseDate ? `<div class="meta-item"><i class="fas fa-calendar"></i> ${robotData.releaseDate}</div>` : ''}
                    </div>
                </div>
                
                <div class="robot-image-container">
                    <img src="${robotData.image || '../images/robots/placeholder.jpg'}" alt="${robotData.title}" class="robot-image" onerror="this.src='../images/robots/placeholder.jpg'">
                </div>
            </div>
        </div>
    </section>

    <!-- Robot Content -->
    <main class="robot-content">
        <div class="container">
            <!-- Overview Section -->
            <section class="content-section">
                <h2 class="section-title">
                    <i class="fas fa-info-circle"></i>
                    Full Description
                </h2>
                <div class="section-content">
                    ${robotData.fullDescription || robotData.description || 'No detailed description available.'}
                </div>
            </section>

            ${specificationsTable ? `
            <!-- Specifications Section -->
            <section class="content-section">
                <h2 class="section-title">
                    <i class="fas fa-clipboard-list"></i>
                    Technical Specifications
                </h2>
                <div class="section-content">
                    ${specificationsTable}
                </div>
            </section>
            ` : ''}

            ${capabilitiesList ? `
            <!-- Capabilities Section -->
            <section class="content-section">
                <h2 class="section-title">
                    <i class="fas fa-rocket"></i>
                    Capabilities
                </h2>
                <div class="section-content">
                    ${capabilitiesList}
                </div>
            </section>
            ` : ''}

            ${applicationsList ? `
            <!-- Applications Section -->
            <section class="content-section">
                <h2 class="section-title">
                    <i class="fas fa-tasks"></i>
                    Applications
                </h2>
                <div class="section-content">
                    ${applicationsList}
                </div>
            </section>
            ` : ''}
        </div>
    </main>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-section">
                    <h3>About</h3>
                    <ul class="footer-links">
                        <li><a href="../about.html">Our Mission</a></li>
                        <li><a href="../about.html#team">The Team</a></li>
                        <li><a href="../about.html#partners">Partners</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h3>Resources</h3>
                    <ul class="footer-links">
                        <li><a href="../encyclopedia.html">Robot Database</a></li>
                        <li><a href="../encyclopedia.html?category=featured">Popular Robots</a></li>
                        <li><a href="../encyclopedia.html?category=new">Latest Additions</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h3>Categories</h3>
                    <ul class="footer-links">
                        <li><a href="../encyclopedia.html?category=industrial">Industrial Robotics</a></li>
                        <li><a href="../encyclopedia.html?category=service">Service Robots</a></li>
                        <li><a href="../encyclopedia.html?category=humanoid">Humanoids</a></li>
                        <li><a href="../encyclopedia.html?category=space">Space Robotics</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h3>Connect</h3>
                    <ul class="footer-links">
                        <li><a href="../contact.html">Contact Us</a></li>
                        <li><a href="#" target="_blank">Twitter</a></li>
                        <li><a href="#" target="_blank">LinkedIn</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="copyright">
                &copy; 2025 TedouaR Robotics Hub. All rights reserved.
            </div>
        </div>
    </footer>

    <script src="../js/main.js"></script>
    <script src="../js/auth.js"></script>
</body>
</html>`;
    }

    // Generate specifications table HTML
    generateSpecificationsTable(specifications) {
        if (!specifications || Object.keys(specifications).length === 0) {
            return null;
        }

        let tableRows = '';
        for (const [key, value] of Object.entries(specifications)) {
            tableRows += `
                <tr>
                    <th>${key}</th>
                    <td>${value}</td>
                </tr>
            `;
        }

        return `
            <table class="specs-table">
                ${tableRows}
            </table>
        `;
    }

    // Generate capabilities list HTML
    generateCapabilitiesList(capabilities) {
        if (!capabilities || capabilities.length === 0) {
            return null;
        }

        const listItems = capabilities.map(capability => `<li>${capability}</li>`).join('');
        
        return `
            <ul class="capability-list">
                ${listItems}
            </ul>
        `;
    }

    // Generate applications list HTML
    generateApplicationsList(applications) {
        if (!applications || applications.length === 0) {
            return null;
        }

        const listItems = applications.map(application => `<li>${application}</li>`).join('');
        
        return `
            <ul class="application-list">
                ${listItems}
            </ul>
        `;
    }

    // Create slug from robot name
    createSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    // Save robot data to robots.json (simulation for admin panel)
    async saveRobotToDatabase(robotData) {
        try {
            // In a real application, this would make an API call to save the robot
            // For now, we'll simulate adding it to the robots array
            
            // Generate slug if not provided
            if (!robotData.slug) {
                robotData.slug = this.createSlug(robotData.title);
            }

            // Add timestamp
            robotData.lastUpdated = new Date().toISOString().split('T')[0];

            // Generate unique ID
            robotData.id = Date.now();

            console.log('Robot data to save:', robotData);
            return true;
        } catch (error) {
            console.error('Error saving robot:', error);
            return false;
        }
    }

    // Generate and download robot page HTML file
    downloadRobotPage(robotData) {
        const htmlContent = this.generateRobotPage(robotData);
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${robotData.slug || this.createSlug(robotData.title)}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Make generator available globally for admin panel
window.RobotPageGenerator = RobotPageGenerator;