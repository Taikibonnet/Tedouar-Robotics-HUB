// Robot Manager System - Modular Approach
// This system allows you to organize robots in separate files and easily add new ones

class RobotManager {
    constructor() {
        this.robots = [];
        this.categories = new Set();
        this.manufacturers = new Set();
        this.isLoading = false;
    }

    // Load robots from multiple sources
    async loadRobots() {
        this.isLoading = true;
        this.showLoading();

        try {
            // Load from main robots.json (existing robots)
            const mainRobots = await this.loadFromFile('robots.json');
            
            // Load from new robots directory (if it exists)
            const newRobots = await this.loadFromDirectory('data/robots/');
            
            // Combine all robots
            this.robots = [...mainRobots, ...newRobots];
            
            // Update categories and manufacturers
            this.updateMetadata();
            
            this.isLoading = false;
            this.hideLoading();
            
            return this.robots;
        } catch (error) {
            console.error('Error loading robots:', error);
            this.isLoading = false;
            this.hideLoading();
            this.showError('Failed to load robot data');
            return [];
        }
    }

    // Load robots from a single JSON file
    async loadFromFile(filename) {
        try {
            const response = await fetch(filename);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}`);
            }
            return await response.json();
        } catch (error) {
            console.warn(`Could not load ${filename}:`, error);
            return [];
        }
    }

    // Load robots from multiple files in a directory
    async loadFromDirectory(directory) {
        try {
            // Try to load an index file that lists available robot files
            const indexResponse = await fetch(`${directory}index.json`);
            if (!indexResponse.ok) {
                return []; // No index file, no additional robots
            }
            
            const index = await indexResponse.json();
            const robotPromises = index.files.map(filename => 
                this.loadFromFile(`${directory}${filename}`)
            );
            
            const robotArrays = await Promise.all(robotPromises);
            return robotArrays.flat();
        } catch (error) {
            console.warn(`Could not load robots from ${directory}:`, error);
            return [];
        }
    }

    // Update categories and manufacturers
    updateMetadata() {
        this.categories.clear();
        this.manufacturers.clear();
        
        this.robots.forEach(robot => {
            this.categories.add(robot.category);
            this.manufacturers.add(robot.manufacturer);
        });
    }

    // Filter robots with multiple criteria
    filterRobots(filters = {}) {
        let filtered = this.robots;

        // Apply category filter
        if (filters.category && filters.category !== 'All') {
            filtered = filtered.filter(robot => robot.category === filters.category);
        }

        // Apply manufacturer filter
        if (filters.manufacturer && filters.manufacturer !== 'All') {
            filtered = filtered.filter(robot => robot.manufacturer === filters.manufacturer);
        }

        // Apply status filter
        if (filters.status && filters.status !== 'All') {
            filtered = filtered.filter(robot => robot.status === filters.status);
        }

        // Apply year filter
        if (filters.year && filters.year !== 'All') {
            filtered = filtered.filter(robot => robot.releaseYear === filters.year);
        }

        // Apply search query
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(robot => 
                robot.title.toLowerCase().includes(searchTerm) ||
                robot.manufacturer.toLowerCase().includes(searchTerm) ||
                robot.description.toLowerCase().includes(searchTerm) ||
                robot.category.toLowerCase().includes(searchTerm) ||
                (robot.tags && robot.tags.some(tag => 
                    tag.toLowerCase().includes(searchTerm)
                ))
            );
        }

        return filtered;
    }

    // Get unique values for filters
    getCategories() {
        return ['All', ...Array.from(this.categories).sort()];
    }

    getManufacturers() {
        return ['All', ...Array.from(this.manufacturers).sort()];
    }

    getStatuses() {
        const statuses = new Set(this.robots.map(robot => robot.status));
        return ['All', ...Array.from(statuses).sort()];
    }

    getYears() {
        const years = new Set(this.robots.map(robot => robot.releaseYear));
        return ['All', ...Array.from(years).sort().reverse()];
    }

    // UI Helper methods
    showLoading() {
        const container = document.getElementById('robot-container');
        if (container) {
            container.innerHTML = `
                <div class="loading">
                    <span>Loading robots...</span>
                </div>
            `;
        }
    }

    hideLoading() {
        // Loading will be hidden when robots are rendered
    }

    showError(message) {
        const container = document.getElementById('robot-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2>⚠️ Error</h2>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="robotManager.loadRobots()">
                        Try Again
                    </button>
                </div>
            `;
        }
    }

    // Render robots to the page - REMOVED DATA-AOS ANIMATION
    renderRobots(robots = null) {
        const robotsToRender = robots || this.robots;
        const container = document.getElementById('robot-container');
        
        if (!container) {
            console.error('Robot container not found');
            return;
        }

        if (robotsToRender.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <h2>🔍 No Robots Found</h2>
                    <p>Try adjusting your search criteria or filters.</p>
                    <button class="btn btn-outline" onclick="robotManager.clearFilters()">
                        Clear Filters
                    </button>
                </div>
            `;
            return;
        }

        const robotCards = robotsToRender.map(robot => `
            <div class="robot-card">
                <div class="robot-card-image">
                    <img src="${robot.image}" alt="${robot.title}" 
                         onerror="this.src='images/robots/placeholder.jpg'" 
                         loading="eager">
                </div>
                <div class="robot-card-content">
                    <h3 class="robot-card-title">${robot.title}</h3>
                    <p class="robot-card-manufacturer">${robot.manufacturer}</p>
                    <span class="category-pill">${robot.category}</span>
                    <p class="robot-card-description">${robot.description}</p>
                    <a href="robot.php?id=${robot.id}" class="robot-view-details">
                        View Details →
                    </a>
                </div>
            </div>
        `).join('');

        container.innerHTML = `<div class="robot-grid">${robotCards}</div>`;
    }

    // Clear all filters
    clearFilters() {
        // Reset all filter elements
        const searchInput = document.getElementById('search-input');
        const categorySelect = document.getElementById('category-filter');
        const manufacturerSelect = document.getElementById('manufacturer-filter');
        const statusSelect = document.getElementById('status-filter');
        const yearSelect = document.getElementById('year-filter');

        if (searchInput) searchInput.value = '';
        if (categorySelect) categorySelect.value = 'All';
        if (manufacturerSelect) manufacturerSelect.value = 'All';
        if (statusSelect) statusSelect.value = 'All';
        if (yearSelect) yearSelect.value = 'All';

        // Re-render all robots
        this.renderRobots();
    }

    // Populate filter dropdowns
    populateFilters() {
        this.populateSelect('category-filter', this.getCategories());
        this.populateSelect('manufacturer-filter', this.getManufacturers());
        this.populateSelect('status-filter', this.getStatuses());
        this.populateSelect('year-filter', this.getYears());
    }

    populateSelect(selectId, options) {
        const select = document.getElementById(selectId);
        if (!select) return;

        select.innerHTML = options.map(option => 
            `<option value="${option}">${option}</option>`
        ).join('');
    }
}

// Initialize the robot manager
const robotManager = new RobotManager();

// Auto-load robots when page loads
document.addEventListener('DOMContentLoaded', async () => {
    await robotManager.loadRobots();
    robotManager.populateFilters();
    robotManager.renderRobots();
    
    // Set up filter event listeners
    setupFilterListeners();
});

// Set up event listeners for filters
function setupFilterListeners() {
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-filter');
    const manufacturerSelect = document.getElementById('manufacturer-filter');
    const statusSelect = document.getElementById('status-filter');
    const yearSelect = document.getElementById('year-filter');

    // Debounced search
    let searchTimeout;
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                applyFilters();
            }, 300);
        });
    }

    // Filter change listeners
    [categorySelect, manufacturerSelect, statusSelect, yearSelect].forEach(select => {
        if (select) {
            select.addEventListener('change', applyFilters);
        }
    });
}

// Apply all filters
function applyFilters() {
    const filters = {
        search: document.getElementById('search-input')?.value || '',
        category: document.getElementById('category-filter')?.value || 'All',
        manufacturer: document.getElementById('manufacturer-filter')?.value || 'All',
        status: document.getElementById('status-filter')?.value || 'All',
        year: document.getElementById('year-filter')?.value || 'All'
    };

    const filteredRobots = robotManager.filterRobots(filters);
    robotManager.renderRobots(filteredRobots);
}

// Utility function to generate robot ID from title
function generateRobotId(title) {
    return title.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);
}