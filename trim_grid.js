const fs = require('fs');

// 1. Update CSS to 2 columns
let css = fs.readFileSync('projects.css', 'utf8');
css = css.replace(/grid-template-columns: repeat\(3, 250px\);/g, 'grid-template-columns: repeat(2, 280px); /* 2 columns to match 6-card isometric view */');
css = css.replace(/gap: 30px;/g, 'gap: 40px;'); // slightly bigger gap
// Remove grid pattern background to match pure black from image
css = css.replace(/\.bg-grid-pattern \{[\s\S]*?\}/, '.bg-grid-pattern { display: none; } body { background-color: #000; }');
fs.writeFileSync('projects.css', css);

// 2. Update HTML to only have 6 cards
let html = fs.readFileSync('projects.html', 'utf8');

// We have exactly 9 card-wrappers right now.
// We want to keep the first 6 and delete the last 3.
let wrapperCount = 0;
html = html.replace(/<div class="card-wrapper">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g, (match) => {
    wrapperCount++;
    if (wrapperCount <= 6) {
        return match;
    }
    return ''; // remove 7, 8, 9
});

fs.writeFileSync('projects.html', html);
console.log('Trimmed to 6 cards and 2 columns');
