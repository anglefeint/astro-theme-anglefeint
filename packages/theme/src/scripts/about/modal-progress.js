export function renderProgressModal() {
  const bar = document.getElementById('dl-progress');
  if (!bar) return;

  bar.innerHTML = '';
  for (let i = 0; i < 48; i += 1) {
    bar.appendChild(document.createElement('span'));
  }

  let idx = 0;
  const fillNext = () => {
    if (idx >= 48) return;
    bar.children[idx].classList.add('filled');
    idx += 1;
    setTimeout(fillNext, 80 + Math.random() * 60);
  };
  fillNext();
}
