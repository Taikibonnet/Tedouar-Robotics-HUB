<?php
// Include necessary files
require_once 'includes/config.php';
require_once 'includes/functions.php';

// Get featured robots for the homepage
$query = "SELECT * FROM robots WHERE is_featured = 1 ORDER BY name ASC LIMIT 3";
$result = mysqli_query($conn, $query);

// Store featured robots in an array
$featured_robots = array();
while ($row = mysqli_fetch_assoc($result)) {
    $featured_robots[] = $row;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TedouaR Robotics Hub</title>
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/logo.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Fasthand&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Header -->
    <header>
        <div class="container header-container">
            <a href="index.php" class="logo-container">
                <!-- SVG Logo -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="180" height="60" class="logo">
                  <!-- Definition of gradient and glow -->
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
                  
                  <!-- Path for the 'T' element -->
                  <path d="M30.96965,130.265109c4.504842-2.783085,98.787866-5.009554,85.997348-5.009554-117.352536,2.860933-40.72106,19.243294-40.493897,14.6112" transform="translate(4.592093-3.339704)" fill="none" stroke="url(#logoGradient)" stroke-width="1.5" filter="url(#glow)"/>
                  
                  <!-- Text elements -->
                  <text dx="0" dy="0" font-family="Arial, sans-serif" font-size="15" font-weight="400" font-style="italic" transform="matrix(2.322194-.031029 0.010676 0.798958 74.435681 137.109235)" fill="url(#logoGradient)" filter="url(#glow)">
                    <tspan y="0" font-weight="400">edouaR</tspan>
                  </text>
                  
                  <text x="110" y="150" font-family="Arial, sans-serif" font-size="10" font-weight="700" letter-spacing="2" text-anchor="middle" fill="url(#logoGradient)" filter="url(#glow)">ROBOTICS</text>
                </svg>
            </a>
            <nav class="nav-links">
                <a href="index.php" class="active">Home</a>
                <a href="encyclopedia.php">Encyclopedia</a>
                <a href="about.php">About Us</a>
                <a href="contact.php">Contact</a>
            </nav>
            
            <!-- Auth Buttons -->
            <div class="auth-buttons">
                <?php if (is_logged_in()): ?>
                    <a href="profile.php" class="btn btn-outline">
                        <i class="fas fa-user"></i>
                        <span><?php echo $_SESSION['username']; ?></span>
                    </a>
                    <?php if (is_admin()): ?>
                        <a href="admin/index.php" class="btn btn-primary">
                            <i class="fas fa-cog"></i>
                            <span>Admin</span>
                        </a>
                    <?php else: ?>
                        <a href="logout.php" class="btn btn-primary">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>Logout</span>
                        </a>
                    <?php endif; ?>
                <?php else: ?>
                    <a href="login.php" class="btn btn-outline">Log In</a>
                    <a href="signup.php" class="btn btn-primary">Sign Up</a>
                <?php endif; ?>
            </div>
            
            <button class="mobile-menu-button">
                <i class="fas fa-bars"></i>
            </button>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <h1 class="hero-title">Explore the World of Robotics</h1>
                <p class="hero-subtitle">Your comprehensive hub for robotics knowledge, news, and community. Discover the latest innovations from Boston Dynamics, SoftBank Robotics, Universal Robots, and many more.</p>
                <div class="hero-buttons">
                    <a href="encyclopedia.php" class="btn btn-primary btn-large">Explore Encyclopedia</a>
                    <a href="about.php" class="btn btn-outline btn-large">Learn More</a>
                </div>
            </div>
            <div class="hero-image">
                <img src="images/hero-robot.png" alt="Robot Illustration">
            </div>
        </div>
    </section>

    <!-- Featured Robots Section -->
    <section class="featured-robots">
        <div class="container">
            <h2 class="section-title">Featured Robots</h2>
            <p class="section-subtitle">Explore some of the most innovative robots in the world</p>
            
            <div class="robot-grid">
                <?php if (count($featured_robots) > 0): ?>
                    <?php foreach ($featured_robots as $robot): ?>
                        <div class="robot-card">
                            <div class="robot-card-image">
                                <?php if (!empty($robot['primary_image'])): ?>
                                    <img src="uploads/robots/<?php echo $robot['primary_image']; ?>" alt="<?php echo $robot['name']; ?>">
                                <?php else: ?>
                                    <div class="no-image"><i class="fas fa-robot"></i></div>
                                <?php endif; ?>
                            </div>
                            <div class="robot-card-content">
                                <h3 class="robot-card-title"><?php echo $robot['name']; ?></h3>
                                <div class="robot-card-categories">
                                    <?php if (!empty($robot['category'])): ?>
                                        <span class="category-pill"><?php echo $robot['category']; ?></span>
                                    <?php endif; ?>
                                </div>
                                <?php if (!empty($robot['manufacturer'])): ?>
                                    <div class="robot-card-manufacturer"><?php echo $robot['manufacturer']; ?></div>
                                <?php endif; ?>
                                <p class="robot-card-description">
                                    <?php 
                                    if (!empty($robot['description'])) {
                                        echo (strlen($robot['description']) > 120) ? substr($robot['description'], 0, 120) . '...' : $robot['description'];
                                    } else {
                                        echo 'No description available.';
                                    }
                                    ?>
                                </p>
                                <a href="robot.php?slug=<?php echo $robot['slug']; ?>" class="robot-view-details">View Details</a>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php else: ?>
                    <div class="no-results">
                        <p>No featured robots found. <a href="encyclopedia.php">View all robots</a> or <a href="admin/robots.php?action=add">add a new robot</a>.</p>
                    </div>
                <?php endif; ?>
            </div>
            
            <div class="featured-cta">
                <a href="encyclopedia.php" class="btn btn-primary">View All Robots</a>
            </div>
        </div>
    </section>

    <!-- Categories Section -->
    <section class="categories">
        <div class="container">
            <h2 class="section-title">Explore By Category</h2>
            <p class="section-subtitle">Discover robots based on their applications and designs</p>
            
            <div class="category-grid">
                <a href="encyclopedia.php?category=industrial" class="category-card">
                    <div class="category-icon">
                        <i class="fas fa-industry"></i>
                    </div>
                    <h3 class="category-title">Industrial</h3>
                    <p class="category-description">Robotic arms and automated systems used in manufacturing and production.</p>
                </a>
                
                <a href="encyclopedia.php?category=humanoid" class="category-card">
                    <div class="category-icon">
                        <i class="fas fa-user"></i>
                    </div>
                    <h3 class="category-title">Humanoid</h3>
                    <p class="category-description">Robots designed to mimic human form and movements.</p>
                </a>
                
                <a href="encyclopedia.php?category=service" class="category-card">
                    <div class="category-icon">
                        <i class="fas fa-hands-helping"></i>
                    </div>
                    <h3 class="category-title">Service</h3>
                    <p class="category-description">Robots that assist with tasks in homes, hospitals, and public spaces.</p>
                </a>
                
                <a href="encyclopedia.php?category=consumer" class="category-card">
                    <div class="category-icon">
                        <i class="fas fa-home"></i>
                    </div>
                    <h3 class="category-title">Consumer</h3>
                    <p class="category-description">Personal robots designed for everyday use in homes.</p>
                </a>
            </div>
        </div>
    </section>

    <!-- AI Assistant Button -->
    <div class="ai-assistant">
        <div class="ai-button" id="ai-button">
            <div class="ai-icon"><i class="fas fa-robot"></i></div>
        </div>
    </div>

    <!-- AI Assistant Chat Interface (Hidden by default) -->
    <div class="ai-chat-container" id="ai-chat-container">
        <div class="ai-chat-header">
            <div class="ai-chat-title">Robot Assistant</div>
            <div class="ai-chat-close" id="ai-chat-close"><i class="fas fa-times"></i></div>
        </div>
        <div class="ai-chat-messages" id="ai-chat-messages">
            <div class="ai-message">
                <div class="ai-avatar"><i class="fas fa-robot"></i></div>
                <div class="ai-bubble">Hello! I'm your robotics guide. How can I help you explore the world of robots today?</div>
            </div>
        </div>
        <div class="ai-chat-input">
            <input type="text" id="ai-input" placeholder="Ask me about robots...">
            <button id="ai-send"><i class="fas fa-paper-plane"></i></button>
        </div>
    </div>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-section">
                    <h3>About</h3>
                    <ul class="footer-links">
                        <li><a href="about.php">Our Mission</a></li>
                        <li><a href="about.php#vision">Our Vision</a></li>
                        <li><a href="about.php#why">Why We Exist</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h3>Resources</h3>
                    <ul class="footer-links">
                        <li><a href="encyclopedia.php">Robot Database</a></li>
                        <li><a href="encyclopedia.php?category=featured">Popular Robots</a></li>
                        <li><a href="encyclopedia.php?category=new">Latest Additions</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h3>Categories</h3>
                    <ul class="footer-links">
                        <li><a href="encyclopedia.php?category=industrial">Industrial Robotics</a></li>
                        <li><a href="encyclopedia.php?category=service">Service Robots</a></li>
                        <li><a href="encyclopedia.php?category=humanoid">Humanoids</a></li>
                        <li><a href="encyclopedia.php?category=quadruped">Quadrupeds</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h3>Connect</h3>
                    <ul class="footer-links">
                        <li><a href="contact.php">Contact Us</a></li>
                        <li><a href="contact.php#newsletter">Newsletter</a></li>
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

    <!-- Scripts -->
    <script src="js/main.js"></script>
</body>
</html>