const fs = require('fs');
let cssTxt = fs.readFileSync('cert_css.txt', 'utf8');
let mainCss = fs.readFileSync('styles.css', 'utf8');

if (!mainCss.includes('.cert-carousel{')) {
    fs.appendFileSync('styles.css', '\n\n' + cssTxt);
    console.log('Appended cert CSS to styles.css');
}

let jsTxt = fs.readFileSync('cert-slider.js', 'utf8');
if (!jsTxt.includes('backButton.style.display')) {
    jsTxt = jsTxt.replace("carousel.classList.add('showDetail');", "carousel.classList.add('showDetail');\n        if(backButton) backButton.style.display = 'block';");
    jsTxt = jsTxt.replace("carousel.classList.remove('showDetail');", "carousel.classList.remove('showDetail');\n    if(backButton) backButton.style.display = 'none';");
    fs.writeFileSync('cert-slider.js', jsTxt);
    console.log('Updated cert-slider.js');
}
