const fs = require('fs');

let js = fs.readFileSync('projects.js', 'utf8');

// 1. Restore the dblclick event listener inside the cards.forEach loop
// We can just add it before the end of the loop: `    });`
js = js.replace(/        \}\n    \}\);\n\n    function openCard/g, `        }\n        card.addEventListener('dblclick', (e) => {\n            e.stopPropagation();\n            openCard(card);\n        });\n    });\n\n    function openCard`);

// 2. Remove rotationY from GSAP open animation
js = js.replace(/scale: 1,\n                opacity: 1,\n                rotationY: 180,\n                duration: 1,/g, "scale: 2,\n                opacity: 1,\n                duration: 1,");

// 3. Remove overlayCard.classList.add('is-flipped');
js = js.replace("overlayCard.classList.add('is-flipped');", "");

// 4. In close animation, scale from 2 down to 0.5
js = js.replace("scale: 0.5,\n            opacity: 0,\n            rotationY: 0,\n            duration: 0.6,", "scale: 0.5,\n            opacity: 0,\n            duration: 0.6,");

fs.writeFileSync('projects.js', js);
console.log('Restored dblclick and removed flip from openCard');
