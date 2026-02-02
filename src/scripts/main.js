// This file contains the JavaScript code for the website. It handles interactivity and dynamic content on the webpage.

const images = [
    "assets/images/ENDFIELD_SHARE_1769345197.png",
    "assets/images/ENDFIELD_SHARE_1769345104.png",
    "assets/images/ENDFIELD_SHARE_1769345021.png",
    "assets/images/ENDFIELD_SHARE_1769343040.png",
    "assets/images/ENDFIELD_SHARE_1769345454.png"
];

let currentRotation = 0;
let isAnimating = false;
let currentIndex = 0;
const totalImages = images.length;
const anglePerImage = 360 / totalImages;
let radius = 350; // Radius of the cylinder

// Initialize carousel positions
function initCarousel() {
    const galleryImages = document.querySelectorAll('#carousel img');
    
    galleryImages.forEach((img, index) => {
        // Add click handler
        img.addEventListener('click', function() {
            rotateToImage(index);
            changeFeatured(this);
        });
    });

    updateRadius();
    updateCarouselPositions();

    window.addEventListener('resize', () => {
        updateRadius();
        updateCarouselPositions();
    });
}

function updateRadius() {
    radius = window.innerWidth <= 768 ? 160 : 350;
}

function updateCarouselPositions() {
    const galleryImages = document.querySelectorAll('#carousel img');

    galleryImages.forEach((img, index) => {
        const angle = anglePerImage * index + currentRotation;
        const theta = (angle * Math.PI) / 180;
        const x = radius * Math.sin(theta);
        const z = radius * Math.cos(theta);

        // Calculate scale based on z-position (closer = larger)
        const scale = 0.7 + (z + radius) / (2 * radius) * 0.3;

        // Calculate opacity and blur based on depth (closer = more opaque, sharper)
        const depthRatio = (z + radius) / (2 * radius);
        const opacity = 0.6 + depthRatio * 0.4;
        const blur = 2 - depthRatio * 2;

        img.style.transform = `translateX(${x}px) translateZ(${z}px) scale(${scale})`;
        img.style.opacity = opacity;
        img.style.filter = `blur(${blur}px)`;

        const zIndex = Math.round(z + radius);
        img.style.zIndex = zIndex;
        img.style.pointerEvents = index === currentIndex ? 'none' : 'auto';
    });
}

function animateRotation(startRotation, endRotation, duration = 250) {
    const startTime = performance.now();

    function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 0.5 - Math.cos(progress * Math.PI) / 2; // ease-in-out
        currentRotation = startRotation + (endRotation - startRotation) * ease;
        updateCarouselPositions();

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            currentRotation = endRotation;
            updateCarouselPositions();
            isAnimating = false;
        }
    }

    requestAnimationFrame(step);
}

// Rotate carousel to bring clicked image to center
function rotateToImage(targetIndex) {
    if (isAnimating || targetIndex === currentIndex) {
        return;
    }

    // Calculate the shortest rotation path
    let diff = targetIndex - currentIndex;
    
    // Wrap around if needed (choose shorter path)
    if (diff > totalImages / 2) {
        diff -= totalImages;
    } else if (diff < -totalImages / 2) {
        diff += totalImages;
    }
    
    currentIndex = targetIndex;
    const startRotation = currentRotation;
    const endRotation = currentRotation - anglePerImage * diff;
    currentRotation = endRotation;
    isAnimating = true;
    animateRotation(startRotation, endRotation);
}

function changeFeatured(el) {
    const img = document.getElementById("featuredImage");

    // Remove the "selected" class from all gallery images
    document.querySelectorAll('.gallery img').forEach(image => {
        image.classList.remove('selected');
    });

    // Add the "selected" class to the clicked image
    el.classList.add('selected');

    // Fade out, swap src, fade in
    img.style.opacity = 0;
    setTimeout(() => {
        img.src = el.src;
        img.style.opacity = 1;
    }, 350);
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initCarousel);

    // Add your JavaScript code here for interactivity
