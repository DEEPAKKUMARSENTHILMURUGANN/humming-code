const fs = require('fs');
let css = fs.readFileSync('projects.css', 'utf8');
css += `

/* Enhanced Active Card Styling for About Section */
.active-card-container .card {
    width: 600px;
    height: 400px;
}
.active-card-container .card-back {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgba(10, 10, 15, 0.98);
    padding: 40px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}
.active-card-container .card-back h3 {
    font-size: 2.5rem;
    margin-bottom: 20px;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 2px;
}
.active-card-container .card-back p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 30px;
    color: #bbb;
    max-width: 80%;
}
.github-btn {
    display: inline-block;
    padding: 12px 30px;
    background: linear-gradient(45deg, #ff3333, #ff6b6b);
    color: white;
    text-decoration: none;
    border-radius: 50px;
    font-weight: 700;
    font-size: 1.1rem;
    box-shadow: 0 4px 15px rgba(255, 51, 51, 0.4);
    transition: all 0.3s ease;
    pointer-events: auto;
    position: relative;
    z-index: 100;
}
.github-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(255, 51, 51, 0.6);
    color: white;
}
`;
fs.writeFileSync('projects.css', css);
console.log("Appended to projects.css");

// Now let's fix projects.js animation
let js = fs.readFileSync('projects.js', 'utf8');
// Fix the animation to flip via GSAP smoothly, AND we make sure pointer events work by explicitly giving the link an event listener if needed, but it should work now with pointer-events: auto on the container.
// Wait, we need to change back rotationY: 180 in projects.js because it was removed earlier!
js = js.replace("scale: 0.5, \\n                opacity: 0", "scale: 0.5, \\n                opacity: 0,\\n                rotationY: 0");
js = js.replace("duration: 1,\\n                ease: 'back.out(1.2)',", "rotationY: 180, // Flip it\\n                duration: 1,\\n                ease: 'back.out(1.2)',");
// For close animation
js = js.replace("scale: 0.5,\\n            opacity: 0,\\n            duration: 0.6,", "scale: 0.5,\\n            opacity: 0,\\n            rotationY: 0,\\n            duration: 0.6,");

// Let's add a script snippet to manually listen for clicks on the GitHub button inside the active card container
// Just in case CSS pointer-events fail due to preserve-3d!
if (!js.includes("window.open")) {
    js = js.replace("overlayCard.classList.add('is-flipped');", "overlayCard.classList.add('is-flipped');\\n                    // Fix link clickability programmatically\\n                    const gitLink = overlayCard.querySelector('a');\\n                    if (gitLink) {\\n                        gitLink.addEventListener('mousedown', (e) => {\\n                            e.stopPropagation();\\n                            window.open(gitLink.href, '_blank');\\n                        });\\n                        gitLink.addEventListener('click', (e) => {\\n                            e.stopPropagation();\\n                        });\\n                    }");
}

fs.writeFileSync('projects.js', js);
console.log("Fixed projects.js");

// Let's also update projects.html to use the class .github-btn
let html = fs.readFileSync('projects.html', 'utf8');
html = html.replace(/style="color: #fff; text-decoration: underline; pointer-events: auto; position: relative; z-index: 10;"/g, 'class="github-btn"');
fs.writeFileSync('projects.html', html);
console.log("Fixed HTML");
