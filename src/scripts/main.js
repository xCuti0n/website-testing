// This file contains the JavaScript code for the website. It handles interactivity and dynamic content on the webpage.

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
    }, 250);
}

    // Add your JavaScript code here for interactivity
