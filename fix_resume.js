const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Fix resume link
html = html.replace(/<a class="nav-link nav-btn" href="resume.pdf"/g, '<a class="nav-link nav-btn" href="Resume.pdf"');

// Fix the accidental insertion
html = html.replace(/<a class="nav-link nav-btn" href="Resume.pdf" target="_blank"\r?\n\s*style="font-weight: 500; letter-spacing: 1px;">MY RESUME<\/a>\r?\n\s*<h2 class="page-heading">3\. SYSTEM AND SPECIFICATION<\/h2>/g, 
    '<h2 class="page-heading">3. SYSTEM AND SPECIFICATION</h2>');

fs.writeFileSync('index.html', html);
console.log('Fixed Resume URL');
