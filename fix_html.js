const fs = require('fs');
let html = fs.readFileSync('projects.html', 'utf8');

// Replace card inner structure
html = html.replace(/<div class="card-inner">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g, (match, inner) => {
    // Extract href
    let hrefMatch = inner.match(/href="([^"]+)"/);
    let href = hrefMatch ? hrefMatch[1] : '';
    
    // Extract front
    let frontMatch = inner.match(/<div class="card-front">([\s\S]*?)<\/div>/);
    let front = frontMatch ? frontMatch[1] : '';
    
    // If no href, just keep front as is
    let linkHTML = href ? `<a href="${href}" target="_blank" class="front-github-btn">View on GitHub</a>` : '';
    
    return `<div class="card-inner">
                        <div class="card-front">${front}${linkHTML}</div>
                    </div>
                </div>
            </div>`;
});

fs.writeFileSync('projects.html', html);
console.log('Fixed HTML');
