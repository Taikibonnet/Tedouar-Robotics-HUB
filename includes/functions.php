<?php
// Clean user inputs
function clean_input($data, $conn) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    if ($conn) {
        $data = mysqli_real_escape_string($conn, $data);
    }
    return $data;
}

// Check if user is logged in
function is_logged_in() {
    return isset($_SESSION['user_id']);
}

// Check if user is admin
function is_admin() {
    return isset($_SESSION['role']) && $_SESSION['role'] == 'admin';
}

// Generate slug from string
function generate_slug($string) {
    $string = strtolower($string);
    $string = preg_replace('/[^a-z0-9\s]/', '', $string);
    $string = preg_replace('/\s+/', '-', $string);
    return trim($string, '-');
}

// Upload image
function upload_image($file, $target_dir) {
    global $allowed_image_extensions, $max_file_size;
    
    // Check if file was uploaded without errors
    if ($file["error"] == 0) {
        $filename = basename($file["name"]);
        $target_file = $target_dir . $filename;
        $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
        
        // Check if file already exists, if so, rename it
        $filename_base = pathinfo($filename, PATHINFO_FILENAME);
        $i = 1;
        while (file_exists($target_dir . $filename_base . '.' . $imageFileType)) {
            $filename_base = pathinfo($filename, PATHINFO_FILENAME) . '_' . $i;
            $i++;
        }
        $final_filename = $filename_base . '.' . $imageFileType;
        $target_file = $target_dir . $final_filename;
        
        // Check file size
        if ($file["size"] > $max_file_size) {
            return array('error' => "Sorry, your file is too large.");
        }
        
        // Allow certain file formats
        if (!in_array($imageFileType, $allowed_image_extensions)) {
            return array('error' => "Sorry, only JPG, JPEG, PNG, GIF, and WEBP files are allowed.");
        }
        
        // Try to upload file
        if (move_uploaded_file($file["tmp_name"], $target_file)) {
            return array('success' => true, 'filename' => $final_filename);
        } else {
            return array('error' => "Sorry, there was an error uploading your file.");
        }
    } else {
        return array('error' => "Upload error code: " . $file["error"]);
    }
}

// Get robot by slug
function get_robot_by_slug($slug, $conn) {
    $sql = "SELECT * FROM robots WHERE slug = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $slug);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    return mysqli_fetch_assoc($result);
}

// Get robots with filtering
function get_robots($conn, $category = '', $search = '', $sort = 'name_asc', $limit = 0) {
    $sql = "SELECT * FROM robots WHERE 1=1";
    $params = array();
    $types = "";
    
    if (!empty($category)) {
        $sql .= " AND category = ?";
        $params[] = $category;
        $types .= "s";
    }
    
    if (!empty($search)) {
        $sql .= " AND (name LIKE ? OR description LIKE ? OR manufacturer LIKE ?)";
        $search_param = "%" . $search . "%";
        $params[] = $search_param;
        $params[] = $search_param;
        $params[] = $search_param;
        $types .= "sss";
    }
    
    // Add sorting
    switch ($sort) {
        case 'name_asc':
            $sql .= " ORDER BY name ASC";
            break;
        case 'name_desc':
            $sql .= " ORDER BY name DESC";
            break;
        case 'newest':
            $sql .= " ORDER BY created_at DESC";
            break;
        case 'oldest':
            $sql .= " ORDER BY created_at ASC";
            break;
        default:
            $sql .= " ORDER BY name ASC";
    }
    
    if ($limit > 0) {
        $sql .= " LIMIT " . intval($limit);
    }
    
    $stmt = mysqli_prepare($conn, $sql);
    if (!empty($params)) {
        mysqli_stmt_bind_param($stmt, $types, ...$params);
    }
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    $robots = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $robots[] = $row;
    }
    
    return $robots;
}

// Get robot images
function get_robot_images($robot_id, $conn) {
    $sql = "SELECT * FROM robot_images WHERE robot_id = ? ORDER BY display_order ASC";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $robot_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    $images = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $images[] = $row;
    }
    
    return $images;
}

// Get robot videos
function get_robot_videos($robot_id, $conn) {
    $sql = "SELECT * FROM robot_videos WHERE robot_id = ? ORDER BY display_order ASC";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $robot_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    $videos = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $videos[] = $row;
    }
    
    return $videos;
}

// Format video URL for embedding
function format_video_url($url) {
    // Convert YouTube URLs to embed format
    if (strpos($url, 'youtube.com/watch') !== false) {
        $video_id = parse_url($url, PHP_URL_QUERY);
        parse_str($video_id, $params);
        if (isset($params['v'])) {
            return 'https://www.youtube.com/embed/' . $params['v'];
        }
    } elseif (strpos($url, 'youtu.be/') !== false) {
        $video_id = substr(parse_url($url, PHP_URL_PATH), 1);
        return 'https://www.youtube.com/embed/' . $video_id;
    }
    
    return $url;
}

// Pagination helper
function paginate($total_items, $items_per_page, $current_page) {
    $total_pages = ceil($total_items / $items_per_page);
    $start = ($current_page - 1) * $items_per_page;
    
    return array(
        'total_pages' => $total_pages,
        'current_page' => $current_page,
        'start' => $start,
        'items_per_page' => $items_per_page
    );
}
?>