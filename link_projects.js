const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

if (!html.includes('<link rel="stylesheet" href="projects.css">')) {
    html = html.replace('</head>', '    <link rel="stylesheet" href="projects.css">\n</head>');
}

if (!html.includes('<script src="projects.js"')) {
    html = html.replace('</body>', '    <script src="projects.js" defer></script>\n</body>');
}

fs.writeFileSync('index.html', html);
console.log('Linked projects.css and projects.js');
