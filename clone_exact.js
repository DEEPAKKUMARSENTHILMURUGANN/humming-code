const fs = require('fs');

// 1. Get the exact 6 cards HTML from index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');
const inlineGridMatch = indexHtml.match(/<div class="inline-grid-container">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/);
if (!inlineGridMatch) {
    console.error('Could not find inline-grid-container in index.html');
    process.exit(1);
}
let cardsHtml = inlineGridMatch[1];

// 2. Replace projects.html grid-container content with these exact 6 cards
let projectsHtml = fs.readFileSync('projects.html', 'utf8');
projectsHtml = projectsHtml.replace(/<div class="grid-container">[\s\S]*?<\/div>\s*<\/div>\s*<!-- ============ MODAL ============ -->/, 
    `<div class="grid-container">\n${cardsHtml}    </div>\n    </div>\n\n    <!-- ============ MODAL ============ -->`);
fs.writeFileSync('projects.html', projectsHtml);

// 3. Make projects.css exactly match the styles.css inline-scene and inline-grid-container
let css = fs.readFileSync('projects.css', 'utf8');

// Update .scene
css = css.replace(/\.scene\s*\{[\s\S]*?\}/, `.scene {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    perspective: 2000px;
    z-index: 1;
}`);

// Update .grid-container
css = css.replace(/\.grid-container\s*\{[\s\S]*?\}/, `.grid-container {
    display: grid;
    grid-template-columns: repeat(3, 270px);
    gap: 30px;
    transform-style: preserve-3d;
    transform: rotateX(55deg) rotateZ(-45deg);
    transition: opacity 0.4s ease;
}`);

// Update .card-wrapper
css = css.replace(/\.card-wrapper\s*\{[\s\S]*?\}/, `.card-wrapper {
    width: 270px;
    height: 380px;
    perspective: 1000px;
    transform-style: preserve-3d;
}`);

// Remove front-buttons CSS if any
css = css.replace(/\.front-buttons\s*\{[\s\S]*?\}/g, '');
css = css.replace(/\.front-about-btn\s*\{[\s\S]*?\}/g, '');
css = css.replace(/\.front-github-btn\s*\{[\s\S]*?\}/g, '');

fs.writeFileSync('projects.css', css);
console.log('Successfully cloned landing page layout and cards to projects page!');
