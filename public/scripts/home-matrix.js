(() => {
	const chars =
		'!"#$%&\'()*+,-./:;<=>?[\\]^_{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const matrixFont =
		'"Matrix Code NFI", "Atkinson", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

	const canvas = document.getElementById('matrix-bg');
	if (!(canvas instanceof HTMLCanvasElement)) return;

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		canvas.style.display = 'none';
		return;
	}

	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	let animationId = 0;
	let lastTime = 0;
	const cols = [];
	const fontSize = 22;
	const speed = 80;
	const trailLen = 18;
	let width = 0;
	let height = 0;

	function randomChar() {
		return chars[Math.floor(Math.random() * chars.length)];
	}

	function resize() {
		const dpr = window.devicePixelRatio || 1;
		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = Math.round(width * dpr);
		canvas.height = Math.round(height * dpr);
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		cols.length = 0;
		for (let i = 0; i < Math.ceil(width / fontSize); i += 1) {
			const y = Math.random() * height;
			const row = Math.floor(y / fontSize);
			cols[i] = {
				y,
				drops: [{ y: row * fontSize, c: randomChar() }],
			};
		}
	}

	function draw(now) {
		const dt = lastTime ? (now - lastTime) / 200 : 0;
		lastTime = now;

		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, width, height);
		ctx.font = `${fontSize}px ${matrixFont}`;

		for (let i = 0; i < cols.length; i += 1) {
			const col = cols[i];
			const x = Math.round(i * fontSize);

			const prevRow = Math.floor(col.y / fontSize);
			col.y += speed * dt;
			const currRow = Math.floor(col.y / fontSize);

			for (let row = prevRow + 1; row <= currRow; row += 1) {
				const dropY = row * fontSize;
				col.drops.unshift({ y: dropY, c: randomChar() });
			}

			while (col.drops.length > trailLen) col.drops.pop();

			for (let j = col.drops.length - 1; j >= 0; j -= 1) {
				const opacity = j === 0 ? 1 : 0.2 + 0.6 * (1 - j / trailLen);
				ctx.fillStyle = `rgba(0, 255, 65, ${opacity})`;
				ctx.fillText(col.drops[j].c, x, col.drops[j].y);
			}

			if (col.y > height && Math.random() > 0.975) {
				col.y = 0;
				col.drops = [{ y: 0, c: randomChar() }];
			}
		}

		animationId = window.requestAnimationFrame(draw);
	}

	resize();
	animationId = window.requestAnimationFrame(draw);
	window.addEventListener('resize', resize);

	document.addEventListener('visibilitychange', () => {
		if (document.hidden) {
			window.cancelAnimationFrame(animationId);
			return;
		}
		lastTime = 0;
		animationId = window.requestAnimationFrame(draw);
	});

	document.addEventListener('mousemove', (event) => {
		document.body.style.setProperty('--matrix-mx', `${event.clientX}px`);
		document.body.style.setProperty('--matrix-my', `${event.clientY}px`);
	});
})();
