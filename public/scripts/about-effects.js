			(function() {
				function init() {
				var runtimeConfig = {};
				var runtimeConfigEl = document.getElementById('hacker-runtime-config');
				if (runtimeConfigEl && runtimeConfigEl.textContent) {
					try {
						runtimeConfig = JSON.parse(runtimeConfigEl.textContent);
					} catch (_err) {
						runtimeConfig = {};
					}
				}
				// ── Terminal background: dir + 可输入 (点击背景聚焦，回车仅换行) ──
				var bgCanvas = document.querySelector('.hacker-bg-canvas');
				if (bgCanvas) {
					var bgCtx = bgCanvas.getContext('2d');
					var fontSize = 13;
					var lineHeight = 18;
					var bgAnimationId = 0;
					var fallbackDirLines = [
						'~ $ ls -la',
						'total 42',
						'drwxr-xr-x  12 void  staff   384  Jan 12  about  blog  projects',
						'drwxr-xr-x   8 void  staff   256  Jan 11  .config  .ssh  keys',
						'-rw-r--r--   1 void  staff  2048  Jan 10  README.md  .env.gpg',
						'-rwxr-xr-x   1 void  staff   512  Jan  9  deploy.sh  hack',
						'~ $ cat .motd',
						'>> welcome to the void | access granted',
					];
					var dirLines = runtimeConfig.effects && Array.isArray(runtimeConfig.effects.backgroundLines) && runtimeConfig.effects.backgroundLines.length > 0
						? runtimeConfig.effects.backgroundLines
						: fallbackDirLines;
					var hackerFocused = false;
					var hackerInput = '';
					var hackerHistory = [];

					function sizeBackground() {
						var dpr = Math.min(window.devicePixelRatio || 1, 2);
						bgCanvas.width = window.innerWidth * dpr;
						bgCanvas.height = window.innerHeight * dpr;
						bgCanvas.style.width = window.innerWidth + 'px';
						bgCanvas.style.height = window.innerHeight + 'px';
						bgCtx.scale(dpr, dpr);
					}
					sizeBackground();

					function renderBg(t) {
						var w = window.innerWidth;
						var h = window.innerHeight;
						var dpr = Math.min(window.devicePixelRatio || 1, 2);

						bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
						bgCtx.clearRect(0, 0, w, h);
						bgCtx.fillStyle = '#0a0a0a';
						bgCtx.fillRect(0, 0, w, h);

						bgCtx.font = fontSize + 'px ui-monospace, SFMono-Regular, Menlo, monospace';
						var padX = 24;
						var baseY = 22;

						// directory listing
						for (var i = 0; i < dirLines.length; i++) {
							var line = dirLines[i];
							if (line.indexOf('~ $') === 0) {
								bgCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
							} else if (line.indexOf('>>') === 0) {
								bgCtx.fillStyle = 'rgba(255, 255, 255, 0.75)';
							} else if (line.indexOf('total') === 0 || line.indexOf('drwx') === 0 || line.indexOf('-rw') === 0) {
								bgCtx.fillStyle = 'rgba(255, 255, 255, 0.55)';
							} else {
								bgCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
							}
							bgCtx.fillText(line, padX, baseY + i * lineHeight);
						}

						var promptY = baseY + dirLines.length * lineHeight + 10;

						// 用户输入历史 (回车产生的行)
						for (var i = 0; i < hackerHistory.length; i++) {
							bgCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
							bgCtx.fillText('~ $ ' + hackerHistory[i], padX, promptY + i * lineHeight);
						}

						// 当前行: prompt + 输入 + 光标
						var currentY = promptY + hackerHistory.length * lineHeight;
						bgCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
						bgCtx.fillText('~ $ ', padX, currentY);
						var promptW = bgCtx.measureText('~ $ ').width;
						bgCtx.fillText(hackerInput, padX + promptW, currentY);
						var inputW = bgCtx.measureText(hackerInput).width;
						var blink = Math.floor(t / 530) % 2;
						if (blink && hackerFocused) {
							bgCtx.fillStyle = 'rgba(0, 255, 100, 0.9)';
							bgCtx.fillRect(padX + promptW + inputW, currentY - fontSize + 4, 8, fontSize - 2);
						} else if (!hackerFocused && blink) {
							bgCtx.fillStyle = 'rgba(0, 255, 100, 0.9)';
							bgCtx.fillRect(padX + promptW + inputW, currentY - fontSize + 4, 8, fontSize - 2);
						}

						bgAnimationId = requestAnimationFrame(renderBg);
					}
					function startBackgroundLoop() {
						if (bgAnimationId || document.hidden) return;
						bgAnimationId = requestAnimationFrame(renderBg);
					}
					function stopBackgroundLoop() {
						if (!bgAnimationId) return;
						cancelAnimationFrame(bgAnimationId);
						bgAnimationId = 0;
					}
					startBackgroundLoop();
					document.addEventListener('visibilitychange', function() {
						if (document.hidden) {
							stopBackgroundLoop();
							return;
						}
						startBackgroundLoop();
					});

					// 点击背景聚焦，点击内容失焦
					document.addEventListener('click', function(e) {
						var content = document.querySelector('.about-shell');
						var header = document.querySelector('header');
						var footer = document.querySelector('footer');
						if (content && content.contains(e.target)) {
							hackerFocused = false;
						} else if (header && header.contains(e.target)) {
							hackerFocused = false;
						} else if (footer && footer.contains(e.target)) {
							hackerFocused = false;
						} else if (e.target.closest('.hacker-back-to-top, .hacker-regenerate')) {
							hackerFocused = false;
						} else {
							hackerFocused = true;
						}
					});

					// 键盘输入 (仅当聚焦时)
					document.addEventListener('keydown', function(e) {
						if (!hackerFocused) return;
						if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
						e.preventDefault();
						if (e.key === 'Enter') {
							hackerHistory.push(hackerInput);
							hackerInput = '';
							if (hackerHistory.length > 8) hackerHistory.shift();
						} else if (e.key === 'Backspace') {
							hackerInput = hackerInput.slice(0, -1);
						} else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && hackerInput.length < 80) {
							hackerInput += e.key;
						}
					});

					window.addEventListener('resize', function() {
						sizeBackground();
					}, { passive: true });
				}

				// ── Progress bar + toasts + back-to-top ──
				var progress = document.querySelector('.hacker-progress');
				var toast = document.querySelector('.hacker-toast');
				var fallbackToasts = {
					p30: 'context parsed',
					p60: 'inference stable',
					p90: 'output finalized',
				};
				var toastMessages = runtimeConfig.effects && runtimeConfig.effects.scrollToasts
					? runtimeConfig.effects.scrollToasts
					: fallbackToasts;
				var stageSeen = { p30: false, p60: false, p90: false };
				var toastTimer = 0;
				var hasScrolled = false;
				function showToast(msg) {
					if (!toast) return;
					toast.textContent = '> ' + msg;
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
						var btn = document.querySelector('.hacker-back-to-top');
						if (btn) btn.classList.toggle('visible', scrollTop > 400);
						if (!hasScrolled && scrollTop > 6) hasScrolled = true;
						if (!hasScrolled) return;
						if (!stageSeen.p30 && p >= 0.3) {
							stageSeen.p30 = true;
							showToast(toastMessages.p30 || fallbackToasts.p30);
						}
						if (!stageSeen.p60 && p >= 0.6) {
							stageSeen.p60 = true;
							showToast(toastMessages.p60 || fallbackToasts.p60);
						}
						if (!stageSeen.p90 && p >= 0.9) {
							stageSeen.p90 = true;
							showToast(toastMessages.p90 || fallbackToasts.p90);
						}
					}
					onScroll();
					window.addEventListener('scroll', onScroll, { passive: true });
				}
				var backTop = document.querySelector('.hacker-back-to-top');
				if (backTop) {
					backTop.addEventListener('click', function() {
						window.scrollTo({ top: 0, behavior: 'smooth' });
					});
				}

				// ── 文件夹弹窗 ──
				var modalOverlay = document.getElementById('hacker-modal');
				var modalBody = document.getElementById('hacker-modal-body');
				var modalTitle = document.querySelector('.hacker-modal-title');
				var decryptorKeysLabel = runtimeConfig.decryptorKeysLabel || 'keys tested';
				var decryptorInterval = null;
				function randHex() {
					var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
					return chars[Math.floor(Math.random() * chars.length)];
				}
				function randKeyLine(pairs) {
					var s = [];
					for (var i = 0; i < pairs; i++) {
						s.push(randHex() + randHex());
					}
					return s.join(' ');
				}
				function randPass() {
					var s = '';
					for (var i = 0; i < 6; i++) s += randHex().toLowerCase();
					s += '@' + randHex() + randHex() + randHex() + randHex() + randHex();
					return s;
				}
				function startDecryptorFlash() {
					if (decryptorInterval) clearInterval(decryptorInterval);
					var keys = 0, sec = 1;
					decryptorInterval = setInterval(function() {
						if (!modalOverlay.classList.contains('open')) {
							clearInterval(decryptorInterval);
							decryptorInterval = null;
							return;
						}
						keys += 1 + Math.floor(Math.random() * 3);
						sec = Math.min(59, Math.floor(keys / 15) + 1);
						var el = document.getElementById('dec-keys');
						if (el) el.textContent = '[00:00:' + String(sec).padStart(2, '0') + '] ' + keys + ' ' + decryptorKeysLabel;
						el = document.getElementById('dec-pass');
						if (el) el.textContent = randPass();
						el = document.getElementById('dec-master1');
						if (el) el.textContent = randKeyLine(8);
						el = document.getElementById('dec-master2');
						if (el) el.textContent = randKeyLine(8);
						el = document.getElementById('dec-trans1');
						if (el) el.textContent = randKeyLine(7);
						el = document.getElementById('dec-trans2');
						if (el) el.textContent = randKeyLine(7);
						el = document.getElementById('dec-trans3');
						if (el) el.textContent = randKeyLine(8);
						el = document.getElementById('dec-trans4');
						if (el) el.textContent = randKeyLine(8);
					}, 180);
				}
				var helpCharCount = 0;
				function buildHelpKeyboard() {
					var keyboardConfig = runtimeConfig.keyboard || {};
					var statsLabel = keyboardConfig.statsLabel || 'Stats & Achievements';
					var typedPrefix = keyboardConfig.typedPrefix || 'You typed:';
					var typedSuffix = keyboardConfig.typedSuffix || 'characters';
					var rows = [
						['`','1','2','3','4','5','6','7','8','9','0','-','=','Backspace'],
						['Tab','Q','W','E','R','T','Y','U','I','O','P','[',']'],
						['CapsLock','A','S','D','F','G','H','J','K','L',';',"'",'Enter'],
						['Shift','Z','X','C','V','B','N','M',',','.','/','ShiftRight'],
						['Ctrl','Alt','Space','AltRight','CtrlRight']
					];
					var codeMap = { '`':'Backquote','1':'Digit1','2':'Digit2','3':'Digit3','4':'Digit4','5':'Digit5','6':'Digit6','7':'Digit7','8':'Digit8','9':'Digit9','0':'Digit0','-':'Minus','=':'Equal','Backspace':'Backspace','Tab':'Tab','Q':'KeyQ','W':'KeyW','E':'KeyE','R':'KeyR','T':'KeyT','Y':'KeyY','U':'KeyU','I':'KeyI','O':'KeyO','P':'KeyP','[':'BracketLeft',']':'BracketRight','CapsLock':'CapsLock','A':'KeyA','S':'KeyS','D':'KeyD','F':'KeyF','G':'KeyG','H':'KeyH','J':'KeyJ','K':'KeyK','L':'KeyL',';':'Semicolon',"'":'Quote','Enter':'Enter','Shift':'ShiftLeft','ShiftRight':'ShiftRight','Z':'KeyZ','X':'KeyX','C':'KeyC','V':'KeyV','B':'KeyB','N':'KeyN','M':'KeyM',',':'Comma','.':'Period','/':'Slash','Ctrl':'ControlLeft','CtrlRight':'ControlRight','Alt':'AltLeft','AltRight':'AltRight','Space':'Space' };
					var html = '<div class="hacker-vkeyboard-wrap" id="help-keyboard">';
					html += '<div class="hacker-vkeyboard hacker-vkeyboard-main">';
					rows.forEach(function(row) {
						html += '<div class="hacker-vkeyboard-row">';
						row.forEach(function(k) {
							var code = codeMap[k] || k;
							var cls = 'hacker-vkey';
							if (k === 'Tab' || k === 'CapsLock' || k === 'Enter') cls += ' wide';
							if (k === 'Space') cls += ' space';
							if (k === 'Backspace') cls += ' acc backspace';
							var label = k === 'Space' ? '&nbsp;' : (k === 'ShiftRight' ? 'Shift' : k === 'CtrlRight' ? 'Ctrl' : k === 'AltRight' ? 'Alt' : k === 'Backspace' ? 'Back ⌫' : k);
							html += '<span class="' + cls + '" data-code="' + code + '" data-key="' + (k === 'ShiftRight' ? 'Shift' : k === 'CtrlRight' ? 'Ctrl' : k === 'AltRight' ? 'Alt' : k === 'Backspace' ? 'Backspace' : k).replace("'", "\\'") + '"' + (k === 'Backspace' ? ' title="Backspace or ESC"' : '') + '>' + label + '</span>';
						});
						html += '</div>';
					});
					html += '</div>';
					html += '<div class="hacker-vkeyboard-side">';
					html += '<div class="hacker-vkeyboard-side-block">';
					html += '<div class="hacker-vkeyboard-side-row"><span class="hacker-vkey" data-code="Insert" data-key="Ins">Insert</span><span class="hacker-vkey nav-home" data-code="Home" data-key="Home">Home</span><span class="hacker-vkey" data-code="PageUp" data-key="PgUp">PgUp</span></div>';
					html += '<div class="hacker-vkeyboard-side-row"><span class="hacker-vkey" data-code="Delete" data-key="Del">Delete</span><span class="hacker-vkey nav-end" data-code="End" data-key="End">End</span><span class="hacker-vkey" data-code="PageDown" data-key="PgDn">PgDn</span></div>';
					html += '</div>';
					html += '<div class="hacker-vkeyboard-side-row"><span class="hacker-vkey" data-code="Purge" data-key="Purge">Purge</span></div>';
					html += '<div class="hacker-vkeyboard-arrows-wrap">';
					html += '<div class="hacker-vkeyboard-arrows">';
					html += '<span class="hacker-vkey arr-u" data-code="ArrowUp" data-key="↑">↑</span>';
					html += '<span class="hacker-vkey arr-l" data-code="ArrowLeft" data-key="←">←</span>';
					html += '<span class="hacker-vkey arr-r" data-code="ArrowRight" data-key="→">→</span>';
					html += '<span class="hacker-vkey arr-d" data-code="ArrowDown" data-key="↓">↓</span>';
					html += '</div>';
					html += '</div></div></div>';
					html += '<div class="hacker-vkeyboard-stats"><span class="hacker-vkeyboard-stats-label">' + statsLabel + '</span><br>' + typedPrefix + ' <span id="help-char-count">0</span> ' + typedSuffix + '</div>';
					return html;
				}
				function highlightKey(code) {
					if (code === 'Escape') code = 'Backspace';
					var el = modalBody.querySelector('.hacker-vkey[data-code="' + code + '"]');
					if (!el) {
						if (code === 'ShiftRight') el = modalBody.querySelector('.hacker-vkey[data-code="ShiftLeft"]');
						else if (code === 'ControlRight') el = modalBody.querySelector('.hacker-vkey[data-code="ControlLeft"]');
						else if (code === 'AltRight') el = modalBody.querySelector('.hacker-vkey[data-code="AltLeft"]');
					}
					if (el) {
						el.classList.add('highlight');
						setTimeout(function() { el.classList.remove('highlight'); }, 150);
					}
				}
				function initHelpKeyboard() {
					helpCharCount = 0;
					var charEl = document.getElementById('help-char-count');
					if (charEl) charEl.textContent = '0';
					modalBody.querySelectorAll('.hacker-vkey').forEach(function(k) {
						k.addEventListener('click', function() {
							var code = k.getAttribute('data-code');
							highlightKey(code);
							var key = k.getAttribute('data-key');
							var navKeys = ['Shift','Ctrl','Alt','CapsLock','Tab','Enter','Backspace','Space','Ins','Home','PgUp','Del','End','PgDn','Purge','↑','↓','←','→'];
							if (key && navKeys.indexOf(key) === -1) {
								helpCharCount++;
								charEl = document.getElementById('help-char-count');
								if (charEl) charEl.textContent = helpCharCount;
							} else if (key === 'Space') {
								helpCharCount++;
								charEl = document.getElementById('help-char-count');
								if (charEl) charEl.textContent = helpCharCount;
							}
						});
					});
				}
				function handleHelpKeydown(e) {
					if (!modalOverlay.classList.contains('open') || !modalBody.classList.contains('hacker-modal-keyboard')) return;
					if (e.key === 'Escape') return;
					e.preventDefault();
					highlightKey(e.code);
					if (e.key.length === 1) {
						helpCharCount++;
						var charEl = document.getElementById('help-char-count');
						if (charEl) charEl.textContent = helpCharCount;
					}
				}
				var scriptsTpl = document.getElementById('hacker-scripts-folders-tpl');
				var fallbackModalContent = {
					'dl-data': { title: 'Downloading...', body: '<div class="hacker-modal-download"><div class="modal-subtitle">Critical Data</div><div class="hacker-modal-progress" id="dl-progress"></div></div>', type: 'progress' },
					'ai': { title: 'AI', body: '<pre>~ $ model --status\n\ninference: stable\ncontext: 8k tokens\nlatency: &lt; 200ms\n\n&gt;&gt; system online</pre>' },
					'decryptor': { title: 'Password Decryptor', body: '<pre class="hacker-decryptor-pre">Calculating Hashes\n\n<span id="dec-keys">[00:00:01] 0 keys tested</span>\n\nCurrent passphrase: <span id="dec-pass">********</span>\n\nMaster key\n<span id="dec-master1"></span>\n<span id="dec-master2"></span>\n\nTransient key\n<span id="dec-trans1"></span>\n<span id="dec-trans2"></span>\n<span id="dec-trans3"></span>\n<span id="dec-trans4"></span></pre>', type: 'decryptor' },
					'help': { title: 'Help', body: '', type: 'keyboard' },
					'all-scripts': { title: '/root/bash/scripts', body: '', type: 'scripts' }
				};
				var modalContent = runtimeConfig.modalContent || fallbackModalContent;
				document.querySelectorAll('.hacker-folder[data-modal]').forEach(function(btn) {
					btn.addEventListener('click', function() {
						var id = btn.getAttribute('data-modal');
						var data = modalContent[id];
						if (data) {
							var modalEl = modalOverlay.querySelector('.hacker-modal');
							if (modalEl) modalEl.classList.remove('hacker-modal-wide');
							modalTitle.textContent = data.title;
							modalBody.innerHTML = data.body;
							modalBody.className = 'hacker-modal-body' + (data.type === 'progress' ? ' hacker-modal-download' : '') + (data.type === 'keyboard' ? ' hacker-modal-keyboard' : '') + (data.type === 'scripts' ? ' hacker-modal-scripts-wrap' : '');
							if (data.type === 'progress') {
								var bar = document.getElementById('dl-progress');
								if (bar) {
									bar.innerHTML = '';
									for (var i = 0; i < 48; i++) bar.appendChild(document.createElement('span'));
									var idx = 0;
									function fillNext() {
										if (idx < 48) {
											bar.children[idx].classList.add('filled');
											idx++;
											setTimeout(fillNext, 80 + Math.random() * 60);
										}
									}
									fillNext();
								}
							} else if (data.type === 'decryptor') {
								var el = document.getElementById('dec-keys');
								if (el) el.textContent = '[00:00:01] 0 ' + decryptorKeysLabel;
								el = document.getElementById('dec-pass');
								if (el) el.textContent = randPass();
								el = document.getElementById('dec-master1');
								if (el) el.textContent = randKeyLine(8);
								el = document.getElementById('dec-master2');
								if (el) el.textContent = randKeyLine(8);
								el = document.getElementById('dec-trans1');
								if (el) el.textContent = randKeyLine(7);
								el = document.getElementById('dec-trans2');
								if (el) el.textContent = randKeyLine(7);
								el = document.getElementById('dec-trans3');
								if (el) el.textContent = randKeyLine(8);
								el = document.getElementById('dec-trans4');
								if (el) el.textContent = randKeyLine(8);
								startDecryptorFlash();
							} else if (data.type === 'keyboard') {
								modalBody.innerHTML = buildHelpKeyboard();
								if (modalEl) modalEl.classList.add('hacker-modal-wide');
								initHelpKeyboard();
								document.addEventListener('keydown', handleHelpKeydown);
							} else if (data.type === 'scripts' && scriptsTpl && scriptsTpl.content) {
								modalBody.innerHTML = '';
								modalBody.appendChild(scriptsTpl.content.cloneNode(true));
								if (modalEl) modalEl.classList.add('hacker-modal-wide');
							}
							modalOverlay.classList.add('open');
							modalOverlay.setAttribute('aria-hidden', 'false');
						}
					});
				});
				function closeModal() {
					if (decryptorInterval) {
						clearInterval(decryptorInterval);
						decryptorInterval = null;
					}
					document.removeEventListener('keydown', handleHelpKeydown);
					var modalEl = modalOverlay.querySelector('.hacker-modal');
					if (modalEl) modalEl.classList.remove('hacker-modal-wide');
					modalOverlay.classList.remove('open');
					modalOverlay.setAttribute('aria-hidden', 'true');
				}
				document.querySelector('.hacker-modal-close').addEventListener('click', closeModal);
				modalOverlay.addEventListener('click', function(e) {
					if (e.target === modalOverlay) closeModal();
				});
				document.addEventListener('keydown', function(e) {
					if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
				});

				// ── Mouse glow ──
				var glow = document.querySelector('.hacker-mouse-glow');
				if (glow) {
					var glowRaf;
					var mx = 0, my = 0;
					document.addEventListener('mousemove', function(e) {
						mx = e.clientX;
						my = e.clientY;
						if (!glowRaf) glowRaf = requestAnimationFrame(function() {
							glow.style.setProperty('--mouse-x', mx + 'px');
							glow.style.setProperty('--mouse-y', my + 'px');
							glowRaf = 0;
						});
					});
				}

				// ── Paragraph scroll reveal ──
				var paras = document.querySelectorAll('.hacker-body p, .hacker-body h2, .hacker-body blockquote, .about-manifest');
				if (window.IntersectionObserver) {
					var io = new IntersectionObserver(function(entries) {
						entries.forEach(function(e) {
							if (e.isIntersecting) {
								e.target.classList.add('hacker-visible');
								io.unobserve(e.target);
							}
						});
					}, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
					paras.forEach(function(p) { io.observe(p); });
				} else {
					paras.forEach(function(p) { p.classList.add('hacker-visible'); });
				}

				// ── Typewriter section titles ──
				var titles = document.querySelectorAll('.about-section-title');
				if (window.IntersectionObserver && titles.length) {
					titles.forEach(function(el) {
						var fullText = el.textContent || '';
						el.setAttribute('data-full-text', fullText);
						el.textContent = '';
						el.style.minHeight = '1.2em';
					});
					var tio = new IntersectionObserver(function(entries) {
						entries.forEach(function(e) {
							if (e.isIntersecting) {
								tio.unobserve(e.target);
								var text = e.target.getAttribute('data-full-text') || '';
								var i = 0;
								e.target.textContent = '';
								function type() {
									if (i <= text.length) {
										e.target.textContent = text.slice(0, i);
										i++;
										setTimeout(type, 32);
									}
								}
								type();
							}
						});
					}, { rootMargin: '0px 0px -40px 0px', threshold: 0.1 });
					titles.forEach(function(el) { tio.observe(el); });
				}

				// ── Regenerate button ──
				var regen = document.querySelector('.hacker-regenerate');
				var article = document.querySelector('.about-shell');
				var scan = document.querySelector('.hacker-load-scan');
				if (regen && article) {
					regen.addEventListener('click', function() {
						regen.disabled = true;
						article.classList.add('hacker-flash');
						if (scan) {
							scan.style.animation = 'none';
							scan.offsetHeight;
							scan.style.animation = 'hacker-scan 0.8s ease-out forwards';
							scan.style.top = '0';
							scan.style.opacity = '1';
						}
						setTimeout(function() {
							article.classList.remove('hacker-flash');
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
