const fs = require('fs');

// 1. Update CSS
let css = fs.readFileSync('projects.css', 'utf8');
css += `
/* GitHub Button directly on the front of the card */
.front-github-btn {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    background: linear-gradient(45deg, #ff3333, #ff6b6b);
    color: white;
    text-decoration: none;
    border-radius: 20px;
    font-weight: bold;
    font-size: 0.9rem;
    box-shadow: 0 4px 15px rgba(255, 51, 51, 0.4);
    z-index: 100;
    pointer-events: auto;
    transition: all 0.3s ease;
    opacity: 0;
}

/* Ensure the front allows clicks and hovering makes the button appear */
.card-front {
    pointer-events: auto;
}

.card:hover .front-github-btn {
    opacity: 1;
    bottom: 30px;
}

.front-github-btn:hover {
    box-shadow: 0 6px 20px rgba(255, 51, 51, 0.6);
    color: white;
    transform: translateX(-50%) scale(1.05);
}
`;
fs.writeFileSync('projects.css', css);

// 2. Update JS to remove the double click event entirely!
let js = fs.readFileSync('projects.js', 'utf8');
// Remove the double click listener
js = js.replace(/card\.addEventListener\('dblclick', \(e\) => \{[\s\S]*?\}\);/g, '');
fs.writeFileSync('projects.js', js);
console.log('Fixed JS and CSS');
