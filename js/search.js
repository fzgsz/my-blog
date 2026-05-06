/* ============================================
   搜索功能
   ============================================ */

(function initSearch() {
  document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const query = e.target.value.trim().toLowerCase();
        performSearch(query);
      }, 200);
    });
  });
})();

function performSearch(query) {
  let results;

  if (!query) {
    // 清空搜索，恢复当前标签过滤
    results = currentTag === 'all'
      ? POSTS_INDEX
      : POSTS_INDEX.filter(p => p.tags.includes(currentTag));
  } else {
    // 在标题、摘要、标签中搜索
    const source = currentTag === 'all'
      ? POSTS_INDEX
      : POSTS_INDEX.filter(p => p.tags.includes(currentTag));

    results = source.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.tags.some(t => t.toLowerCase().includes(query))
    );
  }

  renderPosts(results);
}
