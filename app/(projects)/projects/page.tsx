import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { ProjectKanbanBoard, type ProjectCardPayload } from '@/components/project-kanban';
import { ProjectMemberInviteForm } from '@/components/project-member-invite-form';
import { ProjectTaskForm } from '@/components/project-task-form';
import { ProjectChat } from '@/components/project-chat';
import { ProjectFileManager, type ProjectFileRecord } from '@/components/project-file-manager';
import { ProjectActivityFeed } from '@/components/project-activity-feed';
import { authOptions } from '@/lib/auth';
import { USER_ROLES } from '@/lib/rbac';

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);
  const projects = await prisma.project.findMany({
    include: {
      tasks: true,
      members: { include: { user: true } },
      files: { include: { uploadedBy: true }, orderBy: { uploadedAt: 'desc' }, take: 20 }
    }
  });
  const activityLogs = await prisma.projectLog.findMany({
    include: { project: true, user: true },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  const isAdminRole = session ? [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN].includes(session.user.role) : false;
  const projectCards: ProjectCardPayload[] = projects.map((project) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    status: project.status,
    progress: project.progress,
    members: project.members.map((member) => member.user?.name ?? member.role),
    tasks: project.tasks.map((task) => ({
      id: task.id,
      projectId: task.projectId,
      title: task.title,
      owner: task.owner,
      dueDate: task.dueDate.toISOString(),
      column: task.column
    }))
  }));

  const chats = projects.map((project) => {
    const isMember = session ? project.members.some((member) => member.userId === session.user.id) : false;
    return {
      id: project.id,
      slug: project.slug,
      title: project.title,
      canChat: Boolean(session && (isAdminRole || isMember))
    };
  });

  const filePanels = projects.map((project) => {
    const isMember = session ? project.members.some((member) => member.userId === session.user.id) : false;
    const files: ProjectFileRecord[] = project.files.map((file) => ({
      id: file.id,
      logicalName: file.logicalName,
      version: file.version,
      fileName: file.fileName,
      fileUrl: file.fileUrl,
      language: file.language,
      size: file.size ?? undefined,
      changeSummary: file.changeSummary,
      uploadedAt: file.uploadedAt.toISOString(),
      uploader: file.uploadedBy?.name ?? file.uploadedBy?.userTag ?? null
    }));
    return {
      slug: project.slug,
      title: project.title,
      files,
      canManage: Boolean(session && (isAdminRole || isMember))
    };
  });

  const activityItems = activityLogs.map((log) => ({
    id: log.id,
    projectTitle: log.project?.title ?? '프로젝트',
    actor: log.user?.name ?? log.user?.userTag ?? '시스템',
    message: log.message,
    createdAt: log.createdAt.toISOString()
  }));

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white py-12 dark:from-[#050a11] dark:to-[#0b121b]">
      <div className="mx-auto max-w-6xl space-y-8 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-xl dark:border-slate-800 dark:bg-[#101a28]">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Git-Lite</p>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">프로젝트 협업 공간</h1>
            <p className="text-sm text-slate-500 dark:text-slate-300">버전 히스토리, 멤버 채팅, Cloudinary 파일 업로드를 제공하는 경량 Git 워크플로</p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/community" className="rounded-full border border-slate-200 px-4 py-2 text-slate-600 dark:border-slate-700 dark:text-slate-300">
              커뮤니티 바로가기
            </Link>
            <Link href="/dashboard/student" className="rounded-full bg-primary px-4 py-2 font-semibold text-white">
              내 대시보드
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {projectCards.map((project) => (
            <div key={project.id} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-white/5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-primary">{project.status}</span>
                <span>{project.tasks.length} Tasks</span>
              </div>
              <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{project.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-300">멤버 {project.members.join(', ')}</p>
              <div className="mt-4 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-full rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
              </div>
              <div className="mt-4 space-y-3">
                <ProjectMemberInviteForm projectSlug={project.slug} />
                <ProjectTaskForm projectSlug={project.slug} />
              </div>
            </div>
          ))}
        </section>

        <ProjectKanbanBoard initialProjects={projectCards} />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="grid gap-4 md:grid-cols-2">
              {chats.map((project) => (
                <ProjectChat
                  key={`${project.id}-chat`}
                  projectId={project.id}
                  projectSlug={project.slug}
                  projectTitle={project.title}
                  canChat={project.canChat}
                  currentUserTag={session?.user.userTag}
                />
              ))}
            </div>
            <div className="space-y-4">
              {filePanels.map((panel) => (
                <ProjectFileManager
                  key={`${panel.slug}-files`}
                  projectSlug={panel.slug}
                  projectTitle={panel.title}
                  files={panel.files}
                  canManage={panel.canManage}
                />
              ))}
            </div>
          </div>
          <ProjectActivityFeed items={activityItems} />
        </div>
      </div>
    </div>
  );
}
