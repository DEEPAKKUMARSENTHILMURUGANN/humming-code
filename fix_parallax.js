const fs = require('fs');
let js = fs.readFileSync('projects.js', 'utf8');

js = js.replace(/gsap\.to\(gridContainer, \{\s*rotationY: x,\s*rotationX: -y,\s*duration: 1,\s*ease: 'power2\.out'\s*\}\);/g, `gsap.to(gridContainer, {
            rotationX: 55 - y,
            rotationY: x,
            rotationZ: -45,
            duration: 1,
            ease: 'power2.out'
        });`);

fs.writeFileSync('projects.js', js);
console.log('Fixed parallax to keep isometric view');
