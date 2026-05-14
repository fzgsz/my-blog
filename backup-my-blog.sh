#!/bin/bash
# my-blog 自动备份脚本
# 每天备份 /usr/share/nginx/html/ 到 /var/backups/my-blog/，保留 7 天

BACKUP_SRC="/usr/share/nginx/html"
BACKUP_DIR="/var/backups/my-blog"
RETENTION_DAYS=7
LOG_FILE="/var/log/my-blog-backup.log"

mkdir -p "$BACKUP_DIR"

DATE=$(date +%Y%m%d)
BACKUP_FILE="$BACKUP_DIR/my-blog-$DATE.tar.gz"

tar -czf "$BACKUP_FILE" -C "$BACKUP_SRC" . 2>&1

if [ $? -eq 0 ]; then
  SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 备份成功: $BACKUP_FILE ($SIZE)" >> "$LOG_FILE"
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 备份失败" >> "$LOG_FILE"
  exit 1
fi

# 清理超过 7 天的旧备份
DELETED=$(find "$BACKUP_DIR" -name "my-blog-*.tar.gz" -mtime +$RETENTION_DAYS -delete -print)
if [ -n "$DELETED" ]; then
  echo "$DELETED" | while read f; do
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 清理过期备份: $f" >> "$LOG_FILE"
  done
fi
