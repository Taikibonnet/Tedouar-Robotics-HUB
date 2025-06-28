#!/usr/bin/env node
// Auto-apply image display fixes to all robot pages
// This script adds the robot-detail-fixes.css link and removes problematic animations

const robotPages = [
  'corleo.html',
  'kubota-katr.html', 
  'neo-gamma.html',
  'peanut.html',
  'suzuki-moqba.html',
  'yigoli-energy-arm.html'
];

// CSS fixes to inject
const cssLink = '<link rel="stylesheet" href="../styles/robot-detail-fixes.css">';

// CSS modifications to apply
const cssModifications = `
        /* FIXED: Remove problematic animations for immediate image display */
        .robot-hero-image {
            position: relative;
            animation: none !important;
        }

        .gallery-image {
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(32, 227, 178, 0.2);
            /* FIXED: Remove problematic scale animation */
            transition: box-shadow 0.3s ease;
        }

        .gallery-image:hover {
            /* FIXED: Only change box-shadow, not transform */
            box-shadow: 0 15px 30px rgba(32, 227, 178, 0.4);
        }

        .gallery-image img {
            width: 100%;
            height: auto;
            display: block;
        }
`;

// JavaScript to add for immediate image display
const jsAddition = `
            // CRITICAL: Force immediate image display
            const allImages = document.querySelectorAll('img');
            allImages.forEach(function(img) {
                img.style.opacity = '1';
                img.style.visibility = 'visible';
                img.style.display = 'block';
                img.style.transform = 'none';
                img.style.animation = 'none';
            });
`;

console.log('Image fixes configuration ready.');
console.log('Pages to update:', robotPages);
console.log('This script shows what changes need to be applied to each robot page.');
console.log('\n1. Add CSS link:', cssLink);
console.log('\n2. Replace gallery hover animations with safe ones');
console.log('\n3. Add JavaScript for immediate image display');
