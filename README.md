# 코딩메이커 아카데미 허브

Next.js 14 App Router 기반으로 학원 홈페이지·LMS·커뮤니티·프로젝트 협업·키오스크 출석 화면을 통합한 풀 한국어 웹 애플리케이션입니다. `구성안/stitch_codingmaker`에 제공된 모든 UI 템플릿을 라이트/블랙 컨셉 그대로 재구성했고, `코딩메이커 찐 종합 계획서.md` 기능 기획을 반영해 다음과 같은 영역을 제공합니다.

- 홈/마케팅 페이지: Hero, 기능 소개, 클래스 미리보기, 후기·소식, CTA
- 대시보드 묶음: 관리자, 학생, 학부모 뷰 + 사이드바 구조
- 학습 관리: 클래스 목록/세부 커리큘럼 페이지
- 커뮤니티, Git-Lite 프로젝트 허브, 키오스크 로그인/출석 화면
- Ubuntu 원터치 설치 스크립트(`scripts/install.sh`)로 자동 빌드

## 기술 스택

- **Next.js 14 (App Router)** + React 18
- **TypeScript**, **Tailwind CSS**, **next-themes**, **lucide-react**
- **Prisma + SQLite (개발)**: `prisma db push`로 스키마를 즉시 생성하고, 추후 MySQL/PlanetScale로 provider만 교체해 확장
- **배포 대상**: Node.js 20 환경(로컬 맥북, Ubuntu 서버 모두 지원)

## 폴더 구조

```
.
├─ app/
│  ├─ (marketing)/page.tsx               # 홈페이지
│  ├─ (dashboard)/dashboard/...          # 관리자/학생/학부모 대시보드 + 레이아웃
│  ├─ (classes)/classes/(index|[id])/    # 클래스 목록 및 주차별 커리큘럼
│  ├─ (community)/community/page.tsx     # 커뮤니티 허브
│  ├─ (projects)/projects/page.tsx       # Git-Lite 프로젝트 허브
│  ├─ (kiosk)/kiosk/(login|attendance)/  # 키오스크 로그인/출석 화면
│  └─ layout.tsx, page.tsx, globals.css  # 공통 레이아웃/스타일
├─ components/                           # 헤더, 푸터, 테마 토글, 대시보드 사이드바 등 UI 조각
│  └─ kiosk-attendance-form.tsx          # 키오스크 입력/로컬 저장 클라이언트 컴포넌트
├─ lib/
│  ├─ prisma.ts                          # PrismaClient 싱글턴
│  └─ utils.ts                           # Tailwind 클래스 병합 유틸
├─ prisma/
│  ├─ schema.prisma                      # 도메인 모델 (클래스, 커리큘럼, 프로젝트, 게시글 등)
│  └─ seed.ts                            # 템플릿 기반 샘플 데이터 시드
├─ app/api/kiosk/check-in/route.ts        # 키오스크 출석 API (지시서 5.5 출석 시스템 요구 반영)
├─ scripts/install.sh                    # Ubuntu 원터치 설치 스크립트
├─ tailwind.config.ts / postcss.config   # 스타일 설정
└─ package.json / tsconfig.json          # 빌드·의존성 설정
```

## 사용 가능한 npm 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 (http://localhost:3000) |
| `npm run build` | 프로덕션 빌드 생성 (.next) |
| `npm start` | `next start`로 빌드 결과 실행 |
| `npm run lint` | Next.js + ESLint 규칙 검사 |
| `npm run db:push` | Prisma 스키마를 SQLite 파일에 반영 |
| `npm run db:seed` | 기존 `tmp` 정리 → TypeScript 시드 빌드 → DB에 템플릿 데이터 삽입 |

## 핵심 도메인 & API (지시서 대응)

- `User`, `ParentLink`, `Class`, `StudentClassEnrollment`, `CurriculumWeek`, `AttendanceLog`, `KioskAccount`, `Project`(+`ProjectMember`, `ProjectTask`, `ProjectLog`), `CommunityPost`, `Notification`, `Announcement` 등 기획서의 주요 모델을 Prisma에서 그대로 정의했습니다.
- 샘플 데이터(`prisma/seed.ts`)는 템플릿 화면과 기획서 시나리오(정회원/학부모/관리자 역할, Git-Lite 프로젝트 현황, 키오스크 출석 로그 등)를 모두 반영합니다.
- `/api/kiosk/check-in` 엔드포인트는 `apiKey`(SHA-256 해시 비교)와 `이름#태그`를 받아, 해당 학생의 요일별 수업을 자동으로 찾은 뒤 `AttendanceLog` 레코드를 생성합니다. `status` 값을 `CHECK_IN`/`CHECK_OUT`으로 전달할 수 있어 퇴실 처리도 가능합니다.
- 키오스크 로그인/출석 UI는 지시서 5.5 항목을 따라 `/kiosk/login` → localStorage 저장 → `/kiosk/attendance`에서 입력 및 API 호출 흐름을 구현했습니다.

## 로컬(맥북) 테스트 방법

1. **Node 20 설치**  
   - Homebrew: `brew install node@20 && brew link node@20 --force`  
   - 또는 `nvm install 20 && nvm use 20`
2. **저장소 루트로 이동**: `/Users/gimhyeonmin/WebstormProjects/codingmaker1`
3. **환경 변수 복사**: `cp .env.example .env`
4. **의존성 설치**: `npm install`
5. **DB 초기화 & 시드**: `npm run db:push && npm run db:seed`
6. **개발 서버 실행**: `npm run dev`
7. 브라우저에서 `http://localhost:3000` 접속 → 다크모드/라이트모드, 각 메뉴(클래스·커뮤니티·프로젝트·대시보드·키오스크)를 확인합니다.

### 키오스크 테스트 (로컬)

1. `npm run dev` 실행 후 `http://localhost:3000/kiosk/login` 접속.
2. 샘플 키 `kiosk-demo-key` 입력 → 저장 → `/kiosk/attendance` 자동 이동.
3. `김현민#0003` 등 시드된 `userTag`를 입력하고 `입실/퇴실` 버튼 클릭 → `/api/kiosk/check-in` 호출, `AttendanceLog`에 기록.
4. 기록은 페이지 하단 "최근 기록" 카드와 관리자 대시보드 실시간 테이블에서 즉시 확인할 수 있습니다.

> 빌드 검증이 필요하면 `npm run build && npm start`로 프로덕션 모드를 확인하세요.

## Ubuntu 서버 원터치 설치

```bash
chmod +x scripts/install.sh
./scripts/install.sh
# 완료 후
npm start  # 혹은 pm2 등 프로세스 매니저에 등록
```

스크립트가 Node 20 설치 → `.env` 복사 → `npm install` → `prisma db push` → `npm run db:seed` → `npm run build` 순으로 자동화합니다.

## 환경 변수 / 백엔드 연동

기본 `.env`는 SQLite 파일 경로(`DATABASE_URL="file:./prisma/dev.db"`)만 포함합니다. 운영 전환 시 PlanetScale/MySQL URL로 교체하고, NextAuth·Cloudinary 등 민감 정보를 추가하세요. Prisma 스키마는 provider만 MySQL로 바꾸면 그대로 재사용할 수 있습니다.

## 참고

- 디자인 토큰은 Tailwind 확장을 통해 템플릿 색상(Primary #359EFF, 다크 배경 #0f1923 등)을 그대로 사용합니다.
- 모든 동적 콘텐츠는 Prisma 모델/샘플 데이터로 로딩되며, SQLite → MySQL 전환 시 `schema.prisma`와 `.env`만 조정하면 됩니다.
- 키오스크 페이지는 실사용 시 `localStorage` 기반 apiKey 저장·검증 로직과 출결 API 연동을 추가해야 합니다.

## 진행 현황 & 다음 과제

### 완료
- 지시서 기반 정보구조(홈, 대시보드 3종, 커뮤니티, 프로젝트, 키오스크 등)와 UI 구현
- Prisma 스키마/시드: User·ParentLink·Class·커리큘럼·프로젝트·커뮤니티·알림·키오스크 출석 로직 반영
- `/api/kiosk/check-in` API + 키오스크 로그인/출석 흐름 구축
- README/원터치 설치 스크립트 정비

### 다음 작업(예상)
1. **인증/인가**: NextAuth 도입, 회원가입/로그인, 역할(RBAC) 기반 페이지 접근 제어
2. **권한별 UI 보완**: 헤더/대시보드/버튼에서 사용자 역할에 따라 노출 항목 제어, 액션 제한
3. **API 확장**: 커뮤니티 글 작성, 프로젝트 멤버 초대·칸반 업데이트, LMS 자료 업로드 등 CRUD API 구현
4. **알림 시스템**: Notification 트리거, 헤더 알림 벨, 실시간/읽음 처리 흐름
5. **파일/Cloudinary 연동**: 커뮤니티·프로젝트의 파일 업로드, 코드 미리보기
6. **테스트/보안**: Prisma seed → PlanetScale 전환, 유닛/e2e 테스트, kiosk apiKey 암호화 관리 강화

> 위 TODO는 1차 구현이 완료된 상태를 기준으로 작성했습니다. 내일 작업 시 이 순서를 참고하시면 됩니다.
