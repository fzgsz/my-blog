#!/bin/bash
# 快速新建文章：./new-post.sh "文章标题" "标签1,标签2" [slug]
# 示例：./new-post.sh "Docker 入门笔记" "Docker,教程"

TITLE="$1"
TAGS_INPUT="$2"
SLUG="${3:-$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/-\+/-/g' | sed 's/^-//;s/-$//')}"
# 纯中文标题会生成空 slug，用日期兜底
[ -z "$SLUG" ] && SLUG="post-$(date +%Y%m%d)"
DATE=$(date +%F)
POSTS_DIR="D:/Projects/my-blog/posts"
MAIN_JS="D:/Projects/my-blog/js/main.js"

if [ -z "$TITLE" ]; then
  echo "用法: ./new-post.sh \"文章标题\" \"标签1,标签2\" [slug]"
  exit 1
fi

# 格式化标签：Docker,教程 → 'Docker', '教程'
TAGS=$(echo "$TAGS_INPUT" | sed "s/, */', '/g; s/^/'/; s/$/'/")

# 1. 创建 .md 文件
cat > "$POSTS_DIR/$SLUG.md" << MDEOF
---
title: $TITLE
date: $DATE
tags: [${TAGS}]
---

开始写作...
MDEOF

echo "[1/2] 已创建 posts/$SLUG.md"

# 2. 用 Python 在 POSTS_INDEX 末尾插入新条目
python3 -c "
import re
path = r'$MAIN_JS'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

entry = '''  {
    slug: '${SLUG}',
    title: '${TITLE}',
    date: '${DATE}',
    tags: [${TAGS}],
    excerpt: '关于「${TITLE}」的详细内容...'
  },
'''

# 在 ]; 之前插入，如果前一个元素没有逗号则加上
content = re.sub(r'(?<!,)\n(\s*)\];', r',\n\1];', content, count=1)
content = content.replace('];', entry + '];', 1)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('OK')
"

echo "[2/2] 已更新 js/main.js 文章索引"
echo "完成！打开浏览器预览: start D:/Projects/my-blog/index.html"
