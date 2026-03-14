(function () {
    const COLORS = [
        { trail: '#4af7c4', glow: 'rgba(74,247,196,0.35)' },
        { trail: '#7b6ef6', glow: 'rgba(123,110,246,0.35)' },
        { trail: '#f74a4a', glow: 'rgba(247,74,74,0.30)' },
        { trail: '#4ab8f7', glow: 'rgba(74,184,247,0.30)' },
        { trail: '#f7c44a', glow: 'rgba(247,196,74,0.30)' },
    ];

    const canvas = document.createElement('canvas');
    canvas.id = 'spinjitzu-canvas';
    // z-index:1 keeps it strictly behind all content (sections are z-index:10)
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;opacity:0.55';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Spinjitzu {
        constructor(initial = false) { this.reset(initial); }

        reset(initial = false) {
            const c = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.color = c.trail;
            this.glow = c.glow;
            this.dir = Math.random() < 0.5 ? 1 : -1;
            this.x = this.dir === 1 ? -120 : W + 120;
            this.y = initial ? Math.random() * H : 80 + Math.random() * (H - 160);
            this.speed = 2.5 + Math.random() * 3.5;
            this.wobble = Math.random() * 0.6 + 0.2;
            this.wFreq = 0.02 + Math.random() * 0.03;
            this.t = Math.random() * Math.PI * 2;
            this.angle = 0;
            this.spin = (0.12 + Math.random() * 0.18) * (Math.random() < 0.5 ? 1 : -1);
            this.baseR = 18 + Math.random() * 22;
            this.r = this.baseR;
            this.pulse = 0;
            this.trail = [];
            this.maxTrail = 28 + Math.floor(Math.random() * 20);
        }

        update() {
            this.t += this.wFreq;
            this.pulse += 0.07;
            this.x += this.speed * this.dir;
            this.y += Math.sin(this.t) * this.wobble;
            this.angle += this.spin;
            this.r = this.baseR + Math.sin(this.pulse) * 4;
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > this.maxTrail) this.trail.shift();
            if (this.dir === 1 && this.x > W + 140) this.reset();
            if (this.dir === -1 && this.x < -140) this.reset();
        }

        draw(ctx) {
            const len = this.trail.length;
            if (len < 2) return;

            for (let i = 1; i < len; i++) {
                const a = i / len;
                const p0 = this.trail[i - 1];
                const p1 = this.trail[i];
                ctx.save();
                ctx.globalAlpha = a * 0.45;
                ctx.strokeStyle = this.color;
                ctx.lineWidth = a * this.r * 0.55;
                ctx.lineCap = 'round';
                ctx.shadowColor = this.glow;
                ctx.shadowBlur = 18 * a;
                ctx.beginPath();
                ctx.moveTo(p0.x, p0.y);
                ctx.lineTo(p1.x, p1.y);
                ctx.stroke();
                ctx.restore();
            }

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);

            const r = this.r;
            for (let arm = 0; arm < 4; arm++) {
                ctx.save();
                ctx.rotate((arm / 4) * Math.PI * 2);
                const g = ctx.createLinearGradient(0, 0, r * 1.1, 0);
                g.addColorStop(0, this.color);
                g.addColorStop(1, 'transparent');
                ctx.globalAlpha = 0.82;
                ctx.strokeStyle = g;
                ctx.lineWidth = r * 0.28;
                ctx.lineCap = 'round';
                ctx.shadowColor = this.glow;
                ctx.shadowBlur = 22;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(r * 0.4, -r * 0.3, r * 0.9, -r * 0.1, r * 1.1, r * 0.2);
                ctx.stroke();
                ctx.restore();
            }

            const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.45);
            cg.addColorStop(0, '#ffffff');
            cg.addColorStop(0.35, this.color);
            cg.addColorStop(1, 'transparent');
            ctx.globalAlpha = 0.9;
            ctx.fillStyle = cg;
            ctx.shadowColor = this.glow;
            ctx.shadowBlur = 30;
            ctx.beginPath();
            ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    const MAX = 5;
    const pool = [new Spinjitzu(true)];
    setTimeout(() => pool.push(new Spinjitzu(false)), 1800);

    function maybeSpawn() {
        if (pool.length < MAX && Math.random() < 0.008) pool.push(new Spinjitzu(false));
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        maybeSpawn();
        for (const s of pool) { s.update(); s.draw(ctx); }
        requestAnimationFrame(loop);
    }
    loop();
})();