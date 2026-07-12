document.addEventListener('DOMContentLoaded', () => {
    // ========================
    // HERO CANVAS PARTICLES
    // ========================
    initParticleCanvas('hero-canvas', {
        primaryColor: 'rgba(255, 255, 255, 0.4)',
        accentColor: 'rgba(255, 60, 60, 0.8)',
        accentChance: 0.85,
        lineColor: 'rgba(255, 255, 255, 0.15)',
        scrollAwareY: true
    });

    // ========================
    // FACTORY CANVAS PARTICLES
    // ========================
    window.initFactoryParticles = function() {
        const existing = window._factoryParticleLoop;
        if (existing) return;
        initParticleCanvas('factory-canvas', {
            primaryColor: 'rgba(255, 255, 255, 0.25)',
            accentColor: 'rgba(255, 60, 60, 0.7)',
            accentChance: 0.75, // 25% are red
            lineColor: 'rgba(255, 60, 60, 0.08)',
            scrollAwareY: false,
            isFactory: true
        });
    };
});

function initParticleCanvas(canvasId, opts) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        const container = canvas.parentElement;
        width = container ? container.clientWidth || window.innerWidth : window.innerWidth;
        height = container ? container.clientHeight || window.innerHeight : window.innerHeight;
        // Fallback for hidden containers
        if (height < 10) height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resize);
    resize();

    // Mouse tracking
    const mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = opts.scrollAwareY ? event.clientY + window.scrollY : event.clientY;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.2;
            this.vy = (Math.random() - 0.5) * 1.2;
            this.size = Math.random() * 2 + 0.5;
            const isAccent = Math.random() > opts.accentChance;
            this.color = isAccent ? opts.accentColor : opts.primaryColor;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            if (mouse.x !== undefined && mouse.y !== undefined) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const fx = dx / dist;
                    const fy = dy / dist;
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= fx * force * 5;
                    this.y -= fy * force * 5;
                }
            }
        }
    }

    const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 12000);
    const particles = [];
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    let animId;
    function animate() {
        animId = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    const opacity = 1 - dist / 120;
                    ctx.strokeStyle = opts.lineColor.replace('0.1', `${opacity * 0.15}`).replace('0.15', `${opacity * 0.15}`);
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    animate();

    // Store reference for factory canvas so we can resize it on demand
    if (opts.isFactory) {
        window._factoryResizer = resize;
        window._factoryParticleLoop = animId;
    }
}
