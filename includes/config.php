<?php
// Database connection configuration
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root');  // Change to your database username
define('DB_PASSWORD', '');      // Change to your database password
define('DB_NAME', 'tedouar_robotics');

// Attempt to connect to MySQL database
$conn = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

// Check connection
if($conn === false){
    // If the database doesn't exist or connection fails, show a friendly error
    // that guides to installation
    echo "<div style='font-family: Arial, sans-serif; padding: 20px; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; border-radius: 5px; margin: 20px;'>";
    echo "<h3>Database Connection Error</h3>";
    echo "<p>Unable to connect to the database. This may be because the database doesn't exist yet.</p>";
    echo "<p>Please run the <a href='install.php' style='color: #721c24; font-weight: bold;'>installation script</a> to set up the database.</p>";
    echo "<p>Error details: " . mysqli_connect_error() . "</p>";
    echo "</div>";
    exit();
}

// Set charset to ensure proper handling of special characters
mysqli_set_charset($conn, "utf8mb4");

// Site configuration
$site_title = "TedouaR Robotics HUB";
$site_url = "http://localhost/tedouar-robotics-hub"; // Change this to your actual domain when deployed
$upload_dir = "uploads/";
$max_file_size = 5 * 1024 * 1024; // 5MB max file size for uploads

// Allowed image extensions
$allowed_image_extensions = array('jpg', 'jpeg', 'png', 'gif', 'webp');

// Start the session
session_start();
?>