export class Plane {
  constructor(public x: number, public y: number) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Draw plane body
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(10, 15);
    ctx.lineTo(-10, 15);
    ctx.closePath();
    ctx.fill();

    // Draw wings
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.moveTo(-20, 5);
    ctx.lineTo(20, 5);
    ctx.lineTo(0, -5);
    ctx.closePath();
    ctx.fill();

    // Add engine glow
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(0, 15, 0, 0, 15, 10);
    gradient.addColorStop(0, 'rgba(255, 165, 0, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 165, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.arc(0, 15, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

export class Target {
  speed: number;
  angle: number;

  constructor(public x: number, public y: number) {
    this.speed = Math.random() * 2 + 1;
    this.angle = Math.random() * Math.PI * 2;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    // Bounce off walls
    if (this.x < 20 || this.x > 780) {
      this.angle = Math.PI - this.angle;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Draw tank body
    ctx.fillStyle = '#4b5563';
    ctx.fillRect(-15, -10, 30, 20);

    // Draw tank turret
    ctx.fillStyle = '#374151';
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();

    // Draw tank cannon
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(8, -2, 10, 4);

    // Add tracks
    ctx.fillStyle = '#000000';
    ctx.fillRect(-15, -12, 30, 2);
    ctx.fillRect(-15, 10, 30, 2);

    ctx.restore();
  }
}

export class Missile {
  speed: number = 8;

  constructor(public x: number, public y: number) {}

  update() {
    this.y -= this.speed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Draw missile body
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-2, -8, 4, 16);

    // Draw missile head
    ctx.beginPath();
    ctx.moveTo(-2, -8);
    ctx.lineTo(2, -8);
    ctx.lineTo(0, -12);
    ctx.closePath();
    ctx.fill();

    // Add missile trail
    const gradient = ctx.createLinearGradient(0, 0, 0, 20);
    gradient.addColorStop(0, 'rgba(251, 191, 36, 0.8)');
    gradient.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(-2, 8, 4, 20);

    ctx.restore();
  }
}