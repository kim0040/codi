#!/usr/bin/env bash
set -euo pipefail

log() {
  printf '\n[코딩메이커] %s\n' "$1"
}

ensure_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    return 1
  fi
}

install_node() {
  log "Node.js 20.x가 없어 설치를 시작합니다 (Ubuntu 기준 sudo 필요)."
  sudo apt-get update -y
  sudo apt-get install -y ca-certificates curl gnupg
  curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/nodesource.gpg
  echo "deb [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list >/dev/null
  sudo apt-get update -y
  sudo apt-get install -y nodejs
}

main() {
  log "원터치 설치를 시작합니다."
  ensure_cmd node || install_node
  ensure_cmd npm || { log "npm 명령이 필요합니다."; exit 1; }

  log "의존성 설치 (npm install)"
  npm install

  if [ ! -f .env ] && [ -f .env.example ]; then
    log ".env 파일이 없어 .env.example을 복사합니다."
    cp .env.example .env
  fi

  log "데이터베이스 스키마 동기화 (SQLite)"
  npx prisma db push

  log "샘플 데이터 시드"
  npm run db:seed

  log "Next.js 프로덕션 빌드"
  npm run build

  log "설치 완료! 서버 실행: npm start"
}

main "$@"
