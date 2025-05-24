<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';

// Check if user is admin
if (!is_logged_in() || !is_admin()) {
    header("Location: ../login.php");
    exit();
}

$action = isset($_GET['action']) ? $_GET['action'] : 'list';
$robot_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$success_message = '';
$error_message = '';

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($action === 'add') {
        // Add new robot
        $name = clean_input($_POST['name'], $conn);
        $category = clean_input($_POST['category'], $conn);
        $manufacturer = clean_input($_POST['manufacturer'], $conn);
        $description = clean_input($_POST['description'], $conn);
        $specifications = clean_input($_POST['specifications'], $conn);
        $is_featured = isset($_POST['is_featured']) ? 1 : 0;
        
        // Generate slug
        $slug = generate_slug($name);
        
        // Check if slug exists
        $slug_check = mysqli_query($conn, "SELECT id FROM robots WHERE slug = '" . mysqli_real_escape_string($conn, $slug) . "'");
        if (mysqli_num_rows($slug_check) > 0) {
            $slug .= '-' . time();
        }
        
        // Handle primary image upload
        $primary_image = '';
        if (isset($_FILES['primary_image']) && $_FILES['primary_image']['error'] === 0) {
            $upload_result = upload_image($_FILES['primary_image'], '../uploads/robots/');
            if (isset($upload_result['success'])) {
                $primary_image = $upload_result['filename'];
            } else {
                $error_message = $upload_result['error'];
            }
        }
        
        if (empty($error_message)) {
            $sql = "INSERT INTO robots (name, slug, category, manufacturer, description, specifications, primary_image, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = mysqli_prepare($conn, $sql);
            mysqli_stmt_bind_param($stmt, "sssssssi", $name, $slug, $category, $manufacturer, $description, $specifications, $primary_image, $is_featured);
            
            if (mysqli_stmt_execute($stmt)) {
                $robot_id = mysqli_insert_id($conn);
                
                // Handle additional images
                if (isset($_FILES['additional_images'])) {
                    for ($i = 0; $i < count($_FILES['additional_images']['name']); $i++) {
                        if ($_FILES['additional_images']['error'][$i] === 0) {
                            $file = [
                                'name' => $_FILES['additional_images']['name'][$i],
                                'type' => $_FILES['additional_images']['type'][$i],
                                'tmp_name' => $_FILES['additional_images']['tmp_name'][$i],
                                'error' => $_FILES['additional_images']['error'][$i],
                                'size' => $_FILES['additional_images']['size'][$i]
                            ];
                            
                            $upload_result = upload_image($file, '../uploads/robots/');
                            if (isset($upload_result['success'])) {
                                $image_sql = "INSERT INTO robot_images (robot_id, image_path, display_order) VALUES (?, ?, ?)";
                                $image_stmt = mysqli_prepare($conn, $image_sql);
                                mysqli_stmt_bind_param($image_stmt, "isi", $robot_id, $upload_result['filename'], $i);
                                mysqli_stmt_execute($image_stmt);
                            }
                        }
                    }
                }
                
                // Handle videos
                if (!empty($_POST['video_urls'])) {
                    $video_urls = array_filter(explode("\n", $_POST['video_urls']));
                    foreach ($video_urls as $index => $url) {
                        $url = trim($url);
                        if (!empty($url)) {
                            $video_sql = "INSERT INTO robot_videos (robot_id, video_url, display_order) VALUES (?, ?, ?)";
                            $video_stmt = mysqli_prepare($conn, $video_sql);
                            mysqli_stmt_bind_param($video_stmt, "isi", $robot_id, $url, $index);
                            mysqli_stmt_execute($video_stmt);
                        }
                    }
                }
                
                $success_message = "Robot added successfully!";
                $action = 'list';
            } else {
                $error_message = "Error adding robot: " . mysqli_error($conn);
            }
        }
    } elseif ($action === 'edit' && $robot_id > 0) {
        // Edit existing robot
        $name = clean_input($_POST['name'], $conn);
        $category = clean_input($_POST['category'], $conn);
        $manufacturer = clean_input($_POST['manufacturer'], $conn);
        $description = clean_input($_POST['description'], $conn);
        $specifications = clean_input($_POST['specifications'], $conn);
        $is_featured = isset($_POST['is_featured']) ? 1 : 0;
        
        // Handle primary image upload
        $primary_image_update = '';
        if (isset($_FILES['primary_image']) && $_FILES['primary_image']['error'] === 0) {
            $upload_result = upload_image($_FILES['primary_image'], '../uploads/robots/');
            if (isset($upload_result['success'])) {
                $primary_image_update = ", primary_image = '" . mysqli_real_escape_string($conn, $upload_result['filename']) . "'";
            } else {
                $error_message = $upload_result['error'];
            }
        }
        
        if (empty($error_message)) {
            $sql = "UPDATE robots SET name = ?, category = ?, manufacturer = ?, description = ?, specifications = ?, is_featured = ?" . $primary_image_update . " WHERE id = ?";
            $stmt = mysqli_prepare($conn, $sql);
            mysqli_stmt_bind_param($stmt, "sssssii", $name, $category, $manufacturer, $description, $specifications, $is_featured, $robot_id);
            
            if (mysqli_stmt_execute($stmt)) {
                $success_message = "Robot updated successfully!";
            } else {
                $error_message = "Error updating robot: " . mysqli_error($conn);
            }
        }
    } elseif ($action === 'delete' && $robot_id > 0) {
        // Delete robot
        $sql = "DELETE FROM robots WHERE id = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "i", $robot_id);
        
        if (mysqli_stmt_execute($stmt)) {
            $success_message = "Robot deleted successfully!";
        } else {
            $error_message = "Error deleting robot: " . mysqli_error($conn);
        }
        $action = 'list';
    }
}

// Get robot data for editing
$robot_data = null;
if ($action === 'edit' && $robot_id > 0) {
    $sql = "SELECT * FROM robots WHERE id = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $robot_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $robot_data = mysqli_fetch_assoc($result);
    
    if (!$robot_data) {
        $error_message = "Robot not found!";
        $action = 'list';
    }
}

// Get all robots for listing
if ($action === 'list') {
    $search = isset($_GET['search']) ? clean_input($_GET['search'], $conn) : '';
    $category_filter = isset($_GET['category']) ? clean_input($_GET['category'], $conn) : '';
    
    $where_conditions = [];
    $params = [];
    $types = '';
    
    if (!empty($search)) {
        $where_conditions[] = "(name LIKE ? OR manufacturer LIKE ? OR description LIKE ?)";
        $search_param = "%" . $search . "%";
        $params[] = $search_param;
        $params[] = $search_param;
        $params[] = $search_param;
        $types .= "sss";
    }
    
    if (!empty($category_filter)) {
        $where_conditions[] = "category = ?";
        $params[] = $category_filter;
        $types .= "s";
    }
    
    $where_clause = !empty($where_conditions) ? "WHERE " . implode(" AND ", $where_conditions) : "";
    
    $sql = "SELECT * FROM robots $where_clause ORDER BY created_at DESC";
    
    if (!empty($params)) {
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, $types, ...$params);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
    } else {
        $result = mysqli_query($conn, $sql);
    }
    
    $robots = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $robots[] = $row;
    }
}

// Get categories for dropdown
$categories_result = mysqli_query($conn, "SELECT DISTINCT category FROM robots WHERE category IS NOT NULL AND category != '' ORDER BY category");
$available_categories = [];
while ($row = mysqli_fetch_assoc($categories_result)) {
    $available_categories[] = $row['category'];
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Robots - Admin Dashboard</title>
    <link rel="stylesheet" href="../styles/main.css">
    <link rel="stylesheet" href="../styles/admin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="admin-container">
        <!-- Sidebar -->
        <aside class="admin-sidebar">
            <div class="admin-logo">
                <h2>TedouaR Admin</h2>
                <p style="color: #888; font-size: 0.9rem;">Robotics Hub</p>
            </div>
            
            <nav>
                <ul class="admin-nav">
                    <li><a href="index.php"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
                    <li><a href="robots.php" class="active"><i class="fas fa-robot"></i> Manage Robots</a></li>
                    <li><a href="users.php"><i class="fas fa-users"></i> Manage Users</a></li>
                    <li><a href="messages.php"><i class="fas fa-envelope"></i> Messages</a></li>
                    <li><a href="newsletter.php"><i class="fas fa-newspaper"></i> Newsletter</a></li>
                    <li><a href="../index.php"><i class="fas fa-home"></i> View Site</a></li>
                    <li><a href="../logout.php"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
                </ul>
            </nav>
        </aside>
        
        <!-- Main Content -->
        <main class="admin-main">
            <header class="admin-header">
                <h1 class="admin-title">
                    <?php 
                    if ($action === 'add') echo 'Add New Robot';
                    elseif ($action === 'edit') echo 'Edit Robot';
                    else echo 'Manage Robots';
                    ?>
                </h1>
                <div class="admin-user">
                    <span>Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?></span>
                    <i class="fas fa-user-circle" style="font-size: 2rem; color: #20e3b2;"></i>
                </div>
            </header>
            
            <!-- Messages -->
            <?php if (!empty($success_message)): ?>
                <div class="alert alert-success">
                    <i class="fas fa-check-circle"></i> <?php echo $success_message; ?>
                </div>
            <?php endif; ?>
            
            <?php if (!empty($error_message)): ?>
                <div class="alert alert-error">
                    <i class="fas fa-exclamation-circle"></i> <?php echo $error_message; ?>
                </div>
            <?php endif; ?>
            
            <?php if ($action === 'list'): ?>
                <!-- Robot List -->
                <div class="d-flex justify-between align-center mb-20">
                    <h2 style="color: #20e3b2; margin: 0;">All Robots (<?php echo count($robots); ?>)</h2>
                    <a href="?action=add" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Add New Robot
                    </a>
                </div>
                
                <!-- Search and Filters -->
                <div class="search-filters">
                    <form method="GET" class="d-flex gap-15" style="width: 100%;">
                        <div class="search-group">
                            <label>Search Robots</label>
                            <input type="text" name="search" class="form-control" placeholder="Search by name, manufacturer, or description..." value="<?php echo htmlspecialchars($search ?? ''); ?>">
                        </div>
                        
                        <div class="search-group">
                            <label>Category</label>
                            <select name="category" class="form-control">
                                <option value="">All Categories</option>
                                <?php foreach ($available_categories as $cat): ?>
                                    <option value="<?php echo htmlspecialchars($cat); ?>" <?php echo ($category_filter === $cat) ? 'selected' : ''; ?>>
                                        <?php echo htmlspecialchars(ucfirst($cat)); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        
                        <div class="search-group">
                            <label>&nbsp;</label>
                            <button type="submit" class="btn btn-primary">Filter</button>
                        </div>
                        
                        <div class="search-group">
                            <label>&nbsp;</label>
                            <a href="robots.php" class="btn btn-secondary">Clear</a>
                        </div>
                    </form>
                </div>
                
                <!-- Robots Table -->
                <?php if (!empty($robots)): ?>
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Manufacturer</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($robots as $robot): ?>
                                <tr>
                                    <td>
                                        <?php if (!empty($robot['primary_image']) && file_exists('../uploads/robots/' . $robot['primary_image'])): ?>
                                            <img src="../uploads/robots/<?php echo htmlspecialchars($robot['primary_image']); ?>" 
                                                 alt="<?php echo htmlspecialchars($robot['name']); ?>" class="image-preview">
                                        <?php else: ?>
                                            <div class="no-image"><i class="fas fa-robot"></i></div>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <strong><?php echo htmlspecialchars($robot['name']); ?></strong>
                                        <br><small style="color: #888;"><?php echo htmlspecialchars($robot['slug']); ?></small>
                                    </td>
                                    <td><?php echo htmlspecialchars(ucfirst($robot['category'])); ?></td>
                                    <td><?php echo htmlspecialchars($robot['manufacturer']); ?></td>
                                    <td>
                                        <?php if ($robot['is_featured']): ?>
                                            <span class="status-badge status-featured">Featured</span>
                                        <?php else: ?>
                                            <span class="status-badge status-regular">Regular</span>
                                        <?php endif; ?>
                                    </td>
                                    <td><?php echo date('M j, Y', strtotime($robot['created_at'])); ?></td>
                                    <td class="actions">
                                        <a href="../robot.php?slug=<?php echo htmlspecialchars($robot['slug']); ?>" 
                                           class="btn btn-secondary btn-small" target="_blank" title="View Robot">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                        <a href="?action=edit&id=<?php echo $robot['id']; ?>" 
                                           class="btn btn-primary btn-small" title="Edit Robot">
                                            <i class="fas fa-edit"></i>
                                        </a>
                                        <a href="?action=delete&id=<?php echo $robot['id']; ?>" 
                                           class="btn btn-danger btn-small" 
                                           onclick="return confirm('Are you sure you want to delete this robot?')" title="Delete Robot">
                                            <i class="fas fa-trash"></i>
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php else: ?>
                    <div class="text-center" style="padding: 40px; color: #888;">
                        <i class="fas fa-robot" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.3;"></i>
                        <h3>No robots found</h3>
                        <p>No robots match your search criteria.</p>
                        <a href="?action=add" class="btn btn-primary">Add Your First Robot</a>
                    </div>
                <?php endif; ?>
            
            <?php elseif ($action === 'add' || $action === 'edit'): ?>
                <!-- Add/Edit Robot Form -->
                <div class="d-flex align-center gap-15 mb-20">
                    <a href="robots.php" class="btn btn-secondary">
                        <i class="fas fa-arrow-left"></i> Back to List
                    </a>
                </div>
                
                <form method="POST" enctype="multipart/form-data" class="admin-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="name">Robot Name *</label>
                            <input type="text" id="name" name="name" class="form-control" 
                                   value="<?php echo htmlspecialchars($robot_data['name'] ?? ''); ?>" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="category">Category *</label>
                            <select id="category" name="category" class="form-control" required>
                                <option value="">Select Category</option>
                                <option value="industrial" <?php echo (($robot_data['category'] ?? '') === 'industrial') ? 'selected' : ''; ?>>Industrial</option>
                                <option value="humanoid" <?php echo (($robot_data['category'] ?? '') === 'humanoid') ? 'selected' : ''; ?>>Humanoid</option>
                                <option value="service" <?php echo (($robot_data['category'] ?? '') === 'service') ? 'selected' : ''; ?>>Service</option>
                                <option value="consumer" <?php echo (($robot_data['category'] ?? '') === 'consumer') ? 'selected' : ''; ?>>Consumer</option>
                                <option value="quadruped" <?php echo (($robot_data['category'] ?? '') === 'quadruped') ? 'selected' : ''; ?>>Quadruped</option>
                                <option value="space" <?php echo (($robot_data['category'] ?? '') === 'space') ? 'selected' : ''; ?>>Space</option>
                                <option value="educational" <?php echo (($robot_data['category'] ?? '') === 'educational') ? 'selected' : ''; ?>>Educational</option>
                                <option value="research" <?php echo (($robot_data['category'] ?? '') === 'research') ? 'selected' : ''; ?>>Research</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="manufacturer">Manufacturer</label>
                        <input type="text" id="manufacturer" name="manufacturer" class="form-control" 
                               value="<?php echo htmlspecialchars($robot_data['manufacturer'] ?? ''); ?>">
                    </div>
                    
                    <div class="form-group">
                        <label for="description">Description *</label>
                        <textarea id="description" name="description" class="form-control" required><?php echo htmlspecialchars($robot_data['description'] ?? ''); ?></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="specifications">Specifications</label>
                        <textarea id="specifications" name="specifications" class="form-control" placeholder="Enter technical specifications..."><?php echo htmlspecialchars($robot_data['specifications'] ?? ''); ?></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="primary_image">Primary Image</label>
                        <div class="file-upload">
                            <input type="file" id="primary_image" name="primary_image" accept="image/*">
                            <div class="file-upload-label">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <span>Click to upload primary image</span>
                            </div>
                        </div>
                        <?php if ($action === 'edit' && !empty($robot_data['primary_image'])): ?>
                            <p style="margin-top: 10px; color: #888;">Current: <?php echo htmlspecialchars($robot_data['primary_image']); ?></p>
                        <?php endif; ?>
                    </div>
                    
                    <div class="form-group">
                        <label for="additional_images">Additional Images</label>
                        <div class="file-upload">
                            <input type="file" id="additional_images" name="additional_images[]" accept="image/*" multiple>
                            <div class="file-upload-label">
                                <i class="fas fa-images"></i>
                                <span>Click to upload additional images (multiple files)</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="video_urls">Video URLs</label>
                        <textarea id="video_urls" name="video_urls" class="form-control" 
                                  placeholder="Enter video URLs (YouTube, Vimeo, etc.), one per line..."></textarea>
                        <small style="color: #888; margin-top: 5px; display: block;">Supported: YouTube, Vimeo. One URL per line.</small>
                    </div>
                    
                    <div class="form-group">
                        <label>
                            <input type="checkbox" name="is_featured" value="1" 
                                   <?php echo (($robot_data['is_featured'] ?? 0) == 1) ? 'checked' : ''; ?>>
                            Mark as Featured Robot
                        </label>
                    </div>
                    
                    <div class="d-flex gap-15">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i>
                            <?php echo ($action === 'add') ? 'Add Robot' : 'Update Robot'; ?>
                        </button>
                        <a href="robots.php" class="btn btn-secondary">Cancel</a>
                    </div>
                </form>
            <?php endif; ?>
        </main>
    </div>
    
    <script>
        // File upload preview
        document.getElementById('primary_image').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const label = this.nextElementSibling;
                label.innerHTML = `<i class="fas fa-check"></i> <span>${file.name}</span>`;
            }
        });
        
        document.getElementById('additional_images').addEventListener('change', function(e) {
            const files = e.target.files;
            if (files.length > 0) {
                const label = this.nextElementSibling;
                label.innerHTML = `<i class="fas fa-check"></i> <span>${files.length} file(s) selected</span>`;
            }
        });
    </script>
</body>
</html>