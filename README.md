# TedouaR Robotics HUB

A comprehensive online robotics encyclopedia that showcases various robots from around the world, their specifications, and applications.

![TedouaR Robotics HUB](https://via.placeholder.com/1200x600/0c0c0c/20e3b2?text=TedouaR+Robotics+HUB)

## Features

- **Robot Encyclopedia**: Browse an extensive database of robots categorized by type, manufacturer, and application
- **Detailed Robot Pages**: Individual pages for each robot with comprehensive information, images, and videos
- **User Accounts**: Create accounts to bookmark favorite robots and personalize your experience
- **Admin Dashboard**: Powerful content management system for administrators to add, edit, and manage robot entries
- **Image & Video Management**: Upload images and link videos to robot entries
- **Responsive Design**: Optimized viewing experience across all devices

## Installation

### Prerequisites

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Web server (Apache/Nginx)

### Steps

1. **Clone the repository**
   ```
   git clone https://github.com/Taikibonnet/Tedouar-Robotics-HUB.git
   cd Tedouar-Robotics-HUB
   ```

2. **Configure database connection**
   - Open `install.php` and update the database connection details:
     ```php
     $host = 'localhost'; // Your database host
     $username = 'root';  // Your database username
     $password = '';      // Your database password
     $database = 'tedouar_robotics';
     ```

3. **Run the installation script**
   - Navigate to `http://yourwebsite.com/install.php` in your browser
   - The script will create the necessary database and tables
   - It will also import sample robots and create an admin account

4. **Access your website**
   - Homepage: `http://yourwebsite.com/`
   - Admin Dashboard: `http://yourwebsite.com/admin/`
     - Username: `admin`
     - Password: `admin123`

5. **Set proper permissions**
   - Make sure the `uploads` directory is writable by the web server
   - Recommended: `chmod 755 uploads` and `chmod 755 uploads/robots`

## Directory Structure

```
├── admin/             # Admin dashboard files
├── includes/          # Core PHP functions and configuration
├── js/                # JavaScript files
├── styles/            # CSS stylesheets
├── uploads/           # Uploaded files (images, etc.)
├── db/                # Database setup files
├── index.php          # Homepage
├── encyclopedia.php   # Main encyclopedia page
├── robot.php          # Individual robot page
├── login.php          # Login page
├── signup.php         # Registration page
├── about.php          # About page
├── contact.php        # Contact page
├── robots.json        # Sample robot data
└── install.php        # Installation script
```

## Usage

### Managing Robots

1. Log in as admin and navigate to the admin dashboard
2. Click on "Robots" in the sidebar menu
3. Use the "Add New Robot" button to create a new entry
4. Fill out the robot information in the provided form
5. Upload images and add video links
6. Save the robot entry

### User Features

- **Browse**: Navigate through the encyclopedia by category or use the search function
- **Details**: Click on any robot card to view detailed information
- **Account**: Register an account to bookmark favorite robots
- **Personalization**: Manage your profile and bookmarks from the user dashboard

## Customization

### Themes

You can customize the look and feel by modifying the CSS variables in `styles/main.css`:

```css
:root {
    --primary-color: #20e3b2;      /* Main accent color */
    --secondary-color: #0cebeb;     /* Secondary accent color */
    --text-color: #f0f0f0;          /* Main text color */
    --bg-color: #0c0c0c;            /* Background color */
    /* ... other variables ... */
}
```

### Adding Categories

New categories can be added directly from the admin interface when creating or editing robots.

## Security

- After installation, change the default admin password
- Consider implementing HTTPS for secure data transmission
- Regularly update your server and PHP version
- Make sure to set proper file permissions

## Credits

- Built with PHP, MySQL, HTML5, CSS3, and JavaScript
- Icons by [Font Awesome](https://fontawesome.com/)
- Fonts by [Google Fonts](https://fonts.google.com/)

## License

© 2025 TedouaR Robotics Hub. All rights reserved.

---

*Note: This is a portfolio project built for educational purposes. The robot information is sourced from publicly available data.*