// Dynamic Robot Page Generator
document.addEventListener('DOMContentLoaded', function() {
    // Get robot slug from URL
    const pathSegments = window.location.pathname.split('/');
    const robotSlug = pathSegments[pathSegments.length - 1].replace('.html', '');
    
    loadRobotData(robotSlug);
});

function loadRobotData(slug) {
    // First check localStorage for custom robots
    const customRobots = JSON.parse(localStorage.getItem('customRobots') || '[]');
    const customRobot = customRobots.find(robot => robot.slug === slug);
    
    if (customRobot) {
        displayRobotData(customRobot);
        return;
    }
    
    // Then check the JSON file for default robots
    fetch('../robots.json')
        .then(response => response.json())
        .then(robots => {
            const robot = robots.find(r => r.slug === slug);
            if (robot) {
                displayRobotData(robot);
            } else {
                showRobotNotFound();
            }
        })
        .catch(error => {
            console.error('Error loading robot data:', error);
            showRobotNotFound();
        });
}

function displayRobotData(robot) {
    // Update page title
    document.title = robot.title + ' - TedouaR Robotics Hub';
    
    // Update breadcrumb
    const breadcrumbSpan = document.querySelector('.breadcrumb span:last-child');
    if (breadcrumbSpan) {
        breadcrumbSpan.textContent = robot.title;
    }
    
    // Update robot info
    document.querySelector('.robot-title').textContent = robot.title;
    document.querySelector('.robot-manufacturer').textContent = robot.manufacturer;
    document.querySelector('.robot-category').textContent = robot.category;
    document.querySelector('.robot-description').textContent = robot.description;
    
    // Update image
    const robotImage = document.querySelector('.robot-image');
    if (robotImage) {
        robotImage.src = robot.image || '../images/robots/placeholder.jpg';
        robotImage.alt = robot.title;
    }
    
    // Update video if exists
    if (robot.videoUrl) {
        const videoSection = document.getElementById('videoSection');
        const videoFrame = document.getElementById('robotVideo');
        const embedUrl = convertToEmbedUrl(robot.videoUrl);
        
        if (embedUrl) {
            videoFrame.src = embedUrl;
            videoSection.style.display = 'block';
        }
    }
    
    // Update full description
    const fullDescSection = document.querySelector('.detail-section.full-width-section p');
    if (fullDescSection) {
        fullDescSection.textContent = robot.fullDescription || robot.description;
    }
    
    // Update specifications
    const specTable = document.querySelector('.spec-table');
    if (specTable && robot.specifications) {
        specTable.innerHTML = '';
        Object.entries(robot.specifications).forEach(([key, value]) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${key}</td>
                <td>${value}</td>
            `;
            specTable.appendChild(row);
        });
    }
    
    // Update capabilities
    const capabilitiesList = document.querySelector('.capability-list');
    if (capabilitiesList && robot.capabilities) {
        capabilitiesList.innerHTML = '';
        robot.capabilities.forEach(capability => {
            const li = document.createElement('li');
            li.textContent = capability;
            capabilitiesList.appendChild(li);
        });
    }
    
    // Update applications
    const applicationsList = document.querySelector('.application-list');
    if (applicationsList && robot.applications) {
        applicationsList.innerHTML = '';
        robot.applications.forEach(application => {
            const li = document.createElement('li');
            li.textContent = application;
            applicationsList.appendChild(li);
        });
    }
}

function convertToEmbedUrl(url) {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\\w-]+)/);
    if (youtubeMatch) {
        return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\\d+)/);
    if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    return null;
}

function showRobotNotFound() {
    document.querySelector('.robot-hero').innerHTML = `
        <div class="container" style="text-align: center; padding: 100px 0;">
            <h1 style="color: var(--primary-color); font-size: 3rem; margin-bottom: 20px;">Robot Not Found</h1>
            <p style="color: var(--text-color); font-size: 1.2rem; margin-bottom: 30px;">The robot you're looking for doesn't exist or has been removed.</p>
            <a href="../encyclopedia.html" class="btn btn-primary">Back to Encyclopedia</a>
        </div>
    `;
    
    // Hide the details section
    const detailsSection = document.querySelector('.robot-details');
    if (detailsSection) {
        detailsSection.style.display = 'none';
    }
}