const fs = require('fs');

let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deepakkumar's Projects - 3D Grid</title>
    <link rel="stylesheet" href="projects.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="bg-grid-pattern"></div>
    <nav class="navbar">
        <a href="index.html" class="back-link">&larr; Back to Portfolio</a>
        <div class="logo">Projects.</div>
    </nav>

    <div class="scene">
        <div class="grid-container">

            <div class="card-wrapper">
                <div class="card" data-title="Schedulix AI" data-desc="AI Timetable Scheduler">
                    <div class="card-inner">
                        <div class="card-front">
                            <div class="card-content img-1"></div>
                            <a href="https://github.com/aishwarya-r29/schedulix-ai-timetable-scheduler" target="_blank" class="front-github-btn">View on GitHub</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-wrapper">
                <div class="card" data-title="Academic Authenticity" data-desc="Validator Project">
                    <div class="card-inner">
                        <div class="card-front">
                            <div class="card-content img-2"></div>
                            <a href="https://github.com/Pravinthaa/Academic-authenticity-validator" target="_blank" class="front-github-btn">View on GitHub</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-wrapper">
                <div class="card" data-title="SKYE" data-desc="Project SKYE">
                    <div class="card-inner">
                        <div class="card-front">
                            <div class="card-content img-3"></div>
                            <a href="https://github.com/DEEPAKKUMARSENTHILMURUGANN/SKYE" target="_blank" class="front-github-btn">View on GitHub</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-wrapper">
                <div class="card" data-title="Modern Life Feud" data-desc="Feud Game Project">
                    <div class="card-inner">
                        <div class="card-front">
                            <div class="card-content img-4"></div>
                            <a href="https://github.com/DEEPAKKUMARSENTHILMURUGANN/modernlifefeud" target="_blank" class="front-github-btn">View on GitHub</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-wrapper">
                <div class="card" data-title="CSEA-VR" data-desc="Virtual Reality Project">
                    <div class="card-inner">
                        <div class="card-front">
                            <div class="card-content img-5"></div>
                            <a href="https://github.com/DEEPAKKUMARSENTHILMURUGANN/CSEA-VR" target="_blank" class="front-github-btn">View on GitHub</a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <!-- Local Libraries -->
    <script src="libs/gsap.min.js"></script>
    <script src="libs/Flip.min.js"></script>
    
    <!-- Custom Script -->
    <script src="projects.js"></script>
</body>
</html>`;

fs.writeFileSync('projects.html', html);
console.log('Fixed projects.html');
