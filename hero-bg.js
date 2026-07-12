document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas to full window size initially
    let width, height;
    function resize() {
        // Find the .hero section height
        const heroSection = document.querySelector('.hero');
        width = window.innerWidth;
        height = heroSection ? heroSection.offsetHeight : window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    window.addEventListener('resize', resize);
    resize();

    // Mouse tracking
    const mouse = {
        x: null,
        y: null,
        radius: 150 // Area of effect
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        // Adjust for scroll since canvas is absolute to the hero section, not fixed to screen
        mouse.y = event.y + window.scrollY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Velocity
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            
            // Randomly choose color: mostly white/grey, some red
            const isRed = Math.random() > 0.85;
            this.color = isRed ? 'rgba(255, 60, 60, 0.8)' : 'rgba(255, 255, 255, 0.4)';
            this.size = Math.random() * 2 + 1;
            
            // Base positions for repulsion return
            this.baseX = this.x;
            this.baseY = this.y;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Movement
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse repulsion
            if (mouse.x !== undefined && mouse.y !== undefined) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    // Push away
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    
                    // The closer the mouse, the stronger the push
                    const force = (mouse.radius - distance) / mouse.radius;
                    
                    // Apply force (repulsion)
                    this.x -= forceDirectionX * force * 5;
                    this.y -= forceDirectionY * force * 5;
                }
            }
        }
    }

    // Initialize particles
    const particles = [];
    const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 15000); // Responsive count
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Draw connecting lines
            for (let j = i; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctx.beginPath();
                    // Line opacity based on distance
                    const opacity = 1 - (distance / 120);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Start animation
    animate();
});
