document.addEventListener('DOMContentLoaded', () => {
  const list = window.MATH_BRIDGE_VIDEOS || [];
  const target = document.querySelector('#videoList');
  if (!target) return;

  target.innerHTML = list.map(item => `
    <article class="card video-card">
      <div class="video-top">
        <span class="badge">${item.module}</span>
        <span class="badge difficulty">${item.duration}</span>
        <span class="badge ${item.url ? '' : 'hard'}">${item.url ? '可播放' : '待生成'}</span>
      </div>
      <h3>${item.title}</h3>
      <p class="muted"><strong>讲解目标：</strong>${item.objective}</p>
      ${item.url ? `<video class="lesson-video" controls preload="metadata" src="${item.url}"></video>` : `<div class="video-placeholder">视频待生成：用 HyperFrames by HeyGen 生成后，把视频 URL 填入 <code>web/js/videos.js</code> 的 url 字段。</div>`}
      <details class="video-script">
        <summary>查看讲解脚本</summary>
        <ol>${item.script.map(line => `<li>${line}</li>`).join('')}</ol>
      </details>
      <details class="video-script">
        <summary>查看 HeyGen / HyperFrames 提示词</summary>
        <p>${item.prompt}</p>
      </details>
    </article>
  `).join('');
});
