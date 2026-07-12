const fs = require('fs');

// 1. Get the 3 deleted cards from rollback.js
let rollback = fs.readFileSync('rollback.js', 'utf8');
const card7Match = rollback.match(/<div class="card-wrapper">[\s\S]*?<div class="card" data-title="Brains Trust Club"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/);
const card8Match = rollback.match(/<div class="card-wrapper">[\s\S]*?<div class="card" data-title="GitHub Campus Club"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/);
const card9Match = rollback.match(/<div class="card-wrapper">[\s\S]*?<div class="card" data-title="Education"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/);

const card7 = card7Match ? card7Match[0] : '';
const card8 = card8Match ? card8Match[0] : '';
const card9 = card9Match ? card9Match[0] : '';

// 2. Append them to projects.html
let html = fs.readFileSync('projects.html', 'utf8');
html = html.replace(/<\/div>\s*<\/div>\s*<!-- ============ MODAL ============ -->/, 
    `\n${card7}\n${card8}\n${card9}\n        </div>\n    </div>\n\n    <!-- ============ MODAL ============ -->`);

// 3. Apply front-buttons transformation to the newly added cards (only those that still have card-back)
html = html.replace(/<div class="card-inner">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g, (match, inner) => {
    if (match.includes('github-btn') && match.includes('card-back')) { 
        const hrefMatch = match.match(/href="([^"]*)"/);
        const href = hrefMatch ? hrefMatch[1] : '#';
        const titleMatch = match.match(/<h3>([^<]*)<\/h3>/);
        const title = titleMatch ? titleMatch[1] : '';
        const imgMatch = match.match(/<div class="card-content (img-\d+)"><\/div>/);
        const imgClass = imgMatch ? imgMatch[1] : 'img-1';
        
        return `<div class="card-inner">
            <div class="card-front">
                <div class="card-content ${imgClass}"></div>
                <h3 class="front-title">${title}</h3>
                <div class="front-buttons">
                    <button class="front-about-btn">About</button>
                    <a href="${href}" target="_blank" class="front-github-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        GitHub
                    </a>
                </div>
            </div>
        </div>
    </div>`;
    }
    return match;
});

fs.writeFileSync('projects.html', html);

// 4. Update CSS back to 3 columns and landing page rotation
let css = fs.readFileSync('projects.css', 'utf8');
css = css.replace(/grid-template-columns: repeat\(2, 280px\);[^\n]*/g, 'grid-template-columns: repeat(3, 270px);');
css = css.replace(/transform: rotateX\(60deg\) rotateZ\(-45deg\) scale\(0\.9\);/g, 'transform: rotateX(55deg) rotateZ(-45deg);');
fs.writeFileSync('projects.css', css);

console.log('Restored 9 cards and landing page CSS');
