        // Function to load featured robots using modular system
        function loadFeaturedRobots() {
            const robotGrid = document.querySelector('.robot-grid');
            if (!robotGrid) return;
            
            // Try modular system first, fallback to legacy
            loadFeaturedRobotsModular()
                .catch(error => {
                    console.warn('Modular system failed, using legacy:', error);
                    loadFeaturedRobotsLegacy();
                });
        }
        
        // Modular featured robots loading
        async function loadFeaturedRobotsModular() {
            const robotGrid = document.querySelector('.robot-grid');
            
            try {
                // Load the index to find featured robots
                const indexResponse = await fetch('data/robots-index.json');
                const index = await indexResponse.json();
                
                const featuredRobots = [];
                
                // Load featured robots from each category
                for (const featuredItem of index.featured) {
                    const categoryInfo = index.categories.find(cat => cat.id === featuredItem.category);
                    if (categoryInfo) {
                        const catResponse = await fetch(categoryInfo.file);
                        const catRobots = await catResponse.json();
                        const robot = catRobots.find(r => r.id === featuredItem.id);
                        if (robot) {
                            featuredRobots.push(robot);
                        }
                    }
                }
                
                // Display featured robots (max 3)
                const robotsToShow = featuredRobots.slice(0, 3);
                
                if (robotsToShow.length > 0) {
                    robotGrid.innerHTML = '';
                    robotsToShow.forEach(robot => {
                        const imageUrl = robot.image || 'images/robots/placeholder.jpg';
                        const truncatedDescription = robot.description && robot.description.length > 120 ? 
                            robot.description.substring(0, 120) + '...' : 
                            (robot.description || 'No description available');
                        
                        const robotCard = document.createElement('div');
                        robotCard.className = 'robot-card';
                        
                        robotCard.innerHTML = `
                            <div class="robot-card-image">
                                <img src="${imageUrl}" alt="${robot.title}">
                            </div>
                            <div class="robot-card-content">
                                <h3 class="robot-card-title">${robot.title}</h3>
                                <div class="robot-card-categories">
                                    ${robot.category ? `<span class="category-pill">${robot.category}</span>` : ''}
                                </div>
                                ${robot.manufacturer ? `<div class="robot-card-manufacturer">${robot.manufacturer}</div>` : ''}
                                <p class="robot-card-description">${truncatedDescription}</p>
                                <a href="robots/${robot.slug}.html" class="robot-view-details">View Details</a>
                            </div>
                        `;
                        
                        robotGrid.appendChild(robotCard);
                    });
                } else {
                    // If no featured robots, show default
                    showDefaultRobots(robotGrid);
                }
                
            } catch (error) {
                console.error('Error in modular featured loading:', error);
                throw error; // Let the caller handle fallback
            }
        }
        
        // Legacy featured robots loading (fallback)
        function loadFeaturedRobotsLegacy() {
            const robotGrid = document.querySelector('.robot-grid');
            
            fetch('robots.json')
                .then(response => response.json())
                .then(robots => {
                    // Filter featured robots
                    const featuredRobots = robots.filter(robot => robot.featured === true);
                    
                    // Display featured robots (max 3)
                    const robotsToShow = featuredRobots.slice(0, 3);
                    
                    if (robotsToShow.length > 0) {
                        robotGrid.innerHTML = '';
                        robotsToShow.forEach(robot => {
                            const imageUrl = robot.image || 'images/robots/placeholder.jpg';
                            const truncatedDescription = robot.description.length > 120 ? 
                                robot.description.substring(0, 120) + '...' : 
                                robot.description;
                            
                            const robotCard = document.createElement('div');
                            robotCard.className = 'robot-card';
                            
                            robotCard.innerHTML = `
                                <div class="robot-card-image">
                                    <img src="${imageUrl}" alt="${robot.title}">
                                </div>
                                <div class="robot-card-content">
                                    <h3 class="robot-card-title">${robot.title}</h3>
                                    <div class="robot-card-categories">
                                        ${robot.category ? `<span class="category-pill">${robot.category}</span>` : ''}
                                    </div>
                                    ${robot.manufacturer ? `<div class="robot-card-manufacturer">${robot.manufacturer}</div>` : ''}
                                    <p class="robot-card-description">${truncatedDescription}</p>
                                    <a href="robots/${robot.slug}.html" class="robot-view-details">View Details</a>
                                </div>
                            `;
                            
                            robotGrid.appendChild(robotCard);
                        });
                    } else {
                        // If no featured robots, show default/sample robots
                        showDefaultRobots(robotGrid);
                    }
                })
                .catch(error => {
                    console.error('Error loading featured robots:', error);
                    showDefaultRobots(robotGrid);
                });
        }