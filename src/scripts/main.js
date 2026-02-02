// This file contains the JavaScript code for the website. It handles interactivity and dynamic content on the webpage.

// Video Splash Screen Functions
function fadeOutAudio(video, duration = 1000) {
    if (!video) return;
    
    const startVolume = video.volume;
    const startTime = Date.now();
    
    const fade = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        video.volume = startVolume * (1 - progress);
        
        if (progress < 1) {
            requestAnimationFrame(fade);
        } else {
            video.volume = 0;
            video.muted = true;
        }
    };
    
    requestAnimationFrame(fade);
}

function hideVideoSplash() {
    const splash = document.getElementById('videoSplash');
    if (splash) {
        splash.classList.add('hide');
    }
}

function skipVideo() {
    const video = document.getElementById('splashVideo');
    if (video) {
        fadeOutAudio(video, 500);
        video.pause();
        video.currentTime = 0;
    }
    hideVideoSplash();
}

function setupVideoSplash() {
    const video = document.getElementById('splashVideo');
    const splash = document.getElementById('videoSplash');
    
    if (video && splash) {
        // Hide splash when video ends
        video.addEventListener('ended', hideVideoSplash);
        
        // Handle video errors (if video file doesn't exist, hide splash)
        video.addEventListener('error', hideVideoSplash);
        
        // Auto-stop video and fade out sound after 13 seconds
        setTimeout(() => {
            if (video && !video.paused) {
                fadeOutAudio(video, 1000);
                setTimeout(hideVideoSplash, 1000);
            }
        }, 13000);
    }
}

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
        const blur = index === currentIndex ? 0 : 1 - depthRatio;

        img.style.transform = `translateX(${x}px) translateZ(${z}px) scale(${scale})`;
        img.style.opacity = opacity;
        img.style.filter = `blur(${blur}px)`;

        const zIndex = Math.round(z + radius);
        img.style.zIndex = zIndex;
        img.style.pointerEvents = index === currentIndex ? 'none' : 'auto';
    });
}

function animateRotation(startRotation, endRotation, duration = 250, direction) {
    const startTime = performance.now();

    function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 0.5 - Math.cos(progress * Math.PI) / 2; // ease-in-out
        currentRotation = startRotation + (endRotation - startRotation) * ease;
        
        // Apply motion blur during animation
        const galleryImages = document.querySelectorAll('#carousel img');
        galleryImages.forEach((img, index) => {
            if (progress < 1) {
                // Apply motion blur in rotation direction
                const motionBlur = Math.sin(progress * Math.PI) * 24; // 0 to 24px
                const blurDirection = direction > 0 ? 'blur' : 'blur'; // both use blur, but direction affects perception
                img.style.filter = `${blurDirection}(${motionBlur}px)`;
            }
        });
        
        updateCarouselPositions();

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            currentRotation = endRotation;
            // Clear motion blur
            galleryImages.forEach(img => {
                img.style.filter = '';
            });
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
    animateRotation(startRotation, endRotation, 250, diff);
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
window.addEventListener('DOMContentLoaded', () => {
    setupVideoSplash();
    initCarousel();
});

// Add your JavaScript code here for interactivity
