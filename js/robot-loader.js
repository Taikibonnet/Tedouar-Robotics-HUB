        // Function to filter and sort robots using modular data system
        function filterRobots() {
            const robotGrid = document.querySelector('.robot-grid');
            const categoryFilter = document.getElementById('category-filter');
            const sortOption = document.getElementById('sort-option');
            const searchInput = document.getElementById('search-robots');
            
            if (!robotGrid) return;
            
            const category = categoryFilter ? categoryFilter.value : 'all';
            const sortValue = sortOption ? sortOption.value : 'name-asc';
            const searchText = searchInput ? searchInput.value.trim().toLowerCase() : '';
            
            // Show loading state
            robotGrid.innerHTML = '<div class=\"loading\">Loading robots...</div>';
            
            // Load robots using modular system
            loadRobotsModular(category, sortValue, searchText);
        }
        
        // New modular robot loading system
        async function loadRobotsModular(category, sortValue, searchText) {
            const robotGrid = document.querySelector('.robot-grid');
            
            try {
                // First load the index to know which files to fetch
                const indexResponse = await fetch('data/robots-index.json');
                const index = await indexResponse.json();
                
                let allRobots = [];
                
                if (category === 'all') {
                    // Load all categories
                    for (const cat of index.categories) {
                        try {
                            const catResponse = await fetch(cat.file);
                            const catRobots = await catResponse.json();
                            allRobots = allRobots.concat(catRobots);
                        } catch (error) {
                            console.warn(`Could not load category ${cat.name}:`, error);
                        }
                    }
                } else {
                    // Load specific category
                    const categoryInfo = index.categories.find(cat => cat.id === category);
                    if (categoryInfo) {
                        try {
                            const catResponse = await fetch(categoryInfo.file);
                            allRobots = await catResponse.json();
                        } catch (error) {
                            console.warn(`Could not load category ${categoryInfo.name}:`, error);
                            // Fallback to legacy system
                            return loadRobotsLegacy(category, sortValue, searchText);
                        }
                    } else {
                        // Fallback to legacy system for unknown categories
                        return loadRobotsLegacy(category, sortValue, searchText);
                    }
                }
                
                // Apply search filter
                let filteredRobots = allRobots;
                if (searchText) {
                    filteredRobots = allRobots.filter(robot => {
                        const titleMatch = robot.title && robot.title.toLowerCase().includes(searchText);
                        const manufacturerMatch = robot.manufacturer && robot.manufacturer.toLowerCase().includes(searchText);
                        const descriptionMatch = robot.description && robot.description.toLowerCase().includes(searchText);
                        const categoryMatch = robot.category && robot.category.toLowerCase().includes(searchText);
                        const tagsMatch = robot.tags && robot.tags.some(tag => tag.toLowerCase().includes(searchText));
                        
                        return titleMatch || manufacturerMatch || descriptionMatch || categoryMatch || tagsMatch;
                    });
                }
                
                // Apply sorting
                filteredRobots.sort((a, b) => {
                    switch (sortValue) {
                        case 'name-asc':
                            return a.title.localeCompare(b.title);
                        case 'name-desc':
                            return b.title.localeCompare(a.title);
                        case 'manufacturer-asc':
                            return (a.manufacturer || '').localeCompare(b.manufacturer || '');
                        case 'manufacturer-desc':
                            return (b.manufacturer || '').localeCompare(a.manufacturer || '');
                        default:
                            return 0;
                    }
                });
                
                // Display results
                displayRobots(filteredRobots, robotGrid);
                
            } catch (error) {
                console.error('Error loading modular robot data:', error);
                // Fallback to legacy system
                loadRobotsLegacy(category, sortValue, searchText);
            }
        }
        
        // Legacy fallback function
        function loadRobotsLegacy(category, sortValue, searchText) {
            const robotGrid = document.querySelector('.robot-grid');
            
            fetch('robots.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load robot data');
                    }
                    return response.json();
                })
                .then(robots => {
                    // Apply category filter
                    let filteredRobots = robots;
                    if (category !== 'all') {
                        filteredRobots = robots.filter(robot => 
                            robot.category && robot.category.toLowerCase() === category.toLowerCase()
                        );
                    }
                    
                    // Apply search filter
                    if (searchText) {
                        filteredRobots = filteredRobots.filter(robot => {
                            const titleMatch = robot.title && robot.title.toLowerCase().includes(searchText);
                            const manufacturerMatch = robot.manufacturer && robot.manufacturer.toLowerCase().includes(searchText);
                            const descriptionMatch = robot.description && robot.description.toLowerCase().includes(searchText);
                            const categoryMatch = robot.category && robot.category.toLowerCase().includes(searchText);
                            const tagsMatch = robot.tags && robot.tags.some(tag => tag.toLowerCase().includes(searchText));
                            
                            return titleMatch || manufacturerMatch || descriptionMatch || categoryMatch || tagsMatch;
                        });
                    }
                    
                    // Apply sorting
                    filteredRobots.sort((a, b) => {
                        switch (sortValue) {
                            case 'name-asc':
                                return a.title.localeCompare(b.title);
                            case 'name-desc':
                                return b.title.localeCompare(a.title);
                            case 'manufacturer-asc':
                                return (a.manufacturer || '').localeCompare(b.manufacturer || '');
                            case 'manufacturer-desc':
                                return (b.manufacturer || '').localeCompare(a.manufacturer || '');
                            default:
                                return 0;
                        }
                    });
                    
                    displayRobots(filteredRobots, robotGrid);
                })
                .catch(error => {
                    console.error('Error loading legacy robot data:', error);
                    robotGrid.innerHTML = `
                        <div class=\"error-message\">
                            <h2>Failed to load robot data</h2>
                            <p>Please try again later or contact the administrator.</p>
                        </div>
                    `;
                });
        }
        
        // Common function to display robots
        function displayRobots(robots, container) {
            container.innerHTML = '';
            if (robots.length > 0) {
                robots.forEach(robot => {
                    container.appendChild(createRobotCard(robot));
                });
            } else {
                container.innerHTML = `
                    <div class=\"no-results\">
                        <h2>No robots found</h2>
                        <p>No robots matched your search criteria. Try different filters or search terms.</p>
                        <a href=\"encyclopedia.html\" class=\"btn btn-primary\">View All Robots</a>
                    </div>
                `;
            }
        }