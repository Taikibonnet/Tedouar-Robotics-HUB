<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';

// Get robot slug from URL
$slug = isset($_GET['slug']) ? clean_input($_GET['slug'], $conn) : '';

if (empty($slug)) {
    header("Location: encyclopedia.php");
    exit();
}

// Get robot data
$robot = get_robot_by_slug($slug, $conn);

if (!$robot) {
    header("Location: encyclopedia.php");
    exit();
}

// Get robot images
$robot_images = get_robot_images($robot['id'], $conn);

// Get robot videos
$robot_videos = get_robot_videos($robot['id'], $conn);

// Check if user has favorited this robot
$is_favorited = false;
if (is_logged_in()) {
    $fav_sql = "SELECT id FROM user_favorites WHERE user_id = ? AND robot_id = ?";
    $fav_stmt = mysqli_prepare($conn, $fav_sql);
    mysqli_stmt_bind_param($fav_stmt, "ii", $_SESSION['user_id'], $robot['id']);
    mysqli_stmt_execute($fav_stmt);
    $fav_result = mysqli_stmt_get_result($fav_stmt);
    $is_favorited = mysqli_fetch_assoc($fav_result) ? true : false;
}

// Handle favorite/unfavorite
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['toggle_favorite']) && is_logged_in()) {
    if ($is_favorited) {
        // Remove from favorites
        $sql = "DELETE FROM user_favorites WHERE user_id = ? AND robot_id = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ii", $_SESSION['user_id'], $robot['id']);
        mysqli_stmt_execute($stmt);
        $is_favorited = false;
    } else {
        // Add to favorites
        $sql = "INSERT INTO user_favorites (user_id, robot_id) VALUES (?, ?)";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ii", $_SESSION['user_id'], $robot['id']);
        mysqli_stmt_execute($stmt);
        $is_favorited = true;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($robot['name']); ?> - TedouaR Robotics Hub</title>
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        .robot-header {
            background: linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(18, 18, 18, 0.95) 100%);
            padding: 120px 0 60px;
            position: relative;
            overflow: hidden;
        }
        
        .robot-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: linear-gradient(135deg, rgba(12, 235, 235, 0.1), rgba(32, 227, 178, 0.1));
            opacity: 0.1;
            z-index: 0;
        }
        
        .robot-header-content {
            position: relative;
            z-index: 1;
        }
        
        .robot-title {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 20px;
            background: linear-gradient(90deg, var(--secondary-color), var(--primary-color));
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .robot-meta {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
            flex-wrap: wrap;
            align-items: center;
        }
        
        .robot-category {
            background: linear-gradient(90deg, var(--secondary-color), var(--primary-color));
            color: var(--bg-color);
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        .robot-manufacturer {
            color: var(--primary-color);
            font-weight: 500;
            font-size: 1.1rem;
        }
        
        .robot-actions {
            display: flex;
            gap: 15px;
            margin-top: 20px;
        }
        
        .favorite-btn {
            background: rgba(32, 227, 178, 0.1);
            border: 1px solid var(--primary-color);
            color: var(--primary-color);
            padding: 12px 20px;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .favorite-btn:hover {
            background: var(--primary-color);
            color: var(--bg-color);
        }
        
        .favorite-btn.favorited {
            background: var(--primary-color);
            color: var(--bg-color);
        }
        
        .robot-content {
            padding: 80px 0;
        }
        
        .robot-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            margin-bottom: 60px;
        }
        
        .robot-images {
            position: sticky;
            top: 100px;
        }
        
        .main-image {
            width: 100%;
            height: 400px;
            border-radius: 15px;
            overflow: hidden;
            margin-bottom: 20px;
            background: rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(32, 227, 178, 0.1);
        }
        
        .main-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .main-image .no-image {
            font-size: 4rem;
            color: var(--primary-color);
            opacity: 0.3;
        }
        
        .thumbnail-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
            gap: 10px;
        }
        
        .thumbnail {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            border: 2px solid transparent;
            transition: all 0.3s ease;
        }
        
        .thumbnail:hover,
        .thumbnail.active {
            border-color: var(--primary-color);
        }
        
        .thumbnail img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .robot-info h2 {
            color: var(--primary-color);
            margin-bottom: 20px;
            font-size: 1.8rem;
        }
        
        .robot-description {
            line-height: 1.8;
            margin-bottom: 40px;
            font-size: 1.1rem;
        }
        
        .robot-specs {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 15px;
            padding: 30px;
            border: 1px solid rgba(32, 227, 178, 0.1);
            margin-bottom: 40px;
        }
        
        .robot-specs h3 {
            color: var(--primary-color);
            margin-bottom: 20px;
            font-size: 1.5rem;
        }
        
        .robot-specs p {
            line-height: 1.6;
            white-space: pre-line;
        }
        
        .robot-videos {
            margin-top: 60px;
        }
        
        .robot-videos h2 {
            color: var(--primary-color);
            margin-bottom: 30px;
            font-size: 1.8rem;
        }
        
        .video-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }
        
        .video-container {
            position: relative;
            width: 100%;
            height: 200px;
            border-radius: 15px;
            overflow: hidden;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(32, 227, 178, 0.1);
        }
        
        .video-container iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
        
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--primary-color);
            text-decoration: none;
            margin-bottom: 20px;
            transition: all 0.3s ease;
        }
        
        .back-link:hover {
            transform: translateX(-5px);
        }
        
        @media (max-width: 768px) {
            .robot-layout {
                grid-template-columns: 1fr;
                gap: 40px;
            }
            
            .robot-images {
                position: static;
            }
            
            .robot-title {
                font-size: 2.5rem;
            }
            
            .robot-meta {
                flex-direction: column;
                align-items: flex-start;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header>
        <div class="container header-container">
            <a href="index.php" class="logo-container">
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
                <a href="index.php">Home</a>
                <a href="encyclopedia.php">Encyclopedia</a>
                <a href="about.php">About Us</a>
                <a href="contact.php">Contact</a>
            </nav>
            
            <div class="auth-buttons">
                <?php if (is_logged_in()): ?>
                    <span class="welcome-text">Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?>!</span>
                    <?php if (is_admin()): ?>
                        <a href="admin/index.php" class="btn btn-primary">
                            <i class="fas fa-cog"></i> Admin
                        </a>
                    <?php endif; ?>
                    <a href="logout.php" class="btn btn-outline">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </a>
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

    <!-- Robot Header -->
    <section class="robot-header">
        <div class="container robot-header-content">
            <a href="encyclopedia.php" class="back-link">
                <i class="fas fa-arrow-left"></i> Back to Encyclopedia
            </a>
            
            <h1 class="robot-title"><?php echo htmlspecialchars($robot['name']); ?></h1>
            
            <div class="robot-meta">
                <?php if (!empty($robot['category'])): ?>
                    <span class="robot-category"><?php echo htmlspecialchars(ucfirst($robot['category'])); ?></span>
                <?php endif; ?>
                
                <?php if (!empty($robot['manufacturer'])): ?>
                    <span class="robot-manufacturer">by <?php echo htmlspecialchars($robot['manufacturer']); ?></span>
                <?php endif; ?>
                
                <?php if ($robot['is_featured']): ?>
                    <span class="featured-badge" style="color: var(--primary-color);">
                        <i class="fas fa-star"></i> Featured
                    </span>
                <?php endif; ?>
            </div>
            
            <div class="robot-actions">
                <?php if (is_logged_in()): ?>
                    <form method="post" style="display: inline;">
                        <button type="submit" name="toggle_favorite" class="favorite-btn <?php echo $is_favorited ? 'favorited' : ''; ?>">
                            <i class="fas fa-heart"></i>
                            <?php echo $is_favorited ? 'Remove from Favorites' : 'Add to Favorites'; ?>
                        </button>
                    </form>
                <?php endif; ?>
                
                <?php if (is_admin()): ?>
                    <a href="admin/robots.php?action=edit&id=<?php echo $robot['id']; ?>" class="btn btn-outline">
                        <i class="fas fa-edit"></i> Edit Robot
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </section>

    <!-- Robot Content -->
    <section class="robot-content">
        <div class="container">
            <div class="robot-layout">
                <!-- Robot Images -->
                <div class="robot-images">
                    <div class="main-image" id="main-image">
                        <?php 
                        $main_image = !empty($robot['primary_image']) ? $robot['primary_image'] : 
                                     (!empty($robot_images) ? $robot_images[0]['image_path'] : null);
                        ?>
                        <?php if ($main_image && file_exists('uploads/robots/' . $main_image)): ?>
                            <img src="uploads/robots/<?php echo htmlspecialchars($main_image); ?>" alt="<?php echo htmlspecialchars($robot['name']); ?>" id="main-image-img">
                        <?php else: ?>
                            <div class="no-image">
                                <i class="fas fa-robot"></i>
                            </div>
                        <?php endif; ?>
                    </div>
                    
                    <?php if (!empty($robot_images)): ?>
                        <div class="thumbnail-grid">
                            <?php foreach ($robot_images as $index => $image): ?>
                                <?php if (file_exists('uploads/robots/' . $image['image_path'])): ?>
                                    <div class="thumbnail <?php echo $index === 0 ? 'active' : ''; ?>" 
                                         onclick="changeMainImage('uploads/robots/<?php echo htmlspecialchars($image['image_path']); ?>', this)">
                                        <img src="uploads/robots/<?php echo htmlspecialchars($image['image_path']); ?>" alt="<?php echo htmlspecialchars($robot['name']); ?>">
                                    </div>
                                <?php endif; ?>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
                
                <!-- Robot Information -->
                <div class="robot-info">
                    <h2>About <?php echo htmlspecialchars($robot['name']); ?></h2>
                    <div class="robot-description">
                        <?php echo !empty($robot['description']) ? nl2br(htmlspecialchars($robot['description'])) : 'No description available.'; ?>
                    </div>
                    
                    <?php if (!empty($robot['specifications'])): ?>
                        <div class="robot-specs">
                            <h3>Specifications</h3>
                            <p><?php echo nl2br(htmlspecialchars($robot['specifications'])); ?></p>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
            
            <!-- Robot Videos -->
            <?php if (!empty($robot_videos)): ?>
                <div class="robot-videos">
                    <h2>Videos</h2>
                    <div class="video-grid">
                        <?php foreach ($robot_videos as $video): ?>
                            <div class="video-container">
                                <iframe src="<?php echo htmlspecialchars(format_video_url($video['video_url'])); ?>" 
                                        allowfullscreen></iframe>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </section>

    <!-- AI Assistant Button -->
    <div class="ai-assistant">
        <div class="ai-button" id="ai-button">
            <div class="ai-icon"><i class="fas fa-robot"></i></div>
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
                        <li><a href="encyclopedia.php?featured=1">Featured Robots</a></li>
                        <li><a href="encyclopedia.php?sort=newest">Latest Additions</a></li>
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
    <script>
        function changeMainImage(imageSrc, thumbnail) {
            // Update main image
            const mainImageElement = document.getElementById('main-image-img');
            if (mainImageElement) {
                mainImageElement.src = imageSrc;
            } else {
                // If no main image exists, create one
                const mainImageContainer = document.getElementById('main-image');
                mainImageContainer.innerHTML = `<img src="${imageSrc}" alt="Robot Image" id="main-image-img">`;
            }
            
            // Update active thumbnail
            document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
            thumbnail.classList.add('active');
        }
    </script>
</body>
</html>