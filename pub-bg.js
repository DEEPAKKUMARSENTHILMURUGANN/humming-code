
document.addEventListener('DOMContentLoaded', () => {
    const pubSection = document.getElementById('publications');
    if (!pubSection) return;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'pub-canvas-bg';
    pubSection.insertBefore(canvas, pubSection.firstChild);

    Object.assign(canvas.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '0',
        pointerEvents: 'none',
        opacity: '0.8'
    });

    pubSection.style.position = 'relative';

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    let mouse = { x: -9999, y: -9999 };

    function resize() {
        width = pubSection.offsetWidth;
        height = pubSection.offsetHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }

    window.addEventListener('resize', resize);
    
    pubSection.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    pubSection.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.baseColor = 'rgba(255, 60, 60, ';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.baseColor + '0.5)';
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const numParticles = Math.floor((width * height) / 15000);
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }

    function drawGlow() {
        if (mouse.x < 0 || mouse.y < 0) return;
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 300);
        gradient.addColorStop(0, 'rgba(255, 60, 60, 0.15)');
        gradient.addColorStop(1, 'rgba(255, 60, 60, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        drawGlow();

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Connect particles
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 60, 60, ${0.2 - dist / 600})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            // Connect to mouse
            const dxMouse = particles[i].x - mouse.x;
            const dyMouse = particles[i].y - mouse.y;
            const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

            if (distMouse < 200) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = `rgba(255, 120, 120, ${0.4 - distMouse / 500})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        }
        requestAnimationFrame(animate);
    }

    resize();
    animate();
});
