const fs = require('fs');
let css = fs.readFileSync('projects.css', 'utf8');

css += `
.is-active-popup {
    width: 600px !important;
    height: 800px !important;
    max-width: 90vw !important;
    max-height: 90vh !important;
    z-index: 2500 !important;
    box-shadow: 0 40px 80px rgba(0,0,0,0.8) !important;
}
.is-active-popup .front-github-btn {
    opacity: 1 !important;
    bottom: 40px !important;
    transform: translateX(-50%) scale(1.2) !important;
}
`;

fs.writeFileSync('projects.css', css);
console.log('Appended Flip CSS');
