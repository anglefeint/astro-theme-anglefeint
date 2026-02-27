			(function() {
				function init() {
				// 阅读进度条
				var progress = document.querySelector('.mesh-read-progress');
				var article = document.querySelector('.mesh-article');
				var toast = document.querySelector('.mesh-stage-toast');
				var stageSeen = { p30: false, p60: false, p90: false };
				var toastTimer = 0;
				var hasScrolled = false;
				function showStageToast(msg) {
					if (!toast) return;
					toast.textContent = msg;
					toast.classList.add('visible');
					clearTimeout(toastTimer);
					toastTimer = setTimeout(function() {
						toast.classList.remove('visible');
					}, 900);
				}
				if (progress) {
					function onScroll() {
						var scrollTop = window.scrollY || document.documentElement.scrollTop;
						var scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
						var p = scrollHeight > 0 ? Math.min(1, scrollTop / scrollHeight) : 1;
						progress.style.setProperty('--read-progress', String(p));
						var btn = document.querySelector('.mesh-back-to-top');
						if (btn) btn.classList.toggle('visible', scrollTop > 400);
						if (!hasScrolled && scrollTop > 6) hasScrolled = true;
						if (!hasScrolled) return;
						if (!stageSeen.p30 && p >= 0.3) {
							stageSeen.p30 = true;
							showStageToast('context parsed');
						}
						if (!stageSeen.p60 && p >= 0.6) {
							stageSeen.p60 = true;
							showStageToast('inference stable');
						}
						if (!stageSeen.p90 && p >= 0.9) {
							stageSeen.p90 = true;
							showStageToast('output finalized');
						}
					}
					onScroll();
					window.addEventListener('scroll', onScroll, { passive: true });
				}
				var backTop = document.querySelector('.mesh-back-to-top');
				if (backTop) {
					backTop.addEventListener('click', function() {
						window.scrollTo({ top: 0, behavior: 'smooth' });
					});
				}
				function initHeroCanvas() {
					var shell = document.querySelector('.hero-shell');
					if (!shell) return;
					var canvas = shell.querySelector('.hero-canvas');
					var wrap = shell.querySelector('.hero-canvas-wrap');
					if (!canvas || !wrap) return;
					var src = canvas.getAttribute('data-hero-src');
					if (!src) return;

					var heroStart = 0;
					var heroRaf = 0;
					// offscreen canvas for base image
					var baseCanvas = document.createElement('canvas');
					var baseCtx = baseCanvas.getContext('2d');
					// offscreen canvas reused for pixelation
					var pixelCanvas = document.createElement('canvas');
					var pixelCtx = pixelCanvas.getContext('2d');
					// offscreen canvas reused for static bursts
					var noiseCanvas = document.createElement('canvas');
					var noiseCtx = noiseCanvas.getContext('2d');
					// offscreen canvas for edge detection
					var edgeCanvas = document.createElement('canvas');
					var edgeCtx = edgeCanvas.getContext('2d');
					var edgeReady = false;

					// Phase timing (seconds)
					var EDGE_PHASE = 1.8;      // show edge detection
					var REVEAL_PHASE = 2.5;     // progressive reveal (pixelated -> sharp)
					var INTRO_END = EDGE_PHASE + REVEAL_PHASE; // after this, ongoing glitch

					function sizeCanvas() {
						var rect = shell.querySelector('.hero-stack').getBoundingClientRect();
						var dpr = Math.min(window.devicePixelRatio || 1, 2);
						canvas.width = Math.max(2, Math.round(rect.width * dpr));
						canvas.height = Math.max(2, Math.round(rect.height * dpr));
						canvas.style.width = rect.width + 'px';
						canvas.style.height = rect.height + 'px';
						noiseCanvas.width = canvas.width;
						noiseCanvas.height = 64;
					}

					function drawBase(ctx, img, w, h) {
						var iw = img.width, ih = img.height;
						var scale = Math.max(w / iw, h / ih);
						var sw = w / scale, sh = h / scale;
						var sx = (iw - sw) / 2, sy = (ih - sh) / 2;
						ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
					}

					function buildEdge(img) {
						var w = canvas.width, h = canvas.height;
						edgeCanvas.width = w;
						edgeCanvas.height = h;
						baseCanvas.width = w;
						baseCanvas.height = h;
						drawBase(baseCtx, img, w, h);
						drawBase(edgeCtx, img, w, h);
						// Sobel edge detection
						var src = edgeCtx.getImageData(0, 0, w, h);
						var d = src.data;
						var out = edgeCtx.createImageData(w, h);
						var od = out.data;
						for (var y = 1; y < h - 1; y++) {
							for (var x = 1; x < w - 1; x++) {
								var idx = function(px, py) { return ((py * w) + px) * 4; };
								var i = idx(x, y);
								// grayscale neighbors
								function luma(px, py) {
									var j = idx(px, py);
									return d[j] * 0.299 + d[j+1] * 0.587 + d[j+2] * 0.114;
								}
								var gx = -luma(x-1,y-1) - 2*luma(x-1,y) - luma(x-1,y+1)
								         + luma(x+1,y-1) + 2*luma(x+1,y) + luma(x+1,y+1);
								var gy = -luma(x-1,y-1) - 2*luma(x,y-1) - luma(x+1,y-1)
								         + luma(x-1,y+1) + 2*luma(x,y+1) + luma(x+1,y+1);
								var mag = Math.min(255, Math.sqrt(gx * gx + gy * gy));
								// cyan-tinted edges
								od[i]   = Math.min(255, mag * 0.4);
								od[i+1] = Math.min(255, mag * 0.85);
								od[i+2] = Math.min(255, mag * 1.0);
								od[i+3] = mag > 20 ? Math.min(255, mag * 1.5) : 0;
							}
						}
						edgeCtx.putImageData(out, 0, 0);
						edgeReady = true;
					}

					function heroRender(t) {
						if (!heroStart) heroStart = t;
						var elapsed = (t - heroStart) * 0.001;
						var ctx = canvas.getContext('2d');
						if (!ctx || !canvas.img) { heroRaf = requestAnimationFrame(heroRender); return; }
						var w = canvas.width, h = canvas.height;

						ctx.clearRect(0, 0, w, h);

						if (elapsed < EDGE_PHASE && edgeReady) {
							// Phase 1: Edge detection wireframe
							var edgeFade = Math.min(1, elapsed / 0.5);
							// dark background
							ctx.fillStyle = 'rgba(8, 16, 28, 1)';
							ctx.fillRect(0, 0, w, h);
							// draw edges with fade-in
							ctx.globalAlpha = edgeFade;
							ctx.drawImage(edgeCanvas, 0, 0);
							ctx.globalAlpha = 1;
							// scanning line
							var scanY = (elapsed / EDGE_PHASE) * h;
							ctx.fillStyle = 'rgba(120, 220, 255, 0.3)';
							ctx.fillRect(0, scanY - 1, w, 2);
							var scanGlow = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
							scanGlow.addColorStop(0, 'rgba(120, 220, 255, 0)');
							scanGlow.addColorStop(0.5, 'rgba(120, 220, 255, 0.15)');
							scanGlow.addColorStop(1, 'rgba(120, 220, 255, 0)');
							ctx.fillStyle = scanGlow;
							ctx.fillRect(0, scanY - 30, w, 60);

						} else if (elapsed < INTRO_END) {
							// Phase 2: Progressive reveal — pixelated to sharp
							var revealT = (elapsed - EDGE_PHASE) / REVEAL_PHASE;
							// pixel size: starts large, shrinks to 1
							var maxBlock = 32;
							var blockSize = Math.max(1, Math.round(maxBlock * (1 - revealT * revealT)));
							// draw pixelated
							if (blockSize > 1) {
								var smallW = Math.max(1, Math.ceil(w / blockSize));
								var smallH = Math.max(1, Math.ceil(h / blockSize));
								if (pixelCanvas.width !== smallW || pixelCanvas.height !== smallH) {
									pixelCanvas.width = smallW;
									pixelCanvas.height = smallH;
								}
								pixelCtx.clearRect(0, 0, smallW, smallH);
								pixelCtx.drawImage(baseCanvas, 0, 0, smallW, smallH);
								ctx.imageSmoothingEnabled = false;
								ctx.drawImage(pixelCanvas, 0, 0, smallW, smallH, 0, 0, w, h);
								ctx.imageSmoothingEnabled = true;
							} else {
								ctx.drawImage(baseCanvas, 0, 0);
							}
							// fade out cyan tint
							var tintAlpha = 0.18 * (1 - revealT);
							ctx.globalCompositeOperation = 'screen';
							ctx.fillStyle = 'rgba(100, 200, 255, ' + tintAlpha + ')';
							ctx.fillRect(0, 0, w, h);
							ctx.globalCompositeOperation = 'source-over';

						} else {
							// Phase 3: Full image with ongoing scan + glitch
							ctx.drawImage(baseCanvas, 0, 0);

							// Scanlines
							ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
							for (var i = 0; i < h; i += 3) {
								ctx.fillRect(0, i, w, 1);
							}

							// Moving scan bar
							var scanPos = ((elapsed * 40) % (h + 60)) - 30;
							var barGrad = ctx.createLinearGradient(0, scanPos - 30, 0, scanPos + 30);
							barGrad.addColorStop(0, 'rgba(120, 220, 255, 0)');
							barGrad.addColorStop(0.5, 'rgba(120, 220, 255, 0.06)');
							barGrad.addColorStop(1, 'rgba(120, 220, 255, 0)');
							ctx.fillStyle = barGrad;
							ctx.fillRect(0, scanPos - 30, w, 60);

							// RGB channel glitch (random, ~8% of frames)
							if (Math.random() < 0.08) {
								var glitchY = Math.random() * h;
								var glitchH = 2 + Math.random() * 12;
								var shiftX = (Math.random() - 0.5) * 12;
								ctx.save();
								ctx.globalAlpha = 0.22;
								ctx.drawImage(
									baseCanvas,
									0,
									Math.floor(glitchY),
									w,
									Math.ceil(glitchH),
									Math.round(shiftX),
									Math.floor(glitchY),
									w,
									Math.ceil(glitchH)
								);
								ctx.restore();
							}

							// CRT horizontal retrace/dropout: occasional black line, starts 6s after load
							if (elapsed >= 6 && Math.random() < 0.025) {
								var dropoutY = Math.floor(Math.random() * h);
								var dropoutH = 2 + Math.floor(Math.random() * 2);
								ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
								ctx.fillRect(0, dropoutY, w, dropoutH);
							}

							// Brief static burst (~3% of frames)
							if (Math.random() < 0.03) {
								var burstY = Math.random() * h * 0.8;
								var burstH = 4 + Math.random() * 20;
								if (noiseCanvas.width !== w) {
									noiseCanvas.width = w;
									noiseCanvas.height = 64;
								}
								noiseCtx.clearRect(0, 0, noiseCanvas.width, noiseCanvas.height);
								for (var n = 0; n < 180; n++) {
									var nx = Math.random() * noiseCanvas.width;
									var ny = Math.random() * noiseCanvas.height;
									var nw = 1 + Math.random() * 3;
									var nh = 1 + Math.random() * 2;
									var alpha = 0.08 + Math.random() * 0.18;
									noiseCtx.fillStyle = 'rgba(160,220,255,' + alpha.toFixed(3) + ')';
									noiseCtx.fillRect(nx, ny, nw, nh);
								}
								ctx.drawImage(
									noiseCanvas,
									0,
									0,
									w,
									Math.ceil(Math.min(burstH, noiseCanvas.height)),
									0,
									Math.floor(burstY),
									w,
									Math.ceil(burstH)
								);
							}
						}

						heroRaf = requestAnimationFrame(heroRender);
					}

					var img = new Image();
					img.onload = function() {
						canvas.img = img;
						sizeCanvas();
						buildEdge(img);
						wrap.classList.add('ready');
						heroRaf = requestAnimationFrame(heroRender);
					};
					img.src = new URL(src, window.location.href).href;

					window.addEventListener('resize', function() {
						if (canvas.img) {
							sizeCanvas();
							buildEdge(canvas.img);
						}
					}, { passive: true });
					function onHeroVisibilityChange() {
						if (document.hidden) {
							if (heroRaf) cancelAnimationFrame(heroRaf);
							heroRaf = 0;
						} else if (canvas.img && !heroRaf) {
							heroRaf = requestAnimationFrame(heroRender);
						}
					}
					document.addEventListener('visibilitychange', onHeroVisibilityChange);
					window.addEventListener('beforeunload', function() { cancelAnimationFrame(heroRaf); }, { once: true });
				}
				initHeroCanvas();
			function initRedQueenTv() {
				var shell = document.querySelector('.rq-tv');
				var stage = document.querySelector('.rq-tv-stage');
				var toggle = document.querySelector('.rq-tv-toggle');
				if (!shell || !stage || !toggle) return;

				var source = stage.getAttribute('data-rq-src') || '';
				var source2 = stage.getAttribute('data-rq-src2') || '';
				if (!source) return;

				var OPEN_DELAY_MS = 500;
				var COLLAPSE_DELAY_MS = 260;
				var FRAME_MS = 33;
				var FALLBACK_STEP_MS = 650;
				var FALLBACK_GIF_SHOW_MS = 1400;
				var WARMUP_STATIC_MS = 1000;
				var PRELOAD_RETRY_MAX = 6;
				var PRELOAD_TIMEOUT_MS = 12000;
				var RETRY_BASE_MS = 220;
				var HIDDEN_POLL_MS = 140;

				var sequenceTimer = 0;
				var renderTimer = 0;
				var revealTimer = 0;
				var preloadTimeoutTimer = 0;
				var preloadRetryTimers = new Set();

				var start = 0;
				var width = 320;
				var height = 240;
				var canvas = null;
				var ctx = null;
				var currentFrame = null;
				var playToken = 0;
				var isPlaying = false;
				var isLoading = false;
				var pendingAutoPlay = false;
				var playlistIndex = 0;
				var imageCache = Object.create(null);
				var mediaDataCache = Object.create(null);
				var hasRevealed = false;
				var forceStaticUntil = 0;

				function guessImageType(url) {
					var clean = (url || '').split('?')[0].toLowerCase();
					if (clean.endsWith('.gif')) return 'image/gif';
					if (clean.endsWith('.webp')) return 'image/webp';
					if (clean.endsWith('.png')) return 'image/png';
					if (clean.endsWith('.jpg') || clean.endsWith('.jpeg')) return 'image/jpeg';
					return 'image/webp';
				}

				function resolveItemUrl(item) {
					return new URL(item.url, window.location.href).href;
				}

				var playlist = [{ url: source, type: guessImageType(source), holdLast: 360 }];
				if (source2) playlist.push({ url: source2, type: guessImageType(source2), holdLast: 500 });

				function setCollapsed(collapsed) {
					shell.classList.toggle('rq-tv-collapsed', collapsed);
					toggle.setAttribute('aria-expanded', String(!collapsed));
				}

				function setLoading(loading) {
					isLoading = loading;
					shell.classList.toggle('rq-tv-loading', loading);
					toggle.disabled = loading;
					toggle.setAttribute('aria-busy', String(loading));
				}

				function clearSequenceTimer() {
					if (!sequenceTimer) return;
					clearTimeout(sequenceTimer);
					sequenceTimer = 0;
				}

				function clearRenderTimer() {
					if (!renderTimer) return;
					clearTimeout(renderTimer);
					renderTimer = 0;
				}

				function clearPreloadTimers() {
					if (preloadTimeoutTimer) {
						clearTimeout(preloadTimeoutTimer);
						preloadTimeoutTimer = 0;
					}
					preloadRetryTimers.forEach(function(id) { clearTimeout(id); });
					preloadRetryTimers.clear();
				}

				function scheduleSequence(fn, delay) {
					clearSequenceTimer();
					sequenceTimer = setTimeout(function runTask() {
						if (document.hidden) {
							sequenceTimer = setTimeout(runTask, HIDDEN_POLL_MS);
							return;
						}
						fn();
					}, delay);
				}

				function schedulePreloadRetry(fn, delay) {
					var id = setTimeout(function() {
						preloadRetryTimers.delete(id);
						fn();
					}, delay);
					preloadRetryTimers.add(id);
				}

				function preloadGif(item, token, attempt, done) {
					if (token !== playToken || !isPlaying) return;
					var tryCount = typeof attempt === 'number' ? attempt : 0;
					var cachedData = mediaDataCache[item.url];
					if (cachedData instanceof ArrayBuffer) {
						if (typeof ImageDecoder === 'undefined') {
							done(true);
							return;
						}
						var cachedDecoder = new ImageDecoder({ data: cachedData, type: item.type });
						cachedDecoder.tracks.ready.then(async function() {
							var result = await cachedDecoder.decode({ frameIndex: 0 });
							if (result && result.image && result.image.close) result.image.close();
							done(true);
						}).catch(function() {
							if (tryCount >= PRELOAD_RETRY_MAX) {
								done(false);
								return;
							}
							var retryDelay = Math.min(1800, RETRY_BASE_MS * (tryCount + 1));
							schedulePreloadRetry(function() {
								preloadGif(item, token, tryCount + 1, done);
							}, retryDelay);
						});
						return;
					}
					fetch(resolveItemUrl(item))
						.then(function(response) { return response.arrayBuffer(); })
						.then(function(buffer) {
							mediaDataCache[item.url] = buffer;
							if (typeof ImageDecoder === 'undefined') {
								done(true);
								return;
							}
							var decoder = new ImageDecoder({ data: buffer, type: item.type });
							decoder.tracks.ready.then(async function() {
								var result = await decoder.decode({ frameIndex: 0 });
								if (result && result.image && result.image.close) result.image.close();
								done(true);
							}).catch(function() {
								if (tryCount >= PRELOAD_RETRY_MAX) {
									done(false);
									return;
								}
								var retryDelay = Math.min(1800, RETRY_BASE_MS * (tryCount + 1));
								schedulePreloadRetry(function() {
									preloadGif(item, token, tryCount + 1, done);
								}, retryDelay);
							});
						}).catch(function() {
							if (tryCount >= PRELOAD_RETRY_MAX) {
								done(false);
								return;
							}
							var retryDelay = Math.min(1800, RETRY_BASE_MS * (tryCount + 1));
							schedulePreloadRetry(function() {
								preloadGif(item, token, tryCount + 1, done);
							}, retryDelay);
						});
				}

				function preloadImage(item, token, attempt, done) {
					if (token !== playToken || !isPlaying) return;
					var tryCount = typeof attempt === 'number' ? attempt : 0;
					var cached = imageCache[item.url];
					if (cached && cached.complete) {
						done(true);
						return;
					}
					var img = new Image();
					img.onload = function() {
						imageCache[item.url] = img;
						done(true);
					};
					img.onerror = function() {
						if (tryCount >= PRELOAD_RETRY_MAX) {
							done(false);
							return;
						}
						var retryDelay = Math.min(1800, RETRY_BASE_MS * (tryCount + 1));
						schedulePreloadRetry(function() {
							preloadImage(item, token, tryCount + 1, done);
						}, retryDelay);
					};
					img.src = resolveItemUrl(item);
				}

				function preloadAssets(token, done) {
					clearPreloadTimers();
					var left = playlist.length;
					var failed = false;
					function finish(ok) {
						if (left <= -999) return;
						left = -1000;
						clearPreloadTimers();
						done(ok);
					}
					preloadTimeoutTimer = setTimeout(function() {
						finish(false);
					}, PRELOAD_TIMEOUT_MS);
					function markDone(ok) {
						if (!ok) failed = true;
						left -= 1;
						if (left <= 0) finish(!failed);
					}
					playlist.forEach(function(item) {
						if (item.type === 'image/gif') preloadGif(item, token, 0, markDone);
						else preloadImage(item, token, 0, markDone);
					});
				}

				function revealMonitor(token) {
					if (hasRevealed) return;
					hasRevealed = true;
					if (revealTimer) clearTimeout(revealTimer);
					revealTimer = setTimeout(function runReveal() {
						if (token !== playToken || !isPlaying) return;
						if (document.hidden) {
							revealTimer = setTimeout(runReveal, HIDDEN_POLL_MS);
							return;
						}
						forceStaticUntil = performance.now() + WARMUP_STATIC_MS;
						setCollapsed(false);
						startRenderLoop();
						revealTimer = 0;
					}, 0);
				}

				function createCanvas() {
					if (canvas) return;
					canvas = document.createElement('canvas');
					canvas.className = 'rq-tv-screen';
					stage.appendChild(canvas);
					ctx = canvas.getContext('2d');
					resizeCanvas();
				}

				function destroyCanvas() {
					if (!canvas) return;
					canvas.remove();
					canvas = null;
					ctx = null;
				}

				function resizeCanvas() {
					if (!canvas) return;
					var rect = stage.getBoundingClientRect();
					var dpr = Math.min(window.devicePixelRatio || 1, 2);
					var w = Math.max(2, Math.round(rect.width * dpr));
					var h = Math.max(2, Math.round(rect.height * dpr));
					canvas.width = w;
					canvas.height = h;
					canvas.style.width = '100%';
					canvas.style.height = '100%';
					width = w;
					height = h;
				}

				function releaseCurrentFrame() {
					if (currentFrame && currentFrame.close) currentFrame.close();
					currentFrame = null;
				}

				function clearCanvas() {
					if (!ctx) return;
					ctx.clearRect(0, 0, width, height);
				}

				function stopRenderLoop() {
					clearRenderTimer();
				}

				function teardownPlayback() {
					isPlaying = false;
					playToken++;
					setLoading(false);
					forceStaticUntil = 0;
					clearSequenceTimer();
					clearPreloadTimers();
					if (revealTimer) {
						clearTimeout(revealTimer);
						revealTimer = 0;
					}
					stopRenderLoop();
					releaseCurrentFrame();
					clearCanvas();
					destroyCanvas();
				}

				function drawFallback(elapsed) {
					if (!ctx) return;
					ctx.fillStyle = 'rgba(124, 186, 224, 0.15)';
					ctx.beginPath();
					ctx.ellipse(width * 0.5, height * 0.52, 36, 44, 0, 0, Math.PI * 2);
					ctx.fill();
					ctx.strokeStyle = 'rgba(176, 226, 250, 0.66)';
					ctx.stroke();
					ctx.fillStyle = 'rgba(182, 232, 255, 0.08)';
					for (var i = 0; i < 6; i++) {
						var y = (elapsed * 34 + i * 42) % height;
						ctx.fillRect(0, y, width, 1);
					}
				}

				function drawOverlay(elapsed) {
					if (!ctx) return;
					ctx.globalCompositeOperation = 'screen';
					for (var i = 0; i < 7; i++) {
						var y = (elapsed * 28 + i * 36) % height;
						ctx.fillStyle = i % 2 ? 'rgba(188,238,255,0.05)' : 'rgba(188,238,255,0.08)';
						ctx.fillRect(0, y, width, 1);
					}
					ctx.globalCompositeOperation = 'source-over';
					ctx.globalCompositeOperation = 'screen';
					ctx.fillStyle = 'rgba(154, 230, 255, 0.10)';
					ctx.fillRect(0, 0, width, height);
					ctx.globalCompositeOperation = 'source-over';
					var sweepX = (Math.sin(elapsed * 0.9) * 0.5 + 0.5) * width;
					var sweep = ctx.createLinearGradient(sweepX - 80, 0, sweepX + 80, 0);
					sweep.addColorStop(0, 'rgba(176, 230, 255, 0)');
					sweep.addColorStop(0.5, 'rgba(176, 230, 255, 0.12)');
					sweep.addColorStop(1, 'rgba(176, 230, 255, 0)');
					ctx.fillStyle = sweep;
					ctx.fillRect(0, 0, width, height);
				}

				function drawFrame(frame) {
					if (!ctx) return;
					var item = playlist[playlistIndex] || null;
					var isGif = item && item.type === 'image/gif';
					var fw = frame.displayWidth || frame.width;
					var fh = frame.displayHeight || frame.height;
					var zoom = 1.32;
					var scale = Math.max(width / fw, height / fh) * zoom;
					var dw = fw * scale;
					var dh = fh * scale;
					var shiftX = -Math.min(74, width * 0.18);
					var shiftY = isGif ? 5 : 0;
					var dx = (width - dw) / 2 + shiftX;
					var dy = (height - dh) / 2 + shiftY;
					ctx.save();
					ctx.translate(width, 0);
					ctx.scale(-1, 1);
					ctx.drawImage(frame, dx, dy, dw, dh);
					ctx.restore();
				}

				function renderTick() {
					if (!isPlaying || !ctx) {
						renderTimer = 0;
						return;
					}
					var now = performance.now();
					var elapsed = (now - start) * 0.001;
					var inStaticPhase = now < forceStaticUntil;
					ctx.clearRect(0, 0, width, height);
					if (!inStaticPhase && currentFrame) drawFrame(currentFrame);
					else drawFallback(elapsed);
					drawOverlay(elapsed);
					renderTimer = setTimeout(renderTick, FRAME_MS);
				}

				function startRenderLoop() {
					if (renderTimer) return;
					start = performance.now();
					renderTick();
				}

				function collapseAfterPlayback(token) {
					if (token !== playToken) return;
					scheduleSequence(function() {
						if (token !== playToken) return;
						isPlaying = false;
						stopRenderLoop();
						releaseCurrentFrame();
						clearCanvas();
						destroyCanvas();
						setCollapsed(true);
					}, COLLAPSE_DELAY_MS);
				}

				function fallbackPlay(index, token, attempt) {
					if (token !== playToken || !isPlaying) return;
					playlistIndex = index;
					if (index >= playlist.length) {
						collapseAfterPlayback(token);
						return;
					}
					var item = playlist[index];
					var tryCount = typeof attempt === 'number' ? attempt : 0;
					var cached = item.type === 'image/gif' ? null : imageCache[item.url];
						if (cached && cached.complete) {
							releaseCurrentFrame();
							currentFrame = cached;
							if (index === 0) revealMonitor(token);
							var cachedHold = item.holdLast || FALLBACK_STEP_MS;
							if (index === 0 && forceStaticUntil > performance.now()) {
								cachedHold += Math.ceil(forceStaticUntil - performance.now());
							}
							scheduleSequence(function() {
								fallbackPlay(index + 1, token, 0);
							}, cachedHold);
							return;
						}
					var img = new Image();
					img.onload = function() {
						if (token !== playToken || !isPlaying) return;
						if (item.type !== 'image/gif') imageCache[item.url] = img;
						releaseCurrentFrame();
						currentFrame = img;
						if (index === 0) revealMonitor(token);
						var holdMs = item.holdLast || FALLBACK_STEP_MS;
						if (item.type === 'image/gif') holdMs = Math.max(holdMs, FALLBACK_GIF_SHOW_MS);
						if (index === 0 && forceStaticUntil > performance.now()) {
							holdMs += Math.ceil(forceStaticUntil - performance.now());
						}
						scheduleSequence(function() {
							fallbackPlay(index + 1, token, 0);
						}, holdMs);
					};
					img.onerror = function() {
						var retryDelay = Math.min(1200, 180 * (tryCount + 1));
						scheduleSequence(function() {
							fallbackPlay(index, token, tryCount + 1);
						}, retryDelay);
					};
					img.src = resolveItemUrl(item);
				}

				function decodeWithImageDecoder(index, token) {
					if (token !== playToken || !isPlaying) return;
					playlistIndex = index;
					if (index >= playlist.length) {
						collapseAfterPlayback(token);
						return;
					}
					var item = playlist[index];
					function decodeFromData(data) {
						if (token !== playToken || !isPlaying) return;
						var decoder = new ImageDecoder({ data: data, type: item.type });
						var frameIndex = 0;
						function decodeNext() {
							if (token !== playToken || !isPlaying) return;
							decoder.decode({ frameIndex: frameIndex }).then(function(result) {
								if (token !== playToken || !isPlaying) return;
								releaseCurrentFrame();
								currentFrame = result.image;
								if (index === 0) revealMonitor(token);
								var baseDelay = result.image.duration ? result.image.duration / 1000 : 33;
								var delay = Math.max(16, baseDelay);
								if (index === 0 && forceStaticUntil > performance.now()) {
									delay += Math.ceil(forceStaticUntil - performance.now());
								}
								frameIndex++;
								if (frameIndex >= decoder.tracks.selectedTrack.frameCount) {
									var holdDelay = item.holdLast || 0;
									scheduleSequence(function() {
										decodeWithImageDecoder(index + 1, token);
									}, holdDelay);
									return;
								}
								scheduleSequence(decodeNext, delay);
							}).catch(function() {
								frameIndex = 0;
								scheduleSequence(decodeNext, 100);
							});
						}
						decoder.tracks.ready.then(function() {
							if (token !== playToken || !isPlaying) return;
							decodeNext();
						}).catch(function() {
							if (token !== playToken || !isPlaying) return;
							fallbackPlay(index, token, 0);
						});
					}

					var cachedData = mediaDataCache[item.url];
					if (cachedData instanceof ArrayBuffer) {
						decodeFromData(cachedData);
						return;
					}
					fetch(resolveItemUrl(item))
						.then(function(response) { return response.arrayBuffer(); })
						.then(function(buffer) {
							mediaDataCache[item.url] = buffer;
							decodeFromData(buffer);
						}).catch(function() {
							if (token !== playToken || !isPlaying) return;
							fallbackPlay(index, token, 0);
						});
				}

				function startPlayback() {
					if (isLoading) return;
					teardownPlayback();
					setLoading(true);
					createCanvas();
					if (!ctx) {
						setLoading(false);
						setCollapsed(true);
						return;
					}
					isPlaying = true;
					hasRevealed = false;
					setCollapsed(true);
					var token = playToken;
					preloadAssets(token, function(ok) {
						if (token !== playToken || !isPlaying) return;
						setLoading(false);
						if (!ok) {
							isPlaying = false;
							destroyCanvas();
							setCollapsed(true);
							return;
						}
						if (typeof ImageDecoder !== 'undefined') decodeWithImageDecoder(0, token);
						else fallbackPlay(0, token, 0);
					});
				}

				function queueAutoPlay() {
					function run() {
						clearSequenceTimer();
						sequenceTimer = setTimeout(function() {
							if (document.hidden) {
								pendingAutoPlay = true;
								return;
							}
							startPlayback();
						}, OPEN_DELAY_MS);
					}
					if (document.readyState === 'complete') run();
					else window.addEventListener('load', run, { once: true });
				}

				toggle.addEventListener('click', function() {
					startPlayback();
				});

				function onTvVisibilityChange() {
					if (document.hidden) {
						stopRenderLoop();
					} else {
						if (pendingAutoPlay && !isPlaying) {
							pendingAutoPlay = false;
							startPlayback();
							return;
						}
						if (isPlaying && !renderTimer) startRenderLoop();
					}
				}

				window.addEventListener('resize', function() {
					if (canvas) resizeCanvas();
				}, { passive: true });
				document.addEventListener('visibilitychange', onTvVisibilityChange);
				window.addEventListener('beforeunload', function() { teardownPlayback(); }, { once: true });

				setCollapsed(true);
				queueAutoPlay();
			}
			initRedQueenTv();

				// 鼠标跟随光斑
				var glow = document.querySelector('.mesh-mouse-glow');
				if (glow) {
					var raf;
					var x = 0, y = 0;
					document.addEventListener('mousemove', function(e) {
						x = e.clientX;
						y = e.clientY;
						if (!raf) raf = requestAnimationFrame(function() {
							glow.style.setProperty('--mouse-x', x + 'px');
							glow.style.setProperty('--mouse-y', y + 'px');
							raf = 0;
						});
					});
				}

				// 悬浮预览卡：为链接添加 data-preview
				document.querySelectorAll('.mesh-prose-body a[href]').forEach(function(a) {
					var href = a.getAttribute('href') || '';
					if (!href || href.startsWith('#')) return;
					a.classList.add('mesh-link-preview');
					try {
						a.setAttribute('data-preview', href.startsWith('http') ? new URL(href, location.origin).hostname : href);
					} catch (_) {
						a.setAttribute('data-preview', href);
					}
				});

				// 段落滚动浮现
				var paras = document.querySelectorAll('.mesh-prose-body p, .mesh-prose-body h2, .mesh-prose-body h3, .mesh-prose-body pre, .mesh-prose-body blockquote, .mesh-prose-body ul, .mesh-prose-body ol');
				if (window.IntersectionObserver) {
					var io = new IntersectionObserver(function(entries) {
						entries.forEach(function(e) {
							if (e.isIntersecting) {
								e.target.classList.add('mesh-para-visible');
								io.unobserve(e.target);
							}
						});
					}, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
					paras.forEach(function(p) { io.observe(p); });
				} else {
					paras.forEach(function(p) { p.classList.add('mesh-para-visible'); });
				}

				// Regenerate 按钮
				var regen = document.querySelector('.mesh-regenerate');
				var article = document.querySelector('.mesh-article');
				var scan = document.querySelector('.mesh-load-scan');
				if (regen && article) {
					regen.addEventListener('click', function() {
						regen.disabled = true;
						regen.classList.add('mesh-regenerating');
						article.classList.add('mesh-regenerate-flash');
						if (scan) {
							scan.style.animation = 'none';
							scan.offsetHeight;
							scan.style.animation = 'mesh-scan 0.8s ease-out forwards';
							scan.style.top = '0';
							scan.style.opacity = '1';
						}
						setTimeout(function() {
							article.classList.remove('mesh-regenerate-flash');
							regen.classList.remove('mesh-regenerating');
							regen.disabled = false;
						}, 1200);
					});
				}
			}

			if (document.readyState === 'loading') {
				document.addEventListener('DOMContentLoaded', init);
			} else {
				init();
			}
		})();
