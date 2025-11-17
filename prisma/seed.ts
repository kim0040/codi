import { createHash } from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const hashValue = (input: string) => createHash('sha256').update(input).digest('hex');

async function main() {
  await prisma.attendanceLog.deleteMany();
  await prisma.studentClassEnrollment.deleteMany();
  await prisma.curriculumWeek.deleteMany();
  await prisma.class.deleteMany();
  await prisma.projectLog.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.communityPost.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.metric.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.newsItem.deleteMany();
  await prisma.trendingTag.deleteMany();
  await prisma.studentProgress.deleteMany();
  await prisma.parentChildRecord.deleteMany();
  await prisma.parentMessage.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.kioskNotice.deleteMany();
  await prisma.kioskAccount.deleteMany();
  await prisma.parentLink.deleteMany();
  await prisma.user.deleteMany();

  const [admin, teacher, studentKim, studentLee, parentKim] = await Promise.all([
    prisma.user.create({
      data: {
        name: '김원장',
        email: 'ceo@codingmaker.kr',
        password: hashValue('admin1234'),
        userTag: 'kimwonjang#0001',
        role: 'SUPER_ADMIN'
      }
    }),
    prisma.user.create({
      data: {
        name: '정해린 멘토',
        email: 'mentor@codingmaker.kr',
        password: hashValue('mentor1234'),
        userTag: 'mentorjh#0002',
        role: 'ADMIN'
      }
    }),
    prisma.user.create({
      data: {
        name: '김현민',
        email: 'student1@codingmaker.kr',
        password: hashValue('student1234'),
        userTag: 'kimhyunmin#0003',
        role: 'FULL_MEMBER'
      }
    }),
    prisma.user.create({
      data: {
        name: '이서아',
        email: 'student2@codingmaker.kr',
        password: hashValue('student5678'),
        userTag: 'leeseoa#0004',
        role: 'FULL_MEMBER'
      }
    }),
    prisma.user.create({
      data: {
        name: '김하린 학부모',
        email: 'parent@codingmaker.kr',
        password: hashValue('parent1234'),
        userTag: 'parentkarin#9001',
        role: 'PARENT'
      }
    })
  ]);

  await prisma.parentLink.create({
    data: {
      studentId: studentKim.id,
      parentId: parentKim.id
    }
  });

  const classes = await Promise.all([
    prisma.class.create({
      data: {
        slug: 'frontend-immersive',
        name: '프론트엔드 임머시브',
        category: '웹 개발',
        level: '중급 · T3',
        description: 'Next.js 14와 UI 시스템을 집중적으로 다루는 핵심 과정.',
        cost: 380000,
        classDays: JSON.stringify([1, 3]),
        schedule: '화/목 19:00 - 21:30',
        heroImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
        tags: 'Next.js,App Router,Tailwind',
        highlight: '주차별 프로젝트와 자동 평가 루브릭',
        currentStudents: 24
      }
    }),
    prisma.class.create({
      data: {
        slug: 'ai-modeling',
        name: 'AI 모델링 트랙',
        category: 'AI/데이터',
        level: '고급 · T2/T3',
        description: 'Transformers, HuggingFace 기반의 고급 모델링 트랙.',
        cost: 550000,
        classDays: JSON.stringify([6]),
        schedule: '토 10:00 - 15:00',
        heroImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
        tags: 'Transformers,HuggingFace,Python',
        highlight: '모델 버저닝과 Cloudinary 데이터셋 관리',
        currentStudents: 18
      }
    }),
    prisma.class.create({
      data: {
        slug: 'creative-beginner',
        name: '크리에이티브 입문반',
        category: 'STEAM',
        level: '기초 · T4',
        description: 'Scratch와 디자인 씽킹 중심의 창의력 강화 과정.',
        cost: 240000,
        classDays: JSON.stringify([1, 3]),
        schedule: '월/수 17:00 - 18:30',
        heroImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7',
        tags: 'Scratch,디자인씽킹,MakeCode',
        highlight: '학부모 공유용 주간 리포트 자동 발송',
        currentStudents: 16
      }
    })
  ]);

  const frontClass = classes[0];
  const aiClass = classes[1];
  const creativeClass = classes[2];

  await prisma.studentClassEnrollment.createMany({
    data: [
      { userId: studentKim.id, classId: frontClass.id, role: 'Student', status: 'ACTIVE' },
      { userId: studentLee.id, classId: aiClass.id, role: 'Student', status: 'ACTIVE' },
      { userId: teacher.id, classId: frontClass.id, role: 'Mentor', status: 'ACTIVE' }
    ]
  });

  await prisma.curriculumWeek.createMany({
    data: [
      {
        classId: frontClass.id,
        weekNumber: 1,
        title: 'App Router 구조 이해',
        content: '레이아웃과 서버 컴포넌트를 활용한 페이지 구성.',
        openDate: new Date('2024-07-01T09:00:00'),
        status: 'PUBLISHED'
      },
      {
        classId: frontClass.id,
        weekNumber: 2,
        title: '데이터 패칭 & 캐시 전략',
        content: '서버 액션, ISR, SWR 전략 비교.',
        openDate: new Date('2024-07-08T09:00:00'),
        status: 'PUBLISHED'
      },
      {
        classId: frontClass.id,
        weekNumber: 3,
        title: 'Git-Lite 협업 프로젝트',
        content: '프로젝트 허브와 Cloudinary를 이용한 협업 실습.',
        openDate: new Date('2024-07-15T09:00:00'),
        status: 'SCHEDULED'
      },
      {
        classId: aiClass.id,
        weekNumber: 1,
        title: 'Transformers 심층 분석',
        content: 'Self-Attention 구조 이해.',
        openDate: new Date('2024-07-03T10:00:00'),
        status: 'PUBLISHED'
      }
    ]
  });

  await prisma.metric.createMany({
    data: [
      { label: '활성 수강생', value: '312명', detail: '월 대비 +8%', type: 'MARKETING' },
      { label: '누적 프로젝트', value: '128건', detail: 'Git-Lite 협업', type: 'MARKETING' },
      { label: '부모님 만족도', value: '4.9/5.0', detail: '설문 217건 기준', type: 'MARKETING' },
      { label: '일 평균 출석', value: '186명', detail: '키오스크 연동', type: 'MARKETING' },
      { label: '이번 주 출석률', value: '96.4%', detail: '목표 95%', type: 'ADMIN' },
      { label: '신규 등록', value: '18명', detail: '7월 2주차', type: 'ADMIN' },
      { label: '진행 중 프로젝트', value: '12건', detail: '허브 기준', type: 'ADMIN' },
      { label: '미확인 상담', value: '5건', detail: '즉시 응답 필요', type: 'ADMIN' }
    ]
  });

  await prisma.testimonial.createMany({
    data: [
      { quote: 'Compile-Room 대비 페이지 로딩 속도가 42% 단축되었습니다.', person: '김원장', role: '코딩메이커 아카데미 원장' },
      { quote: 'Git-Lite 프로젝트 허브 덕분에 팀 앱을 완성해 대회에 진출했어요.', person: '이서준', role: '정회원 · 프로젝트 리더' }
    ]
  });

  await prisma.newsItem.createMany({
    data: [
      { title: '2024 여름방학 특강 선착순 접수', summary: '알고리즘/게임개발 2개 트랙 운영, 얼리버드 15% 할인.', publishedAt: new Date('2024-07-12') },
      { title: '학부모 설명회 & 랩투어', summary: '출석 자동화와 대시보드 기능 체험.', publishedAt: new Date('2024-07-20') },
      { title: '코딩 경진대회 3관왕 달성', summary: '창의융합 부문 대상 포함 전국 3개 대회 수상.', publishedAt: new Date('2024-07-02') }
    ]
  });

  await prisma.studentProgress.createMany({
    data: [
      { studentName: '김민준', mentor: '신다빈', nextSession: '7/18 (목) 19:00', progress: 72, classId: frontClass.id, className: frontClass.name },
      { studentName: '이서아', mentor: '정해린 멘토', nextSession: '7/20 (토) 13:00', progress: 48, classId: aiClass.id, className: aiClass.name }
    ]
  });

  await prisma.assignment.createMany({
    data: [
      { title: 'UI 시스템 구축', dueAt: new Date('2024-07-19T23:59:00'), status: '진행 중', ownerName: '정회원' },
      { title: '팀 협업 앱 발표자료', dueAt: new Date('2024-07-23T21:00:00'), status: '준비', ownerName: '정회원' }
    ]
  });

  await prisma.trendingTag.createMany({ data: [{ label: '#프로젝트허브' }, { label: '#키오스크' }, { label: '#출석오류' }, { label: '#자료공유' }] });

  await prisma.communityPost.createMany({
    data: [
      {
        title: '프로젝트 허브 Cloudinary 사용 가이드',
        content: '전용 폴더 구조와 만료 정책 안내',
        category: '프로젝트',
        authorName: '김민준',
        authorRole: '정회원',
        commentCount: 12,
        likeCount: 45
      },
      {
        title: 'AI 트랙 2주차 강의 자료 공유',
        content: 'PDF와 데모 링크 첨부',
        category: 'LMS 팁',
        authorName: '정해린 멘토',
        authorRole: '관리자',
        commentCount: 4,
        likeCount: 18
      },
      {
        title: '키오스크 출석 알림이 학부모에게 안 가요',
        content: 'Webhook 설정 확인 요청',
        category: 'Q&A',
        authorName: '박도윤',
        authorRole: '정회원',
        commentCount: 8,
        likeCount: 20
      }
    ]
  });

  await prisma.project.create({
    data: {
      slug: 'edge-attendance',
      title: 'Edge 기반 출결 알림 시스템',
      description: '키오스크와 알림 시스템을 Edge 함수로 구현',
      status: 'IN_PROGRESS',
      progress: 64,
      heroImage: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d',
      members: {
        create: [
          { userId: studentKim.id, role: 'Owner' },
          { userId: studentLee.id, role: 'Member' }
        ]
      },
      logs: {
        create: [
          { message: '출석 API rate-limit 개선', userId: studentLee.id },
          { message: '프로젝트 로그 UI 구현', userId: studentKim.id }
        ]
      },
      tasks: {
        create: [
          { title: '출석 API rate-limit 개선', owner: '정시우', dueDate: new Date('2024-07-19'), column: 'TODO' },
          { title: '프로젝트 로그 UI', owner: '김민준', dueDate: new Date('2024-07-18'), column: 'IN_PROGRESS' },
          { title: '출결 키오스크 QA', owner: '이서아', dueDate: new Date('2024-07-16'), column: 'REVIEW' }
        ]
      }
    }
  });

  await prisma.project.create({
    data: {
      slug: 'parent-portal',
      title: '부모 포털 리뉴얼',
      description: '학부모 대시보드 및 Notification 개선',
      status: 'PLANNING',
      progress: 32,
      heroImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
      members: {
        create: [{ userId: teacher.id, role: 'Owner' }]
      },
      logs: {
        create: [{ message: '학부모 FAQ 번역 시작', userId: teacher.id }]
      },
      tasks: {
        create: [
          { title: '학부모 FAQ 번역', owner: '장하린', dueDate: new Date('2024-07-20'), column: 'TODO' }
        ]
      }
    }
  });

  await prisma.announcement.createMany({
    data: [
      { title: '서버 점검 안내', summary: '오늘 02:00~03:00 시스템 점검', audience: 'ADMIN' },
      { title: '보호자 설명회 리마인드', summary: 'D-3; 좌석 예약 필수', audience: 'ADMIN' },
      { title: 'Git-Lite 협업 워크숍 참가 신청', summary: '선착순 20명', audience: 'COMMUNITY' },
      { title: '출석 알림 안내', summary: '하린 입실 09:01', audience: 'PARENT' }
    ]
  });

  await prisma.notification.createMany({
    data: [
      { title: '새 커리큘럼 공개', message: 'Week 03 콘텐츠가 열렸습니다.', audience: 'STUDENT', userId: studentKim.id, category: 'LMS' },
      { title: '프로젝트 초대', message: 'Edge 기반 출결 알림 시스템에 초대되었습니다.', audience: 'STUDENT', userId: studentLee.id, category: 'PROJECT' }
    ]
  });

  await prisma.parentChildRecord.createMany({
    data: [
      { childName: '김하린', attendanceInfo: '100% (이번 주)', currentClass: 'AI 모델링', memo: '7/21 모의고사' },
      { childName: '김도현', attendanceInfo: '92%', currentClass: '웹 앱 제작', memo: '7/24 프로젝트 리뷰' }
    ]
  });

  await prisma.parentMessage.createMany({
    data: [
      { teacherName: '박지호 강사', summary: '7/18 상담 리마인드', sentAt: new Date('2024-07-15T09:00:00') },
      { teacherName: '김라온 강사', summary: '과제 제출 피드백', sentAt: new Date('2024-07-14T12:00:00') }
    ]
  });

  await prisma.auditLog.createMany({
    data: [
      { actor: '김원장', message: '프로젝트 AI 튜터 봇 상태 완료', occurredAt: new Date('2024-07-15T10:21:00') },
      { actor: '시스템', message: 'kiosk-02 apiKey 재발급', occurredAt: new Date('2024-07-15T09:40:00') }
    ]
  });

  const kiosk = await prisma.kioskAccount.create({
    data: {
      name: '성수 캠퍼스 1층',
      apiKeyHash: hashValue('kiosk-demo-key'),
      location: '1층 로비'
    }
  });

  await prisma.kioskNotice.createMany({
    data: [
      { body: '학생은 본인 이름#태그 기준으로 입력합니다.' },
      { body: '지문 오류 시 운영팀 내선 2번으로 연락 주세요.' },
      { body: '무단 이탈 방지를 위해 10분 간격으로 동기화됩니다.' }
    ]
  });

  await prisma.attendanceLog.createMany({
    data: [
      {
        userId: studentKim.id,
        classId: frontClass.id,
        kioskId: kiosk.id,
        status: 'CHECK_IN',
        markedByKiosk: true,
        checkInTime: new Date('2024-07-15T09:02:00')
      },
      {
        userId: studentLee.id,
        classId: aiClass.id,
        kioskId: kiosk.id,
        status: 'CHECK_IN',
        markedByKiosk: true,
        checkInTime: new Date('2024-07-15T09:05:00')
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
