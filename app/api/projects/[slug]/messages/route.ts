import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { canAccessProject } from '@/lib/project-access';
import { decryptText, encryptText } from '@/lib/encryption';
import { getSocketServer } from '@/lib/socket-server';

const MAX_CHAT_LENGTH = 2000;
const MAX_HISTORY = 100;

const formatMessage = (message: { id: string; authorTag: string; encryptedContent: string; iv: string; authTag: string; createdAt: Date }) => {
  try {
    return {
      id: message.id,
      authorTag: message.authorTag,
      message: decryptText({
        ciphertext: message.encryptedContent,
        iv: message.iv,
        authTag: message.authTag
      }),
      createdAt: message.createdAt
    };
  } catch (error) {
    console.error('Failed to decrypt project message', error);
    return {
      id: message.id,
      authorTag: message.authorTag,
      message: '[메시지를 복호화할 수 없습니다.]',
      createdAt: message.createdAt
    };
  }
};

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }
    const project = await prisma.project.findUnique({ where: { slug: params.slug } });
    if (!project) {
      return NextResponse.json({ error: '프로젝트를 찾을 수 없습니다.' }, { status: 404 });
    }
    const permitted = await canAccessProject(project.id, session.user.id, session.user.role);
    if (!permitted) {
      return NextResponse.json({ error: '프로젝트 채팅을 볼 권한이 없습니다.' }, { status: 403 });
    }

    const rows = await prisma.projectMessage.findMany({
      where: { projectId: project.id },
      orderBy: { createdAt: 'desc' },
      take: MAX_HISTORY
    });

    const ordered = rows.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    return NextResponse.json(ordered.map((message) => formatMessage(message)));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: '채팅을 불러오지 못했습니다.' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const payload = await request.json().catch(() => null);
    const rawMessage = (payload?.message as string | undefined)?.trim() ?? '';
    if (!rawMessage) {
      return NextResponse.json({ error: '메시지를 입력해주세요.' }, { status: 400 });
    }

    const messageText = rawMessage.slice(0, MAX_CHAT_LENGTH);
    const project = await prisma.project.findUnique({ where: { slug: params.slug } });
    if (!project) {
      return NextResponse.json({ error: '프로젝트를 찾을 수 없습니다.' }, { status: 404 });
    }

    const permitted = await canAccessProject(project.id, session.user.id, session.user.role);
    if (!permitted) {
      return NextResponse.json({ error: '프로젝트 채팅 권한이 없습니다.' }, { status: 403 });
    }

    const encrypted = encryptText(messageText);
    const record = await prisma.projectMessage.create({
      data: {
        projectId: project.id,
        authorId: session.user.id,
        authorTag: session.user.userTag ?? session.user.name ?? '익명',
        encryptedContent: encrypted.ciphertext,
        iv: encrypted.iv,
        authTag: encrypted.authTag
      }
    });

    const responseMessage = {
      id: record.id,
      authorTag: record.authorTag,
      message: messageText,
      createdAt: record.createdAt
    };

    const io = getSocketServer();
    if (io) {
      io.to(project.id).emit('chat-message', responseMessage);
    }

    return NextResponse.json(responseMessage, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: '메시지 전송에 실패했습니다.' }, { status: 500 });
  }
}
