document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('#bridgeCards');
  if (grid) {
    Array.from(grid.children).forEach((card) => {
      if (!card.classList.contains('block-card')) card.remove();
    });
  }

  const desc = document.querySelector('#bridge .section-desc');
  if (desc && !document.querySelector('.bridge-banner')) {
    const banner = document.createElement('div');
    banner.className = 'bridge-banner';
    banner.textContent = '暑假目标不是提前学完整本六上，而是补齐分数乘法、长方体正方体、分数除法、比、百分数这条知识桥。';
    desc.insertAdjacentElement('afterend', banner);
  }

  const nav = document.querySelector('.top-nav');
  if (nav && !document.querySelector('.top-nav a[href="video-lessons.html"]')) {
    const videoLink = document.createElement('a');
    videoLink.href = 'video-lessons.html';
    videoLink.textContent = '教学视频';
    const formulasLink = document.querySelector('.top-nav a[href="#formulas"]');
    nav.insertBefore(videoLink, formulasLink || null);
  }

  const headerActions = document.querySelector('.header-actions');
  if (headerActions && !document.querySelector('.header-actions a[href="video-lessons.html"]')) {
    const btn = document.createElement('a');
    btn.className = 'btn secondary';
    btn.href = 'video-lessons.html';
    btn.textContent = '看教学视频';
    headerActions.insertBefore(btn, headerActions.children[1] || null);
  }
});
