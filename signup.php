<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';

// If user is already logged in, redirect to home
if (is_logged_in()) {
    header("Location: index.php");
    exit();
}

$error_message = '';
$success_message = '';

// Process signup form
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = clean_input($_POST['username'], $conn);
    $email = clean_input($_POST['email'], $conn);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    
    // Validation
    if (empty($username) || empty($email) || empty($password) || empty($confirm_password)) {
        $error_message = "Please fill in all fields.";
    } elseif ($password !== $confirm_password) {
        $error_message = "Passwords do not match.";
    } elseif (strlen($password) < 6) {
        $error_message = "Password must be at least 6 characters long.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error_message = "Please enter a valid email address.";
    } else {
        // Check if username or email already exists
        $sql = "SELECT id FROM users WHERE username = ? OR email = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ss", $username, $email);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        
        if (mysqli_fetch_assoc($result)) {
            $error_message = "Username or email already exists.";
        } else {
            // Create new user
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            $sql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'user')";
            $stmt = mysqli_prepare($conn, $sql);
            mysqli_stmt_bind_param($stmt, "sss", $username, $email, $hashed_password);
            
            if (mysqli_stmt_execute($stmt)) {
                $success_message = "Account created successfully! You can now <a href='login.php' style='color: #20e3b2; font-weight: bold;'>login</a>.";
            } else {
                $error_message = "Error creating account. Please try again.";
            }
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up - TedouaR Robotics Hub</title>
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .signup-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: radial-gradient(circle at center, #1a1a1a 0%, #121212 100%);
        }
        
        .signup-box {
            background-color: rgba(0, 0, 0, 0.3);
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(32, 227, 178, 0.1);
            width: 100%;
            max-width: 500px;
            position: relative;
            overflow: hidden;
        }
        
        .signup-box::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, rgba(32, 227, 178, 0.05), transparent);
            z-index: -1;
        }
        
        .signup-title {
            text-align: center;
            margin-bottom: 30px;
            background: linear-gradient(90deg, #0cebeb, #20e3b2);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            font-size: 2.5rem;
            font-weight: 700;
        }
        
        .signup-subtitle {
            text-align: center;
            margin-bottom: 30px;
            color: #f0f0f0;
            opacity: 0.8;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #20e3b2;
            font-weight: 500;
        }
        
        .form-control {
            width: 100%;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid rgba(32, 227, 178, 0.3);
            background-color: rgba(0, 0, 0, 0.2);
            color: #f0f0f0;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        
        .form-control:focus {
            outline: none;
            border-color: #20e3b2;
            box-shadow: 0 0 10px rgba(32, 227, 178, 0.3);
        }
        
        .signup-btn {
            background: linear-gradient(90deg, #0cebeb, #20e3b2);
            color: #121212;
            padding: 15px 30px;
            border: none;
            border-radius: 50px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
            margin-top: 20px;
            box-shadow: 0 5px 15px rgba(32, 227, 178, 0.3);
        }
        
        .signup-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(32, 227, 178, 0.4);
        }
        
        .login-link {
            text-align: center;
            margin-top: 20px;
            font-size: 0.9rem;
        }
        
        .login-link a {
            color: #20e3b2;
            font-weight: 500;
            text-decoration: none;
        }
        
        .login-link a:hover {
            text-decoration: underline;
        }
        
        .alert {
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 8px;
            text-align: center;
        }
        
        .alert-danger {
            background-color: rgba(255, 76, 76, 0.1);
            border: 1px solid rgba(255, 76, 76, 0.3);
            color: #ff4c4c;
        }
        
        .alert-success {
            background-color: rgba(32, 227, 178, 0.1);
            border: 1px solid rgba(32, 227, 178, 0.3);
            color: #20e3b2;
        }
        
        .back-link {
            position: absolute;
            top: 20px;
            left: 20px;
            color: #20e3b2;
            text-decoration: none;
            font-size: 1.2rem;
            transition: all 0.3s ease;
        }
        
        .back-link:hover {
            transform: translateX(-5px);
        }
        
        .password-requirements {
            font-size: 0.85rem;
            color: #888;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <a href="index.php" class="back-link">
        <i class="fas fa-arrow-left"></i> Back to Home
    </a>
    
    <div class="signup-container">
        <div class="signup-box">
            <h1 class="signup-title">Sign Up</h1>
            <p class="signup-subtitle">Join the TedouaR Robotics Community</p>
            
            <?php if (!empty($error_message)): ?>
                <div class="alert alert-danger">
                    <?php echo $error_message; ?>
                </div>
            <?php endif; ?>
            
            <?php if (!empty($success_message)): ?>
                <div class="alert alert-success">
                    <?php echo $success_message; ?>
                </div>
            <?php endif; ?>
            
            <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" class="form-control" required>
                </div>
                
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" class="form-control" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" class="form-control" required>
                    <div class="password-requirements">Minimum 6 characters</div>
                </div>
                
                <div class="form-group">
                    <label for="confirm_password">Confirm Password</label>
                    <input type="password" id="confirm_password" name="confirm_password" class="form-control" required>
                </div>
                
                <button type="submit" class="signup-btn">Create Account</button>
            </form>
            
            <div class="login-link">
                Already have an account? <a href="login.php">Login here</a>
            </div>
        </div>
    </div>
</body>
</html>