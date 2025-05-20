<?php
// Installation script for TedouaR Robotics HUB
// This file creates the database and tables needed for the application

// Connection variables
$host = 'localhost';
$username = 'root'; // Change this to your database username
$password = ''; // Change this to your database password
$database = 'tedouar_robotics';

// Create connection to MySQL server (without selecting a database)
$conn = mysqli_connect($host, $username, $password);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Start output buffering
ob_start();

// Function to run SQL query and handle errors
function execute_query($conn, $query, $description) {
    $result = mysqli_query($conn, $query);
    echo "<p>$description: ";
    if ($result) {
        echo "<span class='success'>Success</span></p>";
        return true;
    } else {
        echo "<span class='error'>Error: " . mysqli_error($conn) . "</span></p>";
        return false;
    }
}

// Create the database
$create_db = "CREATE DATABASE IF NOT EXISTS $database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
if (!execute_query($conn, $create_db, "Creating database")) {
    die("Failed to create database. Installation stopped.");
}

// Select the database
mysqli_select_db($conn, $database);

// Create users table
$create_users = "CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    bio TEXT,
    profile_image VARCHAR(255),
    is_admin BOOLEAN DEFAULT 0,
    reset_token VARCHAR(255),
    reset_token_expires DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";
execute_query($conn, $create_users, "Creating users table");

// Create robots table
$create_robots = "CREATE TABLE IF NOT EXISTS robots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    manufacturer VARCHAR(255),
    category VARCHAR(100),
    description TEXT,
    specifications TEXT,
    features TEXT,
    history TEXT,
    applications TEXT,
    release_date DATE,
    is_featured BOOLEAN DEFAULT 0,
    primary_image VARCHAR(255),
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
)";
execute_query($conn, $create_robots, "Creating robots table");

// Create robot_images table
$create_robot_images = "CREATE TABLE IF NOT EXISTS robot_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    robot_id INT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    caption VARCHAR(255),
    is_primary BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (robot_id) REFERENCES robots(id) ON DELETE CASCADE
)";
execute_query($conn, $create_robot_images, "Creating robot_images table");

// Create robot_videos table
$create_robot_videos = "CREATE TABLE IF NOT EXISTS robot_videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    robot_id INT NOT NULL,
    video_url VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (robot_id) REFERENCES robots(id) ON DELETE CASCADE
)";
execute_query($conn, $create_robot_videos, "Creating robot_videos table");

// Create bookmarks table
$create_bookmarks = "CREATE TABLE IF NOT EXISTS bookmarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    robot_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (robot_id) REFERENCES robots(id) ON DELETE CASCADE,
    UNIQUE (user_id, robot_id)
)";
execute_query($conn, $create_bookmarks, "Creating bookmarks table");

// Create tags table
$create_tags = "CREATE TABLE IF NOT EXISTS tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
execute_query($conn, $create_tags, "Creating tags table");

// Create robot_tags relationship table
$create_robot_tags = "CREATE TABLE IF NOT EXISTS robot_tags (
    robot_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (robot_id, tag_id),
    FOREIGN KEY (robot_id) REFERENCES robots(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
)";
execute_query($conn, $create_robot_tags, "Creating robot_tags table");

// Create admin user (password: admin123)
$admin_password = password_hash('admin123', PASSWORD_DEFAULT);
$create_admin = "INSERT INTO users (username, email, password, first_name, last_name, is_admin, created_at)
VALUES ('admin', 'admin@tedouarrobotics.com', '$admin_password', 'Admin', 'User', 1, NOW())
ON DUPLICATE KEY UPDATE email = VALUES(email)";
execute_query($conn, $create_admin, "Creating admin user");

// Create sample robots from JSON file if it exists
if (file_exists('robots.json')) {
    $robots_json = file_get_contents('robots.json');
    $robots_data = json_decode($robots_json, true);
    
    if (is_array($robots_data) && !empty($robots_data)) {
        echo "<p>Importing sample robots: ";
        $count = 0;
        
        foreach ($robots_data as $robot) {
            // Clean and prepare data
            $name = mysqli_real_escape_string($conn, $robot['name']);
            $slug = mysqli_real_escape_string($conn, $robot['slug']);
            $manufacturer = isset($robot['manufacturer']) ? mysqli_real_escape_string($conn, $robot['manufacturer']) : null;
            $category = isset($robot['category']) ? mysqli_real_escape_string($conn, $robot['category']) : null;
            $description = isset($robot['description']) ? mysqli_real_escape_string($conn, $robot['description']) : null;
            $specifications = isset($robot['specifications']) ? mysqli_real_escape_string($conn, $robot['specifications']) : null;
            $features = isset($robot['features']) ? mysqli_real_escape_string($conn, $robot['features']) : null;
            $is_featured = isset($robot['is_featured']) ? (int)$robot['is_featured'] : 0;
            
            // Insert robot
            $insert_robot = "INSERT INTO robots (name, slug, manufacturer, category, description, specifications, features, is_featured)
                VALUES ('$name', '$slug', '$manufacturer', '$category', '$description', '$specifications', '$features', $is_featured)
                ON DUPLICATE KEY UPDATE name = VALUES(name)";
            
            if (mysqli_query($conn, $insert_robot)) {
                $count++;
            }
        }
        
        echo "<span class='success'>$count robots imported</span></p>";
    }
} else {
    echo "<p>Sample robots.json file not found. No sample robots imported.</p>";
}

// Check if uploads directory exists, if not create it
if (!file_exists('uploads')) {
    mkdir('uploads', 0755, true);
    echo "<p>Creating uploads directory: <span class='success'>Success</span></p>";
}

// Check if uploads/robots directory exists, if not create it
if (!file_exists('uploads/robots')) {
    mkdir('uploads/robots', 0755, true);
    echo "<p>Creating uploads/robots directory: <span class='success'>Success</span></p>";
}

// Installation complete
echo "<h2>Installation Complete</h2>";
echo "<p>TedouaR Robotics HUB has been successfully installed. You can now:</p>";
echo "<ul>";
echo "<li>Access the <a href='index.php'>homepage</a></li>";
echo "<li>Log in as admin using:";
echo "<ul>";
echo "<li>Username: admin</li>";
echo "<li>Password: admin123</li>";
echo "</ul>";
echo "</li>";
echo "<li>Access the <a href='admin/index.php'>admin dashboard</a></li>";
echo "</ul>";

// Close connection
mysqli_close($conn);

// Get buffered content
$content = ob_get_clean();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Install TedouaR Robotics HUB</title>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #0c0c0c;
            color: #f0f0f0;
            line-height: 1.6;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
        }
        h1, h2 {
            color: #20e3b2;
        }
        .container {
            background-color: #141414;
            padding: 30px;
            border-radius: 10px;
            border: 1px solid rgba(32, 227, 178, 0.1);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
        }
        .success {
            color: #28a745;
            font-weight: bold;
        }
        .error {
            color: #dc3545;
            font-weight: bold;
        }
        a {
            color: #20e3b2;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            background: linear-gradient(90deg, #0cebeb, #20e3b2);
            color: #0c0c0c;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 20px;
        }
        .btn:hover {
            opacity: 0.9;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>TedouaR Robotics HUB Installer</h1>
        <div class="installation-log">
            <?php echo $content; ?>
        </div>
        <a href="index.php" class="btn">Go to Homepage</a>
    </div>
</body>
</html>