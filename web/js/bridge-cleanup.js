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

  function renderVideoLinks() {
    if (document.querySelector('#videos-home')) return;
    const list = window.MATH_BRIDGE_VIDEOS || [];
    if (!list.length) return;
    const section = document.createElement('section');
    section.className = 'section';
    section.id = 'videos-home';
    section.innerHTML = '<div class="section-head"><div><h2>知识点教学视频</h2><p class="section-desc">11 个核心知识点视频已经接入。点击“播放视频”可直接打开对应视频。</p></div><a class="btn secondary" href="video-lessons.html">进入视频页</a></div><div class="grid two" id="videoHomeList"></div>';
    const target = document.querySelector('#formulas') || document.querySelector('#practice');
    if (target) target.insertAdjacentElement('beforebegin', section);
    const box = section.querySelector('#videoHomeList');
    box.innerHTML = list.map(v => '<article class="card video-card"><div class="card-tags"><span class="badge">' + v.module + '</span><span class="badge difficulty">' + v.duration + '</span></div><h3>' + v.title + '</h3><p class="muted">' + v.objective + '</p><div class="exercise-actions"><a class="btn" href="' + v.url + '" target="_blank" rel="noopener">播放视频</a><a class="btn secondary" href="video-lessons.html#' + v.id + '">详情页</a></div></article>').join('');
  }

  if (window.MATH_BRIDGE_VIDEOS) renderVideoLinks();
  else {
    const script = document.createElement('script');
    script.src = 'js/videos.js?v=0.4.1';
    script.onload = renderVideoLinks;
    document.body.appendChild(script);
  }
});
