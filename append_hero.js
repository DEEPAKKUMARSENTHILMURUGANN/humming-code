const fs = require('fs');

let css = fs.readFileSync('styles.css', 'utf8');

// Replace everything related to .hero, .hero-left, .hero-right, .hero-name, .hero-bg-text, etc.
// But wait, the easiest way is just to append overrides to the end of styles.css since CSS cascades.

const overrides = `
/* HERO SECTION REBUILD */
.hero {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 100vh;
    padding: 0 8%;
    background-color: #0a0a0a;
    position: relative;
    overflow: hidden;
}

.hero::after {
    content: '';
    position: absolute;
    bottom: -100px;
    right: 10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(255, 0, 85, 0.15) 0%, rgba(10, 10, 10, 0) 70%);
    z-index: 0;
    pointer-events: none;
}

.hero-left {
    flex: 1;
    z-index: 2;
    padding-top: 100px; /* offset for navbar */
}

.hero-name {
    font-size: 5.5rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    letter-spacing: -2px;
    font-family: 'Inter', sans-serif;
    color: #fff;
}

.highlight-red {
    color: #ff0055;
}

.hero-desc {
    color: #a0a0a0;
    font-size: 1.1rem;
    line-height: 1.8;
    max-width: 600px;
    margin-bottom: 2.5rem;
    font-weight: 400;
}

.hero-right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    position: relative;
    height: 100vh;
}

.hero-bg-text {
    position: absolute;
    top: 50%;
    left: 45%;
    transform: translate(-50%, -50%);
    font-size: 18vw;
    font-weight: 900;
    white-space: nowrap;
    z-index: 1;
    display: flex;
    font-family: 'Inter', sans-serif;
    pointer-events: none;
}

.bg-text-filled {
    color: #ffffff;
}

.bg-text-outline {
    color: transparent;
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1);
}

.hero-photo {
    position: relative;
    z-index: 2;
    max-height: 85vh;
    object-fit: contain;
    bottom: 0;
}

.stamp-container {
    position: absolute;
    bottom: 15%;
    left: 20%;
    width: 120px;
    height: 120px;
    z-index: 3;
    animation: rotateStamp 10s linear infinite;
}

.rotating-stamp {
    width: 100%;
    height: 100%;
    fill: #fff;
}

.stamp-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ff0055;
    color: #fff;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2rem;
}

@keyframes rotateStamp {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

fs.appendFileSync('styles.css', '\\n\\n' + overrides);
console.log('Appended hero overrides to styles.css');
