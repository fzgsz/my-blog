/* ============================================
   主逻辑 - 主题切换、导航、文章索引
   ============================================ */

// --- 文章索引（新增文章只需在这里添加一条） ---
const POSTS_INDEX = [
  {
    slug: 'hello-world',
    title: 'Hello World - 我的博客诞生了',
    date: '2026-05-06',
    tags: ['随笔', '开篇'],
    excerpt: '这是我的第一篇博客文章。从一个想法到一个完整的暗色极客风博客，记录这个过程和背后的一些思考。'
  },
  {
    slug: 'claude-code-with-deepseek',
    title: '用 DeepSeek 驱动 Claude Code 编程',
    date: '2026-05-06',
    tags: ['AI', '工具', '教程'],
    excerpt: '如何将 DeepSeek 的 API 接入 Claude Code，实现国内可用的 AI 编程助手。从安装配置到实际使用的完整教程。'
  }
];

// --- 主题切换 ---
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeBtn(next);
}

function updateThemeBtn(theme) {
  const btn = document.getElementById('themeBtn');
  if (btn) {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

// 初始化主题
(function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeBtn(saved);
})();

// --- 移动端导航 ---
function toggleNav() {
  const links = document.getElementById('navLinks');
  links.classList.toggle('open');
}

// --- 打字机效果 ---
function typeWriter(element, texts, speed = 80) {
  let textIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function tick() {
    const current = texts[textIdx];
    if (!isDeleting) {
      element.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(tick, 2000);
        return;
      }
    } else {
      element.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        textIdx = (textIdx + 1) % texts.length;
      }
    }
    setTimeout(tick, isDeleting ? 30 : speed);
  }

  tick();
}

// --- 首页渲染 ---
function renderHomePage() {
  const grid = document.getElementById('postsGrid');
  const tagCloud = document.getElementById('tagCloud');
  const typingEl = document.getElementById('typingText');

  if (!grid) return;

  // 打字机
  if (typingEl) {
    typeWriter(typingEl, [
      '$ vim new_post.md',
      '$ git commit -m "update"',
      '$ python blog.py',
      '$ echo "Hello World"'
    ]);
  }

  // 渲染标签云
  const allTags = [...new Set(POSTS_INDEX.flatMap(p => p.tags))];
  if (tagCloud) {
    tagCloud.innerHTML = '<span class="tag-item" data-tag="all" onclick="filterByTag(\'all\')">全部</span>' +
      allTags.map(t => `<span class="tag-item" data-tag="${t}" onclick="filterByTag('${t}')">${t}</span>`).join('');
  }

  // 渲染文章卡片
  renderPosts(POSTS_INDEX);
}

function renderPosts(posts) {
  const grid = document.getElementById('postsGrid');
  const empty = document.getElementById('emptyState');

  if (!grid) return;

  if (posts.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }

  if (empty) empty.style.display = 'none';

  grid.innerHTML = posts.map(post => `
    <article class="post-card" onclick="location.href='post.html?slug=${post.slug}'">
      <div class="post-date">${post.date}</div>
      <h2 class="post-title">${post.title}</h2>
      <p class="post-excerpt">${post.excerpt}</p>
      <div class="post-tags">
        ${post.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    </article>
  `).join('');
}

// --- 标签过滤 ---
let currentTag = 'all';

function filterByTag(tag) {
  currentTag = tag;
  // 更新标签高亮
  document.querySelectorAll('.tag-item').forEach(el => {
    el.classList.toggle('active', el.dataset.tag === tag);
  });
  // 过滤文章
  const filtered = tag === 'all'
    ? POSTS_INDEX
    : POSTS_INDEX.filter(p => p.tags.includes(tag));
  renderPosts(filtered);
}

// --- 初始化 ---
document.addEventListener('DOMContentLoaded', renderHomePage);
