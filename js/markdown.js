/* ============================================
   Markdown 文章加载与渲染
   ============================================ */

function loadPost() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  if (!slug) {
    document.getElementById('postHeader').innerHTML = '<p>文章不存在</p>';
    document.getElementById('postBody').innerHTML = '';
    return;
  }

  // 从索引找文章信息
  const postInfo = POSTS_INDEX.find(p => p.slug === slug);
  const title = postInfo ? postInfo.title : slug;

  fetch(`posts/${slug}.md`)
    .then(res => {
      if (!res.ok) throw new Error('文章未找到');
      return res.text();
    })
    .then(text => {
      // 解析 front matter
      const { metadata, content } = parseFrontMatter(text);

      // 渲染头部
      const headerEl = document.getElementById('postHeader');
      const date = metadata.date || (postInfo ? postInfo.date : '');
      const tags = metadata.tags || (postInfo ? postInfo.tags : []);
      const postTitle = metadata.title || title;

      headerEl.innerHTML = `
        <div class="post-meta">${date}</div>
        <h1>${postTitle}</h1>
        <div class="post-tags">
          ${tags.map(t => `<span class="tag-item" style="cursor:default;">${t}</span>`).join('')}
        </div>
      `;

      // 更新页面标题
      document.title = `${postTitle} | 终端极客风博客`;

      // 渲染 Markdown
      const bodyEl = document.getElementById('postBody');
      bodyEl.innerHTML = marked.parse(content);

      // 代码块美化
      bodyEl.querySelectorAll('pre').forEach(pre => {
        pre.querySelector('code')?.classList.add('language-javascript');
      });
    })
    .catch(err => {
      document.getElementById('postHeader').innerHTML = '';
      document.getElementById('postBody').innerHTML = `
        <div class="empty-state">
          <div class="icon">&#128533;</div>
          <p>文章加载失败：${err.message}</p>
          <a href="index.html" class="back-link" style="margin-top:1rem;">&lt; 返回首页</a>
        </div>
      `;
    });
}

function parseFrontMatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { metadata: {}, content: text };

  const metadata = {};
  const frontMatter = match[1];

  frontMatter.split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      const value = rest.join(':').trim();
      if (value.startsWith('[') && value.endsWith(']')) {
        metadata[key.trim()] = value.slice(1, -1).split(',').map(s => s.trim().replace(/['"]/g, ''));
      } else {
        metadata[key.trim()] = value.replace(/['"]/g, '');
      }
    }
  });

  return { metadata, content: match[2] };
}

document.addEventListener('DOMContentLoaded', loadPost);
