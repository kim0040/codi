import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { prisma } from '@/lib/prisma';

const hashKey = (key: string) => createHash('sha256').update(key).digest('hex');

export async function POST(request: Request) {
  try {
    const { apiKey, userTag, note, status } = await request.json();

    if (!apiKey || !userTag) {
      return NextResponse.json({ message: 'apiKey와 userTag를 입력해주세요.' }, { status: 400 });
    }

    const hashed = hashKey(apiKey as string);
    const kiosk = await prisma.kioskAccount.findFirst({ where: { apiKeyHash: hashed, isActive: true } });

    if (!kiosk) {
      return NextResponse.json({ message: '유효하지 않은 키오스크 계정입니다.' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { userTag } });

    if (!user) {
      return NextResponse.json({ message: '해당 이름#태그를 가진 사용자를 찾을 수 없습니다.' }, { status: 404 });
    }

    const enrollments = await prisma.studentClassEnrollment.findMany({
      where: { userId: user.id },
      include: { class: true }
    });

    const today = new Date().getDay();
    const targetClass = enrollments.find((enrollment) => {
      if (!enrollment.class) return false;
      const days: number[] = JSON.parse(enrollment.class.classDays || '[]');
      return days.includes(today);
    });

    if (!targetClass || !targetClass.class) {
      return NextResponse.json({ message: '오늘 수강 예정인 클래스가 없습니다.' }, { status: 400 });
    }

    await prisma.attendanceLog.create({
      data: {
        userId: user.id,
        classId: targetClass.classId,
        kioskId: kiosk.id,
        status: status === 'CHECK_OUT' ? 'CHECK_OUT' : 'CHECK_IN',
        note,
        markedByKiosk: true
      }
    });

    await prisma.kioskAccount.update({ where: { id: kiosk.id }, data: { lastUsedAt: new Date() } });

    return NextResponse.json({ message: `${user.name}님 (${targetClass.class.name}) ${status === 'CHECK_OUT' ? '퇴실' : '출석'} 완료` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: '키오스크 출석 처리에 실패했습니다.' }, { status: 500 });
  }
}
