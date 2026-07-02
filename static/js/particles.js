/**
 * GOAT Royalties - Premium Particle Effects
 * Floating gold particles and crown motifs
 */

(function() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  
  // Resize canvas
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  
  // Particle class
  class Particle {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedY = Math.random() * 0.5 + 0.1;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.glow = Math.random() > 0.7;
      this.type = Math.random() > 0.9 ? 'crown' : 'circle';
    }
    
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      
      if (this.y < -10) {
        this.y = canvas.height + 10;
        this.x = Math.random() * canvas.width;
      }
    }
    
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      
      if (this.type === 'crown') {
        // Draw small crown
        ctx.fillStyle = '#d4a03c';
        ctx.font = `${this.size * 4}px serif`;
        ctx.fillText('👑', this.x, this.y);
      } else {
        // Draw glowing circle
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 2
        );
        gradient.addColorStop(0, 'rgba(212, 160, 60, 0.8)');
        gradient.addColorStop(1, 'rgba(212, 160, 60, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Core
        ctx.fillStyle = '#f0c040';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    }
  }
  
  // Create particles
  function init() {
    particles = [];
    const count = Math.min(80, Math.floor(canvas.width * canvas.height / 15000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }
  
  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    animationId = requestAnimationFrame(animate);
  }
  
  // Start
  init();
  animate();
  
  // Pause when not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
})();