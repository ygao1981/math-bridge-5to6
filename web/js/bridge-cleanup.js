document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('#bridgeCards');
  if (!grid) return;

  Array.from(grid.children).forEach((card) => {
    if (!card.classList.contains('block-card')) {
      card.remove();
    }
  });

  const desc = document.querySelector('#bridge .section-desc');
  if (desc && !document.querySelector('.bridge-banner')) {
    const banner = document.createElement('div');
    banner.className = 'bridge-banner';
    banner.textContent = '暑假目标不是提前学完整本六上，而是补齐分数乘法、长方体正方体、分数除法、比、百分数这条知识桥。';
    desc.insertAdjacentElement('afterend', banner);
  }
});
